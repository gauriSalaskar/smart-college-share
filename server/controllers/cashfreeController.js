const { Cashfree, CFEnvironment } = require('cashfree-pg');
const Listing = require('../models/Listing');
const Transaction = require('../models/Transaction');
const crypto = require('crypto');

// Configure Cashfree
const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

// POST /api/cashfree/create-order
exports.createOrder = async (req, res) => {
  try {
    const { listingId } = req.body;

    const listing = await Listing.findById(listingId).populate('owner');
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    if (listing.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot buy your own listing' });
    }
    if (listing.type === 'Share') {
      return res.status(400).json({ success: false, message: 'This item is free to share' });
    }

    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const orderData = {
      order_id: orderId,
      order_amount: listing.price,
      order_currency: 'INR',
      order_tags: {
        listingId: listingId,
      },
      customer_details: {
        customer_id: req.user._id.toString(),
        customer_name: req.user.name,
        customer_email: req.user.email,
        customer_phone: (req.user.phone || '9999999999').replace(/\D/g, '').slice(-10),
      },
      order_meta: {
        return_url: `${process.env.CLIENT_URL}/payment-success?order_id={order_id}`,
        notify_url: `${process.env.SERVER_URL}/api/cashfree/webhook`,
      },
      order_note: `Payment for: ${listing.title}`,
    };

    const response = await cashfree.PGCreateOrder(orderData);

    res.json({
      success: true,
      orderId,
      paymentSessionId: response.data.payment_session_id,
      listingTitle: listing.title,
      amount: listing.price,
    });
  } catch (err) {
    console.error('Cashfree order error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/cashfree/verify-payment
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, listingId } = req.body;

    const response = await cashfree.PGFetchOrder(orderId);
    const order = response.data;

    if (order.order_status === 'PAID') {
      const listing = await Listing.findById(listingId).populate('owner');

      const transaction = await Transaction.create({
        transactionId: orderId,
        listing: listingId,
        buyer: req.user._id,
        seller: listing.owner._id,
        amount: listing.price,
        type: listing.type,
        status: 'completed',
        paymentMethod: 'Cashfree',
      });

      if (listing.type === 'Sell') {
        await Listing.findByIdAndUpdate(listingId, { status: 'sold' });
      }

      res.json({
        success: true,
        message: 'Payment verified successfully!',
        transaction: {
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          status: transaction.status,
          listingTitle: listing.title,
          sellerName: listing.owner.name,
          createdAt: transaction.createdAt,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Payment not completed' });
    }
  } catch (err) {
    console.error('Cashfree verify error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/cashfree/webhook
exports.webhook = async (req, res) => {
  try {
    const rawBody = JSON.stringify(req.body);
    const timestamp = req.headers['x-webhook-timestamp'];
    const receivedSignature = req.headers['x-webhook-signature'];

    const signedPayload = timestamp + rawBody;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.CASHFREE_SECRET_KEY)
      .update(signedPayload)
      .digest('base64');

    if (expectedSignature !== receivedSignature) {
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    const event = req.body;
    if (event?.type !== 'PAYMENT_SUCCESS_WEBHOOK') {
      return res.status(200).json({ received: true });
    }

    const orderData = event?.data?.order;
    const paymentData = event?.data?.payment;
    const orderId = orderData?.order_id;

    if (orderData?.order_status !== 'PAID' || paymentData?.payment_status !== 'SUCCESS') {
      return res.status(200).json({ received: true });
    }

    const existing = await Transaction.findOne({ transactionId: orderId });
    if (existing) return res.status(200).json({ received: true });

    const listingId = orderData?.order_tags?.listingId;
    if (!listingId) return res.status(200).json({ received: true });

    const listing = await Listing.findById(listingId).populate('owner');
    if (!listing) return res.status(200).json({ received: true });

    await Transaction.create({
      transactionId: orderId,
      listing: listingId,
      buyer: orderData?.customer_details?.customer_id,
      seller: listing.owner._id,
      amount: orderData?.order_amount,
      type: listing.type,
      status: 'completed',
      paymentMethod: 'Cashfree',
    });

    if (listing.type === 'Sell') {
      await Listing.findByIdAndUpdate(listingId, { status: 'sold' });
    }

    console.log('✅ Webhook processed:', orderId);
    return res.status(200).json({ received: true });

  } catch (err) {
    console.error('Cashfree webhook error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
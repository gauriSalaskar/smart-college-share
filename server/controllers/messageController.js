const Message = require('../models/Message');
const Listing = require('../models/Listing');

// POST /api/messages
exports.sendMessage = async (req, res) => {
  try {
    const { listingId, content } = req.body;
    const listing = await Listing.findById(listingId).populate('owner');
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });
    if (listing.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot message yourself.' });
    }
    const message = await Message.create({
      listing: listingId,
      sender: req.user._id,
      receiver: listing.owner._id,
      content,
    });
    await message.populate(['sender', 'receiver', 'listing']);
    res.status(201).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/messages/inbox
exports.getInbox = async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user._id })
      .populate('sender', 'name email avatar')
      .populate('listing', 'title images')
      .sort('-createdAt');
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/messages/sent
exports.getSent = async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user._id })
      .populate('receiver', 'name email avatar')
      .populate('listing', 'title images')
      .sort('-createdAt');
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/messages/:id/read
exports.markRead = async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

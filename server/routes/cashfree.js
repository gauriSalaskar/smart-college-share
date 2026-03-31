const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, webhook } = require('../controllers/cashfreeController');
const { protect } = require('../middleware/auth');

router.post('/webhook', webhook);
router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);

module.exports = router;
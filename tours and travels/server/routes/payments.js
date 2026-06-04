const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/adminMiddleware');
const {
  processPayment, getPaymentByBooking, getAllPayments
} = require('../controllers/paymentController');

// User routes
router.post('/', auth, processPayment);
router.get('/booking/:bookingId', auth, getPaymentByBooking);

// Admin routes
router.get('/', auth, admin, getAllPayments);

module.exports = router;

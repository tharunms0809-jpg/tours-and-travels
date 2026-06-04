const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/adminMiddleware');
const {
  createBooking, getUserBookings, getBookingById,
  cancelBooking, getAllBookings, updateBookingStatus
} = require('../controllers/bookingController');

// User routes
router.post('/', auth, createBooking);
router.get('/my', auth, getUserBookings);
router.get('/:id', auth, getBookingById);
router.put('/:id/cancel', auth, cancelBooking);

// Admin routes
router.get('/', auth, admin, getAllBookings);
router.put('/:id/status', auth, admin, updateBookingStatus);

module.exports = router;

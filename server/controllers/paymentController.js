const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const crypto = require('crypto');

// @desc    Process payment (demo)
// @route   POST /api/payments
exports.processPayment = async (req, res) => {
  try {
    const { bookingId, method, cardNumber } = req.body;

    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Booking already paid' });
    }

    // Generate demo transaction ID
    const transactionId = 'TXN' + Date.now() + crypto.randomBytes(4).toString('hex').toUpperCase();

    // Simulate payment processing (demo - always succeeds)
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user._id,
      amount: booking.totalAmount,
      method,
      transactionId,
      status: 'success',
      cardLast4: cardNumber ? cardNumber.slice(-4) : '0000',
      paidAt: new Date()
    });

    // Update booking status
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        payment,
        booking: {
          _id: booking._id,
          status: booking.status,
          paymentStatus: booking.paymentStatus
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get payment details by booking ID
// @route   GET /api/payments/booking/:bookingId
exports.getPaymentByBooking = async (req, res) => {
  try {
    const payment = await Payment.findOne({ booking: req.params.bookingId })
      .populate('booking', 'totalAmount status travelDate')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all payments (admin)
// @route   GET /api/payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('booking', 'totalAmount status')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

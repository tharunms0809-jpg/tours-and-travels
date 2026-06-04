const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addReview, getPackageReviews, deleteReview
} = require('../controllers/reviewController');

// Public route
router.get('/package/:packageId', getPackageReviews);

// Protected routes
router.post('/', auth, addReview);
router.delete('/:id', auth, deleteReview);

module.exports = router;

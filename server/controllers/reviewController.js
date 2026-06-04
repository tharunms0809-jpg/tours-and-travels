const Review = require('../models/Review');

// @desc    Add a review for a package
// @route   POST /api/reviews
exports.addReview = async (req, res) => {
  try {
    const { packageId, rating, title, comment } = req.body;

    // Check for existing review
    const existing = await Review.findOne({ user: req.user._id, package: packageId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this package'
      });
    }

    const review = await Review.create({
      user: req.user._id,
      package: packageId,
      rating,
      title,
      comment
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: populatedReview
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for a package
// @route   GET /api/reviews/package/:packageId
exports.getPackageReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ package: req.params.packageId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const packageId = review.package;
    await review.deleteOne();

    // Recalculate ratings
    await Review.calcAverageRating(packageId);

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

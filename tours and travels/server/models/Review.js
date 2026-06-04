const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews from same user for same package
reviewSchema.index({ user: 1, package: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calcAverageRating = async function(packageId) {
  const stats = await this.aggregate([
    { $match: { package: packageId } },
    {
      $group: {
        _id: '$package',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Package').findByIdAndUpdate(packageId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count
    });
  } else {
    await mongoose.model('Package').findByIdAndUpdate(packageId, {
      rating: 0,
      reviewCount: 0
    });
  }
};

// Update rating after save
reviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.package);
});

module.exports = mongoose.model('Review', reviewSchema);

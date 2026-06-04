const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Package title is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 2000
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  duration: {
    days: { type: Number, required: true, min: 1 },
    nights: { type: Number, required: true, min: 0 }
  },
  groupSize: {
    min: { type: Number, default: 1 },
    max: { type: Number, default: 20 }
  },
  hotel: {
    name: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: 3 },
    type: { type: String, enum: ['Budget', 'Standard', 'Premium', 'Luxury'], default: 'Standard' }
  },
  transport: {
    type: { type: String, enum: ['Flight', 'Train', 'Bus', 'Self-Drive', 'Mixed'], default: 'Mixed' },
    details: { type: String, default: '' }
  },
  images: [{
    type: String
  }],
  highlights: [{
    type: String
  }],
  itinerary: [{
    day: { type: Number },
    title: { type: String },
    description: { type: String },
    activities: [{ type: String }]
  }],
  inclusions: [{
    type: String
  }],
  exclusions: [{
    type: String
  }],
  availability: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['Adventure', 'Beach', 'Cultural', 'Hill Station', 'Wildlife', 'Pilgrimage', 'Honeymoon', 'Family'],
    default: 'Cultural'
  },
  startDates: [{
    type: Date
  }]
}, {
  timestamps: true
});

// Text index for search
packageSchema.index({ title: 'text', destination: 'text', description: 'text' });

module.exports = mongoose.model('Package', packageSchema);

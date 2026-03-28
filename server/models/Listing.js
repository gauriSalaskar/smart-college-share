const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Books', 'Lab Equipment', 'Appliances', 'Electronics', 'Stationery', 'Others'],
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['Rent', 'Sell', 'Share'],
  },
  price: {
    type: Number,
    required: function () { return this.type !== 'Share'; },
    min: [0, 'Price cannot be negative'],
    default: 0,
  },
  priceUnit: {
    type: String,
    enum: ['per day', 'per week', 'per month', 'fixed', ''],
    default: 'fixed',
  },
  images: [{
    url: String,
    publicId: String,
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'sold', 'unavailable'],
    default: 'pending',
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    default: 'Good',
  },
  location: {
    type: String,
    trim: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  views: {
    type: Number,
    default: 0,
  },
  tags: [String],
  contactPreference: {
    type: String,
    enum: ['email', 'phone', 'both'],
    default: 'email',
  },
}, { timestamps: true });

// Index for search
listingSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Listing', listingSchema);

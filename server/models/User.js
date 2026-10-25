const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  role: {
    type: String,
    enum: ['farmer', 'customer', 'expert'],
    default: 'farmer',
    required: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  location: {
    district: { type: String, default: 'Shopian' },
    state: { type: String, default: 'Jammu & Kashmir' },
    village: { type: String, default: '' },
  },
  orchardDetails: {
    orchardName: { type: String, default: 'Kashmir Valley Orchard' },
    acreage: { type: Number, default: 4.5 },
    primaryVarieties: { type: [String], default: ['Kashmiri Delicious', 'Royal Delicious', 'Maharaji'] },
    treeCount: { type: Number, default: 350 },
    irrigationType: { type: String, default: 'Drip / Spring-fed' },
  },
  expertProfile: {
    title: { type: String, default: 'Agricultural Horticulturist' },
    specialization: { type: String, default: 'Plant Pathology & Pomology' },
    experienceYears: { type: Number, default: 8 },
    institution: { type: String, default: 'SKUAST-Kashmir' },
    isVerified: { type: Boolean, default: false }, // Explicit pending state
    verificationNotes: { type: String, default: 'Pending institutional credentials verification' },
    bio: { type: String, default: 'Specializing in temperate pome fruit disease management, apple scab epidemiology, and integrated pest management (IPM) for high-density orchards.' },
    isAvailable: { type: Boolean, default: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);

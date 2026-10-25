const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  farmerName: {
    type: String,
    default: 'Orchard Farmer',
  },
  imageUrl: {
    type: String,
    required: true,
  },
  originalFilename: {
    type: String,
    default: 'leaf_scan.jpg',
  },
  predictedClass: {
    type: String,
    required: true,
  },
  scientificName: {
    type: String,
    default: '',
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  probabilities: {
    type: Map,
    of: Number,
    default: {},
  },
  severity: {
    type: String,
    enum: ['None', 'Low', 'Moderate', 'Severe'],
    default: 'Moderate',
  },
  symptoms: {
    type: [String],
    default: [],
  },
  organicRemedy: {
    type: String,
    default: '',
  },
  chemicalRemedy: {
    type: String,
    default: '',
  },
  preventiveMeasures: {
    type: [String],
    default: [],
  },
  disclaimer: {
    type: String,
    default: 'AI screening is an automated advisory aid and not a certified laboratory diagnosis. Consult a qualified horticultural officer before applying chemical fungicides.',
  },
  modelSource: {
    type: String,
    default: 'FastAPI Microservice (PyTorch)',
  },
  status: {
    type: String,
    enum: ['analyzed', 'review_requested', 'reviewed_by_expert', 'archived'],
    default: 'analyzed',
  },
  farmerNotes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Scan', scanSchema);

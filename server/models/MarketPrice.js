const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
  variety: {
    type: String,
    required: true,
  },
  mandi: {
    type: String,
    required: true,
  },
  pricePerQuintal: {
    type: Number,
    required: true,
  },
  pricePerBox: {
    type: Number, // 16-18 kg standard box
    required: true,
  },
  minPrice: {
    type: Number,
  },
  maxPrice: {
    type: Number,
  },
  grade: {
    type: String,
    enum: ['Grade A (Export)', 'Grade B (Standard)', 'Grade C (Commercial)'],
    default: 'Grade A (Export)',
  },
  trend: {
    type: String,
    enum: ['up', 'down', 'stable'],
    default: 'stable',
  },
  changePercent: {
    type: Number,
    default: 0.0,
  },
  volumeQuintals: {
    type: Number,
    default: 1200,
  },
  marketDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
  history: [
    {
      date: String,
      pricePerQuintal: Number,
      volume: Number,
    }
  ],
  dataSource: {
    type: String,
    default: 'Demo data — Kashmiri Mandi Reference Rates (Not live official feed)',
  },
  isDemo: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MarketPrice', marketPriceSchema);

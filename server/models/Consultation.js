const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  farmerName: {
    type: String,
    required: true,
  },
  farmerLocation: {
    type: String,
    default: 'Shopian, J&K',
  },
  farmerPhone: {
    type: String,
    default: '',
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  expertName: {
    type: String,
    default: 'Dr. Altaf Hussain (Pathologist)',
  },
  scanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scan',
  },
  scanImageUrl: {
    type: String,
    default: '',
  },
  predictedClass: {
    type: String,
    default: 'Apple Scab',
  },
  appointmentDate: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    default: '10:00 AM - 11:00 AM',
  },
  consultationType: {
    type: String,
    enum: ['Online Video', 'Audio Advisory', 'In-Person Orchard Visit'],
    default: 'Online Video',
  },
  symptomsReported: {
    type: String,
    default: 'Dark olive-green velvety lesions noticed on upper leaf surface after recent rainfall.',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  expertNotes: {
    type: String,
    default: '',
  },
  expertAssessment: {
    type: String,
    default: '',
  },
  recommendations: {
    type: String,
    default: '',
  },
  followUpDate: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Consultation', consultationSchema);

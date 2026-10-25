const mongoose = require('mongoose');
const Consultation = require('../models/Consultation');
const Scan = require('../models/Scan');

// In-memory consultation store
const inMemoryConsultations = [
  {
    _id: 'consult_demo_1',
    farmerId: 'farmer_demo_123',
    farmerName: 'Ghulam Mohammad Mir',
    farmerLocation: 'Shopian (Keller Block), J&K',
    farmerPhone: '+91 94190 12345',
    expertName: 'Dr. Altaf Hussain (Pathologist)',
    scanId: null,
    scanImageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&q=80',
    predictedClass: 'Apple Scab',
    appointmentDate: '2026-10-28',
    timeSlot: '11:00 AM - 11:45 AM',
    consultationType: 'Online Video',
    symptomsReported: 'Velvety olive-green spots on delicious apple variety trees following continuous rain spell.',
    status: 'pending',
    expertNotes: '',
    expertAssessment: '',
    recommendations: '',
    followUpDate: '',
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    _id: 'consult_demo_2',
    farmerId: 'farmer_demo_456',
    farmerName: 'Mohammad Shafi Dar',
    farmerLocation: 'Baramulla (Rafiabad), J&K',
    farmerPhone: '+91 97970 88214',
    expertName: 'Dr. Altaf Hussain (Pathologist)',
    scanId: null,
    scanImageUrl: 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe0a?auto=format&fit=crop&w=400&q=80',
    predictedClass: 'Black Rot',
    appointmentDate: '2026-10-29',
    timeSlot: '02:30 PM - 03:15 PM',
    consultationType: 'In-Person Orchard Visit',
    symptomsReported: 'Frog-eye spots appearing on leaves and trunk cankers on mature trees.',
    status: 'confirmed',
    expertNotes: 'Pre-inspection scheduled. Farmer advised to keep pruning shears sanitized.',
    expertAssessment: '',
    recommendations: '',
    followUpDate: '',
    createdAt: new Date(Date.now() - 86400000 * 3),
  }
];

// Create a new consultation booking (Farmer)
exports.createBooking = async (req, res) => {
  try {
    const {
      expertId,
      expertName,
      scanId,
      scanImageUrl,
      predictedClass,
      appointmentDate,
      timeSlot,
      consultationType,
      symptomsReported,
    } = req.body;

    if (!appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date and time slot are required.',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    const bookingData = {
      farmerId: req.user.id,
      farmerName: req.user.name,
      farmerLocation: req.body.farmerLocation || 'Kashmir Orchard Block',
      farmerPhone: req.body.farmerPhone || '+91 94190 00000',
      expertId: expertId || null,
      expertName: expertName || 'Dr. Altaf Hussain (SKUAST-K)',
      scanId: scanId || null,
      scanImageUrl: scanImageUrl || '',
      predictedClass: predictedClass || 'Apple Disease Review',
      appointmentDate,
      timeSlot,
      consultationType: consultationType || 'Online Video',
      symptomsReported: symptomsReported || 'Automated scan advisory requested verification.',
      status: 'pending',
      createdAt: new Date(),
    };

    if (isDbConnected) {
      const newConsultation = await Consultation.create(bookingData);
      return res.status(201).json({
        success: true,
        message: 'Consultation booking submitted successfully. Waiting for expert confirmation.',
        consultation: newConsultation,
      });
    } else {
      const newConsultation = {
        _id: 'consult_' + Date.now(),
        ...bookingData,
      };
      inMemoryConsultations.unshift(newConsultation);

      return res.status(201).json({
        success: true,
        message: 'Consultation booking submitted successfully (In-Memory Demo). Waiting for expert confirmation.',
        consultation: newConsultation,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create booking: ' + error.message,
    });
  }
};

// Get consultations for authenticated user (Farmer or Expert)
exports.getMyConsultations = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const { role, id } = req.user;

    if (isDbConnected) {
      const query = role === 'farmer' ? { farmerId: id } : {};
      const consultations = await Consultation.find(query).sort({ createdAt: -1 });

      return res.json({
        success: true,
        count: consultations.length,
        consultations,
      });
    } else {
      const consultations = role === 'farmer'
        ? inMemoryConsultations.filter(c => String(c.farmerId) === String(id))
        : inMemoryConsultations;

      return res.json({
        success: true,
        count: consultations.length,
        consultations,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve consultations: ' + error.message,
    });
  }
};

// Update consultation status (Accept, Decline, Complete)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, expertNotes } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, confirmed, completed, or cancelled.',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const consultation = await Consultation.findById(id);
      if (!consultation) {
        return res.status(404).json({ success: false, message: 'Consultation not found' });
      }

      consultation.status = status;
      if (expertNotes) consultation.expertNotes = expertNotes;
      await consultation.save();

      return res.json({
        success: true,
        message: `Consultation status updated to ${status}.`,
        consultation,
      });
    } else {
      const item = inMemoryConsultations.find(c => String(c._id) === String(id));
      if (!item) {
        return res.status(404).json({ success: false, message: 'Consultation not found' });
      }

      item.status = status;
      if (expertNotes) item.expertNotes = expertNotes;

      return res.json({
        success: true,
        message: `Consultation status updated to ${status}.`,
        consultation: item,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update consultation: ' + error.message,
    });
  }
};

// Expert submits case diagnosis & treatment plan
exports.submitAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { expertAssessment, recommendations, followUpDate, expertNotes } = req.body;

    if (!expertAssessment) {
      return res.status(400).json({
        success: false,
        message: 'Expert clinical assessment is required.',
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const consultation = await Consultation.findById(id);
      if (!consultation) {
        return res.status(404).json({ success: false, message: 'Case not found' });
      }

      consultation.expertAssessment = expertAssessment;
      consultation.recommendations = recommendations || '';
      consultation.followUpDate = followUpDate || '';
      if (expertNotes) consultation.expertNotes = expertNotes;
      consultation.status = 'completed';
      await consultation.save();

      return res.json({
        success: true,
        message: 'Expert assessment and prescription submitted successfully.',
        consultation,
      });
    } else {
      const item = inMemoryConsultations.find(c => String(c._id) === String(id));
      if (!item) {
        return res.status(404).json({ success: false, message: 'Case not found' });
      }

      item.expertAssessment = expertAssessment;
      item.recommendations = recommendations || '';
      item.followUpDate = followUpDate || '';
      if (expertNotes) item.expertNotes = expertNotes;
      item.status = 'completed';

      return res.json({
        success: true,
        message: 'Expert assessment and prescription submitted successfully.',
        consultation: item,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit assessment: ' + error.message,
    });
  }
};

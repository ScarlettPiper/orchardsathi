const User = require('../models/User');
const mongoose = require('mongoose');

const DEMO_EXPERTS = [
  {
    _id: 'expert_1',
    name: 'Dr. Altaf Hussain',
    title: 'Senior Plant Pathologist',
    institution: 'SKUAST-Kashmir (Division of Plant Pathology)',
    specialization: 'Temperate Pome Fruit Diseases & Apple Scab Epidemiology',
    experienceYears: 14,
    location: { district: 'Srinagar', state: 'Jammu & Kashmir' },
    isVerified: true,
    verificationBadge: 'Verified SKUAST Horticultural Specialist',
    rating: 4.9,
    casesResolved: 420,
    isAvailable: true,
    availableSlots: ['10:00 AM - 10:45 AM', '02:00 PM - 02:45 PM', '04:00 PM - 04:45 PM'],
    bio: 'Former research scientist at Regional Horticultural Research Station. Author of 18 peer-reviewed publications on apple scab management and fungicide resistance mitigation in the Kashmir valley.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    _id: 'expert_2',
    name: 'Dr. Shabir Ahmad Malik',
    title: 'Entomologist & IPM Consultant',
    institution: 'Directorate of Horticulture, J&K',
    specialization: 'San Jose Scale & European Red Mite Management',
    experienceYears: 11,
    location: { district: 'Baramulla', state: 'Jammu & Kashmir' },
    isVerified: false,
    verificationBadge: 'Pending Verification',
    rating: 4.7,
    casesResolved: 280,
    isAvailable: true,
    availableSlots: ['11:30 AM - 12:15 PM', '03:30 PM - 04:15 PM'],
    bio: 'Field horticulturist serving growers across North Kashmir. Focused on organic spray formulations and predatory mite habitat conservation in high-density rootstocks.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    _id: 'expert_3',
    name: 'Er. Nuzhat Ara',
    title: 'Post-Harvest & Cold Chain Specialist',
    institution: 'Kashmir Fruit Growers & Dealers Association',
    specialization: 'Apple Grading, CA Storage Management & Pre-Harvest Sprays',
    experienceYears: 8,
    location: { district: 'Shopian', state: 'Jammu & Kashmir' },
    isVerified: true,
    verificationBadge: 'Verified SKUAST Horticultural Specialist',
    rating: 4.8,
    casesResolved: 195,
    isAvailable: false,
    availableSlots: ['01:00 PM - 01:45 PM'],
    bio: 'Consultant for controlled atmosphere (CA) stores and export-quality grading across Lassipora Industrial Estate, Pulwama.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  }
];

// Get list of agricultural experts
exports.getExperts = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const dbExperts = await User.find({ role: 'expert' }).select('-password');
      if (dbExperts.length > 0) {
        const formatted = dbExperts.map(e => ({
          _id: e._id,
          name: e.name,
          title: e.expertProfile?.title || 'Agricultural Specialist',
          institution: e.expertProfile?.institution || 'Agricultural University',
          specialization: e.expertProfile?.specialization || 'Apple Orchard Management',
          experienceYears: e.expertProfile?.experienceYears || 5,
          location: e.location || { district: 'Shopian', state: 'J&K' },
          isVerified: e.expertProfile?.isVerified || false,
          verificationBadge: e.expertProfile?.isVerified ? 'Verified Specialist' : 'Pending Verification',
          isAvailable: e.expertProfile?.isAvailable !== false,
          bio: e.expertProfile?.bio || '',
          availableSlots: ['10:00 AM - 11:00 AM', '02:00 PM - 03:00 PM'],
        }));
        return res.json({ success: true, count: formatted.length, experts: formatted });
      }
    }

    return res.json({
      success: true,
      count: DEMO_EXPERTS.length,
      notice: 'Demo agricultural experts list for Review 1 showcase',
      experts: DEMO_EXPERTS,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve experts: ' + error.message,
    });
  }
};

// Toggle expert availability
exports.toggleAvailability = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const { isAvailable } = req.body;

    if (isDbConnected) {
      const expert = await User.findById(req.user.id);
      if (expert && expert.expertProfile) {
        expert.expertProfile.isAvailable = Boolean(isAvailable);
        await expert.save();
      }
    }

    return res.json({
      success: true,
      isAvailable: Boolean(isAvailable),
      message: `Status updated to ${isAvailable ? 'Available for Consultations' : 'Unavailable / In Field'}.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update availability: ' + error.message,
    });
  }
};

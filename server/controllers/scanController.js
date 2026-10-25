const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Scan = require('../models/Scan');
const { analyzeLeafImage } = require('../services/aiService');

// In-memory scans fallback store
const inMemoryScans = [];

// Analyze Leaf
exports.analyzeScan = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No leaf image provided. Please upload a valid JPG or PNG file.',
      });
    }

    const filePath = req.file.path;
    const originalFilename = req.file.originalname;
    const relativeUrl = `/uploads/${req.file.filename}`;

    // Perform AI analysis via AI microservice / local diagnostic engine
    const analysis = await analyzeLeafImage(filePath, originalFilename);

    const isDbConnected = mongoose.connection.readyState === 1;

    const scanData = {
      farmerId: req.user.id,
      farmerName: req.user.name || 'Orchard Farmer',
      imageUrl: relativeUrl,
      originalFilename: originalFilename,
      predictedClass: analysis.predictedClass,
      scientificName: analysis.scientificName,
      confidence: analysis.confidence,
      probabilities: analysis.probabilities,
      severity: analysis.severity,
      symptoms: analysis.symptoms,
      organicRemedy: analysis.organicRemedy,
      chemicalRemedy: analysis.chemicalRemedy,
      preventiveMeasures: analysis.preventiveMeasures,
      disclaimer: analysis.disclaimer,
      modelSource: analysis.modelSource,
      status: 'analyzed',
      farmerNotes: req.body.notes || '',
      createdAt: new Date(),
    };

    if (isDbConnected) {
      const savedScan = await Scan.create(scanData);
      return res.status(201).json({
        success: true,
        message: 'Leaf image analyzed and saved successfully.',
        scan: savedScan,
        microserviceConnected: analysis.isMicroserviceConnected,
        notice: analysis.notice || null,
      });
    } else {
      const savedScan = {
        _id: 'scan_' + Date.now(),
        ...scanData,
      };
      inMemoryScans.unshift(savedScan);

      return res.status(201).json({
        success: true,
        message: 'Leaf image analyzed successfully (In-Memory persistence).',
        scan: savedScan,
        microserviceConnected: analysis.isMicroserviceConnected,
        notice: analysis.notice || null,
      });
    }
  } catch (error) {
    console.error('Scan Analysis Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process leaf image: ' + error.message,
    });
  }
};

// Get Farmer Scan History
exports.getScanHistory = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const farmerId = req.user.id;

    if (isDbConnected) {
      const scans = await Scan.find({ farmerId }).sort({ createdAt: -1 });
      return res.json({
        success: true,
        total: scans.length,
        scans,
      });
    } else {
      const scans = inMemoryScans.filter(s => String(s.farmerId) === String(farmerId));
      return res.json({
        success: true,
        total: scans.length,
        scans,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load scan history: ' + error.message,
    });
  }
};

// Get single scan by ID
exports.getScanById = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    let scan = null;
    if (isDbConnected) {
      scan = await Scan.findById(id);
    } else {
      scan = inMemoryScans.find(s => String(s._id) === String(id));
    }

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan record not found.',
      });
    }

    // Check ownership or expert role
    if (String(scan.farmerId) !== String(req.user.id) && req.user.role !== 'expert') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only access your own scans.',
      });
    }

    return res.json({
      success: true,
      scan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving scan: ' + error.message,
    });
  }
};

// Delete scan
exports.deleteScan = async (req, res) => {
  try {
    const { id } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const scan = await Scan.findOne({ _id: id, farmerId: req.user.id });
      if (!scan) {
        return res.status(404).json({
          success: false,
          message: 'Scan record not found or unauthorized to delete.',
        });
      }
      await Scan.deleteOne({ _id: id });
      return res.json({
        success: true,
        message: 'Scan record removed successfully.',
      });
    } else {
      const idx = inMemoryScans.findIndex(s => String(s._id) === String(id) && String(s.farmerId) === String(req.user.id));
      if (idx === -1) {
        return res.status(404).json({
          success: false,
          message: 'Scan record not found.',
        });
      }
      inMemoryScans.splice(idx, 1);
      return res.json({
        success: true,
        message: 'Scan record removed successfully.',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting scan: ' + error.message,
    });
  }
};

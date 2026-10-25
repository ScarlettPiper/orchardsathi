const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.post(
  '/book',
  authenticateToken,
  authorizeRoles('farmer'),
  consultationController.createBooking
);

router.get(
  '/my-consultations',
  authenticateToken,
  consultationController.getMyConsultations
);

router.put(
  '/:id/status',
  authenticateToken,
  authorizeRoles('expert'),
  consultationController.updateStatus
);

router.post(
  '/:id/assessment',
  authenticateToken,
  authorizeRoles('expert'),
  consultationController.submitAssessment
);

module.exports = router;

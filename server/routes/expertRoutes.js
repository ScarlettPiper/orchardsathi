const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', expertController.getExperts);
router.put('/availability', authenticateToken, authorizeRoles('expert'), expertController.toggleAvailability);

module.exports = router;

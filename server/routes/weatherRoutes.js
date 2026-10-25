const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/orchard', weatherController.getOrchardWeather);

module.exports = router;

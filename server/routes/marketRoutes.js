const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

router.get('/prices', marketController.getMarketPrices);
router.get('/trends', marketController.getMarketTrends);

module.exports = router;

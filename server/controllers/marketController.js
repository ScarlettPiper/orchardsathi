const MarketPrice = require('../models/MarketPrice');
const mongoose = require('mongoose');

// Kashmiri Apple Mandi Market Dataset (Authentic cultivars and wholesale metrics)
const DEMO_MARKET_DATA = [
  {
    variety: 'Kashmiri Delicious (Red Delicious)',
    mandi: 'Sopore Fruit Mandi',
    pricePerQuintal: 9200,
    pricePerBox: 1550, // 16-18 kg box
    minPrice: 8600,
    maxPrice: 9800,
    grade: 'Grade A (Export)',
    trend: 'up',
    changePercent: 4.8,
    volumeQuintals: 3400,
    marketDate: '2026-10-24',
    dataSource: 'Demo data — Kashmiri Mandi Reference Rates (Not live official feed)',
    history: [
      { date: 'Aug W1', pricePerQuintal: 7800, volume: 1100 },
      { date: 'Aug W3', pricePerQuintal: 8100, volume: 1800 },
      { date: 'Sep W1', pricePerQuintal: 8500, volume: 2600 },
      { date: 'Sep W3', pricePerQuintal: 8900, volume: 3200 },
      { date: 'Oct W1', pricePerQuintal: 9050, volume: 3600 },
      { date: 'Oct W3', pricePerQuintal: 9200, volume: 3400 },
    ],
  },
  {
    variety: 'Royal Delicious',
    mandi: 'Shopian Fruit Mandi',
    pricePerQuintal: 10400,
    pricePerBox: 1750,
    minPrice: 9800,
    maxPrice: 11200,
    grade: 'Grade A (Export)',
    trend: 'up',
    changePercent: 6.2,
    volumeQuintals: 2800,
    marketDate: '2026-10-24',
    dataSource: 'Demo data — Kashmiri Mandi Reference Rates (Not live official feed)',
    history: [
      { date: 'Aug W1', pricePerQuintal: 8600, volume: 900 },
      { date: 'Aug W3', pricePerQuintal: 9100, volume: 1500 },
      { date: 'Sep W1', pricePerQuintal: 9600, volume: 2200 },
      { date: 'Sep W3', pricePerQuintal: 10000, volume: 2700 },
      { date: 'Oct W1', pricePerQuintal: 10250, volume: 2900 },
      { date: 'Oct W3', pricePerQuintal: 10400, volume: 2800 },
    ],
  },
  {
    variety: 'Maharaji (White Dotted Red)',
    mandi: 'Parimpora Mandi (Srinagar)',
    pricePerQuintal: 6800,
    pricePerBox: 1150,
    minPrice: 6200,
    maxPrice: 7300,
    grade: 'Grade B (Standard)',
    trend: 'stable',
    changePercent: 0.5,
    volumeQuintals: 1950,
    marketDate: '2026-10-24',
    dataSource: 'Demo data — Kashmiri Mandi Reference Rates (Not live official feed)',
    history: [
      { date: 'Aug W1', pricePerQuintal: 6400, volume: 800 },
      { date: 'Aug W3', pricePerQuintal: 6550, volume: 1200 },
      { date: 'Sep W1', pricePerQuintal: 6700, volume: 1600 },
      { date: 'Sep W3', pricePerQuintal: 6750, volume: 1900 },
      { date: 'Oct W1', pricePerQuintal: 6800, volume: 2000 },
      { date: 'Oct W3', pricePerQuintal: 6800, volume: 1950 },
    ],
  },
  {
    variety: 'American Trel',
    mandi: 'Sopore Fruit Mandi',
    pricePerQuintal: 7400,
    pricePerBox: 1240,
    minPrice: 6900,
    maxPrice: 7800,
    grade: 'Grade B (Standard)',
    trend: 'down',
    changePercent: -2.1,
    volumeQuintals: 2100,
    marketDate: '2026-10-24',
    dataSource: 'Demo data — Kashmiri Mandi Reference Rates (Not live official feed)',
    history: [
      { date: 'Aug W1', pricePerQuintal: 7100, volume: 1000 },
      { date: 'Aug W3', pricePerQuintal: 7300, volume: 1400 },
      { date: 'Sep W1', pricePerQuintal: 7650, volume: 2300 },
      { date: 'Sep W3', pricePerQuintal: 7600, volume: 2500 },
      { date: 'Oct W1', pricePerQuintal: 7500, volume: 2300 },
      { date: 'Oct W3', pricePerQuintal: 7400, volume: 2100 },
    ],
  },
  {
    variety: 'Kullu Delicious',
    mandi: 'Narwal Mandi (Jammu)',
    pricePerQuintal: 8800,
    pricePerBox: 1480,
    minPrice: 8200,
    maxPrice: 9300,
    grade: 'Grade A (Export)',
    trend: 'up',
    changePercent: 3.1,
    volumeQuintals: 1650,
    marketDate: '2026-10-24',
    dataSource: 'Demo data — Kashmiri Mandi Reference Rates (Not live official feed)',
    history: [
      { date: 'Aug W1', pricePerQuintal: 7900, volume: 600 },
      { date: 'Aug W3', pricePerQuintal: 8200, volume: 1100 },
      { date: 'Sep W1', pricePerQuintal: 8400, volume: 1400 },
      { date: 'Sep W3', pricePerQuintal: 8650, volume: 1600 },
      { date: 'Oct W1', pricePerQuintal: 8750, volume: 1700 },
      { date: 'Oct W3', pricePerQuintal: 8800, volume: 1650 },
    ],
  },
  {
    variety: 'Gala (High Density)',
    mandi: 'Azadpur Mandi (Delhi)',
    pricePerQuintal: 12200,
    pricePerBox: 2050,
    minPrice: 11500,
    maxPrice: 13000,
    grade: 'Grade A (Export)',
    trend: 'up',
    changePercent: 7.4,
    volumeQuintals: 4200,
    marketDate: '2026-10-24',
    dataSource: 'Demo data — Kashmiri Mandi Reference Rates (Not live official feed)',
    history: [
      { date: 'Aug W1', pricePerQuintal: 10200, volume: 1500 },
      { date: 'Aug W3', pricePerQuintal: 10800, volume: 2400 },
      { date: 'Sep W1', pricePerQuintal: 11400, volume: 3300 },
      { date: 'Sep W3', pricePerQuintal: 11800, volume: 3900 },
      { date: 'Oct W1', pricePerQuintal: 12000, volume: 4300 },
      { date: 'Oct W3', pricePerQuintal: 12200, volume: 4200 },
    ],
  },
];

// Get all market prices with optional filters
exports.getMarketPrices = async (req, res) => {
  try {
    const { variety, mandi, sort } = req.query;
    let data = [...DEMO_MARKET_DATA];

    if (variety && variety !== 'All') {
      data = data.filter(item => item.variety.toLowerCase().includes(variety.toLowerCase()));
    }

    if (mandi && mandi !== 'All') {
      data = data.filter(item => item.mandi.toLowerCase().includes(mandi.toLowerCase()));
    }

    if (sort === 'price_asc') {
      data.sort((a, b) => a.pricePerQuintal - b.pricePerQuintal);
    } else if (sort === 'price_desc') {
      data.sort((a, b) => b.pricePerQuintal - a.pricePerQuintal);
    }

    return res.json({
      success: true,
      count: data.length,
      notice: 'Demo data — Kashmiri Mandi Reference Rates (Not live official feed)',
      prices: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch market data: ' + error.message,
    });
  }
};

// Get market trend lines for charts
exports.getMarketTrends = async (req, res) => {
  try {
    const { variety } = req.query;
    const selected = DEMO_MARKET_DATA.find(d => 
      variety ? d.variety.toLowerCase().includes(variety.toLowerCase()) : true
    ) || DEMO_MARKET_DATA[0];

    const timelineData = selected.history.map(point => ({
      timeline: point.date,
      price: point.pricePerQuintal,
      volume: point.volume,
    }));

    return res.json({
      success: true,
      variety: selected.variety,
      mandi: selected.mandi,
      currentPrice: selected.pricePerQuintal,
      currentBoxPrice: selected.pricePerBox,
      trend: selected.trend,
      changePercent: selected.changePercent,
      notice: 'Demo data — Kashmiri Mandi Reference Rates',
      trends: timelineData,
      analysis: `Current prices for ${selected.variety} at ${selected.mandi} reflect strong pre-winter festive procurement. Export-grade fruit has seen a ${selected.changePercent}% value appreciation over the last 30 days due to high demand in NCR and South Indian terminal markets.`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch trends: ' + error.message,
    });
  }
};

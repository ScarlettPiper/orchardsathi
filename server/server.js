const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { connectDB, getDbStatus } = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const scanRoutes = require('./routes/scanRoutes');
const marketRoutes = require('./routes/marketRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const expertRoutes = require('./routes/expertRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded images
app.use('/uploads', express.static(uploadsDir));

// System Health API
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    project: 'OrchardSathi AI',
    status: 'ONLINE',
    tagline: 'Smarter Orchards, Healthier Harvests.',
    version: '1.0.0-review1',
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: dbStatus.connected,
      state: dbStatus.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED (In-Memory Fallback Active)',
      host: dbStatus.host
    },
    aiMicroserviceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/weather', weatherRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.message);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File is too large. Leaf image must be under 10MB.',
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Upload error: ' + err.message,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
const startServer = () => {
  // Initiate DB connection asynchronously so HTTP server is available immediately
  connectDB().catch(err => {
    console.warn('[MongoDB Notice] Running in offline / in-memory fallback mode.');
  });

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🍎 OrchardSathi AI — Main Express Backend Active`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
    console.log(`📁 Static Uploads: http://localhost:${PORT}/uploads`);
    console.log(`====================================================`);
  });
};

startServer();

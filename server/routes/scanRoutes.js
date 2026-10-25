const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const scanController = require('../controllers/scanController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'apple-leaf-' + uniqueSuffix + ext);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, and PNG leaf photos are supported.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

// Farmer Routes
router.post(
  '/analyze',
  authenticateToken,
  authorizeRoles('farmer'),
  upload.single('leafImage'),
  scanController.analyzeScan
);

router.get(
  '/history',
  authenticateToken,
  authorizeRoles('farmer'),
  scanController.getScanHistory
);

router.get(
  '/:id',
  authenticateToken,
  scanController.getScanById
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('farmer'),
  scanController.deleteScan
);

module.exports = router;

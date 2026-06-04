const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const admin = require('../middleware/adminMiddleware');
const {
  getAllPackages, getPackageById, createPackage,
  updatePackage, deletePackage, getDestinations
} = require('../controllers/packageController');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `package-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Public routes
router.get('/', getAllPackages);
router.get('/destinations/list', getDestinations);
router.get('/:id', getPackageById);

// Admin routes
router.post('/', auth, admin, upload.array('images', 5), createPackage);
router.put('/:id', auth, admin, upload.array('images', 5), updatePackage);
router.delete('/:id', auth, admin, deletePackage);

module.exports = router;

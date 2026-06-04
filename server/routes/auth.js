const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
  register, login, getProfile, updateProfile, toggleFavorite
} = require('../controllers/authController');

// @route   POST /api/auth/register
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

// @route   POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], login);

// @route   GET /api/auth/profile
router.get('/profile', auth, getProfile);

// @route   PUT /api/auth/profile
router.put('/profile', auth, updateProfile);

// @route   PUT /api/auth/favorites/:packageId
router.put('/favorites/:packageId', auth, toggleFavorite);

module.exports = router;

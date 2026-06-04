const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/adminMiddleware');
const {
  getDashboardStats, getAllUsers, deleteUser
} = require('../controllers/adminController');

// All admin routes require auth + admin middleware
router.use(auth, admin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;

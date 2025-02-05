//auth.js (routes)
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOTP);

module.exports = router;
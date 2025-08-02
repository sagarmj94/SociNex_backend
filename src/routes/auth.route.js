const express = require('express');

const { registerController, loginController, logoutController, forgotPasswordController, resetPasswordController } = require('../controllers/auth.controller');
const router = express.Router();

// POST /register
router.post('/register', registerController);
// POST /login
router.post('/login', loginController);
// POST /logout
router.post('/logout', logoutController);
// POST/ FORTGOT PASSWORD
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password', resetPasswordController);

module.exports = router;
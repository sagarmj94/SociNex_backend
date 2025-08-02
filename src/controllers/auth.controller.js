const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Register Controller
async function registerController(req, res) {
    const { username, password } = req.body;
    const isexistingUser = await userModel.findOne({
        username: username
    });
    if (isexistingUser) {
        return res.status(400).json({
            message: 'Username already exists'
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create(
        {
            username,
            password: hashedPassword
        }
    );

    const token = jwt.sign(
        { id: user._id }, process.env.JWT_SECRET,)
    res.cookie('token', token)
    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: user._id,
            username: user.username
        }
    });
}
//login Controller
async function loginController(req, res) {
    const { username, password } = req.body;
    const user = await userModel.findOne({
        username: username
    })
    if (!user) {
        return res.status(400).json({
            message: 'Invalid username'
        });
    }
    // const isPasswordValid = user.password === password;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({
            message: 'Invalid username or password'
        });
    }
    const token = jwt.sign(
        { id: user._id }, process.env.JWT_SECRET)

    res.cookie('token', token);
    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            id: user._id,
            username: user.username
        }
    });

}
//LogOut Controller
async function logoutController(req, res) {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
//forgot password controller
async function forgotPasswordController(req, res) {
    const { username } = req.body;

    try {
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

        res.status(200).json({
            message: 'Password reset link generated',
            resetLink
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }


}
//reset password controller
async function resetPasswordController(req, res) {
    const token = req.query.token;
    const { password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: 'Token and new password are required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.findByIdAndUpdate(userId, { password: hashedPassword });

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
}

module.exports = { registerController, loginController, logoutController, forgotPasswordController, resetPasswordController }
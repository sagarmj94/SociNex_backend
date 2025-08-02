const express = require('express');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

// POST /register
//GET /user/:id

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await userModel.findOne({
        username: username
    });
    if (existingUser) {
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

});
// POST /login
router.post('/login', (req, res) => { });
// POST /logout
router.post('/logout', (req, res) => { });



module.exports = router;
// routes/auth.js
const express = require('express');
const router = express.Router();

const User = require('@models/User');
const jwt = require('jsonwebtoken');
const { validateRegister, validateLogin } = require('@middlewares/userValidator')

router.post('/register', validateRegister, async (req, res) => {
    try {
        const { username, email, password, joinPrivacyPolicy } = req.body;
        const user = new User({ username, email, password, joinPrivacyPolicy });
        await user.save();
        res.status(201).json({ message: '註冊成功' });
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.validatePassword(password))) {
            return res.status(422).json({ message: '用戶名或密碼錯誤' });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, 'jwt_secret', { expiresIn: '1h' });
        res.json({ message: '登錄成功', token });
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤' });
    }
})

module.exports = router;

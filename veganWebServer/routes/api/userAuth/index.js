// routes/auth.js
const express = require('express');
const router = express.Router();

const User = require('@models/User');
const jwt = require('jsonwebtoken');
const { validateRegister, validateLogin, authToken } = require('@middlewares/userValidator');

const { mailOptions, transporter } = require('./nodemailer');

async function isUserExist(username, email) {
    try {
        return await User.findOne({
            $or: [{ username }, { email }]
        });
    } catch (error) {
        console.log(error);
    }
}

router.post('/register', validateRegister, async (req, res) => {
    try {
        const { username, email } = req.body;
        if (await isUserExist(username, email)) {
            return res.status(422).json({ message: '此帳號已存在' });
        }

        const user = new User({
            ...req.body,
            verified: false,
        });
        await user.save();
        res.status(201).json({ message: '註冊成功' });

    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤' });
    }
});

router.post('/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.validatePassword(password))) {
            return res.status(422).json({ message: '信箱或密碼錯誤' });
        }
        const token = jwt.sign(
            { username: user.username, email: user.email, userID: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // 僅在 HTTPS 連接時發送
            sameSite: 'Strict',
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        });

        res.json({ message: '登錄成功', token });

    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤' });
    }
})

router.get('/profile', authToken, async (req, res) => {
    try {
        const { email } = req.user;
        const user = await User.findOne({ email });
        const token = jwt.sign(
            { username: user.username, email: user.email, userID: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: '歡迎',
            token,
            state: 'confirm'
        });
    } catch (error) {
        console.log(error);
    }
})

router.post('/logout', async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        // secure: true,
        sameSite: 'strict',
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully', state: 'logout' });
})

router.post('/send-verifyEmail', async (req, res) => {
    try {
        const { to } = req.body;
        const token = jwt.sign({ id: to }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const options = {
            ...mailOptions,
            text: `請點擊以下連結來驗證你的信箱: ${to}`,
            html: `<p>請點擊以下連結來驗證你的信箱: <a href="http://localhost:3000/api/auth/verify?token=${token}">驗證連結</a></p>`,
        }
        const info = await transporter.sendMail(options);
        console.log('郵件已發送: ', info.response);
        res.status(200).send({ message: '郵件發送成功', options });
    } catch (error) {
        console.error('發送郵件時出錯:', error);
        res.status(500).send({ message: '郵件發送失敗' });
    }
})

router.get('/verify', async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.id;

        // 查找該使用者並更新狀態
        const user = await User.findOne({ email: id });
        if (!user) {
            return res.status(400).send('無效的驗證連結');
        }
        const verifiedToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })

        user.verified = true;
        await user.save();

        res.send(`
            <html>
            <head>
                <meta http-equiv="refresh" content="5;url=/home" />
                <title>驗證成功</title>
            </head>
            <body>
                <h1>你的帳號已成功驗證！</h1>
                <p>5秒後將自動跳轉到首頁。如果沒有跳轉，<a href="http://localhost:5173/profile?token=${verifiedToken}">點擊這裡</a>。</p>
                <script>
                    setTimeout(() => {
                        window.location.href = 'http://localhost:5173/profile?token=${verifiedToken}';
                    }, 5000); // 5秒後跳轉
                </script>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('驗證過程出錯:', error);
        res.status(400).send('驗證連結無效或已過期');
    }
})

module.exports = router;

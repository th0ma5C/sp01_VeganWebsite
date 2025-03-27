// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('@models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validateRegister, validateLogin, authToken, authJWT, authUser } = require('@middlewares/userValidator');
const { getTransporter, setOptions } = require('./nodemailer');

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

        res
            .status(200)
            .cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 1000 * 60 * 60 * 24 // 1 day
            })
            .json({ state: 'confirm', message: '登錄成功', token });

    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤，請重試' });
    }
})

router.post('/tokenLogin', authJWT, async (req, res) => {
    const user = req.user
    try {
        const token = jwt.sign(
            { username: user.username, email: user.email, userID: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        });

        res.status(200).json({
            message: '歡迎',
            token,
            state: 'confirm'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '伺服器錯誤' });
    }
})

router.get('/profile', authUser, async (req, res) => {
    try {
        const { userID } = req.user;
        const user = await User.findById(userID);
        const token = jwt.sign(
            { username: user.username, email: user.email, userID: user._id, verified: user.verified },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        });

        res.status(200).json({
            message: '歡迎',
            token,
            state: 'confirm'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Invalid request' });
    }
})

router.post('/logout', async (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            // secure: true,
            sameSite: 'strict',
            expires: new Date(0),
        });
        res.status(200).json({ message: 'Logged out successfully', state: 'logout' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Invalid request' });
    }
})
router.post('/send-verifyEmail', async (req, res) => {
    const subject = '驗證你的信箱'
    try {
        const { to } = req.body;
        const user = await User.findOne({ email: to })
        const token = jwt.sign(
            { username: user.username, email: user.email, userID: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        const options = {
            ...setOptions(to, subject),
            text: `請點擊以下連結來驗證你的信箱(連結將在一小時後失效): ${to}`,
            html: `<p>請點擊以下連結來驗證你的信箱: <a href="${process.env.FE_BASE_URL}/profile/emailVerify?token=${token}">驗證連結</a></p>`,
        }
        const transporter = getTransporter();
        const info = await transporter.sendMail(options);
        console.log('郵件已發送: ', info.response);
        res.status(200).send({ message: '郵件發送成功', state: 'confirm' });
    } catch (error) {
        console.error('發送郵件時出錯:', error);
        res.status(500).send({ message: '郵件發送失敗' });
    }
})

router.post('/verifyAccount', async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        // 查找該使用者並更新狀態
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({ state: 'denied', message: '驗證連結無效或已過期' });
        }

        user.verified = true;
        await user.save();

        res.status(200)
            .cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 1000 * 60 * 60 * 24 // 1 day
            })
            .json({
                state: 'confirm',
                token
            })
    } catch (error) {
        console.error('驗證過程出錯:', error);
        res.status(403).json({ state: 'denied', message: '驗證連結無效或已過期' });
    }
})

async function authResetEmail(req, res, next) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: '無此使用者，請輸入正確信箱', state: 'denied' });
        }

        req.body.user = user;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Unauthorized', state: 'denied' });
    }
}

router.post('/forgetPassword', authResetEmail, async (req, res) => {
    const subject = 'Relation-Ship 會員重設密碼'
    try {
        const { _id: userID, email } = req.body.user;
        const token = jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const options = {
            ...setOptions(email, subject),
            html: `
            <h1>
            請點擊以下連結以重設密碼(連結將在一小時後失效)：
            <a href="${process.env.FE_BASE_URL}/profile/resetPassword?token=${token}">重設密碼</a>
            </h1>
            `,
        }
        const transporter = getTransporter();
        await transporter.sendMail(options);
        res.status(200).send({ message: '郵件發送成功', state: 'confirm' });
    } catch (error) {
        res.status(500).json({ message: '伺服器錯誤' });
    }
})

function authResetToken(req, res, next) {
    const token = req.body.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized', state: 'denied' })

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        // req.body.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Unauthorized', state: 'denied' });
    }
}

async function comparePassword(nPassword, oPassword) {
    return await bcrypt.compare(nPassword, oPassword);
}

router.patch('/resetPassword', authResetToken, async (req, res) => {
    try {
        const { userID, password: nPassword } = req.body;
        const user = await User.findById(userID);
        const isSamePassword = await comparePassword(nPassword, user.password)
        if (isSamePassword) {
            return res.status(409).json({ message: "新密碼不能與舊密碼相同", state: 'denied' });
        }
        user.password = nPassword;
        await user.save();
        res.status(201).json({ message: '重設成功', state: 'confirm' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '伺服器錯誤' });
    }
})

router.get('/checkUserVerified', authUser, async (req, res) => {
    try {
        const { userID } = req.user;
        const { verified } = await User.findById(userID);

        if (verified) {
            return res.status(200).json({
                message: '已驗證',
                state: 'confirm'
            });
        }
        res.status(200).json({
            message: '未驗證',
            state: 'denied'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Invalid request' });
    }
})

module.exports = router;

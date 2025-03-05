const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('@models/User');
const Order = require('@models/OrderModel');

const validateRegister = [
    body('username').notEmpty().withMessage('請輸入用戶名'),
    body('email').isEmail().withMessage('請輸入有效的郵件地址'),
    body('password').isLength({ min: 6 }).withMessage('密碼至少需包含 6 個字符'),
    body('joinPrivacyPolicy').equals('true').withMessage('必須接受隱私政策'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
];

const validateLogin = [
    body('email').isEmail().withMessage('請輸入有效的郵件地址'),
    body('password').notEmpty().withMessage('請輸入密碼'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
]

// const routerAuthToken = (req, res, next) => {
//     const token = req.headers['authorization'];
//     if (!token) return res.status(401).json({ message: '未授權' });

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.status(403).json({ message: '無效的令牌' });
//         req.user = user;
//         next();
//     });
// }

// 驗證 cookie
function authToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: '請先登入', state: 'denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Unauthorized', state: 'denied' });
    }
}

async function authJWT(req, res, next) {
    const token = req.cookies.token ?? req.headers.authorization;
    try {
        const { email, isGuest = false, userID = null } = jwt.verify(token, process.env.JWT_SECRET);
        if (isGuest) {
            const token = jwt.sign(
                { email, userID, isGuest },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );
            return res.status(200).json({
                token,
                msg: 'guest check order'
            })
        }

        let user = await User.findOne({ email });

        if (!user) {
            throw new Error('User Error');
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: '請重新登入', state: 'denied' });
    }
}

function authUser(req, res, next) {
    const token = req.cookies.token ?? req.headers.authorization;
    // const { email, userID, isGuest } = jwt.verify(token, process.env.JWT_SECRET)

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token', state: 'denied' });
            }
            req.user = user;
            next();
        });
        return
    }
    // else if (req.path == '/userOrderList' && isGuest) {
    //     req.user = {
    //         userID
    //     }
    //     return next()
    // } 
    else if ((req.path == '/createOrder' && !token)) {
        const { purchaseOrder } = req.body.order;
        req.user = { userID: purchaseOrder.userID };
        req.isGuest = true;
        return next()
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = {
    validateRegister,
    validateLogin,
    authToken,
    authJWT,
    authUser
}
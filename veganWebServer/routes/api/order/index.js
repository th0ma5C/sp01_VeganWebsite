const express = require('express');
const router = express.Router();
const { authToken } = require('@middlewares/userValidator');
const { checkOrder, checkSub } = require('@middlewares/orderVerify');
const User = require('@models/User');
const Order = require('@models/OrderModel');
const Stocks = require('@models/StockModel');
const redisClient = require('@root/redisClient')
const jwt = require('jsonwebtoken');
const { orderMailer } = require('./nodemailer/mailer');
const { saveShippingInfo } = require('./saveShippingInfo/saveInfo')
/**
 * todo: 訂購身分驗證, 價格驗算, 訂購成功email
 * doing:  刪 改 查
 * ---------------------------------------------
 * //下訂email
 */

// 查詢訂單DB
async function findOrderbyUserID(userID) {
    try {
        const orders = await Order.find({ 'purchaseOrder.userID': userID })
            .select('-shippingInfo')
            .lean();
        return orders;
    } catch (err) {
        console.error('Error fetching purchase orders:', err);
        throw err;
    }
}

// 驗證訂單
router.post('/verifyPurchaseOrder', checkOrder, async (req, res) => {
    try {
        return res.status(200).json({ message: '驗證成功', state: 'confirm' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '' });
    }
})

// 創建訂單
router.post('/createOrder', [authToken, checkSub], async (req, res) => {
    const { userID } = req.user;
    const { shippingInfo, purchaseOrder } = req.body.order;
    const newOrder = new Order({
        shippingInfo,
        purchaseOrder
    });

    try {
        const savedOrder = await newOrder.save();

        await orderMailer(shippingInfo.consigneeName, userID, savedOrder._id);

        if (shippingInfo.saveInfo) {
            await saveShippingInfo(userID, shippingInfo);
        }

        res.status(200).json({ message: '訂單已建立', state: 'confirm' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

function authUser(req, res, next) {
    const token = req.cookies.token ?? req.headers.authorization;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token', state: 'denied' });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

// shipping info
router.get('/getShippingInfo', authUser, async (req, res) => {
    const decoded = req.user;
    try {
        const user = await User.findById(decoded.userID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.shippingInfo) return res.status(200).json({
            state: 'denied',
            message: 'info not found'
        });

        res.status(200).json({
            state: 'confirm',
            shippingInfo: user.shippingInfo
        });

    } catch (error) {
        console.error('Error fetching user shipping info:', error);
        res.status(500).json({ message: 'Server error' });
    }
})


// 查詢訂單
router.get('/userOrderList', authUser, async (req, res) => {
    const decoded = req.user;
    try {
        const order = await findOrderbyUserID(decoded.userID);

        if (!order || order.length === 0) {
            return res.status(404).json({ message: 'order not found' });
        }

        res.status(200).json({ order, state: 'confirm' });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

// 變更訂單
router.post('/editOrder', async (req, res) => {

})

// 刪除訂單
router.post('/deleteOrder', async (req, res) => {

})

// router.post('/test', async (req, res) => {
//     try {
//         const { list } = req.body;
//         const startRedis = Date.now();
//         const redisRes = await Promise.all(
//             list.map(async (keyword) => {
//                 const result = await redisClient.get(keyword);
//                 return { keyword, value: result };
//             })
//         );
//         const redisSpend = Date.now() - startRedis;

//         const startMongo = Date.now();
//         const mongoRes = await Stocks.find({ name: { $in: list } }).lean();
//         const mongooseSpend = Date.now() - startMongo;

//         const result = {
//             redis: {
//                 redisSpend,
//                 redisRes
//             },
//             mongoose: {
//                 mongooseSpend,
//                 mongoRes
//             }
//         }
//         res.status(200).json(result);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Failed to create order' });
//     }
// })


module.exports = router;

const express = require('express');
const router = express.Router();
const { authToken, authUser } = require('@middlewares/userValidator');
const { checkOrder, checkSub } = require('@middlewares/orderVerify');
const User = require('@models/User');
const Order = require('@models/OrderModel');
const jwt = require('jsonwebtoken');
const { orderMailer, guestOrderMailer } = require('./nodemailer/mailer');
const { saveShippingInfo } = require('./saveShippingInfo/saveInfo')
const mongoose = require('mongoose');



// 查詢訂單DB
async function findOrderbyUserID(id) {
    try {
        const isGuestID = /^[a-zA-Z0-9]{6}$/.test(id);
        const userID = isGuestID ? id : new mongoose.Types.ObjectId(id);
        const orders = await Order.find({ 'purchaseOrder.userID': userID })
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
router.post('/createOrder', [authUser, checkSub], async (req, res) => {
    const { userID } = req.user;
    const isGuest = req.isGuest ?? false;
    const { shippingInfo, purchaseOrder } = req.body.order;
    const newOrder = new Order({
        shippingInfo,
        purchaseOrder
    });

    try {
        const savedOrder = await newOrder.save();

        await orderMailer(shippingInfo.consigneeName, userID, savedOrder._id, shippingInfo.email, isGuest);

        if (shippingInfo.saveInfo && !isGuest) {
            await saveShippingInfo(userID, shippingInfo);
        }

        res.status(200).json({ message: '訂單已建立', state: 'confirm' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});


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


// 取消訂單
router.patch('/:orderID', authUser, async (req, res) => {
    const decoded = req.user;
    const { orderID } = req.params;
    try {
        const result = await Order.findByIdAndUpdate(
            orderID,
            { $set: { 'purchaseOrder.status': 'cancelled', updatedAt: new Date() } },
            { new: true });

        if (!result) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: '訂單已取消', state: 'confirm' });
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

// 付款

// doing: guest create order
// TODO:  ship info page, guest service popover
router.post('/guest/createOrder', async (req, res) => {
    try {
        const { guestID } = req.user;
        const { shippingInfo, purchaseOrder } = req.body.order;
        const newOrder = new Order({
            shippingInfo,
            purchaseOrder,
        });

        const savedOrder = await newOrder.save();

        await orderMailer(shippingInfo.consigneeName, guestID, savedOrder._id, shippingInfo.email);

        res.status(200).json({ message: '訂單已建立', state: 'confirm' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});



module.exports = router;

// redis cache time spend test code
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



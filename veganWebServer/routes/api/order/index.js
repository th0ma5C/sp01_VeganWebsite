const express = require('express');
const router = express.Router();
const { authToken, authUser } = require('@middlewares/userValidator');
const { checkOrder, checkSub } = require('@middlewares/orderVerify');
const Order = require('@models/OrderModel');
const { orderMailer } = require('./nodemailer/mailer');
const { saveShippingInfo, deleteShippingInfo, editShippingInfo, getShippingInfo } = require('./saveShippingInfo/saveInfo')
const crypto = require('crypto');


// 驗證訂單
router.post('/verifyPurchaseOrder', checkOrder, async (req, res) => {
    try {
        return res.status(200).json({ message: '驗證成功', state: 'confirm' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '' });
    }
})

async function genTransactionId() {
    try {
        let transactionId;
        let isUnique = false;

        while (!isUnique) {
            transactionId = crypto.randomUUID().replace(/-/g, "").substring(0, 20);
            const existingOrder = await Order.exists({ transactionId });
            if (!existingOrder) isUnique = true;
        }

        return transactionId;
    } catch (error) {
        console.log(error);
    }
}

// 創建訂單
router.post('/createOrder', [authUser, checkSub], async (req, res) => {
    try {
        const { userID } = req.user;
        const isGuest = req.isGuest ?? false;
        const { shippingInfo, purchaseOrder } = req.body.order;
        const newOrder = new Order({ shippingInfo, purchaseOrder });
        if (shippingInfo.paymentType == '匯款' || shippingInfo.paymentType == '信用卡') {
            newOrder.transactionId = await genTransactionId();
        }

        const savedOrder = await newOrder.save();

        await Promise.all([
            orderMailer(shippingInfo.consigneeName, userID, savedOrder._id, shippingInfo.email, isGuest),
            (shippingInfo.saveInfo && !isGuest) ? saveShippingInfo({ userID, shippingInfo }) : Promise.resolve()
        ]);

        res.status(200).json({ message: '訂單已建立', state: 'confirm', orderId: savedOrder._id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// get shipping info
router.get('/getShippingInfo', authUser, async (req, res) => {
    try {
        const { userID } = req.user;
        const result = await getShippingInfo(userID);
        if (!result) {
            return res.status(200).json({
                state: 'denied',
                message: 'shippingInfo not found'
            });
        }
        res.status(200).json({
            state: 'confirm',
            shippingInfo: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to get info' });
    }
})

// edit shipping info
router.patch('/saveShippingInfo', authUser, async (req, res) => {
    try {
        const { userID } = req.user;
        const form = {
            userID,
            ...req.body
        }
        const result = await editShippingInfo(form);
        res.status(200).json({
            result,
            state: 'confirm'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to update info' });
    }
})
// delete shipping info
router.delete('/saveShippingInfo', authUser, async (req, res) => {
    try {
        const { userID } = req.user;
        await deleteShippingInfo(userID);
        res.status(200).json({
            message: 'info deleted',
            state: 'confirm'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to delete info' });
    }
})

// 查詢訂單
router.get('/userOrderList', authUser, async (req, res) => {
    const decoded = req.user;
    try {
        const order = await Order.find({ 'purchaseOrder.userID': decoded.userID }).lean();

        if (!order || order.length === 0) {
            return res.status(200).json({ state: 'denied', message: 'order not found' });
        }
        res.status(200).json({ order, state: 'confirm' });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ state: 'denied', message: 'Server error' });
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



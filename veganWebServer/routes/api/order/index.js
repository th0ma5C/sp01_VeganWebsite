const express = require('express');
const router = express.Router();
const { authToken } = require('@middlewares/userValidator');
const { checkOrder, checkSub } = require('@middlewares/orderVerify');
const User = require('@models/User');
const Order = require('@models/OrderModel');
const Stocks = require('@models/StockModel');
const redisClient = require('@root/redisClient')
const jwt = require('jsonwebtoken');
const { transporter } = require('./nodemailer/mailer');
/**
 * todo: 訂購身分驗證, 價格驗算, 訂購成功email
 * doing: 下訂email 刪 改 查
 */

// 訂單email
async function mailOptions(username, orderID, userID) {
    try {
        const user = await User.findOne({ _id: userID });
        const userToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })

        return {
            from: 'thomas29111@gmail.com',
            to: 'thomas29111@gmail.com',
            subject: `Relation-Ship 感謝您的訂購(${orderID})`,
            html: `
            <h1>Hi! ${username}</h1>
            <p>
            感謝您的訂購，<br />
            您的訂單編號：${orderID} <br />
            詳細訂單內容請點選連結查看：<br />
            <a 
            style="font-size: 1.25rem;"
            href="http://localhost:5173/profile?token=${userToken}">訂單狀態</a><br />
            如有任何疑問歡迎諮詢課服，謝謝！
            </p>
        `
        }
    } catch (error) {
        console.log(error);
        throw new Error('sending order mail failed')
    }
}

// 查詢訂單DB
async function findOrderbyUserID(userID) {
    try {
        const orders = await Order.find({ 'purchaseOrder.userID': userID })
            .select('purchaseOrder')
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
        console.log('new order', savedOrder._id);

        const orderIdShort = savedOrder._id.toString().slice(-6);
        const orderIdCustom = `ORD-${new Date().toISOString().slice(0, 10)}-${orderIdShort}`;
        const info = await transporter.sendMail(
            await mailOptions(shippingInfo.consigneeName, orderIdCustom, userID)
        );
        console.log('郵件已發送: ', info.response);

        res.status(200).json({ message: '訂單已建立', state: 'confirm' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// 寄送訂單資訊 mail
// router.post('/send-orderCreated-email', async (req, res) => {

// })

// 查詢訂單
router.get('/userOrderList', async (req, res) => {
    try {

    } catch (error) {

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

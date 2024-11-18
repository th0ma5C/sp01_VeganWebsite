const express = require('express');
const router = express.Router();
const { authToken } = require('@middlewares/userValidator');
const { checkOrder, checkSub } = require('@middlewares/orderVerify');
const User = require('@models/User');
const Order = require('@models/OrderModel');
const Stocks = require('@models/StockModel');
const redisClient = require('@root/redisClient')
const jwt = require('jsonwebtoken');
/**
 * todo: 訂購身分驗證, 價格驗算, 訂購成功email
 * doing: 下訂email 刪 改 查
 */



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
        res.status(200).json({ message: '訂單已建立', state: 'confirm' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// 寄送訂單資訊 mail
router.post('/send-orderCreated-email', async (req, res) => {

})

// 查詢訂單
router.get('/userOrderList', async (req, res) => {

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

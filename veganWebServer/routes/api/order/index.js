const express = require('express');
const router = express.Router();
const { authToken } = require('@middlewares/userValidator');
const User = require('@models/User');
const Order = require('@models/OrderModel');
const jwt = require('jsonwebtoken');
/**
 * todo: 訂購身分驗證, 價格驗算, 訂購成功email
 */

// 創建訂單
router.post('/createOrder', authToken, async (req, res) => {
    const { userID } = req.user;
    // const { order } = req.order;
    res.status(200).json({ message: '建立成功', req });
    // // 計算總價
    // let totalAmount = 0;
    // products.forEach(product => {
    //     totalAmount += product.price * product.quantity;
    // });

    // const newOrder = new Order({
    //     userId,
    //     products,
    //     totalAmount,
    // });

    // try {
    //     const savedOrder = await newOrder.save();
    //     res.status(201).json(savedOrder);
    // } catch (error) {
    //     res.status(500).json({ error: 'Failed to create order' });
    // }
});


module.exports = router;

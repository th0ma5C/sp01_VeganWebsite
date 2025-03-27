const express = require('express');
const router = express.Router();
const { authToken } = require('@middlewares/userValidator');
const { checkOrder, checkSub } = require('@middlewares/orderVerify');
const User = require('@models/User');
const Order = require('@models/OrderModel');
const { genECorderForm, generateCheckValue } = require('./ECorder/ECorder');
const mongoose = require('mongoose');
const isIpAllowed = require('@middlewares/ipChecker/ipChecker')

const userConnections = new Map(); // 儲存用戶的 SSE 連線

router.post('/ECorderForm', async (req, res) => {
    try {
        const { orderId } = req.body;
        const form = await genECorderForm(orderId);

        if (!form) {
            return res.status(403).json({
                state: 'denied',
            })
        }
        res.status(200).json({
            state: 'confirm',
            form
        })
    } catch (error) {
        console.log(error);
    }
})

router.get("/paymentQueue/:userId", (req, res) => {
    const userId = req.params.userId;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    userConnections.set(userId, res);
    req.on("close", () => {
        userConnections.delete(userId);
    });
});

// router.post('/testEc', async (req, res) => {
//     try {
//         const userId = req.body.user;
//         const userRes = userConnections.get(userId);
//         if (userRes) {
//             const result = {
//                 state: 'confirm',
//                 message: 'payment completed'
//             }
//             userRes.write(`data: ${JSON.stringify(result)}\n\n`);
//         }
//         res.status(200).end();

//     } catch (error) {
//         console.error('ECPay Return Error:', error);
//         res.status(500).end();
//     }
// })

router.post('/ECpayResult', async (req, res) => {
    try {
        const accessible = await isIpAllowed(req.ip);
        if (!accessible) return res.status(403).end();

        const { CheckMacValue, ...data } = req.body;
        const calculatedMacValue = generateCheckValue(data);

        if (calculatedMacValue !== CheckMacValue) {
            console.error('CheckMacValue mismatch')
            return res.status(400).end();
        }

        await Order.findByIdAndUpdate(
            mongoose.Types.ObjectId(data.CustomField1),
            {
                $set: { 'purchaseOrder.status': 'processed', updatedAt: new Date() }
            },
            { new: true, runValidators: true }
        );

        const userRes = userConnections.get(data.CustomField1);
        if (userRes) {
            const result = {
                state: 'confirm',
                message: 'payment completed'
            }
            userRes.write(`data: ${JSON.stringify(result)}\n\n`);
        }

        res.send('1|OK');

    } catch (error) {
        console.error('ECPay Return Error:', error);
        res.status(500).send('Error');
    }
})

module.exports = router;

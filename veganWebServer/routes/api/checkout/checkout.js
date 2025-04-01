const express = require('express');
const router = express.Router();
const { authToken } = require('@middlewares/userValidator');
const { checkOrder, checkSub } = require('@middlewares/orderVerify');
const User = require('@models/User');
const Order = require('@models/OrderModel');
const { genECorderForm, generateCheckValue } = require('./ECorder/ECorder');
const mongoose = require('mongoose');
const isIpAllowed = require('@middlewares/ipChecker/ipChecker');
const { fetchLinePayPaymentUrl, fetchLinePayPaymentResult, fetchLinePayRefound } = require('./LinePay')
const jwt = require('jsonwebtoken');



const userConnections = new Map(); // 儲存用戶的 SSE 連線


// 綠界付款表單
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

router.get("/paymentQueue/:orderId", async (req, res) => {
    const orderId = req.params.orderId;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const order = await Order.findById(orderId);
    if (order && order.purchaseOrder.status === 'processed') {
        const result = {
            state: 'confirm',
            message: 'payment completed'
        }
        res.write(`data: ${JSON.stringify(result)}\n\n`);
        // res.write(`data: ${JSON.stringify({ status: 'paid' })}\n\n`);
        res.end();
        return;
    }

    userConnections.set(orderId, res);
    req.on("close", () => {
        userConnections.delete(orderId);
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

// 綠界付款結果
const ECdomains = process.env.ALLOWED_EC_DOMAINS ? process.env.ALLOWED_EC_DOMAINS.split(',') : [];

router.post('/ECpayResult', async (req, res) => {
    try {
        const accessible = await isIpAllowed({
            clientIp: req.ip,
            domains: ECdomains
        });
        if (!accessible) return res.status(403).end();

        const { CheckMacValue, ...data } = req.body;
        const calculatedMacValue = generateCheckValue(data);

        if (calculatedMacValue !== CheckMacValue) {
            console.error('CheckMacValue mismatch')
            return res.status(400).end();
        }

        const userOrder = await Order.findByIdAndUpdate(
            mongoose.Types.ObjectId(data.CustomField1),
            {
                $set: { 'purchaseOrder.status': 'processed', updatedAt: new Date() }
            },
            { new: true, runValidators: true }
        );

        const orderInQueue = userConnections.get(data.CustomField1); //CustomField1 orderId
        if (orderInQueue) {
            const result = {
                state: 'confirm',
                message: 'payment completed'
            }
            orderInQueue.write(`data: ${JSON.stringify(result)}\n\n`);
        }

        res.send('1|OK');

    } catch (error) {
        console.error('ECPay Return Error:', error);
        res.status(500).send('Error');
    }
})
// todo line pay api
// line pay 付款 url
router.post('/testLinePayUrl', async (req, res) => {
    try {
        const form = {
            amount: 1059,
            orderId: '6766bd3dacce3491347bdb42',
            packages: [
                {
                    id: "1",
                    amount: 1059,
                    products: [
                        {
                            name: "日出庭園沙拉",
                            quantity: 7,
                            price: 149,
                        },
                        {
                            name: "運費",
                            quantity: 1,
                            price: 120,
                        },
                        {
                            name: "折扣",
                            quantity: 1,
                            price: -104,
                        },
                    ]
                }
            ]
        }

        const Line_res = await fetchLinePayPaymentUrl({
            orderId: '6766bd3dacce3491347bdb42',
            packages: [
                {
                    id: "1",
                    amount: 1059,
                    products
                }
            ]
        });
        if (Line_res.returnCode == '0000') {
            res.status(200).json({
                state: 'confirm',
                url: Line_res.info.paymentUrl.web,
                transactionId: Line_res.info.transactionId,
                Line_res
            })
        } else {
            res.status(403).json({
                state: 'denied',
                message: '錯誤，請稍後重試'
            })
        }
    } catch (error) {
        console.error('line pay Return Error:', error);
        res.status(500).send('Error');
    }
})

function detectPlatform(req, res, next) {
    const userAgent = req.get('User-Agent') || '';
    const reg = /iphone|ipad|ipod|android|mobile/i;
    const isMobile = reg.test(userAgent);
    req.isMobile = isMobile
    next()
}

router.post('/LinePayUrl', detectPlatform, async (req, res) => {
    const { orderId } = req.body;
    const isMobile = req.isMobile;

    try {
        const order = await Order.findById(orderId);
        // const { purchaseOrder } = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                state: 'denied',
                message: 'order not found'
            })
        }

        const form = {
            orderId,
            order: order.purchaseOrder
        }
        const Line_res = await fetchLinePayPaymentUrl(form);

        if (Line_res.returnCode == '0000') {
            order.transactionId = Line_res.info.transactionId;
            await order.save();
            res.status(200).json({
                state: 'confirm',
                url: isMobile ?
                    Line_res.info.paymentUrl.app :
                    Line_res.info.paymentUrl.web,
            })
        } else {
            console.error(Line_res);
            res.status(403).json({
                state: 'denied',
                message: '錯誤，請稍後重試'
            })
        }
    } catch (error) {
        console.error('line pay Return Error:', error);
        res.status(500).send('Error');
    }
})

// user line pay 付款後授權
const linePayIps = process.env.ALLOWED_LINE_PAY_DOMAINS ? process.env.ALLOWED_LINE_PAY_DOMAINS.split(',') : [];

router.get('/LinePayPaymentResult', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        const accessible = await isIpAllowed({
            clientIp: req.ip,
            ips: linePayIps
        });

        if (!accessible) return res.status(403).end();
    }

    const { orderId, transactionId } = req.query
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                state: 'denied',
                message: 'order not found'
            })
        }
        const params = {
            transactionId,
            amount: order.purchaseOrder.total
        }
        const Line_res = await fetchLinePayPaymentResult(params);

        if (Line_res.returnMessage == 'OK') {
            order.purchaseOrder.status = 'processed';
            order.updatedAt = new Date();
            await order.save();

            const isGuest = !(mongoose.Types.ObjectId.isValid(order.purchaseOrder.userID));
            let user = null
            if (isGuest) {
                user = {
                    userID: order.purchaseOrder.userID,
                    email: order.shippingInfo.email,
                    isGuest
                }
            } else {
                const member = await User.findById(order.purchaseOrder.userID);
                user = {
                    userID: member._id,
                    email: member.email,
                    isGuest
                }
            }
            const token = jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: '7d' });


            res.redirect(`${process.env.FE_BASE_URL}/profile?token=${token}`)
        } else {
            const refundResponse = await fetchLinePayRefound(transactionId);
            console.warn('Line Pay 授權失敗:', Line_res.returnMessage, Line_res.returnCode);

            if (refundResponse.returnCode == "0000") {
                res.redirect(`
                    ${process.env.FE_BASE_URL}/profile?LinePayFailedMsg=${encodeURIComponent(Line_res.returnMessage)}&refunded=true
                    `)
            } else {
                console.error('Line Pay Refund Failed:', refundResponse.returnMessage, refundResponse.returnCode);
                res.redirect(`${process.env.FE_BASE_URL}/profile?refunded=false&code=${refundResponse.returnCode}&msg=${encodeURIComponent(refundResponse.returnMessage)}`);
            }
        }
    } catch (error) {
        console.error('line pay Return Error:', error);
        res.status(500).send('Error');
    }
})

module.exports = router;

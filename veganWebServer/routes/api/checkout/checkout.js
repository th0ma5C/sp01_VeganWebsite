const express = require('express');
const router = express.Router();
const { authToken } = require('@middlewares/userValidator');
const { checkOrder, checkSub } = require('@middlewares/orderVerify');
const User = require('@models/User');
const Order = require('@models/OrderModel');
const { genECorderForm, generateCheckValue } = require('./ECorder/ECorder');
const mongoose = require('mongoose');
const isIpAllowed = require('@middlewares/ipChecker/ipChecker');
const { requestOnlineAPI, fetchLinePayPaymentUrl, fetchLinePayStatus,
    fetchLinePayPaymentResult, fetchLinePayRefound,
    confirmPaymentWithRetry
} = require('./LinePay')
const jwt = require('jsonwebtoken');
const redisClient = require('@root/redisClient');


// user sse state
const userConnections = new Map();

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

// SSE

function registerSSE(orderId, res, req) {
    if (userConnections.has(orderId)) {
        const oldConn = userConnections.get(orderId);
        oldConn.res.end();
        clearTimeout(oldConn.timer);
        userConnections.delete(orderId);
    }

    const timer = setTimeout(() => {
        if (userConnections.has(orderId)) {
            userConnections.get(orderId).res.end();
            userConnections.delete(orderId);
        }
    }, 5 * 60 * 1000); // 5 min

    userConnections.set(orderId, { res, timer });

    req.on('close', () => {
        clearTimeout(timer);
        userConnections.delete(orderId);
    });
}

function closeSSE(orderId, resPayload) {
    const sseClient = userConnections.get(orderId);
    if (!sseClient) {
        console.warn(`[SSE] no connection found for ${orderId}`);
        return;
    }

    try {
        sseClient.res.write(`data: ${JSON.stringify(resPayload)}\n\n`);
        sseClient.res.end();
    } catch (err) {
        console.error(`[SSE] Error closing SSE for ${orderId}:`, err);
    }

    clearTimeout(sseClient.timer);
    userConnections.delete(orderId);
}

// get token get from redis

async function getCachedJWT(orderId) {
    try {
        return await redisClient.get(`order_token:${orderId}`);
    } catch (error) {
        throw new Error(error)
    }
}


router.get("/paymentQueue/:orderId", async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const order = await Order.findById(orderId);
        const token = await getCachedJWT(orderId);

        if (order && order.purchaseOrder.status === 'processed') {
            const result = {
                state: 'confirm',
                message: 'payment completed',
                token
            }
            res.setHeader('Content-Type', 'text/event-stream')
            res.write(`data: ${JSON.stringify(result)}\n\n`);
            res.end();
            return;
        }

        res.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        })
        res.flushHeaders();

        registerSSE(orderId, res, req)

    } catch (error) {
        console.log(error);
    }
});

// router.post('/testEc', async (req, res) => {
//     try {
//         const orderId = req.body.orderId;

//         const resPayload = {
//             state: 'confirm',
//             message: 'payment completed'
//         }
//         closeSSE(orderId, resPayload)

//         res.send('1|OK');

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
        const orderId = data.CustomField1;
        const userOrder = await Order.findByIdAndUpdate(
            new mongoose.Types.ObjectId(String(orderId)),
            {
                $set: { 'purchaseOrder.status': 'processed', updatedAt: new Date() }
            },
            { new: true, runValidators: true }
        );
        const token = await getCachedJWT(orderId);

        const resPayload = {
            state: 'confirm',
            message: 'payment completed',
            token
        }
        closeSSE(orderId, resPayload)

        res.send('1|OK');

    } catch (error) {
        console.error('ECPay Return Error:', error);
        res.status(500).send('Error');
    }
})
// todo line pay api
// line pay 付款 url
const crypto = require("crypto");
router.get('/testLinePayUrl', async (req, res) => {

    function signKey(clientKey, msg) {
        const encoder = new TextEncoder();
        return crypto
            .createHmac("sha256", encoder.encode(clientKey))
            .update(encoder.encode(msg))
            .digest("base64");
    }
    function handleBigInteger(text) {
        const largeNumberRegex = /:\s*(\d{16,})\b/g;
        const processedText = text.replace(largeNumberRegex, ': "$1"');

        const data = JSON.parse(processedText);

        return data;
    }

    async function requestOnlineAPI({
        method,
        baseUrl = "https://sandbox-api-pay.line.me",
        apiPath,
        queryString = "",
        data = null,
        signal = null,
    }) {
        const nonce = crypto.randomUUID();
        let signature = "";

        // 根據不同方式(method)生成MAC
        if (method === "GET") {
            signature = signKey(
                process.env.LINE_PAY_SECRETE,
                process.env.LINE_PAY_SECRETE + apiPath + queryString + nonce
            );
        } else if (method === "POST") {
            signature = signKey(
                process.env.LINE_PAY_SECRETE,
                process.env.LINE_PAY_SECRETE + apiPath + JSON.stringify(data) + nonce
            );
        }
        const headers = {
            "X-LINE-ChannelId": process.env.LINE_PAY_ID,
            "X-LINE-Authorization": signature,
            "X-LINE-Authorization-Nonce": nonce,
        };

        const response = await fetch(
            `${baseUrl}${apiPath}${queryString !== "" ? "&" + queryString : ""}`,
            {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
                body: data ? JSON.stringify(data) : null,
                signal: signal,
            }
        );

        const processedResponse = handleBigInteger(await response.text());

        return processedResponse;
    }
    try {
        let response = await requestOnlineAPI({
            method: "POST",
            apiPath: "/v3/payments/request",
            data: {
                amount: 100,
                currency: "TWD",
                orderId: "EXAMPLE_ORDER_20230422_1000001",
                packages: [
                    {
                        id: "1",
                        amount: 100,
                        products: [
                            {
                                id: "PEN-B-001",
                                name: "Pen Brown",
                                imageUrl: "https://store.example.com/images/pen_brown.jpg",
                                quantity: 2,
                                price: 50,
                            },
                        ],
                    },
                ],
                redirectUrls: {
                    confirmUrlType: "NONE"
                },
            },
        });

        if (response.returnCode == '0000') {
            console.log(response.info.transactionId);
            // res.redirect(response.info.paymentUrl.web)
            res.status(200).json({
                state: 'confirm',
                response
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
router.get('/testGetLinePayStatus', async (req, res) => {
    let intervalId = null;
    const transactionId = req.query.transactionId

    try {
        let intervalId = setInterval(async () => {
            res_code = await fetchLinePayStatus(transactionId);
            switch (res_code) {
                case "0000":
                    console.log("In progress");
                    break;
                case "0110":
                    console.log("Finished");
                    clearInterval(intervalId);
                    res.status(200).json({ msg: 'confirm' })
                case "0121":
                    console.log("Cancelled");
                    clearInterval(intervalId);
                    res.status(200).json({ msg: 'Cancelled' })
                default:
                    console.log("未知狀態碼", res_code);
                    clearInterval(intervalId);
                    res.status(200).json({ msg: 'error' })
            }
        }, 2000);
    } catch (error) {
        console.log('LinePayStatus', error);
        clearInterval(intervalId);
    }
})

function detectPlatform(req, res, next) {
    const userAgent = req.get('User-Agent') || '';
    const reg = /Mobi|Android|iPhone|iPad|iPod|Mobile/i;
    const isMobile = reg.test(userAgent);
    req.isMobile = isMobile
    next()
}

router.post('/LinePayUrl', detectPlatform, async (req, res) => {
    const { orderId } = req.body;
    const isMobile = req.isMobile;

    try {
        const order = await Order.findById(orderId);
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

// check line pay status
router.post('/LinePayStatus', async (req, res) => {
    const orderId = req.body.orderId;
    const resPayload = {
        state: null,
        message: null
    }
    try {
        const order = await Order.findById(orderId);

        const requestTransactionId = order.transactionId;

        let intervalId = setInterval(async () => {
            res_code = await fetchLinePayStatus(requestTransactionId);

            switch (res_code) {
                case "0000":
                    console.log("In progress");
                    break;
                case "0110":
                    console.log("Finished");
                    clearInterval(intervalId);
                    const result = await confirmLinePayPayment(orderId, requestTransactionId);
                    if (result.success) {
                        resPayload.state = 'confirm';
                        resPayload.message = '付款成功';
                    } else {
                        resPayload.state = 'failed';
                        resPayload.message = result.message;
                    }
                    closeSSE(orderId, resPayload);
                    break;
                case "0121":
                    console.log("Cancelled");
                    clearInterval(intervalId);
                    resPayload.state = 'cancelled';
                    resPayload.message = '取消付款';
                    closeSSE(orderId, resPayload);
                    break;
                default:
                    console.log("未知狀態碼", res_code);
                    clearInterval(intervalId);
                    resPayload.state = 'error';
                    resPayload.message = '未知錯誤，請聯繫客服';
                    closeSSE(orderId, resPayload);
            }

        }, 2000);

    } catch (error) {
        console.log('LinePayStatus', error);
        clearInterval(intervalId);
        resPayload.state = 'error'
        resPayload.message = '未知錯誤，請聯繫客服'
        closeSSE(orderId, resPayload)
    }
})

async function confirmLinePayPayment(orderId, transactionId) {
    try {
        const order = await Order.findById(orderId);
        if (!order) throw new Error('Order not found');

        const params = {
            transactionId,
            amount: order.purchaseOrder.total
        }
        const Line_res = await fetchLinePayPaymentResult(params);

        if (Line_res.returnMessage == 'OK') {
            order.purchaseOrder.status = 'processed';
            order.updatedAt = new Date();
            await order.save();
            return { success: true };
        } else {
            console.warn('Line Pay 授權失敗:', Line_res.returnMessage, Line_res.returnCode);
            const refundResponse = await fetchLinePayRefound(transactionId);
            if (refundResponse.returnCode == "0000") {
                return { success: false, message: Line_res.returnMessage };
            } else {
                console.error('Line Pay Refund Failed:', refundResponse.returnMessage, refundResponse.returnCode);
                return { success: false, message: Line_res.returnMessage };
            }
        }
    } catch (error) {
        console.error('line pay Return Error:', error);
        return { success: false, message: 'line pay confirm error' }
    }
}

// user line pay 付款後授權
const linePayIps = process.env.ALLOWED_LINE_PAY_DOMAINS ? process.env.ALLOWED_LINE_PAY_DOMAINS.split(',') : [];

router.post('/LinePayPaymentResult', async (req, res) => {
    // if (process.env.NODE_ENV === 'production') {
    //     const accessible = await isIpAllowed({
    //         clientIp: req.ip,
    //         ips: linePayIps
    //     });

    //     if (!accessible) return res.status(403).end();
    // }

    const { orderId, transactionId } = req.body
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

        await confirmPaymentWithRetry(params);

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

        res.status(200).json({
            state: 'confirm',
            token
        })
    } catch (error) {
        console.error('line pay Return Error:', error);
        res.status(500).json({
            state: 'denied',
            message: '授權驗證失敗，請聯絡客服'
        })
    }
})

module.exports = router;

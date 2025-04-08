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
    fetchLinePayPaymentResult, fetchLinePayRefound } = require('./LinePay')
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
            res.redirect(response.info.paymentUrl.web)
            // res.status(200).json({
            //     state: 'confirm',
            //     response
            // })
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

// get line pay status
router.get('/LinePayStatus', async (req, res) => {
    try {
        const orderId = req.query.orderId;

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
        const requestTransactionId = order.transactionId;
        userConnections.set(orderId, res);

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
                        const responseData = {
                            state: 'confirm',
                            message: '付款成功'
                        };
                        res.write(`data: ${JSON.stringify(responseData)}\n\n`);
                    } else {
                        const responseData = {
                            state: 'failed',
                            message: result.message
                        };
                        res.write(`data: ${JSON.stringify(responseData)}\n\n`);
                    }
                    res.end();
                case "0121":
                    console.log("Cancelled");
                    clearInterval(intervalId);
                    res.write(`data: ${JSON.stringify({ state: 'cancelled', message: '取消付款' })}\n\n`);
                    res.end();
                default:
                    console.log("未知狀態碼", res_code);
                    clearInterval(intervalId);
                    res.write(`data: ${JSON.stringify({ state: 'error', message: '未知錯誤，請聯繫客服' })}\n\n`);
                    res.end();
            }
        }, 2000);

        req.on("close", () => {
            userConnections.delete(orderId);
        });
    } catch (error) {
        console.log('LinePayStatus', error);
        clearInterval(intervalId);
        res.write(`data: ${JSON.stringify({ state: 'error', message: 'server error' })}\n\n`);
        res.end();
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
        res.status(500).send('Error');
    }
}

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

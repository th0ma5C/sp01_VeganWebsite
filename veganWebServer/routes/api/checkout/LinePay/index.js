const crypto = require("crypto");
const { TextEncoder } = require('util');
const mongoose = require('mongoose');
const User = require('@models/User');
const Order = require('@models/OrderModel');

// function signKey(clientKey, msg) {
//     return crypto
//         .createHmac("sha256", clientKey)
//         .update(msg)
//         .digest("base64");
// }
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
    apiPath,
    queryString = "",
    data = null,
    signal = null,
}) {
    const nonce = crypto.randomUUID();
    const baseUrl = process.env.LINE_BASE_URL
    let signature = "";

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

    // const processedResponse = await response.json();
    const processedResponse = handleBigInteger(await response.text());
    return processedResponse;
}

function orderFormatter(order) {
    let itemSubtotal = 0;
    const packages = [];
    const products = [];
    const { total, orderList, freightFee, discountAmount } = order;

    orderList.forEach((item) => {
        itemSubtotal += item.subtotal;
        products.push({
            name: item.name,
            quantity: item.amount,
            price: item.subtotal / item.amount,
        })
    })

    let trialAmount = itemSubtotal;

    trialAmount += freightFee

    products.push({
        name: "運費",
        quantity: 1,
        price: freightFee,
    })
    if (discountAmount) {
        trialAmount -= discountAmount
        products.push({
            name: "折扣",
            quantity: 1,
            price: -(discountAmount),
        })
    }

    if (total !== trialAmount) {
        throw new Error(`Incorrect trial amount: expected ${total}, calculated ${trialAmount}`);
    }

    packages.push({
        id: "1",
        amount: total,
        products
    })

    return packages
}

function detectPlatform(userAgent = '') {
    const reg = /iphone|ipad|ipod|android|mobile/i;
    return reg.test(userAgent)
}

async function fetchLinePayPaymentUrl({
    orderId,
    order
}) {
    try {
        const packages = orderFormatter(order);
        let response = await requestOnlineAPI({
            method: "POST",
            apiPath: "/v3/payments/request",
            data: {
                amount: order.total,
                currency: "TWD",
                orderId,
                packages,
                redirectUrls: {
                    confirmUrl: process.env.LINE_PAY_CONFIRM_URL,
                    cancelUrl: process.env.LINE_PAY_CANCEL_URL,
                },
            },
        });

        return response
    } catch (error) {
        console.error('Line Pay gen Url Error:', error);
        throw error;
    }
}


// 成功響應
// {
//     "returnCode": "0000",
//         "returnMessage": "Success.",
//             "info": {
//         "paymentUrl": {
//             "web": "https://sandbox-web-pay.line.me/web/payment/wait?transactionReserveId=REpEWEttQ0F2RmFnaFFzVndIdjl6Z0lqbGpPemZjOHpNWTFZTmdibUlRNlEzOG50N2VSRmdGU2IxcnVjMHZ1NQ",
//                 "app": "line://pay/payment/REpEWEttQ0F2RmFnaFFzVndIdjl6Z0lqbGpPemZjOHpNWTFZTmdibUlRNlEzOG50N2VSRmdGU2IxcnVjMHZ1NQ"
//         },
//         "transactionId": 2023042201206549310,
//             "paymentAccessToken": "056579816895"
//     }
// }

async function fetchLinePayPaymentResult({
    transactionId,
    amount
}) {
    try {
        let response = await requestOnlineAPI({
            method: "POST",
            apiPath: `/v3/payments/${transactionId}/confirm`,
            data: {
                amount,
                currency: "TWD",
            },
        });

        return response
    } catch (error) {
        console.error('Line Pay Auth Payment Error:', error);
        throw error;
    }
}

// 成功響應
// {
//     "returnCode": "0000",
//         "returnMessage": "OK",
//             "info": {
//         "orderId": "EXAMPLE_ORDER_20230422_1000001",
//             "transactionId": 2023042201206549310,
//                 "payInfo": [
//                     {
//                         "method": "BALANCE",
//                         "amount": 100
//                     }
//                 ]
//     }
// }

async function fetchLinePayRefound(transactionId) {
    try {
        let refundResponse = await requestOnlineAPI({
            method: "POST",
            baseUrl: process.env.LINE_BASE_URL,
            apiPath: `/v3/payments/${transactionId}/refund`,
        });

        return refundResponse
    } catch (error) {
        console.error('Line Pay refound Error:', error);
        throw error;
    }
}

// {
//     "returnCode": "0000",
//         "returnMessage": "success",
//             "info": {
//         "refundTransactionId": 2018082512345678911,
//             "refundTransactionDate": "2018-08-25T09:15:01Z"
//     }
// }


module.exports = {
    fetchLinePayPaymentUrl,
    fetchLinePayPaymentResult,
    fetchLinePayRefound
}
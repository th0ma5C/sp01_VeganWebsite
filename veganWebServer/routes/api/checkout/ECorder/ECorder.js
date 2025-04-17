const Order = require('@models/OrderModel');
const User = require('@models/User');
const moment = require('moment');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const redisClient = require('@root/redisClient');

async function genECorderForm(orderId) {
    try {
        const order = await Order.findById(orderId);
        if (order.transactionId !== null) {
            order.transactionId = await genTransactionId();
            await order.save();
        }
        return await genSubmitForm(order)
    } catch (error) {
        console.log(error);
    }
}

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

async function genUserToken(purchaseOrder, shippingInfo) {
    try {
        const isGuest = !(mongoose.Types.ObjectId.isValid(purchaseOrder.userID));
        let user = null
        if (isGuest) {
            user = {
                userID: purchaseOrder.userID,
                email: shippingInfo.email,
                isGuest
            }
        } else {
            const member = await User.findById(purchaseOrder.userID);
            user = {
                userID: member._id,
                email: member.email,
                isGuest
            }
        }
        const token = jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return token
    } catch (error) {
        throw error
    }
}

async function cacheJWT({ orderId, token } = {}) {
    try {
        if (!orderId || !token) throw new Error('miss orderId or token')

        await redisClient.set(`order_token:${orderId}`, token, {
            EX: 60 * 10, // 10 min
        });
    } catch (error) {
        throw new Error(error)
    }
}

function generateCheckValue(params) {
    const entries = Object.entries(params);

    entries.sort((a, b) => a[0].localeCompare(b[0]));

    let result =
        `HashKey=${process.env.HashKey}&` +
        entries.map((x) => `${x[0]}=${x[1]}`).join('&') +
        `&HashIV=${process.env.HashIV}`;
    result = encodeURIComponent(result)
        .replace(/%20/g, '+')
        .replace(/%21/g, '!')
        .replace(/%28/g, '(')
        .replace(/%29/g, ')')
        .replace(/%2a/g, '*')
        .replace(/%2d/g, '-')
        .replace(/%2e/g, '.')
        .replace(/%5f/g, '_')
        .toLowerCase();

    result = crypto.createHash('sha256')
        .update(result, 'utf8')
        .digest('hex')
        .toUpperCase();

    return result
}

async function genSubmitForm(order) {
    try {
        const { _id, shippingInfo, purchaseOrder, transactionId } = order;

        const ItemName = purchaseOrder.orderList.map((item) => {
            return `${item.name},${item.amount}pcs`
        }).join("#");

        const token = await genUserToken(purchaseOrder, shippingInfo);
        await cacheJWT({
            orderId: _id,
            token
        });

        const base_param = {
            MerchantID: process.env.MerchantID,
            MerchantTradeNo: transactionId,
            MerchantTradeDate: moment().format('YYYY/MM/DD HH:mm:ss'),
            PaymentType: 'aio',
            TotalAmount: purchaseOrder.total,
            TradeDesc: 'ecpay test',
            ItemName,
            ReturnURL: process.env.PaymentReturnURL,
            ChoosePayment: 'ALL',
            EncryptType: 1,
            ClientBackURL: `${process.env.EC_ClientBackURL}?orderId=${_id}`,
            CustomField1: _id,
        };

        const form = `
          <input name="MerchantID" value="${base_param.MerchantID}"/>
          <input name="MerchantTradeNo" value="${base_param.MerchantTradeNo}" />
          <input name="MerchantTradeDate" value="${base_param.MerchantTradeDate}" />
          <input name="PaymentType" value="${base_param.PaymentType}" />
          <input name="TotalAmount" value="${base_param.TotalAmount}" />
          <input name="TradeDesc" value="${base_param.TradeDesc}" />
          <input name="ItemName" value="${base_param.ItemName}" />
          <input name="ReturnURL" value="${base_param.ReturnURL}" />
          <input name="ChoosePayment" value="${base_param.ChoosePayment}" />
          <input name="EncryptType" value="${base_param.EncryptType}" />
          <input name="ClientBackURL" value="${base_param.ClientBackURL}" />
          <input name="CustomField1" value="${base_param.CustomField1}" />
          <input name="CheckMacValue" value="${generateCheckValue(base_param)}" />
      `;

        return form

    } catch (error) {
        throw error
    }
}

module.exports = {
    genECorderForm,
    generateCheckValue
}
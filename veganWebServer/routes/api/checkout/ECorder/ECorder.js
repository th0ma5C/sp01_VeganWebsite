const Order = require('@models/OrderModel');
const moment = require('moment');
const crypto = require('crypto');

async function genECorderForm(orderId) {
    try {
        const order = await Order.findById(orderId);
        return genSubmitForm(order)
    } catch (error) {
        console.log(error);
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

function genSubmitForm(order) {
    const { _id, purchaseOrder, transactionId } = order;

    const ItemName = purchaseOrder.orderList.map((item) => {
        return `${item.name},${item.amount}pcs`
    }).join("#");

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
        ClientBackURL: process.env.EC_ClientBackURL,
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
    // const form = `
    //     <form action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5" method="POST" name="payment" style="display: none;">
    //       <input name="MerchantID" value="${base_param.MerchantID}"/>
    //       <input name="MerchantTradeNo" value="${base_param.MerchantTradeNo}" />
    //       <input name="MerchantTradeDate" value="${base_param.MerchantTradeDate}" />
    //       <input name="PaymentType" value="${base_param.PaymentType}" />
    //       <input name="TotalAmount" value="${base_param.TotalAmount}" />
    //       <input name="TradeDesc" value="${base_param.TradeDesc}" />
    //       <input name="ItemName" value="${base_param.ItemName}" />
    //       <input name="ReturnURL" value="${base_param.ReturnURL}" />
    //       <input name="ChoosePayment" value="${base_param.ChoosePayment}" />
    //       <input name="EncryptType" value="${base_param.EncryptType}" />
    //       <input name="ClientBackURL" value="${base_param.ClientBackURL}" />
    //       <input name="CustomField1" value="${base_param.CustomField1}" />
    //       <input name="CheckMacValue" value="${generateCheckValue(base_param)}" />
    //       <button type="submit">Submit</button>
    //     </form>
    //   `;

    return form
}

module.exports = {
    genECorderForm,
    generateCheckValue
}
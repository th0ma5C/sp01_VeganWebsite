const User = require('@models/User');
const jwt = require('jsonwebtoken');
const { getTransporter } = require('@scripts/nodemailer')

// // 使用 OAuth2 設定傳送憑證
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         type: 'OAuth2',
//         user: 'thomas29111@gmail.com',
//         clientId: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         refreshToken: process.env.Refresh_Token,
//     },
// });

// 訂單email
async function mailOptions(username, orderID, userID, userEmail, isGuest) {
    try {
        let user = null;
        if (!isGuest) user = await User.findOne({ _id: userID });

        const userToken = isGuest ?
            jwt.sign({ userID, email: userEmail, isGuest }, process.env.JWT_SECRET, { expiresIn: '7d' }) :
            jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return {
            from: 'thomas29111@gmail.com',
            to: `${userEmail ?? 'thomas29111@gmail.com'}`,
            subject: `Relation-Ship 感謝您的訂購(${orderID})`,
            html: `
            <h1>Hi! ${username}</h1>
            <p>
            感謝您的訂購，<br />
            您的訂單編號：${orderID} <br />
            若付款一週後尚未收到您的訂購請洽官網客服<br />
            詳細訂單內容請點選連結查看：<br />
            <a 
            style="font-size: 1.25rem;"
            href="http://localhost:5173/profile?token=${userToken}">訂單狀態</a><br />
            如有任何疑問歡迎諮詢客服，謝謝！
            </p>
        `
        }
    } catch (error) {
        console.log(error);
        throw new Error('sending order mail failed')
    }
}

async function orderMailer(recipientName, userID, orderID, userEmail, isGuest) {

    try {
        const orderIdShort = orderID.toString().slice(-6);
        const orderIdCustom = `ORD-${new Date().toISOString().slice(0, 10)}-${orderIdShort}`;
        const transporter = getTransporter();
        const info = await transporter.sendMail(
            await mailOptions(recipientName, orderIdCustom, userID, userEmail, isGuest)
        );
        console.log('郵件已發送: ', info.response);
    } catch (error) {
        console.log(error);
        throw new Error('order mailer crash')
    }
}

// async function guestMailOptions(username, orderID, userID, userEmail) {
//     const userToken = jwt.sign({ email: userEmail, guest: true }, process.env.JWT_SECRET, { expiresIn: '7d' })
//     try {
//         return {
//             from: 'thomas29111@gmail.com',
//             to: `${userEmail ?? 'thomas29111@gmail.com'}`,
//             subject: `Relation-Ship 感謝您的訂購(${orderID})`,
//             html: `
//             <h1>Hi! ${username}</h1>
//             <p>
//             感謝您的訂購，<br />
//             您的訂單編號：${orderID} <br /> 
//             若付款一週後尚未收到您的訂購請洽官網客服<br />
//             詳細訂單內容請點選連結查看：<br />
//             <a
//             style="font-size: 1.25rem;"
//             href="http://localhost:5173/profile?token=${userToken}">訂單狀態</a><br />
//             如有任何疑問歡迎諮詢客服，謝謝！
//             </p>
//         `
//         }
//     } catch (error) {
//         console.log(error);
//         throw new Error('sending order mail failed')
//     }
// }

// async function guestOrderMailer(recipientName, userID, orderID, userEmail) {
//     try {
//         const orderIdShort = orderID.toString().slice(-6);
//         const orderIdCustom = `ORD-${new Date().toISOString().slice(0, 10)}-${orderIdShort}`;
//         const transporter = getTransporter();
//         const info = await transporter.sendMail(
//             await guestMailOptions(recipientName, orderIdCustom, userID, userEmail)
//         );
//         console.log('郵件已發送: ', info.response);
//     } catch (error) {
//         console.log(error);
//         throw new Error('order mailer crash')
//     }
// }

module.exports = {
    getTransporter,
    orderMailer,
    mailOptions,
    // guestOrderMailer
}
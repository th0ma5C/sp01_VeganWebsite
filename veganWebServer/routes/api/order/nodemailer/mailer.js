const User = require('@models/User');
const jwt = require('jsonwebtoken');
const setTransporter = require('@scripts/nodemailer')

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
async function mailOptions(username, orderID, userID) {
    try {
        const user = await User.findOne({ _id: userID });
        const userToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })

        return {
            from: 'thomas29111@gmail.com',
            to: 'thomas29111@gmail.com',
            subject: `Relation-Ship 感謝您的訂購(${orderID})`,
            html: `
            <h1>Hi! ${username}</h1>
            <p>
            感謝您的訂購，<br />
            您的訂單編號：${orderID} <br />
            詳細訂單內容請點選連結查看：<br />
            <a 
            style="font-size: 1.25rem;"
            href="http://localhost:5173/profile?token=${userToken}">訂單狀態</a><br />
            如有任何疑問歡迎諮詢課服，謝謝！
            </p>
        `
        }
    } catch (error) {
        console.log(error);
        throw new Error('sending order mail failed')
    }
}

async function orderMailer(recipientName, userID, orderID) {
    try {
        const orderIdShort = orderID.toString().slice(-6);
        const orderIdCustom = `ORD-${new Date().toISOString().slice(0, 10)}-${orderIdShort}`;
        const transporter = await setTransporter();
        const info = await transporter.sendMail(
            await mailOptions(recipientName, orderIdCustom, userID)
        );
        console.log('郵件已發送: ', info.response);
    } catch (error) {
        console.log(error);
        throw new Error('order mailer crash')
    }
}

module.exports = {
    setTransporter,
    orderMailer,
    mailOptions
}
const nodemailer = require('nodemailer');

// 使用 OAuth2 設定傳送憑證
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'thomas29111@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.Refresh_Token,
    },
});

// 設定郵件內容
const mailOptions = {
    from: 'thomas29111@gmail.com',
    to: 'thomas29111@gmail.com',
    subject: '驗證你的信箱',
    // text: '請點擊以下連結來驗證你的信箱：\n\nhttp://localhost:5173/home',
};

// 發送郵件
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         return console.log('Error: ', error);
//     }
//     console.log('驗證信已發送: ' + info.response);
// });

module.exports = {
    mailOptions,
    transporter
}
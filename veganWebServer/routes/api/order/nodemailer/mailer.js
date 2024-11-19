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

module.exports = {
    transporter
}
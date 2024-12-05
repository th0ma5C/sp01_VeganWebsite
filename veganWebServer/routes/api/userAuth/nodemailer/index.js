const { getTransporter } = require('@scripts/nodemailer')

// 設定郵件內容
const mailOptions = {
    from: 'thomas29111@gmail.com',
    to: 'thomas29111@gmail.com',
    subject: '驗證你的信箱',
};

module.exports = {
    mailOptions,
    getTransporter
}
const User = require('@models/User');
const jwt = require('jsonwebtoken');
const { getTransporter } = require('@scripts/nodemailer')

function mailOptions(recipient) {
    return {
        from: `"果漾 Relation-Ship" <${process.env.SMTP_ADDRESS}>`,
        to: `${recipient ?? 'thomas29111@gmail.com'}`,
        subject: '感謝您訂閱我們的電子報！',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #2c7be5;">感謝您的訂閱！</h2>
                <p>親愛的用戶，</p>
                <p>感謝您訂閱 <b>果漾Relation-Ship</b> 的電子報！我們將定期為您提供最新的消息、活動和促銷優惠。</p>
                <p>我們的團隊將竭力提供最有價值的內容，助您了解最新動態。</p>
                <p>如果有任何問題或建議，歡迎隨時聯繫我們！</p>
                <hr>
                <a href="${process.env.FE_BASE_URL}">果漾Relation-Ship</a>
            </div>
        `
    }
}

async function orderMailer(recipient) {
    try {
        const options = mailOptions(recipient);
        const transporter = getTransporter();
        const result = await transporter.sendMail(options);
        console.log('郵件已發送: ', result.response);
        return result
    } catch (error) {
        throw new Error('nodemailer error', error)
    }
}

module.exports = {
    orderMailer
}
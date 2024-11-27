const nodemailer = require('nodemailer');
const OAuthToken = require('@models/OAuthTokenModel');


// module.exports = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         type: 'OAuth2',
//         user: 'thomas29111@gmail.com',
//         clientId: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         refreshToken: process.env.Refresh_Token,
//     },
// });

module.exports = async () => {
    try {
        const tokenData = await OAuthToken.findOne()

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'thomas29111@gmail.com',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: tokenData.refreshToken,
                accessToken: tokenData.accessToken,
            },
        });

        return transporter;
    } catch (error) {
        console.log(error);
    }
}
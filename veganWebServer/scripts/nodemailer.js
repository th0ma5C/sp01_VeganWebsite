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

let transporter;

const initTransporter = async () => {
    try {
        const tokenData = await OAuthToken.findOne()

        transporter = nodemailer.createTransport({
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
        transporter.on('token', async (token) => {
            try {
                tokenData.accessToken = token.accessToken;
                tokenData.expiryDate = new Date(token.expires);
                await tokenData.save();

                console.log('access token refreshed');
            } catch (error) {
                console.error('Failed to refresh access token:', error);
            }
        });

        return transporter;
    } catch (error) {
        console.log(error);
    }
}

initTransporter();

module.exports = {
    getTransporter: () => transporter,
};
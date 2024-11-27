var express = require('express');
var router = express.Router();
const OAuthToken = require('@models/OAuthTokenModel');

const googleOAuth2Client = require('@root/config/googleOAth2Client');

const SCOPES = [
    'https://mail.google.com/',
];

router.get('/login', (req, res) => {
    const authUrl = googleOAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
    });
    res.redirect(authUrl);
});

router.get('/google/callback', async (req, res) => {
    const code = req.query.code; // 授權碼
    try {
        // 使用授權碼交換 token
        const { tokens } = await googleOAuth2Client.getToken(code);

        // 設定憑證並保存 token
        googleOAuth2Client.setCredentials(tokens);
        req.session.tokens = tokens;
        req.session.authenticated = true;

        console.log('Access Token:', tokens.access_token);
        console.log('Refresh Token:', tokens.refresh_token);

        googleOAuth2Client.setCredentials(tokens);
        res.send('Token retrieved successfully. Check the console for details.');

        let token = await OAuthToken.findOne();

        if (token) {
            token.accessToken = tokens.access_token;
            token.refreshToken = tokens.refresh_token;
            token.tokenType = tokens.token_type;
            token.scope = tokens.scope;
            token.expiryDate = new Date(tokens.expiry_date);
            await token.save();
        } else {
            token = new OAuthToken({
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                tokenType: tokens.token_type,
                scope: tokens.scope,
                expiryDate: new Date(tokens.expiry_date)
            });
            await token.save();
        }
        console.log('Token retrieved and saved to database successfully.');

    } catch (err) {
        console.error('Error authenticating with Google:', err);
        res.status(500).send('Error authenticating with Google');
    }
});


module.exports = router;

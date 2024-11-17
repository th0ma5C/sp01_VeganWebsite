var express = require('express');
var router = express.Router();

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
        req.session.tokens = tokens; // 保存到 session 或數據庫

        console.log('Access Token:', tokens.access_token);
        console.log('Refresh Token:', tokens.refresh_token); // 保存此值以便後續使用

        googleOAuth2Client.setCredentials(tokens);
        res.send('Token retrieved successfully. Check the console for details.');
        // 保存 tokens.refresh_token 用於後續應用程式使用
        req.session.tokens = tokens;
    } catch (err) {
        console.error('Error authenticating with Google:', err);
        res.status(500).send('Error authenticating with Google');
    }
});


module.exports = router;

const express = require('express');
const { google } = require('googleapis');
const router = express.Router();
const OAuthToken = require('@models/OAuthTokenModel');
const jwt = require('jsonwebtoken');
const User = require('@models/User');

const mailerClient = require('./OAuthClient/MailerClient');
const { client: loginClient, getAuthUrl } = require('./OAuthClient/LoginClient');

// get auth url
router.get('/google-loginUrl', (req, res) => {
    try {
        const authUrl = getAuthUrl();
        res.status(200).json({
            state: 'confirm',
            authUrl
        })
    } catch (error) {
        console.error(err);
        res.status(500).send('Authentication failed');
    }
});

const verifyToken = async (req, res, next) => {
    const { code, state } = req.body;
    if (!code) return res.status(401).json({ error: '未提供授權碼' })
    try {
        jwt.verify(state, process.env.JWT_SECRET);

        const { tokens } = await loginClient.getToken(code);
        loginClient.setCredentials(tokens);
        const oauth2 = google.oauth2({ version: 'v2', auth: loginClient });
        const { data } = await oauth2.userinfo.get();
        req.googleProfile = data

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: '無效的授權碼' });
    }
};

// save google user data
router.post('/google-login', verifyToken, async (req, res) => {
    try {
        if (!req.googleProfile) {
            return res.status(401).json({ state: 'denied', message: 'Invalid Google verify' });
        }

        const profile = req.googleProfile;
        const { user, result } = await createProfileInDB(profile);
        if (user && result) {
            const token = jwt.sign(
                { username: user.username, email: user.email, userID: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );
            res
                .status(200)
                .cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                    maxAge: 1000 * 60 * 60 * 24 // 1 day
                })
                .json({ ...result, token });
        }
    } catch (err) {
        console.log(err);
        console.error('Error getting Google user data:', err);
        res.status(500).json({ state: 'denied', message: 'internal error' })
    }
});

async function createProfileInDB(profile) {
    try {
        const { email, id: googleId, name: username } = profile

        const ExistingUser = await User.findOne({ email });

        if (ExistingUser) {
            if (!ExistingUser.googleId) {
                ExistingUser.googleId = googleId;
                await ExistingUser.save();
            }
            return {
                user: ExistingUser,
                result: {
                    state: 'confirm',
                    message: '登入成功'
                }
            };
        }

        const newUser = new User({
            email,
            googleId,
            username,
            verified: true,
            joinPrivacyPolicy: true
        });
        await newUser.save();

        return {
            user: newUser,
            result: {
                state: 'confirm',
                message: '登入成功'
            }
        }
    } catch (error) {
        console.error("Error in createProfileInDB:", error);
        throw error;
    }
}


// refresh mailer token
router.get('/oauthGmail-redirect', async (req, res) => {
    try {
        const { code, state } = req.query;
        jwt.verify(state, process.env.JWT_SECRET);

        const { tokens } = await mailerClient.getToken(code);

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
        // console.log('Access Token:', tokens.access_token);
        // console.log('Refresh Token:', tokens.refresh_token);
        console.log('Token retrieved and saved to database successfully.');
        res.send('Token retrieved successfully. Check the console for details.');

    } catch (err) {
        console.error('Error authenticating with nodemailer:', err);
        res.status(500).send('Error authenticating with nodemailer');
    }
});


module.exports = router;

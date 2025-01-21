const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { orderMailer } = require('./mailerOptions');

router.post('/send-subscribeEmail', async (req, res) => {
    try {
        const { recipient } = req.body;
        const result = await orderMailer(recipient);
        res.status(200).send({ message: '郵件發送成功', state: 'confirm' });
    } catch (error) {
        console.error('發送郵件時出錯:', error);
        res.status(500).send({ message: '郵件發送失敗', state: 'denied' });
    }
})

// router.post('/unsubscribe', async (req, res) => {
//     try {
//         const { recipient } = req.body;
//         const result = await orderMailer(recipient);
//         res.status(200).send({ message: '郵件發送成功' });
//     } catch (error) {
//         console.error('發送郵件時出錯:', error);
//         res.status(500).send({ message: '郵件發送失敗' });
//     }
// })

module.exports = router;

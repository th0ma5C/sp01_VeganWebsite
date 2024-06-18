const express = require('express');
const router = express.Router();
const NewsModel = require('../../../models/NewsModel')

/* GET news */
router.get('/newsList', async (req, res) => {
    try {
        const newsList = await NewsModel.findOne();
        res.status(200).json(newsList);
    } catch (err) {
        res.status(500).send('獲取news失敗')
    }
})


module.exports = router;

const express = require('express');
const router = express.Router();
const NewsModel = require('../../../models/NewsModel');
const moment = require('moment')

/* GET news */
router.get('/newsList', async (req, res) => {
    try {
        const data = await NewsModel.find().sort({ date: -1 }).exec();
        let newsList = data.map((item) => {
            return {
                ...item.toObject(),
                date: moment(item.date).format('YYYY-MM-DD')
            };
        })
        res.status(200).json(newsList);
    } catch (err) {
        res.status(500).send('獲取news失敗')
    }
})

// const MenuModel = require('../../../models/MenuModel')
// router.get('/test', async (req, res) => {
//     try {
//         const data = await MenuModel.find()
//         console.log(data);
//         res.status(200).send('成功')
//         return data
//     } catch (error) {
//         res.status(500).send('獲取失敗')
//     }
// })

module.exports = router;

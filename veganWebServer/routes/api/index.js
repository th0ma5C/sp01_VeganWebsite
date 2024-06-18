const express = require('express');
const router = express.Router();

// 引入路由模块
const menu = require('./menu');
const news = require('./news');

// 使用路由模块
router.use('/menu', menu);
router.use('/news', news);

module.exports = router;

const express = require('express');
const router = express.Router();

const MenuModel = require('../../models/menuModel');

/* GET home menu */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;

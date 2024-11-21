const express = require('express');
const router = express.Router();
const { authToken } = require('@middlewares/userValidator');
const { checkOrder, checkSub } = require('@middlewares/orderVerify');
const User = require('@models/User');
const Order = require('@models/OrderModel');
const Stocks = require('@models/StockModel');
const redisClient = require('@root/redisClient')
const jwt = require('jsonwebtoken');

router.post('/')


module.exports = router;

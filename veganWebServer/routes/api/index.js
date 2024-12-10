const express = require('express');
const router = express.Router();
const { createHandler } = require("graphql-http/lib/use/express")

// 引入路由模块
const menu = require('./menu');
const news = require('./news');
const { getQuestionnaire } = require('./questionnaire');
const coupon = require('./coupon');
const auth = require('./userAuth');
const checkout = require('./checkout/checkout');
const oauth = require('./oauth/OAuth');
const cart = require('./cart/cart.js');
const order = require('./order');

// 使用路由模块
router.use('/menu', menu);
router.use('/news', news);

// graphQL
// const schema = require('./graphql/schema');
// const resolvers = require('./graphql/resolvers');
const schema = require('./graphql/schema')
router.use('/graphql', createHandler({
    schema
    // rootValue: resolvers,
    // graphiql: true
}));

// 問卷api
router.get('/questionnaire', getQuestionnaire);

// coupon api
router.use('/coupon', coupon);

// 註冊api
router.use('/auth', auth);

// 訂單
router.use('/order', order);

// 結帳
router.use('/checkout', checkout);

// get mailer token
router.use('/OAuth', oauth);

// 購物車
router.use('/cart', cart)

module.exports = router;

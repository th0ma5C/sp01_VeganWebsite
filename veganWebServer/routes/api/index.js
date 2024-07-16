const express = require('express');
const router = express.Router();
const { createHandler } = require("graphql-http/lib/use/express")

// 引入路由模块
const menu = require('./menu');
const news = require('./news');

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

module.exports = router;

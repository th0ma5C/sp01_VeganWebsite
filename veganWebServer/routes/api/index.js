const express = require('express');
const router = express.Router();

// 引入路由模块
const menu = require('./menu');
const news = require('./news');

// 使用路由模块
router.use('/menu', menu);
router.use('/news', news);

// graphQL
const schema = require('./graphql/schema');
const root = require('./graphql/resolvers');

router.use('/graphql', createHandler({
    schema: schema,
    rootValue: root,
    graphiql: true, // 用於開發測試的 GraphiQL 工具
}));

module.exports = router;

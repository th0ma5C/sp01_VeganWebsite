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
// const root = require('./graphql/resolvers');
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            hello: {
                type: GraphQLString,
                // resolve: () => 'world',
            },
            menu: {
                type: GraphQLString,
            }
        },
    }),
});

const Menu = require('../../models/MenuModel')
let root = {
    hello: () => {
        return 'Hello world!';
    },
    menu: async () => {
        try {
            console.log('object');
            return await Menu.find();
        } catch (error) {
            console.error('Error fetching menus:', error);
            throw new Error('Unable to fetch menus');
        }
    }
};

router.use('/graphql', createHandler({
    schema: schema,
    rootValue: root,
    graphiql: true, // 用於開發測試的 GraphiQL 工具
}));

module.exports = router;

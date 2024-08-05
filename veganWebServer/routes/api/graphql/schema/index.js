const { GraphQLSchema, GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLFloat } = require('graphql');
const MenuModel = require('../../../../models/MenuModel');

const MenuItemType = new GraphQLObjectType({
    name: 'MenuItem',
    fields: {
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        ingredients: { type: new GraphQLList(GraphQLString) },
        price: { type: GraphQLFloat },
        category: { type: GraphQLString },
        fileName: { type: GraphQLString },
        rating: { type: GraphQLFloat },
        date: { type: GraphQLString }
    }
});

const MenuType = new GraphQLObjectType({
    name: 'Menu',
    fields: {
        name: { type: GraphQLString },
        items: { type: new GraphQLList(MenuItemType) },
    }
});

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        menu: {
            type: new GraphQLList(MenuType),
            args: {
                name: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                try {
                    // let menus;
                    // if (args.name) {
                    //     return menus = await MenuModel.find({ name: args.name });
                    // } else {
                    //     return menus = await MenuModel.find({});
                    // }
                    const matchStage = args.name ? { $match: { name: args.name } } : { $match: {} };
                    const addFieldsStage = {
                        $addFields: {
                            items: {
                                $map: {
                                    input: "$items",
                                    as: "item",
                                    in: {
                                        name: "$$item.name",
                                        description: "$$item.description",
                                        ingredients: "$$item.ingredients",
                                        price: "$$item.price",
                                        category: "$$item.category",
                                        date: "$$item.date",
                                        rating: "$$item.rating",
                                        fileName: { $concat: ["/images/menu/", "$$item.category", "/", "$$item.fileName"] }
                                    }
                                }
                            }
                        }
                    };
                    const menus = await MenuModel.aggregate([matchStage, addFieldsStage]).exec();
                    return menus;

                } catch (error) {
                    console.error('Error fetching menus:', error);
                    throw new Error('Unable to fetch menus');
                }
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: QueryType
});

module.exports = schema;


// const { buildSchema } = require('graphql');

// const schema = buildSchema(`
//     type MenuItem {
//         name: String!
//         description: String
//         ingredients: [String]
//         price: Float
//         category: String
//         fileName: String
//     }

//     type Menu {
//         name: String!
//         items: [MenuItem]
//     }

//     type Query {
//         menus: [Menu]
//         menu(name: String!): Menu
//   }
// `);

// module.exports = schema;

// 步骤 3：配置服务器缓存控制
// 确保服务器响应中设置了合适的缓存头，例如 Cache - Control 和 ETag。以下是一个基于 Node.js / Express 的示例：

// javascript
// 複製程式碼
// const express = require('express');
// const app = express();

// app.use(express.static('public', {
//     maxAge: '1d', // 浏览器将缓存这些文件 1 天
//     etag: true, // 启用 ETag
// }));

// app.get('/api/menu', (req, res) => {
//     const menu = {
//         items: [
//             {
//                 fileName: 'images/sunrise.jpg'
//             }
//         ]
//     };
//     res.json({ menu });
// });

// app.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000');
// });
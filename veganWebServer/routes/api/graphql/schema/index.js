const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type MenuItem {
        name: String!
        description: String
        ingredients: [String]
        price: Float
        fileName: String
    }

    type Menu {
        id: ID!
        name: String!
        items: [MenuItem]
    }

    type Query {
        menus: [Menu]
        menu(id: ID!): Menu
        menuByName(name: String!): Menu
        menuItems(menuName: String!): [MenuItem]
        menuItem(menuName: String!, itemName: String!): MenuItem
    } 
`);
// const schema = buildSchema(`
//     type MenuItem {
//     name: String!
//     description: String!
//     ingredients: [String!]!
//     price: Int!
//     category: String!
//     imageURL: String
// }

//     type Category {
//         name: String!
//         items: [MenuItem!]!
// }

//     type Query {
//         categories: [Category!]!
//         menuItems(category: String): [MenuItem!]!
//         menuItem(name: String!): MenuItem
// }
// `);

module.exports = schema;
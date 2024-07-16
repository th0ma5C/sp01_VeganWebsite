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
        fileName: { type: GraphQLString }
    }
});

const MenuType = new GraphQLObjectType({
    name: 'Menu',
    fields: {
        name: { type: GraphQLString },
        items: { type: new GraphQLList(MenuItemType) }
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
                    if (args.name) {
                        return await MenuModel.find({ name: args.name });
                    } else {
                        return await MenuModel.find({});
                    }
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
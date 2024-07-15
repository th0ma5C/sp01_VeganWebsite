const Menu = require('../../../../models/MenuModel');

class UserInputError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserInputError';
    }
}

const resolvers = {
    Query: {
        menus: async () => {
            try {
                console.log('object');
                return await Menu.find();
            } catch (error) {
                console.error('Error fetching menus:', error);
                throw new Error('Unable to fetch menus');
            }
        },
        menu: async (_, { id }) => {
            try {
                const menu = await Menu.findById(id);
                if (!menu) throw new UserInputError(`Menu with id ${id} not found`);
                return menu;
            } catch (error) {
                console.error(`Error fetching menu with id ${id}:`, error);
                if (error instanceof UserInputError) throw error;
                throw new Error('Unable to fetch menu');
            }
        },
        menuByName: async (_, { name }) => {
            try {
                const menu = await Menu.findOne({ name });
                if (!menu) throw new UserInputError(`Menu with name "${name}" not found`);
                return menu;
            } catch (error) {
                console.error(`Error fetching menu with name "${name}":`, error);
                if (error instanceof UserInputError) throw error;
                throw new Error('Unable to fetch menu');
            }
        }
    }
}

// const resolver = {
//     Query: {
//         categories: async () => {
//             try {
//                 return await Category.find().populate('items').exec();
//             } catch (error) {
//                 console.error("Error fetching categories:", error);
//                 throw new Error("Failed to fetch categories");
//             }
//         },
//         menuItems: async ({ category }) => {
//             try {
//                 if (category) {
//                     const categoryData = await Category.findOne({ name: category }).populate('items').exec();
//                     if (!categoryData) {
//                         throw new Error(`Category "${category}" not found`);
//                     }
//                     return categoryData.items;
//                 } else {
//                     return await MenuItem.find().exec();
//                 }
//             } catch (error) {
//                 console.error("Error fetching menu items:", error);
//                 throw new Error("Failed to fetch menu items");
//             }
//         },
//         menuItem: async ({ name }) => {
//             try {
//                 const menuItem = await MenuItem.findOne({ name }).exec();
//                 if (!menuItem) {
//                     throw new Error(`Menu item "${name}" not found`);
//                 }
//                 return menuItem;
//             } catch (error) {
//                 console.error("Error fetching menu item:", error);
//                 throw new Error("Failed to fetch menu item");
//             }
//         }
//     }
// };

module.exports = resolvers;


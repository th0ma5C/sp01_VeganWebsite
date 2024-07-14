const { MenuItem, Category } = require('../../../../models/MenuModel');

const resolvers = {
    Query: {
        categories: async () => {
            try {
                return await Category.find().populate('items').exec();
            } catch (error) {
                console.error("Error fetching categories:", error);
                throw new Error("Failed to fetch categories");
            }
        },
        menuItems: async ({ category }) => {
            try {
                if (category) {
                    const categoryData = await Category.findOne({ name: category }).populate('items').exec();
                    if (!categoryData) {
                        throw new Error(`Category "${category}" not found`);
                    }
                    return categoryData.items;
                } else {
                    return await MenuItem.find().exec();
                }
            } catch (error) {
                console.error("Error fetching menu items:", error);
                throw new Error("Failed to fetch menu items");
            }
        },
        menuItem: async ({ name }) => {
            try {
                const menuItem = await MenuItem.findOne({ name }).exec();
                if (!menuItem) {
                    throw new Error(`Menu item "${name}" not found`);
                }
                return menuItem;
            } catch (error) {
                console.error("Error fetching menu item:", error);
                throw new Error("Failed to fetch menu item");
            }
        }
    },
    Mutation: {
        addMenuItem: async (parent, args) => {
            try {
                const newItem = new MenuItem(args);
                await newItem.save();

                let category = await Category.findOne({ name: args.category });
                if (!category) {
                    category = new Category({ name: args.category, items: [newItem._id] });
                } else {
                    category.items.push(newItem);
                }
                await category.save();
                return newItem;
            } catch (error) {
                console.error("Error adding menu item:", error);
                throw new Error("Failed to add menu item");
            }
        },
        updateMenuItem: async (parent, args) => {
            try {
                const updatedItem = await MenuItem.findOneAndUpdate({ name: args.name }, args, { new: true }).exec();
                if (!updatedItem) {
                    throw new Error(`Menu item "${args.name}" not found`);
                }
                return updatedItem;
            } catch (error) {
                console.error("Error updating menu item:", error);
                throw new Error("Failed to update menu item");
            }
        },
        deleteMenuItem: async ({ name }) => {
            try {
                const deletedItem = await MenuItem.findOneAndDelete({ name }).exec();
                if (!deletedItem) {
                    throw new Error(`Menu item "${name}" not found`);
                }
                await Category.updateMany({ items: deletedItem._id }, { $pull: { items: deletedItem._id } }).exec();
                return deletedItem;
            } catch (error) {
                console.error("Error deleting menu item:", error);
                throw new Error("Failed to delete menu item");
            }
        }
    }
};

module.exports = resolvers;


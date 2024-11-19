const { Schema, model } = require('mongoose');
// const Schema = mongoose.Schema;

// const menuItemSchema = new Schema({
//     name: { type: String, required: true },
//     description: String,
//     ingredients: [String],
//     price: Number,
//     category: String,
//     fileName: String
// }, { _id: false });

const menuSchema = new Schema({
    name: { type: String, required: true },
    items: [
        {
            name: { type: String, required: true },
            description: String,
            ingredients: [String],
            main: String,
            price: Number,
            category: String,
            fileName: String,
            date: String,
            rating: Number,
            tags: [String]
        }
    ]
}, { collection: 'menu' });

const MenuModel = model('menu', menuSchema);

module.exports = MenuModel;

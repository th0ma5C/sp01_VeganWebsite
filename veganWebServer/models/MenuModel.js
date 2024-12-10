const { Schema, model } = require('mongoose');
// const Schema = mongoose.Schema;

const menuItemSchema = new Schema({
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
}, { _id: true });

const menuSchema = new Schema({
    name: { type: String, required: true },
    items: [menuItemSchema]
}, { collection: 'menu' });

const MenuModel = model('menu', menuSchema);

module.exports = MenuModel;

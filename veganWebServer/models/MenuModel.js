const { Schema, model } = require('mongoose');
// const Schema = mongoose.Schema;

const menuItemSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    ingredients: [String],
    price: Number,
    fileName: String
}, { _id: false });

const menuSchema = new Schema({
    name: { type: String, required: true },
    items: [menuItemSchema]
}, { strict: true });

const Menu = model('Category', menuSchema);

module.exports = Menu;

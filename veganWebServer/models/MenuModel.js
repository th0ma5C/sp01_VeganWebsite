const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuItemSchema = new Schema({
    name: String,
    description: String,
    ingredients: [String],
    price: Number,
    category: String,
    imageURL: String
});

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);


const CategorySchema = new Schema({
    name: String,
    items: [{ type: Schema.Types.ObjectId, ref: 'MenuItem' }]
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = {
    MenuItem,
    Category
};

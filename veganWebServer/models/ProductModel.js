const mongoose = require('mongoose');

let ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    ingredient: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    imageURL: {
        type: String,
        require: true,
    }
})

let ProductModel = mongoose.model('product', ProductSchema);

module.exports = ProductModel;
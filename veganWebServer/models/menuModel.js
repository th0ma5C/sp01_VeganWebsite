const mongoose = require('mongoose');

let MenuSchema = new mongoose.Schema({
    name: String,
    url: String
})

let MenuModel = mongoose.model('menu', MenuSchema);

module.exports = MenuModel;
// Meal logic
let mongoose = require('mongoose');
require('dotenv').config()
const mongo = process.env.MONGO

let itemSchema = new mongoose.Schema({
    name: String,
    vicinity: String,
    dates: Object,
    geometry: Object,
    id: mongoose.Schema.Types.ObjectId,
    placeId: String
});

mongoose.connect(mongo);
module.exports = mongoose.model('Item', itemSchema);
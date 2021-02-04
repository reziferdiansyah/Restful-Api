const mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    title: String,
    lat: Number,
    lang: Number
});

module.exports = mongoose.model('Map', mapSchema)
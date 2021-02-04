const mongoose = require('mongoose');

const letterSchema = new mongoose.Schema({
    letter: String,
    frequency: Number
});

module.exports = mongoose.model('Letters', letterSchema)
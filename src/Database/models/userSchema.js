const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    cde: {
        type: Number,
        require: true,
        unique: true
    }, number: {
        type: Number,
        require: true,
        unique: true
    }, name: {
        type: String,
        require: true,
    }, psswrd: {
        type: String,
        require: true,
    }, changeTk: {
        type: String,
    }, expireTime: {
        type: Date,
    }
})

module.exports = new mongoose.model('/User', userSchema);
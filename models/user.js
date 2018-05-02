const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    gender: {type: String},
    friendlist: {type: Array},
    interests: {type: Array},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date}

})


module.exports = mongoose.model('User', UserSchema);

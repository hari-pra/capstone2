const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    mobile: { type: Number, unique: true },
    admin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('user',userSchema);
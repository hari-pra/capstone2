const mongoose = require('mongoose');
const book = require('./book');
const returnSchema = new mongoose.Schema({
    username:{
        type:String
    },
    bookid: { type: mongoose.Schema.Types.ObjectId, unique: true, ref: "book" },
    duedate: { type: Date, required: true },
    fine: { type: Number, default: 0 }},
    { timestamps: true }
)

module.exports = mongoose.model('return',returnSchema);
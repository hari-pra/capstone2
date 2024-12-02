const mongoose = require('mongoose');
const Book = require('./book');
const borrowSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    bookid: { 
        type: mongoose.Schema.Types.ObjectId, 
        unique: true, 
        ref: 'Book', 
        required: true 
    },
    duedate: { 
        type: Date, 
        default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 
        required: [true, 'Must have due date'] 
    }
}, { timestamps: true });


module.exports = mongoose.model('borrow',borrowSchema);
const express = require('express');
const user = require('../models/user');
const returns = require('../models/return');
const book = require('../models/book');
const borrow = require('../models/borrow')

const router = express.Router();

// to Register user 
router.post('/registerUser',async(req,res)=>{
    try {
        const newUser = new user(req.body);
        await newUser.save();
        res.status(201).send('user registered successfully');
    } catch (error) {
        console.log(error);
        res.send(' failed to register user').status(500);
    }
});
// to authenticate
router.get('/auth',async(req,res)=>{
    try {
        const {uname,passw}= req.body;
        await user.findOne({username:uname,password:passw});
        res.send(' authorised ');
    } catch (error) {
        console.log(error);
        res.send('failed to authenticate');
    }
});
// to get all users
router.get('/getUsers',async(req,res)=>{
    try {
        const users = await user.find();
        res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.send(' Failed to fetch users').status(404);
    }
})
// to create new book 
router.post('/addBook',async(req,res)=>{
    try {
        const newBook = new book(req.body);
        await newBook.save();
        res.status(201).send(' book added succeddfully');
    } catch (error) {
        console.log(error);
        res.send(' failed to add book').status(500);
    }
});

// to get book 
router.get('/getBooks',async(req,res)=>{
    try {
        const books = await book.find();
        res.status(200).send(books);
    } catch (error) {
        console.log(error);
        res.send(' Failed to fetch data').status(404);
    }
});

//Admin to  to update book deatils 
const checkAuth =(req,res,next)=>{
    if(req.query.user!='admin'){
        return res.send('unauthorised')
    }
    next();
};
//?user=admin
router.put('/update',checkAuth,async(req,res)=>{
    try {
        const{name,newAuthor} = req.body;
        await book.findOneAndUpdate({name:name,author:newAuthor});
        res.status(202).send('data updated successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Update access for admin ');
    }
});

// to return

// @ts-ignore
router.post('/return', async(req,res)=> {
    const { username, bookid } = req.body;

    try {
        const borrowRecord = await returns.findOne({ username, bookid });
        if (!borrowRecord) {
            return res.status(404).json({ message: 'Borrowing record not found' });
        }
        await book.findByIdAndUpdate(bookid, { available: true });

        await returns.deleteOne({ _id: borrowRecord._id }); 

        res.status(200).json({
            message: 'Book returned successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// to borrow
// @ts-ignore
router.post('/borrow', async (req, res) => {
    try {
        const { username, bookid } = req.body;
        const Book = await book.findById(bookid);
        if (!Book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (!Book.available) {
            return res.status(400).json({ message: 'Book is not available for borrowing' });
        }
        const newBorrow = new borrow({
            username,
            bookid,
            duedate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) 
        });
        await newBorrow.save();

        Book.available = false; 
        await Book.save();

        res.status(201).json({
            message: 'Book borrowed successfully',
            borrowRecord: newBorrow
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports =router;
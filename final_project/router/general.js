const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn]) 
 });

// Get book details based on ISBN with promises
//public_users.get("/isbn/:isbn", async function (req, res) {
    //Write your code here
    //const promise = new Promise((resolve, reject) => {
      //setTimeout(() => resolve(books[req.params.isbn]), 100);
    //});
  
    //const book = await promise;
  
    //if (book) {
      //return res.status(200).json({ book });
    //} else {
      //return res.status(404).json({ message: "Book not found" });
    //}
  //});

   public_users.get('/author/:author', function (req, res) {
     const author = req.params.author; // Get the author from request parameters
     const booksWithAuthor = []; // Initialize an array to store books with the specified author
 
     // Iterate through the keys of the 'books' object
     for (const key in books) {
         if (books.hasOwnProperty(key)) {
             const book = books[key];
             // Check if the author of the current book matches the requested author
             if (book.author === author) {
                 // If it matches, add the book to the 'booksWithAuthor' array
                 booksWithAuthor.push(book);
             }
         }
     }
 
     // Return the array of books with the specified author
     return res.status(200).json({ books: booksWithAuthor });
 });
 



 public_users.get('/title/:title', function (req, res) {
    const title = req.params.title; // Get the title from request parameters
    const booksWithTitle = []; // Initialize an array to store books with the specified title

    // Iterate through the keys of the 'books' object
    for (const key in books) {
        if (books.hasOwnProperty(key)) {
            const book = books[key];
            // Check if the title of the current book matches the requested title
            if (book.title === title) {
                // If it matches, add the book to the 'booksWithTitle' array
                booksWithTitle.push(book);
            }
        }
    }

    // Return the array of books with the specified title
    return res.status(200).json({ books: booksWithTitle });
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Get the ISBN from request parameters

    // Check if the book with the provided ISBN exists
    if (books.hasOwnProperty(isbn)) {
        const book = books[isbn];
        const reviews = book.reviews; // Get the reviews for the book

        // Return the reviews for the book with the specified ISBN
        return res.status(200).json({ reviews: reviews });
    } else {
        // If the book with the provided ISBN doesn't exist, return an error message
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;

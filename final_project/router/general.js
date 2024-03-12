const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

// Define the users object
let users = {};

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  
  // Check if username already exists
  if (users.hasOwnProperty(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Store the new user information
  users[username] = password;
  
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const bookList = Object.values(books).map(book => {
    return {
      title: book.title,
      author: book.author,
      reviews: book.reviews
    };
  });
  return res.status(200).json(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      if (book.author === author) {
        booksByAuthor.push(book);
      }
    }
  }
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "Books by author not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      if (book.title.toLowerCase().includes(title.toLowerCase())) {
        booksByTitle.push(book);
      }
    }
  }
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "Books with title not found" });
  }
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    if (book.reviews && Object.keys(book.reviews).length > 0) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;

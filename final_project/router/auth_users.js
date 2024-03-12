

// auth_users.js

const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

let users = {};

const isValid = (username) => {
    // Check if the username exists in the users object
    return users.hasOwnProperty(username);
}

const authenticatedUser = (username, password) => {
    // Check if the username and password match
    return users[username] === password;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username exists
    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid username" });
    }

    // Check if the username and password match
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate and return JWT token
    const token = jwt.sign({ username: username }, "secret_key");
    return res.status(200).json({ token: token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.user.username; // Get username from JWT token in the session
    const isbn = req.params.isbn;
    const review = req.query.review;

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    if (!books.hasOwnProperty(isbn)) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already reviewed the book
    if (books[isbn].reviews && books[isbn].reviews.hasOwnProperty(username)) {
        // Modify the existing review
        books[isbn].reviews[username] = review;
    } else {
        // Add a new review
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }
        books[isbn].reviews[username] = review;
    }

    return res.status(200).json({ message: "Review added/modified successfully" });
});

// Register a new user
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if username already exists
    if (isValid(username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Store the new user information
    users[username] = password;
  
    return res.status(201).json({ message: "User registered successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

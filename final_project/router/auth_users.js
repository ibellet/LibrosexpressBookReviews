const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });



// Add a book review
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Extracting ISBN from URL parameters
    const review = req.body.review; // Extracting review content from request body
    const userName = req.session.authorization.username; // Extracting username from session
  
    // Adding the review for the book identified by ISBN
    if (!books[isbn].reviews) {
        books[isbn].reviews = {}; // Initialize reviews object if it doesn't exist
    }
    books[isbn].reviews[userName] = review;
    
    // Sending 201 Created response with success message
    return res.status(201).json({ message: "Review added" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Extract ISBN from URL parameters
    const userName = req.session.authorization.username; // Extract username from session
  
    // Check if the user is logged in
    if (!userName) {
        return res.status(401).json({ message: "Unauthorized. User not logged in" });
    }

    // Check if the book exists
    if (!books.hasOwnProperty(isbn)) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has reviewed the book
    if (!books[isbn].reviews || !books[isbn].reviews[userName]) {
        return res.status(404).json({ message: "Review not found" });
    }

    // Delete the review associated with the user
    delete books[isbn].reviews[userName];

    // Sending 200 OK response with success message
    return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

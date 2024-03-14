// Importing necessary modules
const express = require("express"); // Importing Express.js module for creating routes
const jwt = require("jsonwebtoken"); // Importing JWT (JSON Web Token) module for user authentication
let books = require("./booksdb.js"); // Importing database of books
const regd_users = express.Router(); // Creating an instance of Express Router for user authentication routes

let users = []; // Array to store user data

// Function to check if the username is valid
const isValid = (username) => {
  // (This function should have its implementation defined)
  // Returns a boolean indicating whether the username is valid or not
};

// Function to authenticate users based on username and password
const authenticatedUser = (username, password) => {
  // Filtering users array to find a match for username and password
  let validusers = users.filter((user) => {
    return user.userName === username && user.password === password;
  });
  // Returning true if there is at least one match, indicating successful authentication
  return validusers.length > 0;
};

// Route to handle user login
regd_users.post("/login", (req, res) => {
  const userName = req.body.userName; // Extracting username from request body
  const password = req.body.password; // Extracting password from request body

  // Checking if username or password is missing
  if (!userName || !password) {
    return res.status(400).json({ message: "Error logging in" }); // Sending 400 Bad Request response
  }

  // Authenticating the user using the provided username and password
  if (authenticatedUser(userName, password)) {
    // Generating JWT token for authentication
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access", // Secret key for signing the token
      { expiresIn: 60 * 60 } // Token expiration time (1 hour in this case)
    );

    // Storing user authentication data in session
    req.session.authorization = {
      accessToken, // Access token
      userName, // Username
    };
    // Sending 200 OK response with success message and access token
    return res.status(200).json({ message: "User successfully logged in", accessToken });
  } else {
    // Sending 401 Unauthorized response if authentication fails
    return res.status(401).json({ message: "Invalid Login. Check username and password" });
  }
});

// Route to add a review for a book
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Extracting ISBN from URL parameters
  const review = req.body.review; // Extracting review content from request body
  const userName = req.userName; // Extracting username from request object

  // Adding the review for the book identified by ISBN
  books[isbn].reviews[userName] = review;
  // Sending 300 Multiple Choices response with success message
  return res.status(300).json({ message: "Review added" });
});

// Route to delete a review for a book
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Extracting ISBN from URL parameters
  const userName = req.userName; // Extracting username from request object

  // Deleting the review for the book identified by ISBN
  delete books[isbn].reviews[userName];
  // Sending 300 Multiple Choices response with success message
  return res.status(300).json({ message: "Review deleted" });
});

// Exporting the authenticated router, isValid function, and users array for external use
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

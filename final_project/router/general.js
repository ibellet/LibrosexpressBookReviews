// Importing necessary modules
const express = require("express"); // Importing Express.js module for creating routes
let books = require("./booksdb.js"); // Importing database of books
let isValid = require("./auth_users.js").isValid; // Importing isValid function from auth_users.js for username validation
let users = require("./auth_users.js").users; // Importing users array from auth_users.js for user registration
const public_users = express.Router(); // Creating an instance of Express Router for public routes

// Route to handle user registration
public_users.post("/register", (req, res) => {
  const { userName, password } = req.body; // Extracting username and password from request body

  // Checking if username or password is missing
  if (!userName || !password) {
    res.status(400).send("userName or password not provided"); // Sending 400 Bad Request response
  }

  // Filtering existing users array to check if the username already exists
  let existingUsers = users.filter((values) => {
    return values.userName == userName;
  });

  // If the username already exists, sending a 500 Internal Server Error response
  if (existingUsers.length > 0) {
    res.status(500).send("user already exists");
  } else {
    // If the username is unique, adding the new user to the users array
    users.push({ userName, password });
    // Sending 300 Multiple Choices response with success message
    res.status(300).send("successfully registered");
  }
});

// Route to get all books
public_users.get("/", function (req, res) {
  return res.status(300).json(books); // Sending all books as JSON response
});

// Route to get book by ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn; // Extracting ISBN from URL parameters
  return res.status(300).json(books[isbn]); // Sending book with the specified ISBN as JSON response
});

// Route to get books by author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author; // Extracting author name from URL parameters
  // Converting books object to array of key-value pairs, filtering by author, and converting back to object
  const asArray = Object.entries(books);
  const filtered = asArray.filter(([key, value]) => value.author === author);
  const justStrings = Object.fromEntries(filtered);
  // Sending filtered books as JSON response
  return res.status(300).json(justStrings);
});

// Route to search books by title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title; // Extracting title from URL parameters
  // Converting books object to array of key-value pairs, filtering by title (case insensitive), and converting back to object
  const asArray = Object.entries(books);
  const filtered = asArray.filter(([key, value]) =>
    value.title?.toLowerCase().includes(title.toLocaleLowerCase())
  );
  const justStrings = Object.fromEntries(filtered);
  // Sending filtered books as JSON response
  return res.status(300).json(justStrings);
});

// Route to get reviews for a book by ISBN
public_users.get("/review/:isbn", function (req, res) {
  return res.status(300).json(books[req.params.isbn].reviews); // Sending reviews for the specified book as JSON response
});

// Exporting the public router for external use
module.exports.general = public_users;

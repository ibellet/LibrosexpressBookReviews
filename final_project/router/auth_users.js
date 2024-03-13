// auth_users.js

const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check if the username is valid
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.userName === username && user.password === password;
  });
  return validusers.length > 0;
};

regd_users.post("/login", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  if (!userName || !password) {
    return res.status(400).json({ message: "Error logging in" });
  }

  if (authenticatedUser(userName, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      userName,
    };
    return res.status(200).json({ message: "User successfully logged in", accessToken });
  } else {
    return res.status(401).json({ message: "Invalid Login. Check username and password" });
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const userName = req.userName;

  books[isbn].reviews[userName] = review;
  return res.status(300).json({ message: "review added" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const userName = req.userName;

  delete books[isbn].reviews[userName];
  return res.status(300).json({ message: "review deleted" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

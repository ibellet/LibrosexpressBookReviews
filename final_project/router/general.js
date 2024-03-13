// general.js

const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    res.status(400).send("userName or password not provided");
  }
  let existingUsers = users.filter((values) => {
    return values.userName == userName;
  });

  if (existingUsers.length > 0) {
    res.status(500).send("user already exists");
  } else {
    users.push({ userName, password });
    res.status(300).send("successfully registered");
  }
});

public_users.get("/", function (req, res) {
  return res.status(300).json(books);
});

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  return res.status(300).json(books[isbn]);
});

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const asArray = Object.entries(books);
  const filtered = asArray.filter(([key, value]) => value.author === author);
  const justStrings = Object.fromEntries(filtered);
  return res.status(300).json(justStrings);
});

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const asArray = Object.entries(books);
  const filtered = asArray.filter(([key, value]) =>
    value.title?.toLowerCase().includes(title.toLocaleLowerCase())
  );
  const justStrings = Object.fromEntries(filtered);
  return res.status(300).json(justStrings);
});

public_users.get("/review/:isbn", function (req, res) {
  return res.status(300).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;

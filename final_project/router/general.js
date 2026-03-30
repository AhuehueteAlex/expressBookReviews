const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const userAlreadyExists = users.some((user) => user.username === username);
  if (userAlreadyExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res
    .status(201)
    .json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get the book list using async-await with Axios
public_users.get("/async/books", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to fetch books with Axios" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn], null, 4));
});

// Get book details based on ISBN using async-await with Axios
public_users.get("/async/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to fetch book details by ISBN with Axios" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const booksByAuthor = {};

  bookKeys.forEach((key) => {
    if (books[key].author === author) {
      booksByAuthor[key] = books[key];
    }
  });

  return res.send(JSON.stringify(booksByAuthor, null, 4));
});

// Get book details based on author using async-await with Axios
public_users.get("/async/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to fetch book details by author with Axios" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const booksByTitle = {};

  bookKeys.forEach((key) => {
    if (books[key].title === title) {
      booksByTitle[key] = books[key];
    }
  });

  return res.send(JSON.stringify(booksByTitle, null, 4));
});

// Get book details based on title using async-await with Axios
public_users.get("/async/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to fetch book details by title with Axios" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;

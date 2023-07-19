const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let filteredUsers = users.filter((user) => user.username === username);
    return (length(filteredUsers) > 0);
}

const authenticatedUser = (username, password) => { //returns boolean
    for (let user of users) {
        if (user.username === username && user.password === password) {
            return true;
        }
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    let [username, password] = [req.body.username, req.body.password];

    if (!(username && password)) {
        return res.status(401).send("Username or password not provided.");
    }
    if (!authenticatedUser(username, password)) {
        return res.status(401).send("Invalid login. Check username and password.");
    }

    let accessToken = jwt.sign({ data: password }, "fingerprint_customer", { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };

    return res.status(200).send("Successfully logged in.")
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.session.authorization["username"];
    let review = req.query.review;

    if (!(isbn in books)) {
        return res.status(404).send("No such book exists.");
    }
    if (!review) {
        return res.status(404).send("Error adding review.");
    }

    books[isbn]["reviews"][username] = review;
    return res.status(200).send(`Review successfully added/updated for book with ISBN ${isbn}.`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.session.authorization["username"];

    if (!(isbn in books)) {
        return res.status(404).send("No such book exists.");
    }
    if (!(username in books[isbn]["reviews"])) {
        return res.status(404).send("No review written for this book.");
    }

    delete books[isbn]["reviews"][username];
    return res.status(200).send(`Review for book with ISBN ${isbn} by user ${username} successfully deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

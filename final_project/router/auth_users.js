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
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

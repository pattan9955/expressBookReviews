const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    let [username, password] = [req.body.username, req.body.password];

    if (!(username && password)) {
        return res.status(401).send("Error registering user.");
    }
    users.push({"username": username, "password": password});

    return res.status(200).send("Successfully registered user.");
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    
    if (!(isbn in books)) {
        return res.status(404).send("No such book exists.");
    }

    const chosenBook = books[isbn];
    return res.status(200).send(JSON.stringify(chosenBook, null, 4));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let author = req.params.author;
    
    let result = {"booksbyauthor": []};
    for (const [isbn, book] of Object.entries(books)) {
        if (book["author"] === author) {
            result["booksbyauthor"].push({ [isbn]: book });
        }
    }

    return res.status(200).send(JSON.stringify(result, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let title = req.params.title;
    
    let result = {"booksbytitle": []};
    for (const [isbn, book] of Object.entries(books)) {
        if (book["title"] === title) {
            result["booksbytitle"].push({ [isbn]: book });
        }
    }

    return res.status(200).send(JSON.stringify(result, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;

    if (!(isbn in books)) {
        return res.status(404).send("No such title found.");
    }

    let reviews = books[isbn]["reviews"];
    return res.status(200).send(JSON.stringify(reviews, null, 4));
});

// Async Portion (Tasks 10-13)
public_users.get('/async-all-books', (req, res) => {
    let promise = new Promise((resolve, reject) => {
        resolve(books);
    });
    
    promise
        .then(value => {
            return res.status(200).send(JSON.stringify(value, null, 4));
        });
});

public_users.get('/async-isbn/:isbn', (req, res) => {
    let promise = new Promise((resolve, reject) => {
        let isbn = req.params.isbn;
        
        if (!(isbn in books)) {
            reject("No such book exists");
        }

        resolve(books[isbn]);
    });

    promise
        .then(book => {
            return res.status(200).send(JSON.stringify(book, null, 4));
        }, reason => {
            return res.status(404).send(reason);
        });
});

public_users.get('/async-author/:author', (req, res) => {
    let promise = new Promise((resolve, reject) => {
        let author = req.params.author;
        let result = {"booksbyauthor": []};

        for (const [isbn, book] of Object.entries(books)) {
            if (book["author"] === author) {
                result["booksbyauthor"].push({ [isbn]: book });
            }
        }

        resolve(result);
    });

    promise
        .then(result => {
            return res.status(200).send(JSON.stringify(result, null, 4));
        });
});

public_users.get('/async-title/:title', (req, res) => {
    let promise = new Promise((resolve, reject) => {
        let title = req.params.title;
        let result = {"booksbytitle": []};

        for (const [isbn, book] of Object.entries(books)) {
            if (book["title"] === title) {
                result["booksbytitle"].push({ [isbn]: book });
            }
        }

        resolve(result);
    });

    promise
        .then(result => {
            return res.status(200).send(JSON.stringify(result, null, 4));
        });
});

module.exports.general = public_users;

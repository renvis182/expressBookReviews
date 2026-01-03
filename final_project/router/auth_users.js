const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    return !users.some(user => user.username === username); 
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    return users.some(
        user => user.username === username && user.password === password
    );
}

//only registered users can login
//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    // 1) Validar que vengan datos
    if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
    }
  
    // 2) Validar credenciales
    if (authenticatedUser(username, password)) {
      // 3) Generar JWT y guardarlo en sesión
      const accessToken = jwt.sign(
        { data: password },   // patrón del lab
        "access",
        { expiresIn: 60 }
      );
  
      req.session.authorization = { accessToken, username };
      return res.status(200).send("User successfully logged in");
    }
  
    // 4) Credenciales incorrectas
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const review = req.query.review;

    // username guardado en sesión en el login (Task 7)
    const username = req.session?.authorization?.username;

    // Validaciones básicas
    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review query parameter is required" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Asegurar que exista el objeto reviews
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Si el usuario ya tenía review, se sobreescribe (modifica); si no, se agrega
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        isbn: isbn,
        reviews: books[isbn].reviews
    });
  });

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
  
    // Username guardado en sesión
    const username = req.session?.authorization?.username;
  
    if (!username) {
      return res.status(403).json({ message: "User not logged in" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!books[isbn].reviews || Object.keys(books[isbn].reviews).length === 0) {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  
    // Solo eliminar la review de este usuario
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "No review found for this user on this book" });
    }
  
    delete books[isbn].reviews[username];
  
    return res.status(200).json({
      message: "Review deleted successfully",
      isbn: isbn,
      reviews: books[isbn].reviews
    });
});
  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

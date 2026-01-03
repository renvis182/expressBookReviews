const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // 1) Validar que vengan username y password
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // 2) Verificar si el usuario ya existe
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists!" });
  }

  // 3) Registrar usuario
  users.push({ username, password });

  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
// Synchronously
//public_users.get('/',function (req, res) {
  //Write your code here
    //return res.status(200).send(JSON.stringify(books, null, 4));
//});

// Task 10: Get all books using Promises / Async-Await
public_users.get('/', async (req, res) => {
    console.log("Before creating promise");
  
    // Crear promesa que simula una operación asíncrona
    const getBooksPromise = () => {
      return new Promise((resolve, reject) => {
        console.log("Inside promise - fetching books...");
        
        setTimeout(() => {
          console.log("Promise resolved - books fetched");
          resolve(books);
        }, 2000); // delay para notar la asincronía
      });
    };
  
    console.log("Before awaiting promise");
  
    try {
      const allBooks = await getBooksPromise();
  
      console.log("After awaiting promise");
      return res.status(200).json(allBooks);
  
    } catch (error) {
      console.log("Error occurred");
      return res.status(500).json({ message: "Error retrieving books" });
    }
  });

// Get book details based on ISBN
//Synchronously
//public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    //const isbn = req.params.isbn;

    //const book = books[isbn];

    //if (book) {
        //return res.status(200).send(JSON.stringify(book, null, 4));
    //} else {
        //return res.status(404).json({ message: "Book not found" });
    //}
//});

// Task 11: Get book details based on ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    console.log("Before Axios call");
  
    try {
      const baseUrl = req.protocol + "://" + req.get("host");
  
      // Axios call to Task 10 endpoint (GET /)
      const response = await axios.get(`${baseUrl}/`);
      console.log("After Axios call - data received");
  
      const allBooks = response.data;
      const book = allBooks[isbn];
  
      if (book) {
        console.log("Book found for ISBN:", isbn);
        return res.status(200).send(JSON.stringify(book, null, 4));
      } else {
        console.log("Book NOT found for ISBN:", isbn);
        return res.status(404).json({ message: "Book not found" });
      }
  
    } catch (error) {
      console.log("Error in Axios request:", error.message);
      return res.status(500).json({ message: "Error retrieving book by ISBN" });
    }
  });
  
  
// Get book details based on author
//Synchronously
//public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //const author = req.params.author;

  //const result = [];

  // 1. Obtener todas las claves del objeto books
  //const keys = Object.keys(books);

  // 2. Iterar y comparar autores
  //keys.forEach(key => {
    //if (books[key].author === author) {
      //result.push({
        //isbn: key,
        //title: books[key].title,
        //author: books[key].author,
        //reviews: books[key].reviews
      //});
    //}
  //});

  //if (result.length > 0) {
    //return res.status(200).send(JSON.stringify(result, null, 4));
  //} else {
    //return res.status(404).json({ message: "No books found for this author" });
  //}
//});

// Task 12: Get book details based on author using Promises + Axios
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    console.log("Before creating Promise"); 
    const baseUrl = req.protocol + "://" + req.get("host");

    const getBooksByAuthorPromise = new Promise((resolve, reject) => {
      console.log("Inside Promise - calling Axios");
  
      axios.get(`${baseUrl}/`)
        .then(response => {
          console.log("Axios resolved");
  
          const allBooks = response.data;
          const result = [];
  
          Object.keys(allBooks).forEach((key) => {
            if (allBooks[key].author === author) {
              result.push({
                isbn: key,
                title: allBooks[key].title,
                author: allBooks[key].author,
                reviews: allBooks[key].reviews
              });
            }
          });
  
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    });
    console.log("After creating Promise");
  
    getBooksByAuthorPromise
      .then(result => {
        if (result.length > 0) {
          console.log("Books found:", result.length);
          res.status(200).send(JSON.stringify(result, null, 4));
        } else {
          console.log("No books found for author");
          res.status(404).json({ message: "No books found for this author" });
        }
      })
      .catch(error => {
        console.log("Error:", error.message);
        res.status(500).json({ message: "Error retrieving books by author" });
      });
  });
  

// Get all books based on title
//public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //const title = req.params.title;

  //const result = [];

  // Obtener todas las claves del objeto books
  //const keys = Object.keys(books);

  // Iterar y comparar títulos
  //keys.forEach(key => {
    //if (books[key].title === title) {
      //result.push({
        //isbn: key,
        //title: books[key].title,
        //author: books[key].author,
        //reviews: books[key].reviews
      //});
    //}
  //});

  //if (result.length > 0) {
    //return res.status(200).send(JSON.stringify(result, null, 4));
  //} else {
    //return res.status(404).json({ message: "No books found with this title" });
  //}
//});

// Task 13: Get book details based on title using Promises + Axios
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const baseUrl = req.protocol + "://" + req.get("host");
    console.log("Before Axios call");
  
    axios.get(`${baseUrl}/`)
      .then(response => {
        console.log("Axios response received");
  
        const allBooks = response.data;
        const result = Object.keys(allBooks)
          .filter(key => allBooks[key].title === title)
          .map(key => ({ isbn: key, ...allBooks[key] }));
  
        return result.length
          ? res.status(200).send(JSON.stringify(result, null, 4))
          : res.status(404).json({ message: "No books found with this title" });
      })
      .catch(error => {
        console.log("Error occurred");
        res.status(500).json({ message: "Error retrieving books by title", error: error.message });
      });
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;

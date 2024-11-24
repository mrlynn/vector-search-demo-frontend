const mongoose = require('mongoose');
const bookSchema = require('./Book');

// Create and export the Book model
const Book = mongoose.model('Book', bookSchema);

module.exports = {
  Book
};
const { Book } = require('../models');
const { validateEmbedding } = require('../models/validation');

async function validateDocument(doc) {
  const validationErrors = [];

  // Required fields check
  const requiredFields = [
    'title',
    'title_embedding',
    'description_embedding',
    'searchableTitle',
    'summary'
  ];

  requiredFields.forEach(field => {
    if (!doc[field]) {
      validationErrors.push(`Missing required field: ${field}`);
    }
  });

  // Embedding validation
  if (doc.title_embedding && !validateEmbedding(doc.title_embedding)) {
    validationErrors.push('Invalid title_embedding format or dimension');
  }

  if (doc.description_embedding && !validateEmbedding(doc.description_embedding)) {
    validationErrors.push('Invalid description_embedding format or dimension');
  }

  // Nested embeddings validation
  if (doc.embeddings) {
    if (doc.embeddings.title && !validateEmbedding(doc.embeddings.title)) {
      validationErrors.push('Invalid embeddings.title format or dimension');
    }
    if (doc.embeddings.description && !validateEmbedding(doc.embeddings.description)) {
      validationErrors.push('Invalid embeddings.description format or dimension');
    }
  }

  // Create a Book instance to trigger Mongoose validation
  try {
    const book = new Book(doc);
    await book.validate();
  } catch (err) {
    if (err.errors) {
      Object.values(err.errors).forEach(error => {
        validationErrors.push(error.message);
      });
    }
  }

  return {
    isValid: validationErrors.length === 0,
    errors: validationErrors
  };
}

module.exports = { validateDocument };
// Validation functions for schemas
const EMBEDDING_DIMENSION = 384; // for text-embedding-3-small

const validateEmbedding = (embedding) => {
  if (!Array.isArray(embedding)) return false;
  if (embedding.length !== EMBEDDING_DIMENSION) return false;
  return embedding.every(num => typeof num === 'number' && !isNaN(num));
};

// Additional validation helpers
const validateSearchableTitle = (title) => {
  return typeof title === 'string' && title.length > 0;
};

const validateDate = (date) => {
  if (!date) return true; // Optional
  // Accepts formats like "1975 BCE" or "Unknown"
  return typeof date === 'string' && (
    date === 'Unknown' ||
    /^\d{1,4}\s*(BCE|CE|BC|AD)?$/.test(date)
  );
};

module.exports = {
  validateEmbedding,
  validateSearchableTitle,
  validateDate,
  EMBEDDING_DIMENSION
};
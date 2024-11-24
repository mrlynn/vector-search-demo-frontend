const { Schema } = require('mongoose');
const { validateEmbedding } = require('./validation');

const bookSchema = new Schema({
  // Vector Search Fields (maintain original structure)
  title_embedding: {
    type: [Number],
    required: true,
    validate: {
      validator: validateEmbedding,
      message: 'title_embedding must be an array of 384 numbers'
    }
  },
  description_embedding: {
    type: [Number],
    required: true,
    validate: {
      validator: validateEmbedding,
      message: 'description_embedding must be an array of 384 numbers'
    }
  },
  searchableTitle: {
    type: String,
    required: true,
    index: true
  },

  // Basic Information
  title: {
    type: String,
    required: true,
    index: true
  },
  author: {
    type: String,
    default: 'Unknown',
    index: true
  },
  summary: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    default: 'Ancient Egyptian Texts',
    index: true
  },
  period: {
    type: String,
    default: 'Unknown',
    index: true
  },
  date: {
    type: String,
    default: 'Unknown'
  },

  // Detailed Content
  significance: String,
  contents: String,
  keywords: {
    type: [String],
    index: true,
    default: []
  },

  // Embeddings Nested Structure (matching your document)
  embeddings: {
    description: {
      type: [Number],
      validate: {
        validator: validateEmbedding,
        message: 'Embedding must be an array of 384 numbers'
      }
    },
    title: {
      type: [Number],
      validate: {
        validator: validateEmbedding,
        message: 'Embedding must be an array of 384 numbers'
      }
    }
  },

  // Metadata
  metadata: {
    dateAdded: {
      type: Date,
      default: Date.now,
      required: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
      required: true
    },
    searchableTitle: {
      type: String,
      required: true
    }
  },

  // References
  references: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['academic', 'digital', 'print']
    }
  }]
}, {
  timestamps: true,
  collection: 'books'
});

// Vector Search Indexes
bookSchema.index(
  { title_embedding: "vectorSearch" },
  {
    name: "vector_title_index",
    vectorSearchOptions: {
      dimension: 384,
      similarity: "cosine"
    }
  }
);

bookSchema.index(
  { description_embedding: "vectorSearch" },
  {
    name: "vector_description_index",
    vectorSearchOptions: {
      dimension: 384,
      similarity: "cosine"
    }
  }
);

// Regular Indexes
bookSchema.index({ searchableTitle: 1 });
bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ keywords: 1 });
bookSchema.index({ period: 1, category: 1 });
bookSchema.index({ 'metadata.dateAdded': 1 });

// Instance methods
bookSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Middleware
bookSchema.pre('save', function(next) {
  this.metadata.lastUpdated = new Date();
  next();
});

module.exports = bookSchema;
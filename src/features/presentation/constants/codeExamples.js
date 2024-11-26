// src/presentation/constants/codeExamples.ts
export const codeExamples = {
  vectorSearchIndex: {
    title: 'Vector Search Index Definition',
    language: 'javascript',
    code: `{
  "mappings": {
    "dynamic": true,
    "fields": {
      "embedding": {
        "type": "knnVector",
        "dimensions": 1536,
        "similarity": "cosine"
      }
    }
  }
}`,
    notes: ['Defines the structure for vector search', 'Specifies dimensionality and similarity metric']
  },
  // ... other code examples
};
// src/features/presentation/slides/technicalEvolutionSlides.ts
import { SlideSection } from '../types/slideTypes';
import { 
  MongoDBBasicSearchWrapper, 
  DataFlowAnimationWrapper,
  SearchEvolution,
  SearchJourney,
  VectorEmbeddingsExplanation
} from '../components';

export const technicalEvolutionSection: SlideSection = {
  id: 'technical-evolution',
  title: 'Technical Evolution',
  description: 'The journey from basic search to intelligent vector search',
  duration: 15,
  learningObjectives: [
    'Understand the limitations of traditional search',
    'Learn how Atlas Search enhances text search capabilities',
    'Master vector search concepts and implementation',
    'Explore the integration of AI with search'
  ],
  keyTakeaways: [
    'Vector search enables semantic understanding',
    'Integration with AI models enhances search capabilities',
    'MongoDB supports multiple search paradigms',
    'Choose the right search approach for your use case'
  ],
  slides: [
    {
      id: 'basic-search',
      type: 'text-full',
      title: 'The Foundation: Basic Search',
      note: 'BUILDING BLOCKS',
      component: MongoDBBasicSearchWrapper,
      content: `
## Basic Search Operations

Starting with fundamental MongoDB queries:

\`\`\`javascript
db.collection.find({
  title: { $regex: /pattern/i }
})
\`\`\`

### Limitations
- Exact matching only
- No semantic understanding
- Limited relevance ranking
- Performance challenges at scale
      `,
      duration: 3,
      speakerNotes: [
        'Demo basic search functionality',
        'Highlight limitations',
        'Set up need for better solutions'
      ]
    },
    {
      id: 'atlas-search',
      type: 'text-full',
      title: 'Enhanced Understanding with Atlas Search',
      note: 'FIRST EVOLUTION',
      content: `
## Beyond Basic Text Search
      
Atlas Search introduces sophisticated text analysis:
      
\`\`\`javascript
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "description": {
        "type": "string",
        "analyzer": "lucene.standard"
      }
    }
  }
}

// Fuzzy Search Query
db.products.aggregate([
  {
    $search: {
      text: {
        query: "coffee maker",
        path: "description",
        fuzzy: { maxEdits: 2 }
      }
    }
  }
])
\`\`\`
      
## Key Capabilities
* *Fuzzy Matching*: Handles typos and variations
* *Synonyms*: Understands related terms
* *Relevance Scoring*: Intelligent ranking
* *Faceted Search*: Dynamic filtering
      `,
      duration: 4,
      speakerNotes: [
        'Demonstrate fuzzy matching',
        'Show relevance scoring',
        'Explain analyzers and their importance'
      ]
    },
    {
      id: 'vector-search-intro',
      type: 'text-full',
      title: 'Introduction to Vector Search',
      note: 'VECTOR FUNDAMENTALS',
      component: SearchEvolution,
      content: `
## Understanding Vector Search

### Key Concepts
- Embeddings represent meaning
- Similar meanings have similar vectors
- Distance metrics measure similarity
- Dimensionality and vector spaces

### Applications
- Semantic search
- Recommendation systems
- Image similarity
- Natural language understanding
      `,
      duration: 4,
      speakerNotes: [
        'Explain embeddings simply',
        'Use visual analogies',
        'Connect to real-world examples'
      ]
    },
    {
      id: 'vector-embeddings',
      title: 'Understanding Vector Embeddings',
      content: 'Explore how vector embeddings enable AI-powered search capabilities',
      note: 'Vector embeddings and their role in modern search',
      type: 'split',
      component: VectorEmbeddingsExplanation,
      duration: 5,
      speakerNotes: [
        'Vector embeddings are the foundation of modern AI-powered search',
        'They convert complex data into numerical representations',
        'Similar items are positioned closer together in vector space',
        'This enables semantic understanding and similarity matching',
        'MongoDB Vector Search leverages these embeddings for intelligent queries'
      ]
    },
    {
      id: 'vector-search-implementation',
      type: 'text-full',
      title: 'Vector Search in Action',
      note: 'IMPLEMENTATION',
      component: DataFlowAnimationWrapper,
      content: `
## Vector Search Architecture

\`\`\`javascript
// Vector Search Index
{
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
}

// Vector Search Query
db.products.aggregate([
  {
    $vectorSearch: {
      queryVector: embedding,
      path: "embedding",
      numCandidates: 100,
      limit: 10
    }
  }
])
\`\`\`

### Key Features
- Efficient similarity search
- Scalable architecture
- Flexible integration
- Multiple embedding models supported
      `,
      duration: 4,
      speakerNotes: [
        'Walk through the vector search flow',
        'Explain each component',
        'Highlight performance considerations'
      ]
    },
    {
      id: 'modern-architecture',
      type: 'text-full',
      title: 'Modern Search Architecture',
      note: 'SYSTEM OVERVIEW',
      component: SearchJourney,
      content: `
## Complete Search Solution

### Components
- Vector storage and indexing
- Embedding generation
- Query processing
- Result ranking

### Integration Points
- AI/ML models
- Application logic
- User interface
- Analytics and monitoring
      `,
      duration: 3,
      speakerNotes: [
        'Show how components work together',
        'Discuss scaling considerations',
        'Address common challenges'
      ]
    }
  ]
};

export default technicalEvolutionSection.slides;
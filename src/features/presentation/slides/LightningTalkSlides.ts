// src/features/presentation/slides/lightningTalkSlides.ts
import { SlideSection } from '../types/slideTypes';
import {
  SearchEvolution,
  VectorEmbeddingsExplanation,
  AncientLibraryScroll,
  AncientTextQA,
  DataFlowAnimation,
  SearchJourney,
  DataExplorer,
  EmbeddingVisualizer,
  CodeComparison,
  VectorSearchDemo,
  ImplementationSteps,
  VectorSpaceVisualization,
  Vector3DVisualization,
  VisualRelationshipVisualization,
  SwimLaneFlow,
  Vector3DForce,
  VectorSearchDemo2
} from '../components';

export const lightningTalkSection: SlideSection = {
  id: 'lightning-talk',
  title: 'From Data to Intelligence',
  description: 'Building AI-Powered Applications with MongoDB Vector Search',
  duration: 15,
  slides: [
    // Opening: Developer Context (2 minutes)
    {
      id: 'welcome',
      title: 'Welcome',
      content: 'From Data to Intelligence: Building AI-Powered Apps',
      note: 'Michael Lynn',
      image: '/slide2.png', // Suggested: Create an image showing the journey from code to AI
      speakerNotes: [
        'Welcome developers!',
        'Today we will build intelligence into your applications',
        'Practical implementation of vector search in MongoDB'
      ],
      duration: 1,
      type: 'split'
    },
    {
      id: 'dev-evolution',
      type: 'split',
      title: 'The Developer\'s Journey',
      note: 'EVOLUTION',
      content: `
## From Data to Intelligence

\`\`\`javascript
// Traditional Search
db.products.find({ 
  name: { $regex: /leather.*jacket/ } 
})

// Knowledge Organization
db.products.createIndex({ 
  description: "text" 
})

// Intelligent Search
db.products.aggregate([
  { "$vectorSearch": {
    "queryVector": embedding,
    "path": "description_vector"
  }}
])
\`\`\`
      `,
      image: '/code-evolution.webp', // Suggested: Create an image showing code evolution
      duration: 1,
      speakerNotes: [
        'Show how our code evolves from simple to intelligent',
        'Emphasize the power of vector search',
        'Set up the technical journey ahead'
      ]
    },

    {
      id: 'embedding-explanation',
      type: 'text-full',
      title: 'Understanding Vector Embeddings',
      note: 'TECHNICAL DEEP DIVE',
      component: EmbeddingVisualizer,
      content: '',
      duration: 2,
      speakerNotes: [
        'Explain the transformation process',
        'Highlight how vectors capture meaning',
        'Show the difference from traditional search'
      ]
    },
    {
      id: 'vector-space',
      type: 'text-full',
      title: 'Vector Space Representation',
      note: 'SEMANTIC RELATIONSHIPS',
      component: VectorSpaceVisualization,
      content: '',
      duration: 2,
      speakerNotes: [
        'Opening Line: Lets step into the world of intelligence—starting with data. Here, I’m introducing you to the concept of vector space. Imagine a world where every concept, idea, or entity is represented as a point in a multi-dimensional space.',
        'Explanation: What youre seeing here is a visualization of how an LLM (Large Language Model) organizes related concepts into a vector space. Each dot represents a concept, like Java, Nike, or Mint, while the proximity between them shows how closely related they are.',
        'Engage Audience: Notice how the clusters naturally form based on context. For instance, \'Technology\' concepts like \'Python\' and Java group together, while Places & Geography, like Phoenix and China, form their own distinct neighborhood. This is the power of vectorization—it reveals hidden relationships in your data.',
        'This is a 2D representation of a much higher-dimensional space'
        ]
      },
    {
      id: 'vector-3d',
      type: 'text-full',
      title: 'Vector Space Representation',
      note: 'SEMANTIC RELATIONSHIPS',
      component: Vector3DVisualization,
      content: '',
      duration: 2,
      speakerNotes: [
        'Points represent words in high-dimensional space',
        'Colors indicate semantic clusters',
        'Connected points show semantic relationships',
        'Search and zoom to explore the space'
      ]
    },
    {
      id: 'vector-3d',
      type: 'text-full',
      title: 'Vector Space Representation',
      note: 'SEMANTIC RELATIONSHIPS',
      component: Vector3DForce,
      content: '',
      duration: 2,
      speakerNotes: [
        'Points represent words in high-dimensional space',
        'Colors indicate semantic clusters',
        'Connected points show semantic relationships',
        'Search and zoom to explore the space'
      ]
    },
    // Implementation (4 minutes)
    {
      id: 'setup-steps',
      type: 'text-full',
      title: 'Setting Up Vector Search',
      note: 'IMPLEMENTATION',
      component: DataFlowAnimation, // Using existing component
      content: `
## Quick Start Steps

1. Enable Atlas Vector Search
2. Create vector index
3. Generate embeddings
4. Store & query vectors

\`\`\`javascript
// Create vector index
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "description_vector": {
        "dimensions": 1536,
        "similarity": "cosine",
        "type": "knnVector"
      }
    }
  }
}
\`\`\`
      `,
      duration: 2,
      speakerNotes: [
        'Walk through implementation steps',
        'Show actual configuration',
        'Highlight key parameters'
      ]
    },
    {
      id: 'integration-demo',
      type: 'text-full',
      title: 'Live Integration',
      note: 'DEMO',
      component: AncientTextQA, // Repurpose existing component for modern search
      content: `
## Vector Search in Action

* Real-time semantic search
* Context-aware results
* Relevance ranking
* Performance metrics
      `,
      duration: 2,
      speakerNotes: [
        'Show live search demo',
        'Compare with traditional search',
        'Demonstrate improved relevance'
      ]
    },

    // Real-world Applications (4 minutes)
    {
      id: 'use-cases',
      type: 'split',
      title: 'Real-World Applications',
      note: 'APPLICATIONS',
      content: `
## Vector Search Use Cases

\`\`\`javascript
// Semantic Search
const similar = await semanticSearch(
  "comfortable winter coat"
);

// Recommendation Engine
const recommendations = await findSimilar(
  productId
);

// Content Discovery
const related = await findRelatedContent(
  articleVector
);
\`\`\`
      `,
      image: '/applications.webp', // Suggested: Create image showing different use cases
      duration: 2,
      speakerNotes: [
        'Show practical applications',
        'Demonstrate code patterns',
        'Inspire developer ideas'
      ]
    },
    {
      id: 'search-comparison',
      type: 'text-full',
      title: 'Traditional vs Vector Search',
      note: 'CODE COMPARISON',
      component: CodeComparison,
      content: '',
      duration: 2,
      speakerNotes: [
        'Show limitations of traditional search',
        'Demonstrate vector search capabilities',
        'Highlight key benefits and differences'
      ]
    },
    {
      id: 'vector-search-demo',
      type: 'text-full',
      title: 'Vector Search Demo',
      note: 'DEMO',
      component: VectorSearchDemo,
      content: '',
      duration: 2,
      speakerNotes: [
        'Show live search demo',
        'Compare with traditional search',
        'Demonstrate improved relevance'
      ]
    },
    {
      id: 'vector-search-demo',
      type: 'text-full',
      title: 'Vector Search Demo',
      note: 'DEMO',
      component: VectorSearchDemo2,
      content: '',
      duration: 2,
      speakerNotes: [
        'Show live search demo',
        'Compare with traditional search',
        'Demonstrate improved relevance'
      ]
    },
    {
      id: 'implementation-steps',
      type: 'text-full',
      title: 'Implementation Steps',
      note: 'IMPLEMENTATION',
      component: ImplementationSteps,
      content: '',
      duration: 2,
      speakerNotes: [
        'Show implementation steps',
        'Highlight key steps',
        'Provide next steps'
      ]
    },

    // Closing (2 minutes)
    {
      id: 'next-steps',
      type: 'split',
      title: 'Start Building',
      note: 'NEXT STEPS',
      content: `
## Quick Start Guide

1. \`\`\`bash
   # Create Atlas cluster (M10+)
   atlas cluster create demo --tier M10
   \`\`\`

2. \`\`\`javascript
   // Enable vector search
   await db.runCommand({
     createSearchIndex: "products",
     definition: {
       mappings: {
         dynamic: true,
         fields: {
           "description_vector": {
             type: "knnVector",
             dimensions: 1536
           }
         }
       }
     }
   });
   \`\`\`

3. Clone starter repo:
   github.com/mongodb-developer/vector-search-starter

> "Transform your apps with AI power"
      `,
      image: '/getting-started.png', // Suggested: Create image showing getting started steps
      duration: 2,
      speakerNotes: [
        'Provide concrete next steps',
        'Share resources and links',
        'Call to action'
      ]
    }
  ]
};

export default lightningTalkSection.slides;
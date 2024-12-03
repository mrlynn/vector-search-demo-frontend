import { SlideSection } from '../types/slideTypes';
import {
  SearchEvolution,
  VectorEmbeddingsExplanation,
  DataFlowAnimation,
  SearchJourney,
  DataExplorer,
  EmbeddingVisualizer,
  CodeComparison,
  VectorSearchDemo,
  ImplementationSteps,
  VectorSpaceVisualization,
  Vector3DVisualization,
  Vector3DForce,
  VectorSearchDemo2,
  SearchComparison,
  AncientLibraryScroll,
  EvolutionExplorer,
  VectorLibrarySearch,
  AncientLibraryFlowWrapper,
  TitleSlide,
  SwimLaneFlow,
  InitialVectorAnimation,
  FullImageSlide,
  VectorSearchProcess,
  AIExplanationSlide,
  AIVectorSlide,
  VectorExplanationSlide,
  SemanticSearchExplained,
  TextSearchDemo,
  AncientTextQA,
  NeuralPathwaySimulator,
  AtlasVectorVisualizer,
  Atlas3DVisualizer,
  VectorSearchWizard,
  AtlasClusterSetup,
  FullImageWelcome,
  FullImageSage,
  FullImageEmbeddings,
  AncientLibrarySearch,
  TextSearchDemo2,
  TimeLine,
  VectorTransformation,
  LLMVectorFlow,
  EmbeddingProcess,
  DataGrowthCharts,
  DataUnitsComparison,
  DataScaleComparison,
  GeoVectorVisualization
} from '../components';

export const vectorSearchPresentation: SlideSection = {
  id: 'vector-search-presentation',
  title: 'From Data to Intelligence',
  description: 'Building AI-Powered Applications with MongoDB Vector Search',
  duration: 15,
  slides: [
    // Slide 1
    {
      id: 'hand', // Slide 1
      title: 'Michael Lynn',
      content: 'Principal Developer Advocate, MongoDB',
      component: FullImageWelcome,
      note: '',
      image: '/title.png',
      speakerNotes: [
        'Introduce yourself',
        'Introduce the topic',
        'Introduce the audience'
      ],
      duration: 2,
      type: 'image-full'
    },
    // Slide 2
    {
      id: 'timeline',
      type: 'text-full',
      title: 'timeline',
      note: '',
      component: TimeLine,
      content: ''
    },
    {
      id: 'what-is-data',
      type: 'text-full',
      title: `what is data?
      🤷‍♂️`,
      note: '',
      component: '',
      content: ''
    },
    {
      id: 'data-facts',
      type: 'text-full',
      title: 'data facts',
      note: '',
      component: DataGrowthCharts,
      content: `Volume Milestones:


In 1992, global internet traffic was approximately 100 GB per day
By 2022, global internet traffic reached about 150,700 GB per second
By 2025, it's projected that 463 exabytes of data will be created each day globally


## Historical Context:


All words ever spoken by humans until 2003 were estimated to equal about 5 exabytes
In 2023, we create that much data every few days
90% of all data ever created was generated between 2020-2022


## Social Media Impact:


### Every minute in 2023:

- Users send 16 million text messages
- TikTok users watch 167 million videos
- Instagram users share 65,000 photos
YouTube users upload 500 hours of video


## Business Data Growth:


### Companies went from managing megabytes in the 1990s to petabytes today

### The average company's data doubles every 12-18 months

### By 2025, 75% of enterprise data will be created and processed outside a traditional centralized data center


IoT Contribution:


Connected IoT devices will generate 73.1 ZB (zettabytes) of data by 2025
A single autonomous vehicle generates about 4 terabytes of data per day
Smart factories create about 1 petabyte of data per day


Healthcare Data:


Medical data doubles every 73 days
A single patient generates around 80 megabytes of imaging and EMR data annually
Genomic sequencing of one person generates about 200 gigabytes of raw data`
    },
    // Slide 3
    {
      id: 'data-units-comparison',
      type: 'text-full',
      title: 'data units comparison',
      note: '',
      component: DataUnitsComparison,
      content: ''
    },
    {
      id: 'data-scale-comparison',
      type: 'text-full',
      title: 'data scale comparison',
      note: '',
      component: DataScaleComparison,
      content: ''
    },
    {
      id: 'data-evolution', // Slide 2
      type: 'text-full',
      title: '',
      note: '',
      component: EvolutionExplorer,
      content: '',
      duration: 2,
      speakerNotes: [
        'Walk through the evolution from data to intelligence',
        'Click through each stage to show the progression',
        'Highlight key differences between stages',
        'Emphasize how each builds upon the previous'
      ]
    },
    // Slide 4
    {
      id: 'alexandria-parallel', // Slide 3
      type: 'split',
      title: 'the great library',
      note: 'HISTORICAL PARALLEL',
      content: `
## Lessons from Alexandria

The world's first universal library:
* Built 283 BCE
* 700,000+ scrolls and books
* Complex organization system
* Expert librarians and scholars
* Knowledge synthesis and creation
      `,
      image: '/library.png',
      duration: 2,
      speakerNotes: [
        'Draw parallel between ancient and modern challenges',
        'Set up the scrolling demonstration',
        'Highlight the scale of information'
      ]
    },
    // Slide 5
    {
      "id": "library-of-alexandria-slide",
      "type": "split",
      "title": "Knowledge Retrieval in the Library of Alexandria",
      "note": "HISTORICAL CONTEXT",
      "content": `
## How Knowledge Was Found

- **Classification**: Scrolls organized by subject
- **Catalogs**: Callimachus' 'Pinakes' provided summaries and metadata
- **Librarians**: Guided scholars to relevant resources
- **Cross-references**: Interlinked texts enriched understanding

> Imagine manually sifting through scrolls to discover connections.
`,
      "image": "/wall-of-scrolls.webp",
      "duration": 2,
      "speakerNotes": [
        "Explain how knowledge was managed in the Library of Alexandria.",
        "Draw parallels to modern search challenges.",
        "Set up the transition to modern vector search solutions."
      ]
    },
    {
      id: 'can-you-relate?',
      type: 'text-full',
      title: '✨ lets learn about spell 125...',
      note: '',
      component: '',
      content: '',
      duration: 2,
    },
    {
      id: 'can-you-relate-2',
      type: 'text-full',
      title: 'aka... weighing of the heart ❤️',
      note: '',
      component: '',
      content: '',
      duration: 2,
    },
    {
      id: 'can-you-relate-3',
      type: 'text-full',
      title: '👀 search through the library to find a text with more information...',
      note: '',
      component: '',
      content: '',
      duration: 2,
    },
    // Slide 6
    {
      id: 'endless-scroll', // Slide 4
      type: 'text-full',
      title: '👀 Find the right text...',
      note: 'THE CHALLENGE',
      component: AncientLibraryScroll,
      content: `
## Manual Search Process

Imagine searching through endless scrolls...
      `,
      duration: 2,
      speakerNotes: [
        'Show endless scrolling component',
        'Emphasize the challenge of manual search',
        'Set up need for better solution'
      ]
    },
    {
      id: 'did-you-find-it',
      type: 'text-full',
      title: '... did you find it? 🤷',
      note: '',
      component: '',
      content: '',
      duration: 2,
    },
    {
      id: 'data-is-not-enough',
      type: 'text-full',
      title: '☹️ data is not enough...',
      note: '',
      component: '',
      content: '',
      duration: 2,
    },
    {
      id: 'perhaps-we-need-search',
      type: 'text-full',
      title: '🔎 perhaps we need search...',
      note: '',
      component: '',
      content: '',
      duration: 2,
    },
    {
      id: 'ancient-library-search',
      type: 'text-full',
      title: '',
      note: '',
      component: AncientLibrarySearch,
      content: '',
      duration: 2,
    },
    {
      id: 'lets-try-again-2',
      type: 'text-full',
      title: '😩 basic search still leaves us hanging...',
      note: '',
      component: '',
      content: '',
      duration: 2,
    },
    {
      id: 'perhaps-we-need-better-search',
      type: 'text-full',
      title: 'perhaps we need better search...',
      note: '',
      component: '',
      content: '',
      duration: 2,
    },
    // Slide 7
    {
      id: 'enter-sage',
      type: 'image-full',
      title: 'enter the sage',
      note: 'THE SOLUTION',
      component: FullImageSage,
      content: `
## The Ancient Librarian

* Deep knowledge of all texts
* Understanding of context
* Ability to make connections
* Instant access to wisdom
      `,
      image: '/sage.webp',
      duration: 2,
      speakerNotes: [
        'Introduce the concept of the wise guide',
        'Set up parallel with AI assistance',
        'Transition to modern implementation'
      ]
    },
    // Slide 8
    {
      id: 'ancient-parallel',
      type: 'text-full',
      title: 'how to get help...',
      note: 'accessing the sage',
      component: AncientLibraryFlowWrapper,
      content: ''
    },
    // Slide 9
    {
      id: 'so-it-was',
      type: 'text-full',
      title: 'so it was... so it shall be.',
      note: '',
      component: '',
      content: '',
      duration: 2,
    },
    {
      "id": "modern-sage-intro",
      "type": "image-full",
      "title": "the modern sage: vector search & ai",
      "note": "introducing modern intelligence",
      "content": '',
      "component": FullImageSlide,
      "image": "/modern-sage.webp",
      "duration": 2,
      "speakerNotes": [
        "Introduce vector search and AI as the modern-day equivalent of an ancient sage.",
        "Highlight how they navigate and understand complex datasets.",
        "Explain the core attributes of these technologies speed, precision, and adaptability.",
        "Set up a transition into how these tools transform knowledge discovery today."
      ]
    },
    // Slide 10
    {
      id: 'swim-lane-flow',
      type: 'text-full',
      title: 'the modern sage',
      note: 'the solution',
      component: SwimLaneFlow,
      content: '',
      duration: 2,
    },
    {
      id: 'ancient-text-qa',
      type: 'text-full',
      title: '',
      note: '',
      component: AncientTextQA,
      content: '',
      duration: 2,
    },
    // Slide 11
    {
      id: 'missing-peices',
      title: 'the missing link: context, semantic search',
      content: '',
      note: '',
      component: '',
      type: 'text-full',
      duration: 2
    },
    {
      id: 'ai-explanation',
      type: 'text-full',
      title: 'ai explained',
      note: 'ai explanation',
      component: AIExplanationSlide,
      content: '',
      duration: 2,
    },
    // Slide 12
    {
      id: 'ai-vectors',
      type: 'text-full',
      title: '',
      note: '',
      component: AIVectorSlide,
      content: '',
      duration: 2,
    },
    // Slide 13
    {
      id: 'vectors',
      type: 'text-full',
      title: 'so then... what are vectors?',
      note: '',
      component: '',
      content: '',
      duration: 2,
    },
    {
      id: 'embeddings-image',
      type: 'image-full',
      title: 'Array (1536)',
      note: '',
      component: FullImageEmbeddings,
      content: '[0.008, 0.009, 0.010, ...]',
      duration: 2,
    },
    // Slide 14
    {
      id: 'vector-explanation',
      type: 'text-full',
      title: '',
      note: '',
      component: VectorExplanationSlide,
      content: '',
      duration: 2,
    },
    {
      id: 'vector-transformation',
      type: 'text-full',
      title: '',
      note: '',
      component: EmbeddingProcess,
      content: '',
      duration: 2,
    },
    {
      id: 'lets-take-a-look',
      type: 'text-full',
      title: 'where have we seen this before?',
      note: '',
      component: '',
      content: '',
      duration: 2,
    },
    // Slide 15
    // {
    //     id: 'vector-library-search', // Slide 5
    //     type: 'text-full',
    //     title: 'Vector Search in the Library',
    //     note: 'THE SOLUTION',
    //     component: VectorLibrarySearch,
    //     content: '',
    //     duration: 2
    // },
    // Slide 16
    // {
    //   id: 'vector-space',
    //   type: 'text-full',
    //   title: '',
    //   note: '',
    //   component: VectorSpaceVisualization,
    //   content: '',
    //   duration: 2,
    //   speakerNotes: [
    //     'Opening Line: Lets step into the world of intelligence—starting with data. Here, I’m introducing you to the concept of vector space. Imagine a world where every concept, idea, or entity is represented as a point in a multi-dimensional space.',
    //     'Explanation: What youre seeing here is a visualization of how an LLM (Large Language Model) organizes related concepts into a vector space. Each dot represents a concept, like Java, Nike, or Mint, while the proximity between them shows how closely related they are.',
    //     'Engage Audience: Notice how the clusters naturally form based on context. For instance, \'Technology\' concepts like \'Python\' and Java group together, while Places & Geography, like Phoenix and China, form their own distinct neighborhood. This is the power of vectorization—it reveals hidden relationships in your data.',
    //     'This is a 2D representation of a much higher-dimensional space'
    //   ]
    // },
    // Slide 17
    {
      id: 'geo-vector-visualization',
      type: 'text-full',
      title: '2d vector visualization',
      note: '',
      component: GeoVectorVisualization,
      content: '',
      duration: 2,
    },
    {
      id: 'add-vectors-challenge',
      type: 'text-full',
      title: 'the difference...',
      note: '',
      component: '',
      content: `
# Geo Vectors have 2 (or 3) dimensions
- latitude & longitude, altitude
# Text Vectors have 1536, sometimes more dimensions
- each vector is a dimension in the LLM embedding space
      `,
      duration: 2,
    },
    {
      id: 'vector-space-intro',
      type: 'text-full',
      title: '',
      note: '',
      component: Vector3DForce,
      content: '',
      duration: 1,
      speakerNotes: [
        'Welcome everyone! What you\re seeing here is the future of data intelligence.',
        'Each point represents a concept in high-dimensional space',
        'Watch how related concepts naturally cluster together',
        'This is how modern AI systems understand relationships between ideas'
      ]
    },
    {
      id: 'atlas-vector-visualizer',
      type: 'text-full',
      title: '',
      note: '',
      component: AtlasVectorVisualizer,
      content: '',
      duration: 2,
    },
    {
      id: 'atlas-3d-vector-visualizer',
      type: 'text-full',
      title: '',
      note: '',
      component: Atlas3DVisualizer,
      content: '',
      duration: 2,
    },
    // Slide 19
    {
      id: 'vector-search-process',
      type: 'text-full',
      title: '',
      note: '',
      component: VectorSearchProcess,
      content: '',
      duration: 1,
    },
    // Slide 20
    {
      id: 'vector-mechanics', // Slide 7
      type: 'text-full',
      title: '',
      note: '',
      component: EmbeddingVisualizer,
      content: '',
      duration: 1.5,
      speakerNotes: [
        'Let\'s demystify vector search',
        'Text/images → vectors → semantic meaning',
        'Show live transformation process',
        'Explain why this matters for real applications'
      ]
    },
    // Slide 21
    {
      id: 'text-search-demo',
      type: 'text-full',
      title: '',
      note: '',
      component: TextSearchDemo,
      content: '',
      duration: 1,
    },
    {
      id: 'code-comparison', // Slide 8
      type: 'text-full',
      title: '',
      note: '',
      component: CodeComparison,
      content: '',
      duration: 1.5,
      speakerNotes: [
        'Direct comparison of approaches',
        'Note the query complexity vs capabilities',
        'Performance implications',
        'When to use each approach'
      ]
    },

    // Slide 22
    {
      id: 'vector-search-setup', // Slide 9
      type: 'text-full',
      title: 'Setting Up Vector Search',
      note: 'IMPLEMENTATION',
      component: DataFlowAnimation,
      content: `
## Vector Search Setup

\`\`\`javascript
// Create vector search index
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
        'Step-by-step implementation guide',
        'Focus on key configuration options',
        'Common pitfalls to avoid',
        'Best practices for production'
      ]
    },
    // Slide 23
    {
      id: 'live-demo', // Slide 10
      type: 'text-full',
      title: '',
      note: '',
      component: VectorSearchDemo2,
      content: '',
      duration: 2,
      speakerNotes: [
        'Live demo of vector search capabilities',
        'Show real-time semantic matching',
        'Demonstrate similarity thresholds',
        'Interactive exploration of results'
      ]
    },
    // Slide 24
    {
      id: 'semantic-search',
      type: 'text-full',
      title: 'Semantic Search Explained',
      note: 'SEMANTIC SEARCH',
      component: SemanticSearchExplained,
      content: '',
      duration: 2,
    },
    // Slide 25
    {
      id: 'search-comparison',
      type: 'text-full',
      title: 'Search Approaches Compared',
      component: SearchComparison,
      content: '',
      duration: 2,
      note: 'SEARCH COMPARISON',
      speakerNotes: [
        'Real-world comparison of search approaches',
        'Performance metrics and trade-offs',
        'When to use each type of search',
        'Impact on user experience'
      ]
    },
    // Slide 26
    {
      "id": "semantic-search-intro",
      "type": "split",
      "title": "What Is Semantic Search?",
      "note": "INTRODUCTION TO SEMANTIC SEARCH",
      "content": `
## Semantic Search Explained

- **Definition**: A search method that understands the intent and contextual meaning of queries, not just keywords.
- **How It Works**: Leverages AI and natural language understanding to match queries with relevant content, even if exact terms differ.
- **Difference from Vector Search**:
  - **Vector Search**: Matches based on proximity in vector space (numerical similarity).
  - **Semantic Search**: Adds an additional layer of meaning, intent, and contextual relevance.
- **Use Case**: Asking "What are the health benefits of apples?" retrieves articles about nutrition, not random mentions of "apples."

> Semantic search = Vector search + Contextual understanding.
    `,
      "image": "/semantic-search.png",
      "duration": 2,
      "speakerNotes": [
        "Introduce semantic search as an evolution of traditional search techniques.",
        "Explain how it combines the power of vectors with deeper language understanding.",
        "Use a practical example to clarify the difference.",
        "Highlight how semantic search aligns with user intent for more accurate and meaningful results."
      ]
    },

    // Slide 28
    {
      id: 'quick-start', // Slide 11
      type: 'split',
      title: 'Start Building',
      note: 'NEXT STEPS',
      content: `
## Quick Start Guide

1. Create M10+ cluster
2. Enable vector search
3. Install dependencies
4. Generate embeddings
5. Create indexes
6. Build awesome apps!

Clone starter repo:
github.com/mongodb-developer/vector-search-starter
      `,
      image: '/getting-started.png',
      duration: 2,
      speakerNotes: [
        'Concrete next steps for implementation',
        'Resource links and documentation',
        'Community support channels',
        'Call to action: Transform your apps with AI power'
      ]
    },
    {
      id: 'vector-search-wizard',
      type: 'text-full',
      title: '',
      note: '',
      component: VectorSearchWizard,
      content: '',
      duration: 2,
    },
    {
      id: 'atlas-cluster-setup',
      type: 'text-full',
      title: '',
      note: '',
      component: AtlasClusterSetup,
      content: '',
      duration: 2,
    },
    {
      id: 'atlas-cluster-setup-qr',
      type: 'image-full',
      image: '/qr.png',
      title: 'Get Started with MongoDB Atlas',
      note: '',
      component: '',
      content: '',
      duration: 2,
    }
  ]
};

export default vectorSearchPresentation;
const presentationSlides = [
    {
      id: 'hand',
      title: 'Welcome',
      content: 'From Data to Intelligence',
      note: 'Michael Lynn',
      image: '/slide1.png'
    },
    {
      id: 'definition',
      title: 'Data',
      content: `
  ## Definition
  Raw, unprocessed facts and figures without context or meaning.
  
  ### Characteristics
  - Data is the building block for knowledge and intelligence
  - It can be numbers, text, measurements, or observations
  - Raw data requires processing to be meaningful
  
  ### Purpose
  - It serves as input to be processed into meaningful insights
  - Forms the foundation for all analytical processes
  
  ### Role in Decision-Making
  - Limited utility unless organized and contextualized
  - Becomes valuable through proper analysis and interpretation
  
  > "Data is the new oil of the digital economy"
      `,
      image: '/data.webp'
    },
    {
      id: 'knowledge',
      title: 'Knowledge',
      content: `
  ## Definition
  Information that has been processed and contextualized to provide meaning and context.
  
  ### Characteristics
  - Knowledge is derived from data
  - It is organized and structured to support decision-making
  - It can be expressed in various forms, including text, numbers, and visualizations
  
  ### Purpose
  - It serves as input to be processed into meaningful insights
  - Forms the foundation for all analytical processes
  
  ### Role in Decision-Making
  - It is essential for making informed decisions
  - It can be used to predict outcomes and trends
  - It is a key driver of competitive advantage
  
  > "Knowledge is power"
      `,
      image: '/knowledge.webp'
    },
    {
      id: 'intelligence',
      title: 'Intelligence',
      content: `
  ## Definition
  The ability to learn, understand, and apply knowledge to make decisions and solve problems.
  
  ### Characteristics
  - Intelligence is the ability to learn and adapt
  - It is a complex process that involves multiple cognitive functions
  - It can be expressed in various forms, including text, numbers, and visualizations

  ### Purpose
  - It serves as input to be processed into meaningful insights
  - Forms the foundation for all analytical processes
  
  ### Role in Decision-Making
  - It is essential for making informed decisions
  - It can be used to predict outcomes and trends
  - It is a key driver of competitive advantage
      `,
      image: '/intelligence.webp'
    },
    {
      id: 'library',
      title: 'Library of Alexandria',
      content: `
## Center of Learning
The library was a collection of books and scrolls that were stored in the Library of Alexandria, a library that was built in the city of Alexandria, Egypt. The library was founded in the 3rd century BC and was one of the largest libraries in the world at the time. The library contained over 700,000 scrolls and books, and was home to many scholars and researchers.
      `,
      note: 'Example',
      image: '/library.png'
    },
    {
      id: 'challenge',
      title: 'The Challenge',
      content: 'Finding the right information quickly and effectively in vast datasets',
      note: 'The Problem',
      component: DataExplorer
    },
    {
      id: 'journey',
      title: 'The Journey',
      content: 'From basic search to vector search to semantic search, unlocking intelligence with LLMs',
      note: 'The Evolution',
      component: SearchEvolution
    },
    {
      id: 'mongodb',
      title: 'MongoDB: The Modern Library',
      content: 'Every product in the catalog is a data point in this vast collection',
      note: 'Data Setup',
      image: '/slide4.png',
      component: SearchJourney
    },
    {
      id: 'basic',
      title: 'The Librarian',
      content: 'Basic search using regex - finding exact matches in our digital library',
      note: 'Basic Search',
      image: '/slide5.png',
      component: AncientLibraryScroll
    },
    {
      id: 'vector',
      title: 'The Scholar',
      content: 'Vector search understands context and relationships between concepts',
      note: 'Vector Search',
      image: '/slide6.png',
      component: AncientLibrarySearch
    },
    {
      id: 'semantic',
      title: 'The Philosopher',
      content: 'Semantic search with LLMs provides intelligent answers to complex queries',
      note: 'Semantic Search',
      image: '/slide7.png',
      component: AncientLibraryAutocomplete
    },
    {
      id: 'conclusion',
      title: 'The Evolution',
      content: 'From finding data to discovering insights to unlocking intelligence',
      note: 'Conclusion',
      image: '/slide8.png',
      component: VectorLibrarySearch
    },
    {
      id: 'thesage',
      title: 'The Sage',
      content: 'The Sage uses a combination of vector search and semantic search to provide intelligent answers to complex queries',
      note: 'The Sage',
      image: '/slide8.png',
      component: AncientTextQA
    },
    {
      id: 'evolution-agents',
      title: 'The Evolution - Agents',
      content: 'Agents are the next frontier in search. They can be used to automate complex workflows, such as finding the best product to buy based on a user\'s query.',
      note: 'Agents',
      image: '/atlas_vector_search.png',
      component: AIAgentDashboard
    },
    {
      id: 'operational-data',
      type: 'text-full',
      title: 'MongoDB as an Operational Database',
      note: 'THE FOUNDATION',
      content: `
  ## Traditional Document Model
  
  MongoDB excels at storing and retrieving operational data in its natural form:
  
  \`\`\`javascript
  // Product Document
  {
    _id: ObjectId("..."),
    name: "Premium Coffee Maker",
    price: 299.99,
    category: "Appliances",
    description: "Professional-grade coffee maker with precision brewing",
    specifications: {
      capacity: "12 cups",
      warranty: "2 years",
      dimensions: "12x8x15 inches"
    },
    reviews: [
      { rating: 5, comment: "Perfect coffee every time" },
      { rating: 4, comment: "Great features but slightly complex" }
    ]
  }
  \`\`\`
  
  ## Traditional Query Capabilities
  
  * **Exact Matches**: \`db.products.find({ category: "Appliances" })\`
  * **Range Queries**: \`db.products.find({ price: { $lt: 500 } })\`
  * **Text Search**: \`db.products.find({ $text: { $search: "coffee maker" } })\`
  
  > But what if we want to understand the *meaning* behind our data?
  `
    },
    {
      id: 'atlas-search',
      type: 'text-full',
      title: 'Enhanced Understanding with Atlas Search',
      note: 'FIRST EVOLUTION',
      content: `## Beyond Basic Text Search
    
Atlas Search introduces sophisticated text analysis:
    
\`\`\`javascript
    // Advanced Text Search Index
    {
      "mappings": {
        "dynamic": true,
        "fields": {
          "description": {
            "type": "string",
            "analyzer": "lucene.standard",
            "searchAnalyzer": "lucene.standard"
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
    
  * *Fuzzy Matching*: Handles typos and misspellings
  * *Synonyms*: Understands related terms
  * *Relevance Scoring*: Returns results by importance
  * *Faceted Search*: Enables dynamic filtering
  
  > Atlas Search bridges the gap between basic queries and semantic understanding
  `
    },
    {
      id: 'vector-search',
      type: 'text-full',
      title: 'Semantic Understanding with Vector Search',
      note: 'The Power of Embeddings',
      content: `
## Vector Search Architecture
    
Transforming text into meaningful vectors:
    
\`\`\`javascript
    // Document with Vector Embeddings
    {
      _id: ObjectId("..."),
      name: "Premium Coffee Maker",
      description: "Professional-grade coffee maker...",
      // Generated by AI model
      embedding: [0.123, -0.456, 0.789, ...], // 1,536 dimensions
      description_embedding: [0.234, 0.567, -0.890, ...],
      category_embedding: [0.345, -0.678, 0.901, ...]
    }
    
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
    \`\`\`
    
## Semantic Queries
Find products based on meaning, not just keywords:
    
  \`\`\`javascript
  db.products.aggregate([
    {
      $vectorSearch: {
        queryVector: generateEmbedding("something to make great espresso"),
        path: "description_embedding",
        numCandidates: 100,
        limit: 10
      }
    }
  ])
  \`\`\`
    
  > Vector search enables understanding of intent and context`
    },
    {
      id: 'ai-integration',
      type: 'text-full',
      title: 'Integrating AI with MongoDB',
      note: 'The Intelligence Layer',
      content: `
## AI-Powered Applications
    
  Combining operational data with AI capabilities:

### 1. Generate embeddings for natural language query

  \`\`\`javascript
  const userQuery = "I need a coffee maker that's easy to clean and makes great lattes";
  const queryEmbedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: userQuery
  });
  \`\`\`

### 2. Semantic search with context

  \`\`\`javascript
  const results = await db.products.aggregate([
    {
      $vectorSearch: {
        queryVector: queryEmbedding.data[0].embedding,
        path: "description_embedding",
        numCandidates: 100,
        limit: 5
      }
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "product_id",
        as: "reviews"
      }
    }
  ]);
  \`\`\`

### 3. Generate personalized response

  \`\`\`javascript
  const systemPrompt = \`You are a helpful shopping assistant. 
  Use the product data and reviews to make a recommendation.
  Format response in markdown.\`;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: formatContext(userQuery, results) }
    ]
  });
  \`\`\`
  
  ## Key Capabilities
  * *Natural Language Understanding*
  * *Context-Aware Recommendations*
  * *Personalized Responses*
  * *Intelligent Query Processing*
  
  > MongoDB becomes not just a data store, but an intelligent application platform
  `
    },
    {
      id: 'practical-applications',
      type: 'text-full',
      title: 'Practical Applications',
      note: 'Putting It All Together',
      content: `
  # Real-World Use Cases
  
  ## 1. Intelligent Product Search
  - Natural language product discovery
  - Visual similarity search
  - Semantic recommendations
  
  ## 2. Customer Support
  - Automatic ticket routing
  - Context-aware response generation
  - Knowledge base integration
  
  ## 3. Content Management
  - Semantic content organization
  - Automated tagging
  - Related content discovery
  
  ## 4. Financial Services
  - Risk analysis
  - Fraud detection
  - Document processing
  
  ## Implementation Strategy
  
  1. **Start with Structure**
      - Organize operational data
      - Define clear schema
      - Implement basic indexing
  
  2. **Add Search Intelligence**
      - Deploy Atlas Search
      - Configure analyzers
      - Implement faceted search
  
  3. **Integrate Vectors**
      - Generate embeddings
      - Create vector indexes
      - Implement similarity search
  
  4. **Layer in AI**
      - Connect to AI services
      - Implement embedding generation
      - Add LLM integration
  
  > "The journey from data to intelligence is not a destination, but a continuous evolution"
    `
    },
    {
      id: 'basic-search-flow',
      type: 'text-full',
      title: 'MongoDB Basic Search',
      note: 'QUERY EXECUTION',
      component: MongoDBBasicSearchWrapper,
      content: ''
    },

    {
      id: 'data-flow',
      type: 'text-full',
      title: 'Data Flow Architecture',
      note: 'SYSTEM OVERVIEW',
      component: DataFlowAnimationWrapper,
      content: '' // Empty content since we're using a component
    },
    {
      id: 'data-swimlane',
      type: 'text-full',
      title: 'Data Flow Architecture',
      note: 'SYSTEM OVERVIEW',
      component: SwimlaneFlowWrapper,
      content: '' // Empty content since we're using a component
    },
    {
      id: 'ancient-library',
      type: 'text-full',
      title: 'Ancient Library',
      note: 'SYSTEM OVERVIEW',
      component: AncientLibraryFlowWrapper,
      content: '' // Empty content since we're using a component
    },
    {
      id: 'code-example',
      title: 'MongoDB Query',
      content: `
  ## Vector Search Example
  
  Here's how we perform vector search in MongoDB:
  
  \`\`\`javascript
  db.products.aggregate([
    {
      $vectorSearch: {
        queryVector: embedding,
        path: "description_vector",
        numCandidates: 100,
        limit: 10
      }
    }
  ])
  \`\`\`
  
  **Key Features:**
  - Semantic understanding
  - Fast similarity search
  - Scalable architecture
      `
    },
  ];
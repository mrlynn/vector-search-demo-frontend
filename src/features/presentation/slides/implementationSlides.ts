// src/features/presentation/slides/implementationSlides.ts
import { SlideSection } from '../types/slideTypes';

export const implementationSection: SlideSection = {
  id: 'implementation',
  title: 'Building AI-Powered Applications',
  description: 'Practical implementation of vector search with MongoDB and AWS',
  duration: 20,
  learningObjectives: [
    'Set up MongoDB Atlas vector search',
    'Integrate with AWS Bedrock',
    'Build a complete search application',
    'Implement best practices for production'
  ],
  keyTakeaways: [
    'Vector search implementation is straightforward',
    'AWS integration enhances capabilities',
    'Performance optimization is crucial',
    'Monitoring ensures reliability'
  ],
  slides: [
    {
      id: 'setup-overview',
      type: 'text-full',
      title: 'Setting Up Vector Search',
      note: 'GETTING STARTED',
      content: `
## Implementation Steps

1. **Set Up MongoDB Atlas**
   - Create M10+ cluster
   - Enable vector search
   - Configure network access

2. **AWS Configuration**
   - Set up Bedrock access
   - Configure authentication
   - Choose embedding model

3. **Application Setup**
   - Initialize MongoDB client
   - Set up AWS SDK
   - Configure environment

> "Let's build this together..."
      `,
      duration: 3,
      speakerNotes: [
        'Walk through each setup step',
        'Mention common pitfalls',
        'Share best practices'
      ]
    },
    {
      id: 'vector-index-setup',
      type: 'text-full',
      title: 'Vector Index Configuration',
      note: 'INDEX SETUP',
      content: `
## Creating Vector Indexes

\`\`\`javascript
// Vector Search Index Definition
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "embedding": {
        "type": "knnVector",
        "dimensions": 1536,
        "similarity": "cosine"
      },
      "metadata": {
        "type": "document"
      }
    }
  }
}

// Index Creation Command
db.createSearchIndex({
  name: "vector_index",
  definition: {
    // Index definition here
  }
})
\`\`\`

### Configuration Options
- Index types and dimensions
- Similarity metrics
- Dynamic mapping
- Compound indexes
      `,
      duration: 4,
      speakerNotes: [
        'Explain index configuration options',
        'Discuss dimension choices',
        'Cover similarity metrics'
      ]
    },
    {
      id: 'aws-integration',
      type: 'text-full',
      title: 'AWS Bedrock Integration',
      note: 'AWS SETUP',
      content: `
    ## Integrating with AWS Bedrock
    
    \`\`\`python
    import boto3
    from pymongo import MongoClient
    from typing import List, Dict, Any
    
    class VectorSearchService:
        def __init__(self):
            self.bedrock = boto3.client(
                service_name='bedrock-runtime',
                region_name='us-east-1'
            )
            self.mongo_client = MongoClient('mongodb+srv://<connection_string>')
            self.db = self.mongo_client.your_database
    
        async def generate_embedding(self, text: str) -> List[float]:
            response = self.bedrock.invoke_model(
                modelId='amazon.titan-embed-text-v1',
                body=json.dumps({
                    'inputText': text
                })
            )
            return json.loads(response['body'].read())['embedding']
    
        async def store_document(
            self, 
            text: str, 
            metadata: Dict[str, Any] = None
        ) -> str:
            embedding = await self.generate_embedding(text)
            doc = {
                'text': text,
                'embedding': embedding,
                'metadata': metadata or {},
                'created_at': datetime.utcnow()
            }
            result = await self.db.documents.insert_one(doc)
            return str(result.inserted_id)
    
        async def search_similar(
            self, 
            query: str, 
            limit: int = 10, 
            min_score: float = 0.7
        ) -> List[Dict]:
            query_embedding = await self.generate_embedding(query)
            
            results = await self.db.documents.aggregate([
                {
                    '$vectorSearch': {
                        'queryVector': query_embedding,
                        'path': 'embedding',
                        'numCandidates': limit * 10,
                        'limit': limit,
                        'index': 'vector_index',
                        'minScore': min_score
                    }
                },
                {
                    '$project': {
                        'text': 1,
                        'metadata': 1,
                        'score': { '$meta': 'vectorSearchScore' }
                    }
                }
            ]).to_list(length=limit)
            
            return results
    \`\`\`
    
    ### Key Integration Points
    - AWS Authentication
    - Error Handling
    - Rate Limiting
    - Connection Pooling
    
    > "Proper integration is key to production readiness"
      `,
      duration: 5,
      speakerNotes: [
        'Walk through the service class implementation',
        'Highlight error handling considerations',
        'Discuss rate limiting and quotas',
        'Mention connection pooling importance'
      ]
    },
    {
      id: 'api-implementation',
      type: 'text-full',
      title: 'Building the API Layer',
      note: 'API DEVELOPMENT',
      content: `
    ## FastAPI Implementation
    
    \`\`\`python
    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel
    from typing import List, Optional
    
    app = FastAPI()
    vector_service = VectorSearchService()
    
    class SearchRequest(BaseModel):
        query: str
        limit: Optional[int] = 10
        min_score: Optional[float] = 0.7
        filters: Optional[dict] = None
    
    class DocumentInput(BaseModel):
        text: str
        metadata: Optional[dict] = None
    
    @app.post("/search")
    async def semantic_search(request: SearchRequest):
        try:
            results = await vector_service.search_similar(
                query=request.query,
                limit=request.limit,
                min_score=request.min_score
            )
            
            if request.filters:
                results = [
                    r for r in results 
                    if all(
                        r['metadata'].get(k) == v 
                        for k, v in request.filters.items()
                    )
                ]
            
            return {
                'results': results,
                'count': len(results),
                'query': request.query
            }
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Search failed: {str(e)}"
            )
    
    @app.post("/documents")
    async def store_document(document: DocumentInput):
        try:
            doc_id = await vector_service.store_document(
                text=document.text,
                metadata=document.metadata
            )
            return {'id': doc_id, 'status': 'success'}
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Document storage failed: {str(e)}"
            )
    
    @app.get("/health")
    async def health_check():
        return {
            'status': 'healthy',
            'vector_service': await vector_service.check_health(),
            'timestamp': datetime.utcnow()
        }
    \`\`\`
    
    ### API Features
    - Type validation with Pydantic
    - Error handling and status codes
    - Health checks
    - Filtering capabilities
      `,
      duration: 4,
      speakerNotes: [
        'Demonstrate the API endpoints',
        'Show request/response flow',
        'Discuss validation and error handling',
        'Mention monitoring considerations'
      ]
    },
    {
      id: 'performance-optimization',
      type: 'text-full',
      title: 'Performance Optimization',
      note: 'OPTIMIZATION',
      content: `
    ## Optimizing Vector Search
    
    ### 1. Index Configuration
    \`\`\`javascript
    // Optimized Vector Index
    {
      "mappings": {
        "dynamic": true,
        "fields": {
          "embedding": {
            "type": "knnVector",
            "dimensions": 1536,
            "similarity": "cosine"
          },
          // Add regular indexes for filtering
          "metadata.category": { "type": "keyword" },
          "metadata.date": { "type": "date" },
          "metadata.tags": { "type": "keyword" }
        }
      }
    }
    \`\`\`
    
    ### 2. Query Optimization
    \`\`\`javascript
    // Efficient Vector Search with Filters
    db.collection.aggregate([
      {
        '$search': {
          'compound': {
            'must': [{
              'vectorSearch': {
                'queryVector': embedding,
                'path': 'embedding',
                'numCandidates': 100
              }
            }],
            'filter': [{
              'equals': {
                'path': 'metadata.category',
                'value': 'technology'
              }
            }]
          }
        }
      },
      {
        '$limit': 10
      },
      {
        '$project': {
          'score': { '$meta': 'searchScore' },
          'text': 1,
          'metadata': 1
        }
      }
    ])
    \`\`\`
    
    ### Best Practices
    - Cache frequent queries
    - Batch embedding generation
    - Use appropriate numCandidates
    - Implement connection pooling
    - Add request timeout handling
    - Monitor performance metrics
    
    ### Performance Metrics
    - Latency percentiles (p95, p99)
    - Query throughput
    - Cache hit rates
    - Error rates
    - Resource utilization
      `,
      duration: 4,
      speakerNotes: [
        'Discuss performance considerations',
        'Show optimization techniques',
        'Share monitoring strategies',
        'Provide benchmark examples'
      ]
    },
    {
      id: 'deployment-monitoring',
      type: 'text-full',
      title: 'Deployment & Monitoring',
      note: 'OPERATIONS',
      content: `
    ## Production Deployment
    
    ### 1. Monitoring Setup
    \`\`\`python
    from prometheus_client import Counter, Histogram
    from functools import wraps
    import time
    
    # Metrics
    SEARCH_LATENCY = Histogram(
        'vector_search_latency_seconds',
        'Time spent processing vector search requests',
        buckets=[0.1, 0.5, 1.0, 2.0, 5.0]
    )
    
    SEARCH_REQUESTS = Counter(
        'vector_search_requests_total',
        'Total number of vector search requests',
        ['status']
    )
    
    def monitor_search(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                SEARCH_REQUESTS.labels(status='success').inc()
                return result
            except Exception as e:
                SEARCH_REQUESTS.labels(status='error').inc()
                raise
            finally:
                SEARCH_LATENCY.observe(time.time() - start_time)
        return wrapper
    \`\`\`
    
    ### 2. Error Handling
    \`\`\`python
    class SearchError(Exception):
        def __init__(self, message: str, status_code: int = 500):
            self.message = message
            self.status_code = status_code
            super().__init__(self.message)
    
    @app.exception_handler(SearchError)
    async def search_error_handler(request, exc):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                'error': exc.message,
                'status_code': exc.status_code,
                'timestamp': datetime.utcnow().isoformat()
            }
        )
    \`\`\`
    
    ### 3. Health Checks
    - MongoDB connection status
    - AWS service availability
    - API endpoint health
    - Resource utilization
    - Error rates and latencies
    
    ### 4. Alerting Rules
    - High latency (p95 > 2s)
    - Error rate spike (>1%)
    - Low cache hit rate (<50%)
    - Resource constraints
    - Authentication failures
    
    ### 5. Deployment Checklist
    ✓ Load testing completed
    ✓ Monitoring configured
    ✓ Alerts set up
    ✓ Backup strategy defined
    ✓ Rollback plan documented
    ✓ Security review completed
      `,
      duration: 4,
      speakerNotes: [
        'Emphasize importance of monitoring',
        'Show real-world metrics setup',
        'Discuss alert thresholds',
        'Share deployment best practices'
      ]
    }
    
  ]
};

export default implementationSection.slides;
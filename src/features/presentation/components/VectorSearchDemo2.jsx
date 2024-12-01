import React, { useState } from 'react';
import { Search, Sigma, Code2, ClipboardCopy } from 'lucide-react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-medium">MongoDB Vector Search Query</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};


const VectorSearchDemo2 = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [similarity, setSimilarity] = useState(0.0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const generateMongoDBQuery = () => {
        const queryVector = getQueryVector(searchQuery);

        return {
            query: `db.articles.aggregate([
  {
    $vectorSearch: {
      index: "content_embedding",
      path: "embedding",
      queryVector: ${JSON.stringify(queryVector)},
      numCandidates: 100,
      limit: 10
      ${similarity > 0 ? `,\n      scoreThreshold: ${similarity / 100}` : ''}
    }
  },
  {
    $project: {
      title: 1,
      text: 1,
      score: { $meta: "vectorSearchScore" }
    }
  }
])`,
            explanation: {
                index: "Name of the vector search index",
                path: "Field containing the document vectors",
                queryVector: "Vector representation of the search query",
                numCandidates: "Number of candidates to consider",
                limit: "Maximum number of results to return",
                scoreThreshold: "Minimum similarity score (0-1)",
                project: "Fields to include in results"
            }
        };
    };

    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      };

    const documents = [
        {
            id: 1,
            text: "MongoDB aggregation pipeline tutorial",
            vector: [0.8, 0.6],
            tags: ["database", "tutorial"]
        },
        {
            id: 2,
            text: "Guide to NoSQL databases",
            vector: [0.7, 0.5],
            tags: ["database", "guide"]
        },
        {
            id: 3,
            text: "Building scalable applications",
            vector: [0.4, 0.8],
            tags: ["architecture", "scalability"]
        },
        {
            id: 4,
            text: "Microservices design patterns",
            vector: [0.3, 0.9],
            tags: ["architecture", "patterns"]
        },
        {
            id: 5,
            text: "JavaScript performance optimization",
            vector: [0.2, 0.3],
            tags: ["javascript", "performance"]
        }
    ];

    const getQueryVector = (query) => {
        if (query.toLowerCase().includes('database')) return [0.75, 0.55];
        if (query.toLowerCase().includes('architecture')) return [0.35, 0.85];
        if (query.toLowerCase().includes('javascript')) return [0.2, 0.25];
        if (query.toLowerCase().includes('microservice')) return [0.3, 0.9];
        return [0.5, 0.5];
    };

    const cosineSimilarity = (vecA, vecB) => {
        const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
        const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
        const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
        return dotProduct / (normA * normB);
    };

    const getSearchResults = () => {
        if (!searchQuery) return [];
        const queryVector = getQueryVector(searchQuery);
        return documents
            .map(doc => ({
                ...doc,
                similarity: cosineSimilarity(queryVector, doc.vector) * 100
            }))
            .filter(doc => doc.similarity >= similarity)
            .sort((a, b) => b.similarity - a.similarity);
    };

    const results = getSearchResults();
    const queryVector = getQueryVector(searchQuery);

    return (
        <div className="w-full max-w-5xl mx-auto p-4 space-y-6 bg-black text-white">

            {/* Main visualization card */}
            <div className="bg-white rounded-xl shadow-lg text-black">
                <div className="flex items-center gap-2 p-4 border-b">
                    <Sigma className="w-5 h-5" />
                    <h2 className="text-lg font-medium">Vector Search Visualization</h2>
                </div>
                <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            <Code2 className="w-4 h-4" />
            View Query
          </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    {/* Vector Space Visualization */}
                    <div className="relative aspect-square bg-gray-50 rounded-lg">
                        <div className="absolute inset-0">
                            <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
                                {/* Grid lines */}
                                <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.5" />
                                <line x1="50" y1="0" x2="50" y2="100" stroke="#e5e7eb" strokeWidth="0.5" />
                                {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map(tick => (
  <g key={`x-tick-${tick}`}>
    <line 
      x1={tick * 100} 
      y1="49" 
      x2={tick * 100} 
      y2="51" 
      stroke="#94a3b8" 
      strokeWidth="0.5"
    />
    <text 
      x={tick * 100} 
      y="56" 
      textAnchor="middle" 
      className="text-[3px] fill-gray-500"
    >
      {tick.toFixed(1)}
    </text>
  </g>
))}

{/* Y-axis ticks and labels */}
{[0, 0.2, 0.4, 0.6, 0.8, 1.0].map(tick => (
  <g key={`y-tick-${tick}`}>
    <line 
      x1="49" 
      y1={100 - tick * 100} 
      x2="51" 
      y2={100 - tick * 100} 
      stroke="#94a3b8" 
      strokeWidth="0.5"
    />
    <text 
      x="44" 
      y={100 - tick * 100} 
      textAnchor="end" 
      dominantBaseline="middle" 
      className="text-[3px] fill-gray-500"
    >
      {tick.toFixed(1)}
    </text>
  </g>
))}

{/* Axis labels */}
<text 
  x="50" 
  y="65" 
  textAnchor="middle" 
  className="text-[4px] fill-gray-600 font-medium"
>
  Y
</text>
<text 
  x="35" 
  y="50" 
  textAnchor="middle" 
  transform="rotate(-90, 35, 50)" 
  className="text-[4px] fill-gray-600 font-medium"
>
  X
</text>

{/* Grid lines with lighter color */}
{[0.2, 0.4, 0.6, 0.8].map(tick => (
  <g key={`grid-${tick}`}>
    <line 
      x1={tick * 100} 
      y1="0" 
      x2={tick * 100} 
      y2="100" 
      stroke="#e5e7eb" 
      strokeWidth="0.25" 
      strokeDasharray="2,2"
    />
    <line 
      x1="0" 
      y1={100 - tick * 100} 
      x2="100" 
      y2={100 - tick * 100} 
      stroke="#e5e7eb" 
      strokeWidth="0.25" 
      strokeDasharray="2,2"
    />
  </g>
))}
                                {/* Document vectors */}
                                {documents.map(doc => (
                                    <g key={doc.id}>
                                        <text
                                            x={doc.vector[0] * 100}
                                            y={100 - doc.vector[1] * 100 - 8}
                                            className="text-[4px] fill-gray-600"
                                            textAnchor="middle"
                                        >
                                            {doc.text.slice(0, 16)}...
                                        </text>
                                        <circle
                                            cx={doc.vector[0] * 100}
                                            cy={100 - doc.vector[1] * 100}
                                            r="4"
                                            fill={results.find(r => r.id === doc.id) ? "#3b82f6" : "#94a3b8"}
                                            className="transition-all duration-300"
                                        />

                                    </g>
                                ))}

                                {/* Query vector */}
                                {searchQuery && (
                                    <>
                                        <circle
                                            cx={queryVector[0] * 100}
                                            cy={100 - queryVector[1] * 100}
                                            r="5"
                                            fill="#dc2626"
                                        />
                                        <circle
                                            cx={queryVector[0] * 100}
                                            cy={100 - queryVector[1] * 100}
                                            r={similarity * 0.4}
                                            fill="none"
                                            stroke="#dc2626"
                                            strokeWidth="1"
                                            strokeDasharray="4"
                                            className="opacity-50"
                                        />
                                    </>
                                )}
                            </svg>
                        </div>
                    </div>

                    {/* Controls and Results */}
                    <div className="space-y-6">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Try: database, architecture, javascript, microservices"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Similarity Threshold */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Similarity Threshold:</span>
                                <span className="text-sm font-medium">{similarity.toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                value={similarity}
                                onChange={(e) => setSimilarity(parseFloat(e.target.value))}
                                min="0"
                                max="100"
                                step="0.1"
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        {/* Results */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Search Results:</h3>
                            <div className="space-y-1">
                                {results.map(doc => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg"
                                    >
                                        <span className="text-sm">{doc.text}</span>
                                        <span className="text-sm text-gray-500 ml-4">
                                            {doc.similarity.toFixed(1)}%
                                        </span>
                                    </div>
                                ))}
                                {searchQuery && results.length === 0 && (
                                    <p className="text-sm text-gray-500 p-2">No results match the similarity threshold</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Educational cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-4 text-black">
                    <h3 className="text-sm font-medium mb-2">Vector Embeddings</h3>
                    <p className="text-sm text-gray-600">
                        Documents and queries are converted to vector representations (embeddings) that capture semantic meaning. Similar concepts are closer in vector space.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 text-black">
                    <h3 className="text-sm font-medium mb-2">Similarity Search</h3>
                    <p className="text-sm text-gray-600">
                        Vector search finds documents by measuring the distance/similarity between vectors, rather than exact keyword matching.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 text-black">
                    <h3 className="text-sm font-medium mb-2">Threshold Control</h3>
                    <p className="text-sm text-gray-600">
                        Adjust the similarity threshold to control how closely results must match the query vector to be included in results.
                    </p>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className="space-y-4">
        <p className="text-sm text-black mb-4">
          Current search as a MongoDB vector search query:
        </p>
        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            {generateMongoDBQuery().query}
          </pre>
          <button
            onClick={() => copyToClipboard(generateMongoDBQuery().query)}
            className="absolute top-2 right-2 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            title="Copy to clipboard"
          >
            <ClipboardCopy className="w-4 h-4 text-gray-300" />
          </button>
          {copied && (
            <span className="absolute top-2 right-12 text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded">
              Copied!
            </span>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p className="font-medium mb-2">Query Parameters:</p>
          <ul className="list-disc pl-4 space-y-2">
            {Object.entries(generateMongoDBQuery().explanation).map(([key, value]) => (
              <li key={key}>
                <code className="text-blue-600">{key}</code>: {value}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This query uses the new <code>$vectorSearch</code> operator, 
            which offers improved performance and additional features compared to the previous 
            <code>$knnBeta</code> syntax.
          </p>
        </div>
      </div>
    </Modal>
        </div>
    );
};

export default VectorSearchDemo2;
import React, { useState } from 'react';
import { Search, Loader, ArrowRight } from 'lucide-react';

const VectorSearchDemo = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);

  // Sample product database
  const sampleProducts = [
    {
      id: 1,
      name: "Leather Jacket",
      description: "Classic black leather motorcycle jacket",
      category: "outerwear",
      vector_score: 0.92
    },
    {
      id: 2,
      name: "Denim Vest",
      description: "Rugged blue denim vest with brass buttons",
      category: "outerwear",
      vector_score: 0.85
    },
    {
      id: 3,
      name: "Biker Boots",
      description: "Heavy-duty leather boots with steel toe",
      category: "footwear",
      vector_score: 0.78
    }
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate vector search results
    const vectorResults = sampleProducts
      .map(product => ({
        ...product,
        score: Math.random() * (0.95 - 0.75) + 0.75
      }))
      .sort((a, b) => b.score - a.score);

    setResults({
      traditional: sampleProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      ),
      vector: vectorResults
    });
    
    setIsSearching(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[500px] overflow-y-auto bg-white rounded-lg shadow-sm p-6">
      {/* Search Input */}
      <div className="sticky top-0 bg-white z-10 pb-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try searching for 'rugged leather outerwear' or 'motorcycle gear'"
              className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          <button
            onClick={handleSearch}
            disabled={!query || isSearching}
            className={`px-6 py-2 rounded-lg transition-all ${
              !query || isSearching
                ? 'bg-gray-100 text-gray-400'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isSearching ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>

      {/* Results Comparison */}
      {results && (
        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Traditional Search Results */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-600" />
              Traditional Search
              <span className="text-sm font-normal text-gray-500">
                ({results.traditional.length} results)
              </span>
            </h3>
            {results.traditional.length === 0 ? (
              <p className="text-gray-500 text-sm">No exact matches found</p>
            ) : (
              <div className="space-y-3">
                {results.traditional.map(product => (
                  <div key={product.id} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Category: {product.category}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vector Search Results */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-blue-500" />
              Vector Search
              <span className="text-sm font-normal text-gray-500">
                (Semantic matches)
              </span>
            </h3>
            <div className="space-y-3">
              {results.vector.map(product => (
                <div 
                  key={product.id} 
                  className="p-3 bg-blue-50 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{product.name}</h4>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {(product.score * 100).toFixed(1)}% match
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Category: {product.category}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Initial State */}
      {!results && !isSearching && (
        <div className="text-center mt-12 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Try searching for natural language queries like:</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>"rugged motorcycle gear"</li>
            <li>"durable outdoor clothing"</li>
            <li>"classic biker style"</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default VectorSearchDemo;
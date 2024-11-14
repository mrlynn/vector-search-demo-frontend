import React, { useState } from 'react';
import { Search, Brain, FileText, Radar } from 'lucide-react';

const SearchComparison = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState({
    basic: [],
    vector: [],
    semantic: []
  });

  const performComparison = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const searches = ['basic', 'vector', 'semantic'];
      const results = await Promise.all(
        searches.map(type => 
          fetch('http://localhost:3003/api/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: searchTerm,
              type: type
            })
          }).then(res => res.json())
        )
      );
      
      setResults({
        basic: results[0].results || [],
        vector: results[1].results || [],
        semantic: results[2].results || []
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-[#001E2B] mb-6">Search Comparison</h2>
      
      {/* Search Input */}
      <div className="flex space-x-2 mb-8">
        <input
          type="text"
          placeholder="Enter a search term to compare approaches..."
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#00ED64] focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && performComparison()}
        />
        <button
          className="bg-[#001E2B] text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-[#023047] transition-colors"
          onClick={performComparison}
          disabled={isSearching}
        >
          <Search size={20} />
          <span>{isSearching ? 'Comparing...' : 'Compare'}</span>
        </button>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Search Results */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="text-[#001E2B]" size={24} />
            <h3 className="text-lg font-semibold text-[#001E2B]">Basic Search</h3>
          </div>
          <div className="text-sm text-[#1C2D38] mb-4">
            Uses regex pattern matching. Limited to exact matches and simple patterns.
          </div>
          <div className="space-y-4">
            {results.basic.map((result, index) => (
              <div 
                key={index}
                className="p-3 bg-[#E3FCF7] rounded-lg"
              >
                <div className="font-medium text-[#001E2B]">{result.title}</div>
                <div className="text-sm text-[#1C2D38] mt-1">{result.category}</div>
              </div>
            ))}
            {results.basic.length === 0 && !isSearching && (
              <div className="text-gray-500 text-center py-4">No results</div>
            )}
          </div>
        </div>

        {/* Vector Search Results */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Radar className="text-[#001E2B]" size={24} />
            <h3 className="text-lg font-semibold text-[#001E2B]">Vector Search</h3>
          </div>
          <div className="text-sm text-[#1C2D38] mb-4">
            Uses AI embeddings. Finds similar items based on meaning, not just words.
          </div>
          <div className="space-y-4">
            {results.vector.map((result, index) => (
              <div 
                key={index}
                className="p-3 bg-[#E3FCF7] rounded-lg"
              >
                <div className="font-medium text-[#001E2B]">{result.title}</div>
                <div className="text-sm text-[#1C2D38] mt-1">{result.category}</div>
                <div className="text-xs text-[#00ED64] mt-1">
                  {(result.score * 100).toFixed(1)}% match
                </div>
              </div>
            ))}
            {results.vector.length === 0 && !isSearching && (
              <div className="text-gray-500 text-center py-4">No results</div>
            )}
          </div>
        </div>

        {/* Semantic Search Results */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="text-[#001E2B]" size={24} />
            <h3 className="text-lg font-semibold text-[#001E2B]">Semantic Search</h3>
          </div>
          <div className="text-sm text-[#1C2D38] mb-4">
            Uses GPT to understand intent. Finds relevant items based on context and meaning.
          </div>
          <div className="space-y-4">
            {results.semantic.map((result, index) => (
              <div 
                key={index}
                className="p-3 bg-[#E3FCF7] rounded-lg"
              >
                <div className="font-medium text-[#001E2B]">{result.title}</div>
                <div className="text-sm text-[#1C2D38] mt-1">{result.category}</div>
                <div className="text-xs text-[#00ED64] mt-1">
                  {(result.score * 100).toFixed(1)}% match
                </div>
              </div>
            ))}
            {results.semantic.length === 0 && !isSearching && (
              <div className="text-gray-500 text-center py-4">No results</div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isSearching && (
        <div className="text-center mt-4">
          <div className="animate-pulse text-[#1C2D38]">
            Comparing search approaches...
          </div>
        </div>
      )}

      {/* Example Queries */}
      <div className="mt-8 p-4 bg-[#E3FCF7] rounded-lg">
        <h4 className="font-semibold text-[#001E2B] mb-2">Try these example queries:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-[#001E2B]">Basic Search:</div>
            <div className="text-[#1C2D38]">"wireless headphones", "camera", "desk"</div>
          </div>
          <div>
            <div className="font-medium text-[#001E2B]">Vector Search:</div>
            <div className="text-[#1C2D38]">"portable audio device", "photography equipment", "office furniture"</div>
          </div>
          <div>
            <div className="font-medium text-[#001E2B]">Semantic Search:</div>
            <div className="text-[#1C2D38]">"something to listen to music while working out", "equipment for professional photos", "comfortable work from home setup"</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchComparison;
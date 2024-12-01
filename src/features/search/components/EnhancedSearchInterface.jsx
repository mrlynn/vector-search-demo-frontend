// src/features/search/components/EnhancedSearchInterface.jsx
import React from 'react';
import { Search, Database, Radar, Brain, Image } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const EnhancedSearchInterface = ({
    searchTerm,
    onSearchTermChange,
    onSearch,
    isSearching,
    searchType,
    onSearchTypeChange,
    searchOptions,
    onSearchOptionsChange,
    results = [], // Add default value
    searchTime = 0, // Add default value
    error
}) => {

    const formatSearchTime = (time) => {
        if (typeof time === 'number') {
            return time.toFixed(2);
        }
        if (typeof time === 'string') {
            const num = parseFloat(time);
            return !isNaN(num) ? num.toFixed(2) : '0.00';
        }
        return '0.00';
    };


    // Add search type buttons
    const renderSearchTypeButtons = () => (
        <div className="flex flex-wrap gap-2 justify-center mb-4">
            <button
                className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${searchType === 'basic'
                        ? 'bg-[#001E2B] text-white'
                        : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
                    }`}
                onClick={() => onSearchTypeChange('basic')}
            >
                <Database size={20} />
                <span>Basic Find</span>
            </button>

            <button
                className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${searchType === 'atlas'
                        ? 'bg-[#001E2B] text-white'
                        : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
                    }`}
                onClick={() => onSearchTypeChange('atlas')}
            >
                <Search size={20} />
                <span>Atlas Search</span>
            </button>

            <button
                className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${searchType === 'vector'
                        ? 'bg-[#001E2B] text-white'
                        : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
                    }`}
                onClick={() => onSearchTypeChange('vector')}
            >
                <Radar size={20} />
                <span>Vector Search</span>
            </button>

            <button
                className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${searchType === 'semantic'
                        ? 'bg-[#001E2B] text-white'
                        : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
                    }`}
                onClick={() => onSearchTypeChange('semantic')}
            >
                <Brain size={20} />
                <span>Semantic Search</span>
            </button>

            <button
                className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${searchType === 'image'
                        ? 'bg-[#001E2B] text-white'
                        : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
                    }`}
                onClick={() => onSearchTypeChange('image')}
            >
                <Image size={20} />
                <span>Image Search</span>
            </button>
        </div>
    );

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Vector Search Demo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-4">
                        {/* Search Type Buttons */}
                        {renderSearchTypeButtons()}

                        {/* Search Input */}
                        <div className="flex space-x-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => onSearchTermChange(e.target.value)}
                                    placeholder="Enter your search query..."
                                    className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <Search className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                            <button
                                onClick={onSearch}
                                disabled={isSearching}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSearching ? 'Searching...' : 'Search'}
                            </button>
                        </div>

                        {/* Search Options */}
                        <div className="flex space-x-4">
                            {Object.entries(searchOptions).map(([option, enabled]) => (
                                <label key={option} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={enabled}
                                        onChange={(e) =>
                                            onSearchOptionsChange({
                                                ...searchOptions,
                                                [option]: e.target.checked
                                            })
                                        }
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm">
                                        {option.charAt(0).toUpperCase() + option.slice(1).replace(/([A-Z])/g, ' $1')}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Section - Keep existing code */}


            {Array.isArray(results) && results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Search Results</span>
              {searchTime && (
                <span className="text-sm text-gray-500">
                  Found in {formatSearchTime(searchTime)}ms
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-2">
                      {result.image && (
                        <img
                          src={result.image}
                          alt={result.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <h3 className="font-medium">{result.title || 'Untitled'}</h3>
                    <p className="text-sm text-gray-500">{result.description || 'No description available'}</p>
                    {result.score !== undefined && (
                      <div className="mt-2 text-xs text-gray-400">
                        Score: {formatSearchTime(result.score)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
        </div>
    );
};

export default EnhancedSearchInterface;
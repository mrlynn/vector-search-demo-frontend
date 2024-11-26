// src/features/search/components/SearchInterface.jsx
import React from 'react';
import { Search, Database, Radar, Brain, Image } from 'lucide-react';

export function SearchInterface() {
  const [searchType, setSearchType] = React.useState('basic');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchOptions, setSearchOptions] = React.useState({
    fuzzyMatching: true,
    autoComplete: true,
    phraseMatching: true
  });

  // Add search type buttons
  const renderSearchButtons = () => (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      <button
        className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
          searchType === 'basic'
            ? 'bg-[#001E2B] text-white'
            : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
        }`}
        onClick={() => setSearchType('basic')}
      >
        <Database size={20} />
        <span>Basic Find</span>
      </button>

      <button
        className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
          searchType === 'atlas'
            ? 'bg-[#001E2B] text-white'
            : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
        }`}
        onClick={() => setSearchType('atlas')}
      >
        <Search size={20} />
        <span>Atlas Search</span>
      </button>

      <button
        className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
          searchType === 'vector'
            ? 'bg-[#001E2B] text-white'
            : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
        }`}
        onClick={() => setSearchType('vector')}
      >
        <Radar size={20} />
        <span>Vector Search1</span>
      </button>

      <button
        className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
          searchType === 'semantic'
            ? 'bg-[#001E2B] text-white'
            : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
        }`}
        onClick={() => setSearchType('semantic')}
      >
        <Brain size={20} />
        <span>Semantic Search</span>
      </button>

      <button
        className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
          searchType === 'image'
            ? 'bg-[#001E2B] text-white'
            : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
        }`}
        onClick={() => {
          setSearchType('image');
          // Add image upload trigger here if needed
        }}
      >
        <Image size={20} />
        <span>Image Search</span>
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Vector Search Demo</h2>
      
      {/* Search Type Buttons */}
      {renderSearchButtons()}

      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Enter your search query..."
          className="w-full pl-4 pr-12 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded"
        >
          Search
        </button>
      </div>

      {/* Text/Image Toggle */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSearchType('text')}
          className={`flex items-center gap-2 px-3 py-1 rounded ${
            searchType === 'text' ? 'text-blue-600 font-medium' : 'text-gray-600'
          }`}
        >
          <span>Text</span>
        </button>
        <button
          onClick={() => setSearchType('image')}
          className={`flex items-center gap-2 px-3 py-1 rounded ${
            searchType === 'image' ? 'text-blue-600 font-medium' : 'text-gray-600'
          }`}
        >
          <span>Image</span>
        </button>
      </div>

      {/* Search Options */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={searchOptions.fuzzyMatching}
            onChange={(e) => setSearchOptions(prev => ({
              ...prev,
              fuzzyMatching: e.target.checked
            }))}
            className="rounded"
          />
          <span>Fuzzy Matching</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={searchOptions.autoComplete}
            onChange={(e) => setSearchOptions(prev => ({
              ...prev,
              autoComplete: e.target.checked
            }))}
            className="rounded"
          />
          <span>Auto Complete</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={searchOptions.phraseMatching}
            onChange={(e) => setSearchOptions(prev => ({
              ...prev,
              phraseMatching: e.target.checked
            }))}
            className="rounded"
          />
          <span>Phrase Matching</span>
        </label>
      </div>
    </div>
  );
}

export default SearchInterface;
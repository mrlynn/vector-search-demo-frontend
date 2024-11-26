// src/features/search/components/SearchTypeSelector.jsx
import React from 'react';
import { Database, Search, Radar, Brain, Image } from 'lucide-react';

export const searchTypes = [
  {
    id: 'basic',
    name: 'Basic Find',
    icon: Database,
    color: 'bg-[#001E2B]',
    hoverBg: 'bg-[#E3FCF7]',
    placeholder: 'Enter exact text to match...',
    description: 'Traditional MongoDB find() - Exact text matching'
  },
  {
    id: 'atlas',
    name: 'Atlas Search',
    icon: Search,
    color: 'bg-[#001E2B]',
    hoverBg: 'bg-[#E3FCF7]',
    placeholder: 'Try searching with typos...',
    description: 'Atlas Search - Full-text search with fuzzy matching'
  },
  {
    id: 'vector',
    name: 'Vector Search',
    icon: Radar,
    color: 'bg-[#001E2B]',
    hoverBg: 'bg-[#E3FCF7]',
    placeholder: 'Describe what you\'re looking for...',
    description: 'Vector Search - Semantic text similarity'
  },
  {
    id: 'semantic',
    name: 'Semantic Search',
    icon: Brain,
    color: 'bg-[#001E2B]',
    hoverBg: 'bg-[#E3FCF7]',
    placeholder: 'Ask in natural language...',
    description: 'Semantic Search - Natural language understanding'
  },
  {
    id: 'image',
    name: 'Image Search',
    icon: Image,
    color: 'bg-[#001E2B]',
    hoverBg: 'bg-[#E3FCF7]',
    placeholder: 'Upload an image to search...',
    description: 'Image Search - Visual similarity using vectors'
  }
];

const SearchTypeSelector = ({ searchType, onTypeChange, triggerImageUpload }) => {
  return (
    <>
      {/* Mobile View - Dropdown */}
      <div className="block sm:hidden">
        <select
          value={searchType}
          onChange={(e) => {
            onTypeChange(e.target.value);
            if (e.target.value === 'image') {
              triggerImageUpload();
            }
          }}
          className="w-full p-3 border rounded-lg bg-white"
        >
          {searchTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name} - {type.description}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop View - Buttons */}
      <div className="hidden sm:flex flex-wrap gap-2 justify-center">
        {searchTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              onTypeChange(type.id);
              if (type.id === 'image') {
                triggerImageUpload?.();
              }
            }}
            className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
              searchType === type.id
                ? 'bg-[#001E2B] text-white'
                : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
            }`}
          >
            <type.icon size={20} />
            <span>{type.name}</span>
            {/* Tooltip */}
            <div className="hidden group-hover:block absolute top-full mt-2 p-2 bg-black text-white text-xs rounded shadow-lg">
              {type.description}
            </div>
          </button>
        ))}
      </div>

      {/* Search Type Description */}
      <div className="text-center mt-2">
        <p className="text-sm text-slate-600">
          {searchTypes.find(t => t.id === searchType)?.description}
        </p>
      </div>
    </>
  );
};

export default SearchTypeSelector;
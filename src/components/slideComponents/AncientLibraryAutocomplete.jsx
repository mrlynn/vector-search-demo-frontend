import React, { useState, useEffect, useRef } from 'react';
import { Scroll, BookOpen, Search, X } from 'lucide-react';

const AncientLibraryAutocomplete = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('title');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const suggestionsRef = useRef(null);
  const searchInputRef = useRef(null);
  const loaderRef = useRef(null);
  const [page, setPage] = useState(1);

  // Data generation code remains the same
  const titlePrefixes = [
    "Book of the Dead", "Papyrus of", "Teachings of", 
    "Prophecies of", "Mysteries of", "Scroll of",
    "Wisdom of", "Chronicles of", "Spells of", "Tales from"
  ];

  const titleSuffixes = [
    "the Sacred Temple", "the Rising Sun", "the Pharaoh's Court",
    "Ancient Memphis", "the Great Pyramid", "the Nile's Secrets",
    "the Royal Scribe", "Divine Knowledge", "Eternal Life", "the Sacred Lotus"
  ];

  const egyptianNames = [
    "Amenhotep", "Imhotep", "Nefertiti", "Thutmose", "Hatshepsut",
    "Akhenaten", "Ptolemy", "Ramesses", "Senusret", "Khufu"
  ];

  // Helper functions remain the same
  const generateTitle = () => {
    const prefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
    const suffix = titleSuffixes[Math.floor(Math.random() * titleSuffixes.length)];
    return `${prefix} ${suffix}`;
  };

  const generateAuthor = () => {
    const name = egyptianNames[Math.floor(Math.random() * egyptianNames.length)];
    const title = Math.random() > 0.5 ? ", Royal Scribe" : ", High Priest";
    return name + title;
  };

  const generateDescription = (length) => {
    const words = [
      "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", 
      "λόγος", "σοφία", "ἀρετή", "νοῦς", "ψυχή", "κόσμος"
    ];
    let description = "";
    for (let i = 0; i < length; i++) {
      description += words[Math.floor(Math.random() * words.length)] + " ";
    }
    return description.trim();
  };

  // Updated search functionality
  const updateResults = (term) => {
    const searchTermLower = term.toLowerCase();
    
    const results = items.filter(item => {
      if (searchField === 'title') {
        return item.title.toLowerCase().startsWith(searchTermLower);
      } else {
        const authorName = item.author.split(',')[0].toLowerCase();
        return authorName.startsWith(searchTermLower);
      }
    });

    setFilteredItems(results);
    
    // Update suggestions
    const uniqueValues = new Set();
    const suggestions = results
      .map(item => searchField === 'title' ? item.title : item.author.split(',')[0])
      .filter(value => {
        const lowerValue = value.toLowerCase();
        if (!uniqueValues.has(lowerValue)) {
          uniqueValues.add(lowerValue);
          return true;
        }
        return false;
      })
      .slice(0, 5);

    setSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0 && term.length > 0);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    updateResults(value);
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchTerm(suggestion);
    updateResults(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (selectedSuggestion >= 0) {
          e.preventDefault();
          handleSuggestionSelect(suggestions[selectedSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  // Initial data load
  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newItems = Array(10).fill(null).map((_, index) => ({
        id: items.length + index,
        title: generateTitle(),
        author: generateAuthor(),
        description: generateDescription(8),
        year: Math.floor(Math.random() * 3000) + " BCE"
      }));
      setItems(prevItems => [...prevItems, ...newItems]);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
<div className="w-full h-[800px] bg-[#FDF5E6] rounded-lg shadow-lg overflow-hidden flex flex-col">
{/* Header */}
<div className="flex flex-col bg-amber-100 border-b border-amber-200">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <BookOpen className="text-amber-800" size={16} />
            <h2 className="text-lg font-serif text-amber-900">Ancient Library Autocomplete</h2>
          </div>
          <div className="text-amber-800 text-xs">
            Matching Scrolls: {filteredItems.length} of {items.length}
          </div>
        </div>
        
        {/* Search Interface */}
        <div className="p-3 pt-0 flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Start typing to search by ${searchField}...`}
              className="w-full px-3 py-1.5 pr-8 rounded border border-amber-300 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
            
            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div 
                ref={suggestionsRef}
                className="absolute z-20 w-full mt-1 bg-white rounded-md shadow-lg border border-amber-200 max-h-48 overflow-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={`px-3 py-2 cursor-pointer text-sm ${
                      index === selectedSuggestion
                        ? 'bg-amber-100'
                        : 'hover:bg-amber-50'
                    }`}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <select
            value={searchField}
            onChange={(e) => {
              setSearchField(e.target.value);
              handleSearchChange('');
            }}
            className="px-2 py-1.5 rounded border border-amber-300 text-sm bg-white"
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-amber-50 sticky top-0 z-10">
            <tr className="text-xs">
              <th className="text-left p-2 font-serif text-amber-900">Title</th>
              <th className="text-left p-2 font-serif text-amber-900">Author</th>
              <th className="text-left p-2 font-serif text-amber-900">Description</th>
              <th className="text-left p-2 font-serif text-amber-900 w-20">Year</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100">
            {filteredItems.map((item) => (
              <tr 
                key={item.id}
                className="hover:bg-amber-50 transition-colors text-sm"
              >
                <td className="p-2 font-medium text-amber-900">{item.title}</td>
                <td className="p-2 text-amber-800">{item.author}</td>
                <td className="p-2 text-amber-700">
                  <div className="truncate max-w-xs">{item.description}</div>
                </td>
                <td className="p-2 text-amber-800 text-xs">{item.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading Indicator */}
      <div 
        ref={loaderRef}
        className="flex justify-center items-center p-2 bg-amber-50"
      >
        {isLoading && (
          <div className="flex items-center gap-2 text-amber-800 text-xs">
            <Scroll className="animate-spin" size={12} />
            <span>Unrolling scrolls...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AncientLibraryAutocomplete;
import React, { useState } from 'react';
import { Database, Search } from 'lucide-react';

const DataExplorer = () => {
  const [activeTab, setActiveTab] = useState('data');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  
  const sampleData = [
    { name: "Eco-friendly Water Bottle", category: "Sustainable Living", price: 24.99 },
    { name: "Organic Cotton T-shirt", category: "Clothing", price: 29.99 },
    { name: "Bamboo Utensil Set", category: "Kitchen", price: 19.99 },
    { name: "Solar-Powered Charger", category: "Electronics", price: 49.99 },
    { name: "Reusable Food Wraps", category: "Kitchen", price: 15.99 },
    { name: "Natural Yoga Mat", category: "Fitness", price: 39.99 },
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      return;
    }
    const term = searchTerm.toLowerCase();
    const results = sampleData.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
    );
    setSearchResults(results);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full h-[800px]">
      {/* Larger Tab Buttons */}
      <div className="flex border-b">
        <button
          className={`flex items-center gap-3 px-6 py-4 text-lg ${
            activeTab === 'data' ? 'bg-[#00ED64] text-white' : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('data')}
        >
          <Database size={24} />
          Data View
        </button>
        <button
          className={`flex items-center gap-3 px-6 py-4 text-lg ${
            activeTab === 'search' ? 'bg-[#00ED64] text-white' : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('search')}
        >
          <Search size={24} />
          Search View
        </button>
      </div>
      
      <div className="p-8">
        {activeTab === 'data' ? (
          <div className="space-y-6">
            <h3 className="text-3xl font-semibold text-gray-800">Product Catalog</h3>
            <div className="grid grid-cols-3 gap-6">
              {sampleData.map((item, index) => (
                <div key={index} className="p-6 border-2 rounded-xl hover:border-[#00ED64] transition-colors">
                  <h4 className="text-xl font-medium text-gray-800 mb-2">{item.name}</h4>
                  <p className="text-base text-gray-600 mb-2">{item.category}</p>
                  <p className="text-lg font-medium text-[#00ED64]">${item.price}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 p-4 text-xl border-2 rounded-xl focus:border-[#00ED64] outline-none transition-colors"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              />
              <button className="px-8 py-4 bg-[#00ED64] text-white rounded-xl text-xl hover:bg-[#00ED64]/90 transition-colors" onClick={handleSearch}>
                Search
              </button>
            </div>
            <div className="text-lg text-gray-600 flex items-center gap-2">
              <Search size={20} className="text-[#00ED64]" />
              Try searching for "eco-friendly" or "organic"
            </div>
            {/* Search Results */}
            <div className="mt-6">
              {searchResults === null
                ? null
                : searchResults.length === 0
                ? <div className="text-gray-500 text-xl">No results found.</div>
                : (
                  <div className="grid grid-cols-3 gap-6">
                    {searchResults.map((item, index) => (
                      <div key={index} className="p-6 border-2 rounded-xl hover:border-[#00ED64] transition-colors">
                        <h4 className="text-xl font-medium text-gray-800 mb-2">{item.name}</h4>
                        <p className="text-base text-gray-600 mb-2">{item.category}</p>
                        <p className="text-lg font-medium text-[#00ED64]">${item.price}</p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataExplorer;
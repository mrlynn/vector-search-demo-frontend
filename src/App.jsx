import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Image,
  FileText,
  MessagesSquare,
  Database,
  Radar,
  Brain,
  TableProperties,
  Code,
  X
} from 'lucide-react';

function App() {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('basic');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTime, setSearchTime] = useState(null);
  const [viewMode, setViewMode] = useState('search'); // 'search' or 'data'
  const [allData, setAllData] = useState([]);
  const [showCommand, setShowCommand] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const fileInputRef = useRef(null);

  const API_URL = 'http://localhost:3003/api';

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const response = await fetch(`${API_URL}/data`);
      const data = await response.json();
      setAllData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = async () => {
    if ((!searchTerm.trim() && searchType !== 'image') ||
      (searchType === 'image' && !selectedImage)) return;

    setIsSearching(true);
    setError(null);
    const startTime = performance.now();

    try {
      let response;

      if (searchType === 'image') {
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('type', 'image');

        response = await fetch(`${API_URL}/search`, {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch(`${API_URL}/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: searchTerm,
            type: searchType,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results || []);
      setSearchTime(data.searchTime);

      // Show the command used
      setCurrentCommand(getSearchCommand(searchType, searchTerm));
      setShowCommand(true);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to perform search. Please try again.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setSearchType('image');
      setTimeout(() => {
        handleSearch();
      }, 0);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const getSearchDescription = () => {
    switch (searchType) {
      case 'basic':
        return "Traditional MongoDB find() - Exact text matching";
      case 'atlas':
        return "Atlas Search - Full-text search with fuzzy matching";
      case 'vector':
        return "Vector Search - Semantic text similarity";
      case 'semantic':
        return "Semantic Search - Natural language understanding";
      case 'image':
        return "Image Search - Visual similarity using vectors";
      default:
        return "";
    }
  };

  const getSearchCommand = (type, query) => {
    switch (type) {
      case 'basic':
        return `db.products.find({
  $or: [
    { title: { $regex: "${query}", $options: "i" } },
    { description: { $regex: "${query}", $options: "i" } },
    { category: { $regex: "${query}", $options: "i" } }
  ]
})`;
      case 'atlas':
        return `db.products.aggregate([
  {
    $search: {
      text: {
        query: "${query}",
        path: ["title", "description", "category"],
        fuzzy: { maxEdits: 1, prefixLength: 3 }
      }
    }
  }
])`;
      case 'vector':
        return `// 1. Generate embedding using OpenAI
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: "${query}"
});

// 2. Perform vector search
db.products.aggregate([
  {
    $vectorSearch: {
      queryVector: embedding,
      path: "description_embedding",
      numCandidates: 100,
      limit: 10
    }
  }
])`;
      case 'semantic':
        return `// 1. Enhance query using GPT-4
const enhancedQuery = await openai.chat.completions.create({
  model: "gpt-4-1106-preview",
  messages: [
    {
      role: "system",
      content: "Convert the query into a detailed product description"
    },
    { role: "user", content: "${query}" }
  ]
});

// 2. Generate embedding & search
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: enhancedQuery
});

db.products.aggregate([
  {
    $vectorSearch: {
      queryVector: embedding,
      path: "description_embedding",
      numCandidates: 100
    }
  }
])`;
      case 'image':
        return `// 1. Process image with GPT-4 Vision
const imageDescription = await openai.chat.completions.create({
  model: "gpt-4-vision-preview-1106",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "Describe this product image" },
        { type: "image_url", image_url: { url: "..." } }
      ]
    }
  ]
});

// 2. Generate embedding & search
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: imageDescription
});

db.products.aggregate([
  {
    $vectorSearch: {
      queryVector: embedding,
      path: "description_embedding",
      numCandidates: 100
    }
  }
])`;
      default:
        return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-[#FFFFFF]"> {/* Pure White background */}
      {/* Mode Toggle */}
      <div className="flex justify-end mb-4 space-x-2">
        <button
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${viewMode === 'search'
              ? 'bg-[#001E2B] text-white' // Slate Blue
              : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]' // Mist with hover
            }`}
          onClick={() => setViewMode('search')}
        >
          <Search size={20} />
          <span>Search Interface</span>
        </button>
        <button
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${viewMode === 'data'
              ? 'bg-[#001E2B] text-white' // Slate Blue
              : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]' // Mist with hover
            }`}
          onClick={() => setViewMode('data')}
        >
          <TableProperties size={20} />
          <span>View Data</span>
        </button>
      </div>

      {viewMode === 'search' ? (
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-2 text-[#001E2B]">
              MongoDB Search Evolution Demo
            </h1>
            <p className="text-center text-[#1C2D38] mb-6">
              From Basic Queries to Intelligent Vector Search
            </p>

            {/* Search Controls */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${searchType === 'basic'
                      ? 'bg-[#001E2B] text-white'
                      : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
                    }`}
                  onClick={() => setSearchType('basic')}
                >
                  <Database size={20} />
                  <span>Basic Find</span>
                </button>
                <button
                  className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${searchType === 'atlas'
                      ? 'bg-[#001E2B] text-white'
                      : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
                    }`}
                  onClick={() => setSearchType('atlas')}
                >
                  <Search size={20} />
                  <span>Atlas Search</span>
                </button>
                <button
                  className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${searchType === 'vector'
                      ? 'bg-[#001E2B] text-white'
                      : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
                    }`}
                  onClick={() => setSearchType('vector')}
                >
                  <Radar size={20} />
                  <span>Vector Search</span>
                </button>
                <button
                  className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${searchType === 'semantic'
                      ? 'bg-[#001E2B] text-white'
                      : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
                    }`}
                  onClick={() => setSearchType('semantic')}
                >
                  <Brain size={20} />
                  <span>Semantic Search</span>
                </button>
                <button
                  className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${searchType === 'image'
                      ? 'bg-[#001E2B] text-white'
                      : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
                    }`}
                  onClick={triggerImageUpload}
                >
                  <Image size={20} />
                  <span>Image Search</span>
                </button>
              </div>

              <div className="text-center text-sm text-[#1C2D38]">
                {getSearchDescription()}
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />

              {/* Search input */}
              {searchType !== 'image' && (
                <div className="flex space-x-2 max-w-2xl mx-auto">
                  <input
                    type="text"
                    placeholder={
                      searchType === 'semantic'
                        ? "Enter natural language description..."
                        : searchType === 'basic'
                          ? "Enter exact text to match..."
                          : "Enter your search query..."
                    }
                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#00ED64] focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    className="bg-[#001E2B] text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-[#023047] transition-colors"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    <Search size={20} />
                    <span>{isSearching ? 'Searching...' : 'Search'}</span>
                  </button>
                </div>
              )}

              {/* Image preview */}
              {searchType === 'image' && selectedImage && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    className="max-h-40 rounded-lg"
                  />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 max-w-2xl mx-auto">
                  {error}
                </div>
              )}
            </div>

            {/* Results Section */}
            {!isSearching && results.length > 0 && (
              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-[#001E2B]">Results ({results.length})</h3>
                  <span className="text-sm text-[#1C2D38]">Search time: {searchTime}ms</span>
                </div>
                <div className="grid gap-4">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-[#E3FCF7] transition-colors"
                    >
                      <img
                        src={result.image}
                        alt={result.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#001E2B]">{result.title}</h4>
                        <p className="text-sm text-[#1C2D38]">{result.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-[#1C2D38]">{result.category}</span>
                          <span className="text-sm font-semibold text-[#001E2B]">${result.price}</span>
                        </div>
                      </div>
                      {result.score !== undefined && (
                        <div className="text-right">
                          <div className="text-sm font-semibold text-[#00ED64]">
                            {(result.score * 100).toFixed(1)}% match
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isSearching && (
              <div className="mt-6 text-center text-[#1C2D38]">
                <div className="animate-pulse">Processing search...</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#001E2B]">Product Database</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E3FCF7]">
                <thead className="bg-[#E3FCF7]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#001E2B] uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#001E2B] uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#001E2B] uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#001E2B] uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#001E2B] uppercase tracking-wider">Price</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E3FCF7]">
                  {allData.map((item, index) => (
                    <tr key={index} className="hover:bg-[#E3FCF7]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-12 w-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[#001E2B]">{item.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#1C2D38] max-w-md">{item.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#1C2D38]">{item.category}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-[#001E2B]">${item.price}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Command Modal */}
      {showCommand && (
        <div className="fixed inset-0 bg-[#001E2B] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[#001E2B]">MongoDB Command</h3>
              <button
                onClick={() => setShowCommand(false)}
                className="p-2 hover:bg-[#E3FCF7] rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <pre className="bg-[#001E2B] text-white p-4 rounded-lg overflow-x-auto">
                <code>{currentCommand}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
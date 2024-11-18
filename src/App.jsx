import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Image,
  FileText,
  MessagesSquare,
  Info,
  Database,
  Radar,
  ChevronDown,
  ChevronUp,
  Brain,
  TableProperties,
  Code,
  X
} from 'lucide-react';
import config from './config';
import SearchComparison from './SearchComparison';
import HighlightedText from './HighlightedText';
import SearchMatchIndicator from './SearchMatchIndicator';
import SearchFlowDiagram from './SearchFlowDiagram';

const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': config.apiKey
};
function App() {
  // State management
  const API_URL = config.apiUrl;
  const [imageDescription, setImageDescription] = useState(null);
  const [showDiagram, setShowDiagram] = useState(false);

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
  const fileInputRef = useRef();

  const [searchOptions, setSearchOptions] = useState({
    fuzzyMatching: true,
    autoComplete: true,
    phraseMatching: true
  });
  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const response = await fetch(`${API_URL}/data`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setAllData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    }
  };
  const handleSearch = async () => {
    console.log(`Starting search process: ${searchType}`);
    // Input validation
    const isValidSearch = searchType === 'image' ? selectedImage : searchTerm.trim();
    if (!isValidSearch) {
      console.debug('Search validation failed:', { searchType, hasImage: !!selectedImage });
      return;
    }
  
    setIsSearching(true);
    setError(null);
  
    try {
      // Prepare request configuration
      const config = {
        method: 'POST',
        credentials: 'include',
        headers: {},
        body: null
      };
  
      if (searchType === 'image') {
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('type', 'image');
        config.body = formData;
        console.debug('Preparing image search:', { imageSize: selectedImage.size });
      } else {
        config.headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify({
          query: searchTerm,
          type: searchType,
          options: searchType === 'atlas' ? searchOptions : undefined
        });
        console.debug('Search configuration:', config);

      }
      console.debug('Search configuration:', config);
  
      // Execute search
      console.log(`${API_URL}/search`);
      const response = await fetch(`${API_URL}/search`, config);
      const data = await handleResponse(response);
  
      // Update UI state
      updateSearchResults(data);
    } catch (error) {
      handleSearchError(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResponse = async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }
    return response.json();
  };
  

  const handleSearchError = (error) => {
    console.error('Search failed:', error);
    setError(error.message || 'Failed to perform search. Please try again.');
    setResults([]);
  };

  // Update updateSearchResults
const updateSearchResults = (data) => {
  setResults(data.results || []);
  setSearchTime(data.searchTime);
  setShowCommand(true);
  setCurrentCommand(getSearchCommand(searchType, searchTerm));
  if (data.imageDescription) {
    setImageDescription(data.imageDescription);
  }
};

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    try {
      // Create object URL first to avoid race conditions
      const imageUrl = URL.createObjectURL(file);
      
      // Update states synchronously
      setSelectedImage(file);
      setSearchType('image');
      
      // Trigger search with a slight delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Perform search with validation
      const config = {
        method: 'POST',
        credentials: 'include',
        body: (() => {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('type', 'image');
          return formData;
        })()
      };
  
      setIsSearching(true);
      setError(null);
  
      const response = await fetch(`${API_URL}/search`, config);
      const data = await handleResponse(response);
      updateSearchResults(data);
    } catch (error) {
      handleSearchError(error);
    } finally {
      setIsSearching(false);
    }
  };

  const triggerImageUpload = () => {
    console.log('Triggering image upload'); // Log to verify trigger
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
      // In your getSearchCommand function, update the 'atlas' case:
      case 'atlas':
        const options = [];
        if (searchOptions.phraseMatching) {
          options.push(`      phrase: {
              query: "${query}",
              path: ["title", "description"],
              slop: 0
            }`);
        }
        if (searchOptions.fuzzyMatching) {
          options.push(`      text: {
              query: "${query}",
              path: ["title", "description", "category"],
              fuzzy: { maxEdits: 2, prefixLength: 3 }
            }`);
        }
        if (searchOptions.autoComplete) {
          options.push(`      autocomplete: {
              query: "${query}",
              path: "title",
              tokenOrder: "sequential"
            }`);
        }

        return `db.products.aggregate([
        {
          $search: {
            index: "advanced",
            compound: {
              should: [
      ${options.join(',\n')}
              ],
              minimumShouldMatch: 1
            },
            highlight: {
              path: ["title", "description"]
            }
          }
        },
        {
          $addFields: {
            score: { $meta: "searchScore" },
            highlights: { $meta: "searchHighlights" }
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

  // In your renderSearchInterface function, add the diagram after the search buttons
  const renderSearchInterface = () => (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-2 text-[#001E2B]">
          MongoDB Search Evolution Demo
        </h1>
        <p className="text-center text-[#1C2D38] mb-6">
          From Basic Queries to Intelligent Vector Search
        </p>
        <div className="space-y-6">
          {/* Search Type Buttons */}
          <div className="space-y-4">
            {renderSearchButtons()}
            
            {/* Search Type Description with Diagram Toggle */}
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <div className="text-sm text-[#1C2D38]">
                {getSearchDescription()}
              </div>
              {searchType !== 'image' && (
                <button
                  onClick={() => setShowDiagram(!showDiagram)}
                  className="flex items-center space-x-2 text-sm text-[#00684A] hover:text-[#00ED64] transition-colors p-2 rounded-lg hover:bg-[#E3FCF7]"
                >
                  <Info size={16} />
                  <span>How it works</span>
                  {showDiagram ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              )}
            </div>
  
            {/* Collapsible Diagram Section */}
            <div
              className={`transform transition-all duration-300 ease-in-out overflow-hidden ${
                showDiagram ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#001E2B]">
                    How {searchType.charAt(0).toUpperCase() + searchType.slice(1)} Search Works
                  </h3>
                  <div className="overflow-x-auto">
                    <SearchFlowDiagram searchType={searchType} />
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Atlas Search Options */}
          {renderSearchOptions()}
  
          {/* Search Input */}
          {renderSearchInput()}
  
          {/* Image Preview */}
          {renderImagePreview()}
  
          {/* Error Display */}
          {renderError()}
  
          {/* Search Results */}
          {renderResults()}
  
          {/* Loading State */}
          {renderLoadingState()}
        </div>
      </div>
    </div>
  );
  

  const renderDataTable = () => (
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
  );

  const renderModeToggle = () => (
    <div className="flex justify-end mb-4 space-x-2">
      <button
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${viewMode === 'search' ? 'bg-[#001E2B] text-white' : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
          }`}
        onClick={() => setViewMode('search')}
      >
        <Search size={20} />
        <span>Search Interface</span>
      </button>
      <button
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${viewMode === 'compare' ? 'bg-[#001E2B] text-white' : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
          }`}
        onClick={() => setViewMode('compare')}
      >
        <Brain size={20} />
        <span>Compare Search Types</span>
      </button>
      <button
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${viewMode === 'data' ? 'bg-[#001E2B] text-white' : 'bg-[#E3FCF7] hover:bg-[#C6EDE7]'
          }`}
        onClick={() => setViewMode('data')}
      >
        <TableProperties size={20} />
        <span>View Data</span>
      </button>
    </div>
  );

  const renderMainContent = () => {
    switch (viewMode) {
      case 'compare':
        return <SearchComparison />;
      case 'search':
        return renderSearchInterface();
      case 'data':
        return renderDataTable();
      default:
        return null;
    }
  };

  const renderSearchButtons = () => (
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
  );

  const renderSearchDescription = () => (
    <div className="text-center space-y-1">
      <div className="text-sm text-[#1C2D38]">
        {getSearchDescription()}
      </div>
      {searchType === 'atlas' && (
        <div className="text-xs text-[#00ED64]">
          Using advanced search index with fuzzy matching and autocomplete
        </div>
      )}
    </div>
  );

  const renderSearchOptions = () => (
    searchType === 'atlas' && (
      <div className="max-w-2xl mx-auto mt-2 mb-4">
        <div className="flex flex-wrap gap-3 justify-center text-sm">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={searchOptions.fuzzyMatching}
              onChange={(e) => setSearchOptions(prev => ({
                ...prev,
                fuzzyMatching: e.target.checked
              }))}
              className="rounded text-[#00ED64] focus:ring-[#00ED64]"
            />
            <span className="whitespace-nowrap">Fuzzy Matching</span>
            <span className="text-xs text-[#1C2D38] ml-1">(handles typos)</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={searchOptions.autoComplete}
              onChange={(e) => setSearchOptions(prev => ({
                ...prev,
                autoComplete: e.target.checked
              }))}
              className="rounded text-[#00ED64] focus:ring-[#00ED64]"
            />
            <span className="whitespace-nowrap">Auto-Complete</span>
            <span className="text-xs text-[#1C2D38] ml-1">(partial words)</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={searchOptions.phraseMatching}
              onChange={(e) => setSearchOptions(prev => ({
                ...prev,
                phraseMatching: e.target.checked
              }))}
              className="rounded text-[#00ED64] focus:ring-[#00ED64]"
            />
            <span className="whitespace-nowrap">Exact Matching</span>
            <span className="text-xs text-[#1C2D38] ml-1">(precise terms)</span>
          </label>
        </div>
        <div className="text-xs text-center mt-2 text-[#1C2D38]">
          Try searching: "cffee maker" (fuzzy), "coff" (autocomplete), "premium coffee" (exact)
        </div>
      </div>
    )
  );

  const renderSearchInput = () => (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageSelect}
      />

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
    </>
  );

  const formatImageDescription = (description) => {
    // Remove markdown-style elements and clean up the text
    const cleanDescription = description
      .replace(/###/g, '')
      .replace(/\*\*/g, '')
      .replace(/ - /g, '\n•')
      .trim();
  
    // Split into sections
    const sections = cleanDescription.split('\n');
    
    // Get main description (first section)
    const mainDescription = sections[0];
    
    // Get bullet points (remaining sections)
    const bulletPoints = sections.slice(1).filter(point => point.startsWith('•'));
  
    return { mainDescription, bulletPoints };
  };

  const renderImagePreview = () => (
    searchType === 'image' && selectedImage && (
      <div className="mt-4 space-y-4">
        <div className="flex justify-center">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className="max-h-40 rounded-lg"
          />
        </div>
        {imageDescription && (
          <div className="max-w-2xl mx-auto p-6 bg-[#E3FCF7] rounded-lg space-y-4">
            <div className="text-lg font-semibold text-[#001E2B]">AI Analysis</div>
            <div className="text-sm text-[#1C2D38]">
              {formatImageDescription(imageDescription).mainDescription}
            </div>
            <div className="space-y-2">
              {formatImageDescription(imageDescription).bulletPoints.map((point, index) => (
                <div key={index} className="text-sm text-[#1C2D38] flex items-start">
                  <span className="text-[#00ED64] mr-2">•</span>
                  <span>{point.replace('•', '').trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  );

  const renderError = () => (
    error && (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 max-w-2xl mx-auto">
        {error}
      </div>
    )
  );

  const renderResults = () => (
    !isSearching && results.length > 0 && (
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
                <h4 className="font-semibold text-[#001E2B]">
                  <HighlightedText
                    text={result.title}
                    highlights={result.highlights?.filter(h => h.path === 'title')}
                  />
                </h4>
                <p className="text-sm text-[#1C2D38]">
                  <HighlightedText
                    text={result.description}
                    highlights={result.highlights?.filter(h => h.path === 'description')}
                  />
                </p>
                <div className="flex items-center justify-between mt-1">
                  <div>
                    <span className="text-sm text-[#1C2D38]">{result.category}</span>
                    <span className="text-sm font-semibold text-[#001E2B] ml-4">${result.price}</span>
                    <SearchMatchIndicator result={result} searchType={searchType} options={searchOptions} />
                  </div>
                  {result.score !== undefined && (
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#00ED64]">
                        {(result.score * 100).toFixed(1)}% match
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );

  const renderLoadingState = () => (
    isSearching && (
      <div className="mt-6 text-center text-[#1C2D38]">
        <div className="animate-pulse">Processing search...</div>
      </div>
    )
  );

  return (
    <div className="max-w-7xl mx-auto p-4 bg-[#FFFFFF]">
      {renderModeToggle()}
      {renderMainContent()}
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
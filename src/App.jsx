import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Image,
  FileText,
  MessagesSquare,
  Database,
  Radar,
  Brain,
  Hand,
  Code,
  X,
  Info,
  ChevronDown,
  ChevronUp,
  MonitorPlay,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Layout
} from 'lucide-react';
import config from './config';
import SearchComparison from './SearchComparison';
import HighlightedText from './HighlightedText';
import SearchMatchIndicator from './SearchMatchIndicator';
import SearchFlowDiagram from './SearchFlowDiagram';
import { productImageService } from './services/productImageService';
import ProductImage from './components/ProductImage';
import MongoDBFlow from './MongoDBFlow';
import MongoDBQueryPlanner from './MongoDBQueryPlanner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import DataExplorer from './components/slideComponents/DataExplorer';
import SearchEvolution from './components/slideComponents/SearchEvolution';
import SearchJourney from './components/slideComponents/SearchJourney';
import AncientLibraryScroll from './components/slideComponents/AncientLibraryScroll';
import AncientLibrarySearch from './components/slideComponents/AncientLibrarySearch';
import AncientLibraryAutocomplete from './components/slideComponents/AncientLibraryAutocomplete';
import VectorLibrarySearch from './components/slideComponents/VectorLibrarySearch';
import AncientTextQA from './components/slideComponents/AncientTextQA';
import AIAgentDashboard from './components/slideComponents/AIAgentDashboard';
import MarkdownSlideContent from './components/MarkdownSlideContent';
import DataFlowAnimationWrapper from './components/slideComponents/DataFlowAnimation';
import MongoDBBasicSearchWrapper from './components/slideComponents/MongoDBBasicSearch';
import SwimlaneFlowWrapper from './components/slideComponents/SwimLaneFlow';
import AncientLibraryFlowWrapper from './components/slideComponents/AncientLibraryFlow';
const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': config.apiKey
};
function App() {
  // State management
  const API_URL = config.apiUrl;
  const [imageDescription, setImageDescription] = useState(null);
  const [showDiagram, setShowDiagram] = useState(false);
  const [viewMode, setViewMode] = useState('search'); // Update to include 'presentation'
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('basic');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTime, setSearchTime] = useState(null);
  const [allData, setAllData] = useState([]);
  const [showCommand, setShowCommand] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const fileInputRef = useRef(null);

  const searchTypes = [
    {
      id: 'basic',
      name: 'Basic Find',
      icon: Database,
      description: 'Traditional MongoDB find() - Exact text matching',
      color: 'bg-slate-600',
      placeholder: 'Enter exact text to match...',
      tip: 'Uses standard MongoDB queries with regex matching'
    },
    {
      id: 'atlas',
      name: 'Atlas Search',
      icon: Search,
      description: 'Atlas Search - Full-text search with fuzzy matching',
      color: 'bg-blue-600',
      placeholder: 'Try searching with typos...',
      tip: 'Supports fuzzy matching, autocomplete, and exact phrases'
    },
    {
      id: 'vector',
      name: 'Vector Search',
      icon: Radar,
      description: 'Vector Search - Semantic text similarity',
      color: 'bg-green-600',
      placeholder: 'Describe what you\'re looking for...',
      tip: 'Converts text to vectors for similarity search'
    },
    {
      id: 'semantic',
      name: 'Semantic Search',
      icon: Brain,
      description: 'Semantic Search - Natural language understanding',
      color: 'bg-purple-600',
      placeholder: 'Ask in natural language...',
      tip: 'Uses AI to understand search intent'
    },
    {
      id: 'image',
      name: 'Image Search',
      icon: Image,
      description: 'Image Search - Visual similarity using vectors',
      color: 'bg-pink-600',
      placeholder: 'Upload an image to search...',
      tip: 'Converts images to vectors for similarity matching'
    }
  ];

  const presentationSlides = [
    // Opening Section
    {
      id: 'welcome',
      title: 'From Data to Intelligence',
      content: `
  ## The Journey Begins
  
  We stand at a remarkable intersection in the history of information processing:
  
  - Traditional data storage and retrieval
  - Modern vector representations
  - Artificial Intelligence and LLMs
  
  Join me on a journey from simple data storage to true machine intelligence.
      `,
      note: 'INTRODUCTION',
      image: '/slide1.png'
    },
    {
      id: 'data-definition',
      title: 'Understanding Data',
      content: `
  ## The Foundation of Intelligence
  
  Raw, unprocessed facts and figures that form the basis of understanding.
  
  ### Characteristics
  - Building blocks of knowledge and intelligence
  - Raw numbers, text, measurements, observations
  - Context-free information
  - Requires processing to be meaningful
  
  ### Challenge
  - Vast amounts of unstructured data
  - Limited utility without organization
  - Needs context for value
  
  > "Data is the new oil - but like oil, it needs refining to be valuable"
      `,
      note: 'FOUNDATIONS',
      image: '/data.webp'
    },
    {
      id: 'knowledge-evolution',
      title: 'From Data to Knowledge',
      content: `
  ## Beyond Raw Data
  
  Information that has been processed, organized, and contextualized.
  
  ### The Transformation
  - Data gains structure and meaning
  - Patterns emerge from chaos
  - Relationships become visible
  - Context provides understanding
  
  ### Value Creation
  - Supports decision making
  - Enables pattern recognition
  - Forms basis for automation
  - Drives business insights
  
  > "Knowledge is not just processed data - it's data with purpose"
      `,
      note: 'THE EVOLUTION',
      image: '/knowledge.webp'
    },
    {
      id: 'intelligence-emergence',
      title: 'The Rise of Intelligence',
      content: `
  ## Machine Intelligence
  
  The ability to understand, learn, and apply knowledge to solve problems.
  
  ### Key Aspects
  - Learning from patterns
  - Understanding context
  - Making connections
  - Generating insights
  
  ### Applications
  - Natural language understanding
  - Pattern recognition
  - Predictive analytics
  - Automated reasoning
  
  > "True intelligence is not just about storing knowledge, but understanding it"
      `,
      note: 'THE GOAL',
      image: '/intelligence.webp'
    },
    // Historical Context Section
    {
      id: 'alexandria',
      title: 'The Great Library',
      content: `
  ## Lessons from Alexandria
  
  The world's first universal library holds valuable lessons for modern data systems.
  
  ### Historical Parallel
  - 700,000+ scrolls and books
  - Complex organization system
  - Expert librarians and scholars
  - Knowledge synthesis and creation
  
  ### Enduring Challenges
  - Information discovery
  - Context preservation
  - Knowledge organization
  - Wisdom transfer
  
  > "The past illuminates our path to the future"
      `,
      note: 'HISTORICAL CONTEXT',
      image: '/library.png'
    },
    {
      id: 'basic',
      title: 'In the beginning...',
      content: 'The search for knowledge begins with the simplest of tools... your eyes, hands, a ladder, perhaps a torch. You look around, see what you can find, and take what you need.',
      note: 'Basic Search',
      image: '/slide5.png',
      component: AncientLibraryScroll
    },
    {
      id: 'ancient-parallel',
      type: 'text-full',
      title: 'Ancient Wisdom, Modern Solutions',
      note: 'PARALLEL SYSTEMS',
      component: AncientLibraryFlowWrapper,
      content: ''
    },
    // Modern Challenge Section
    {
      id: 'modern-challenge',
      type: 'text-full',
      title: 'The Modern Data Challenge',
      content: `
  ## Scale Beyond Imagination
  
  Today's digital library faces unprecedented challenges:
  
  - Data growing exponentially
  - Complex, unstructured information
  - Need for immediate insights
  - Semantic understanding required
  - Multiple data formats and sources
  
  We need a system that combines the wisdom of the ancient library with the power of modern technology.
      `,
      note: 'THE CHALLENGE',
      component: DataExplorer
    },
    {
      id: 'journey',
      title: 'The Search Evolution',
      content: 'From basic search to vector search to semantic search, unlocking intelligence with LLMs',
      note: 'THE EVOLUTION',
      component: SearchEvolution
    },
    {
      id: 'mongodb-intro',
      title: 'MongoDB: The Modern Library',
      content: 'Every piece of data is a scroll in our digital Library of Alexandria',
      note: 'THE PLATFORM',
      component: SearchJourney
    },
    // Technical Evolution Section
    {
      id: 'basic-search',
      type: 'text-full',
      title: 'The Foundation: Basic Search',
      note: 'BUILDING BLOCKS',
      component: MongoDBBasicSearchWrapper,
      content: ''
    },
    {
      id: 'atlas-search',
      type: 'text-full',
      title: 'Enhanced Understanding with Atlas Search',
      note: 'FIRST EVOLUTION',
      content: `
  ## Beyond Basic Text Search
      
  Atlas Search introduces sophisticated text analysis:
      
  \`\`\`javascript
  {
    "mappings": {
      "dynamic": true,
      "fields": {
        "description": {
          "type": "string",
          "analyzer": "lucene.standard"
        }
      }
    }
  }
  \`\`\`
      
  ## Key Capabilities
  * *Fuzzy Matching*: Handles typos and variations
  * *Synonyms*: Understands related terms
  * *Relevance Scoring*: Intelligent ranking
  * *Faceted Search*: Dynamic filtering
  
  > "Atlas Search bridges the gap between basic queries and semantic understanding"
      `
    },
    {
      id: 'vector-search',
      type: 'text-full',
      title: 'The Power of Vector Search',
      note: 'SEMANTIC UNDERSTANDING',
      component: DataFlowAnimationWrapper,
      content: ''
    },
    {
      id: 'system-architecture',
      type: 'text-full',
      title: 'Modern Knowledge Architecture',
      note: 'SYSTEM OVERVIEW',
      component: SwimlaneFlowWrapper,
      content: ''
    },
    // Intelligence Layer Section
    {
      id: 'llm-integration',
      title: 'The Intelligence Layer',
      content: `
  ## Combining Vector Search with LLMs
  
  Creating truly intelligent applications:
  
  - Natural language understanding
  - Context-aware responses
  - Multi-modal search capabilities
  - Dynamic knowledge synthesis
  
  > "The whole is greater than the sum of its parts"
      `,
      note: 'AI INTEGRATION',
      component: AncientTextQA
    },
    {
      id: 'practical-applications',
      type: 'text-full',
      title: 'Real World Applications',
      note: 'APPLICATIONS',
      content: `
  # Intelligent Applications
  
  ## 1. Enhanced Search & Discovery
  - Natural language understanding
  - Semantic search capabilities
  - Multi-modal search
  - Context-aware results
  
  ## 2. Customer Experience
  - Intelligent support systems
  - Personalized recommendations
  - Contextual assistance
  - Automated responses
  
  ## 3. Knowledge Management
  - Automatic organization
  - Semantic relationships
  - Dynamic knowledge graphs
  - Intelligent retrieval
  
  ## 4. Operational Intelligence
  - Pattern recognition
  - Anomaly detection
  - Predictive insights
  - Automated decision support
  
  > "From storing data to delivering insights"
      `
    },
    {
      id: 'future-direction',
      type: 'text-full',
      title: 'The Road Ahead',
      note: 'LOOKING FORWARD',
      content: `
  # Future of Data Intelligence
  
  ## Emerging Capabilities
  - Multi-modal intelligence
  - Cross-domain understanding
  - Autonomous learning
  - Real-time adaptation
  
  ## Key Developments
  - Advanced embedding techniques
  - Improved context understanding
  - Enhanced reasoning capabilities
  - Deeper knowledge integration
  
  ## Next Steps
  1. Explore vector search capabilities
  2. Integrate with LLM technologies
  3. Build intelligent applications
  4. Transform your data journey
  
  > "The journey from data to intelligence is continuous - start today"
      `
    }
  ];

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

      // Enhance the data with product-specific images
      const enhancedData = data.map(item => ({
        ...item,
        image: productImageService.findBestMatch(
          item.title,
          item.description,
          item.category
        )
      }));

      setAllData(enhancedData);

      // Preload images for better performance
      await productImageService.preloadImages();
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
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: null
      };

      if (searchType === 'image') {
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('type', 'image');
        config.body = formData;
        delete config.headers['Content-Type']; // Let browser set correct content-type for FormData
        console.debug('Preparing image search:', { imageSize: selectedImage.size });
      } else {
        config.headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify({
          query: searchTerm,
          type: searchType,
          options: searchType === 'atlas' ? searchOptions : undefined
        });
      }

      console.debug('Search configuration:', {
        url: `${API_URL}/search`,
        method: config.method,
        headers: config.headers,
        type: searchType
      });

      const response = await fetch(`${API_URL}/search`, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `Server error: ${response.status} ${response.statusText}`
        }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      updateSearchResults(data);
    } catch (error) {
      console.error('Search request failed:', error);
      setError(error.message || 'Failed to perform search. Please try again.');
      setResults([]);
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
    if (!data || !Array.isArray(data.results)) {
      console.error('Invalid response data:', data);
      setError('Invalid response from server');
      setResults([]);
      return;
    }

    setResults(data.results);
    setSearchTime(data.searchTime);
    setShowCommand(true);
    setCurrentCommand(getCommandSyntax());
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

  const getCommandSyntax = () => {
    switch (searchType) {
      case 'basic':
        return `db.products.find({
  $or: [
    { name: { $regex: "${searchTerm}", $options: "i" } },
    { description: { $regex: "${searchTerm}", $options: "i" } }
  ]
})`;
      case 'atlas':
        return `db.products.aggregate([
  {
    $search: {
      index: "default",
      text: {
        query: "${searchTerm}",
        path: ["name", "description"],
        fuzzy: { maxEdits: 1 }
      }
    }
  },
  { $limit: 10 }
])`;
      case 'vector':
        return `db.products.aggregate([
  {
    $vectorSearch: {
      queryVector: generateEmbedding("${searchTerm}"), // [0.1, 0.2, ...]
      path: "embedding",
      numCandidates: 100,
      limit: 10,
      index: "vector_index",
    }
  }
])`;
      case 'semantic':
        return `// 1. Process query with LLM
const enhancedQuery = await llm.enhance("${searchTerm}");

// 2. Vector search with enhanced query
db.products.aggregate([
  {
    $vectorSearch: {
      queryVector: generateEmbedding(enhancedQuery),
      path: "embedding",
      numCandidates: 100,
      limit: 10,
      index: "vector_index",
    }
  }
])`;
      case 'image':
        return `// 1. Generate image embedding
const imageEmbedding = await vision.generateEmbedding(uploadedImage);

// 2. Vector search with image embedding
db.products.aggregate([
  {
    $vectorSearch: {
      queryVector: imageEmbedding, // [0.1, 0.2, ...]
      path: "imageEmbedding",
      numCandidates: 100,
      limit: 10,
      index: "image_vector_index",
    }
  }
])`;
      default:
        return '';
    }
  };

  const renderEnhancedSearchInterface = () => (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold">MongoDB Search Evolution</CardTitle>
            <p className="text-sm text-slate-600">From Basic Queries to Intelligent Vector Search</p>
          </div>
          <div className="flex gap-2 self-end sm:self-auto">
            <button
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
              onClick={() => setShowDiagram(!showDiagram)}
            >
              <Layout size={20} />
            </button>
            <button
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
              onClick={() => setViewMode('presentation')}
            >
              <MonitorPlay size={20} />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Search Type Selector - Mobile Dropdown */}
        <div className="block sm:hidden">
          <select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
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

        {/* Search Type Selector - Desktop Grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {searchTypes.map((type) => (
            <div key={type.id} className="relative group">
              <button
                onClick={() => {
                  setSearchType(type.id);
                  if (type.id === 'image') {
                    triggerImageUpload();
                  }
                }}
                className={`w-full p-4 rounded-xl transition-all ${searchType === type.id
                  ? `${type.color} text-white shadow-lg scale-105`
                  : 'bg-slate-100 hover:bg-slate-200'
                  }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <type.icon size={24} />
                  <span className="font-medium">{type.name}</span>
                </div>
              </button>
              <div className="hidden group-hover:block absolute left-1/2 transform -translate-x-1/2 top-full mt-2 z-30 w-48 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg">
                {type.tip}
              </div>
            </div>
          ))}
        </div>

        {/* Search Input Area */}
        <div className="relative mt-8 space-y-4">
          {searchType !== 'image' ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder={searchTypes.find(t => t.id === searchType)?.placeholder}
                  className="flex-1 p-3 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <div className="flex gap-2">
                  <button
                    className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-white ${isSearching ? 'bg-slate-400' : searchTypes.find(t => t.id === searchType)?.color
                      }`}
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    <Search size={20} />
                  </button>
                  <button
                    onClick={() => setShowCommand(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border"
                  >
                    <Code size={16} />
                    <span className="sm:hidden">Query</span>
                    <span className="hidden sm:inline">View Query</span>
                  </button>
                </div>
              </div>
              {/* Atlas Search Options */}
              {searchType === 'atlas' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {renderSearchOptions()}
                </div>
              )}
            </div>
          ) : (
            renderImagePreview()
          )}

          {/* Results Area */}
          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-sm text-slate-600">
                  Found {results.length} results in {searchTime}ms
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderResults()}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
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
    <div className="flex flex-wrap gap-2 mb-4">
      {['search', 'data', 'compare', 'presentation'].map((mode) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === mode
            ? 'bg-[#00ED64] text-white'
            : 'bg-white text-[#001E2B] hover:bg-[#E3FCF7]'
            }`}
        >
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </button>
      ))}
    </div>
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewMode === 'presentation') {
        if (e.key === 'ArrowRight' || e.key === 'Space') {
          setCurrentSlide((prev) => (prev + 1) % presentationSlides.length);
        } else if (e.key === 'ArrowLeft') {
          setCurrentSlide((prev) => (prev - 1 + presentationSlides.length) % presentationSlides.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, presentationSlides.length]);

  const renderPresentationMode = () => {
    const slide = presentationSlides[currentSlide];
    const isTextOnlySlide = slide.type === 'text-full';
    const Component = slide.component;
  
    return (
      <div className="fixed inset-0 bg-black overflow-hidden">
        {/* Fixed Navigation Controls */}
        <div className="absolute top-4 right-4 flex gap-4 z-20">
          <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + presentationSlides.length) % presentationSlides.length)}
            className="text-white/50 hover:text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-white/50">
            {currentSlide + 1} / {presentationSlides.length}
          </span>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % presentationSlides.length)}
            className="text-white/50 hover:text-white"
          >
            <ChevronRight size={24} />
          </button>
        </div>
  
        {/* Main Content Area with Conditional Layout */}
        {isTextOnlySlide ? (
          <div className="h-full flex flex-col pt-16">
            {/* Fixed Header */}
            <div className="px-24 py-8 bg-black">
              <h2 className="text-[#00ED64] text-xl tracking-wide uppercase text-center">{slide.note}</h2>
              <h1 className="text-5xl font-bold tracking-tight text-center text-white">{slide.title}</h1>
            </div>
            
            {/* Conditional Content Rendering */}
            {slide.component ? (
              <div className="flex-1">
                <Component />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-24 pb-16">
                <div className="w-full">
                  <MarkdownSlideContent content={slide.content} />
                </div>
              </div>
            )}
          </div>
        ) : (
          // Standard split layout
          <div className="absolute inset-0 flex items-center justify-center p-8 mt-16">
            <div className="w-full max-w-[90%] h-full flex flex-col lg:flex-row items-center justify-between">
              {/* Text Content */}
              <div className="flex flex-col space-y-4 lg:space-y-8 lg:w-2/5 max-w-lg mx-auto text-white">
                <div>
                  <h2 className="text-[#00ED64] text-xl tracking-wide uppercase">{slide.note}</h2>
                  <h1 className="text-5xl font-bold tracking-tight">{slide.title}</h1>
                </div>
                <MarkdownSlideContent content={slide.content} />
              </div>
  
              {/* Image or Component */}
              <div className="flex items-center justify-center lg:w-3/5 w-full h-full">
                {slide.component ? (
                  <Component />
                ) : slide.image ? (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                  />
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };


  const renderMainContent = () => {
    switch (viewMode) {
      case 'compare':
        return <SearchComparison />;
      case 'search':
        return renderEnhancedSearchInterface();
      case 'data':
        return renderDataTable();
      case 'presentation':
        return renderPresentationMode();
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
        onClick={() => {
          setSearchType('image');
          triggerImageUpload();
        }}
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

  const renderImagePreview = () => {
    if (!selectedImage) {
      return (
        <div
          onClick={triggerImageUpload}
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50"
        >
          <Image size={48} className="text-slate-400 mb-2" />
          <p className="text-sm text-slate-600">Click to upload an image</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="relative">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className="w-full max-h-64 object-contain rounded-lg"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>
        {imageDescription && (
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">{imageDescription}</p>
          </div>
        )}
      </div>
    );
  };

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
              className="flex flex-col space-y-2 p-4 border rounded-lg bg-white shadow-md overflow-hidden"
            >
              {/* Title */}
              <h4 className="font-semibold text-[#001E2B] truncate">
                <HighlightedText
                  text={result.title}
                  highlights={result.highlights?.filter(h => h.path === 'title')}
                />
              </h4>

              {/* Description */}
              <p
                className="text-sm text-[#1C2D38] line-clamp-3"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3, // Limit to 3 lines
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                <HighlightedText
                  text={result.description}
                  highlights={result.highlights?.filter(h => h.path === 'description')}
                />
              </p>

              {/* Footer Section */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{result.category}</span>
                <span className="text-sm font-semibold text-[#001E2B]">${result.price}</span>
                <SearchMatchIndicator result={result} searchType={searchType} options={searchOptions} />
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
    <div className="min-h-screen bg-[#F3F3F3] p-4">
      {/* Mode Toggle - Always Visible */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="max-w-7xl mx-auto">
          {renderModeToggle()}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto mt-16">
        {renderMainContent()}
      </div>
    </div>
  );
}

export default App;
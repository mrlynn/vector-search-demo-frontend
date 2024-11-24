import React, { useState, useEffect } from 'react';
import { Database, Search, Radar, Brain, ArrowRight, Loader2 } from 'lucide-react';
import config from '../../config';

const SearchJourney = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('coffee maker');
  const [results, setResults] = useState({
    basic: [],
    vector: [],
    semantic: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = config.apiUrl;

  const stages = [
    {
      id: 'basic',
      title: 'Traditional Database',
      icon: Database,
      color: 'bg-blue-500',
      searchType: 'basic',
      description: 'Traditional search looks for exact text matches',
    },
    {
      id: 'vector',
      title: 'Vector Search',
      icon: Radar,
      color: 'bg-purple-500',
      searchType: 'vector',
      description: 'Vector search finds similar items based on meaning',
    },
    {
      id: 'semantic',
      title: 'Semantic Understanding',
      icon: Brain,
      color: 'bg-green-500',
      searchType: 'semantic',
      description: 'Semantic search understands user intent and context',
    }
  ];

  const performSearch = async (term, searchType) => {
    try {
      const response = await fetch(`${API_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: term,
          type: searchType,
        }),
      });

      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error(`Error in ${searchType} search:`, error);
      return [];
    }
  };

  const searchAllMethods = async (term) => {
    setIsLoading(true);
    try {
      const [basicResults, vectorResults, semanticResults] = await Promise.all([
        performSearch(term, 'basic'),
        performSearch(term, 'vector'),
        performSearch(term, 'semantic'),
      ]);

      setResults({
        basic: basicResults.slice(0, 5),
        vector: vectorResults.slice(0, 5),
        semantic: semanticResults.slice(0, 5),
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    searchAllMethods(searchTerm);
  }, [searchTerm]);

  // Auto-advance stages every 4 seconds unless loading
  useEffect(() => {
    if (isLoading) return;
    
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [isLoading]);

  const getResultMetric = (result, stageId) => {
    switch (stageId) {
      case 'basic':
        return result.highlights ? 
          `${result.highlights.length} matches` : 
          'Text match';
      case 'vector':
        return result.score ? 
          `${(result.score * 100).toFixed(1)}% similar` : 
          'Vector match';
      case 'semantic':
        return result.relevance || 'Semantic match';
      default:
        return '';
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-lg p-6 flex flex-col">
      {/* Search Input */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50"
            placeholder="Try searching for products..."
          />
          {isLoading ? (
            <Loader2 className="absolute right-3 top-3 text-gray-400 animate-spin" size={20} />
          ) : (
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          )}
        </div>
      </div>

      {/* Journey Visualization */}
      <div className="flex justify-between mb-8">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index === activeStage;
          
          return (
            <React.Fragment key={stage.id}>
              <div 
                className={`flex flex-col items-center cursor-pointer ${
                  isActive ? 'scale-110' : 'opacity-50'
                } transition-all duration-300`}
                onClick={() => setActiveStage(index)}
              >
                <div className={`p-4 rounded-full ${stage.color} mb-2`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-sm font-medium">{stage.title}</span>
              </div>
              {index < stages.length - 1 && (
                <ArrowRight className="text-gray-300 self-center" size={24} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Results Display */}
      <div className="flex-1 bg-gray-50 rounded-lg p-4">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : (
          <div className="space-y-3">
            {results[stages[activeStage].id]?.map((result, index) => (
              <div
                key={index}
                className={`p-4 bg-white rounded-lg shadow-sm border-l-4 ${
                  stages[activeStage].color
                } transform transition-all duration-300`}
                style={{
                  opacity: 1 - (index * 0.15),
                  transform: `translateX(${index * 8}px)`
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-gray-500 truncate">
                      {result.description}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                    {getResultMetric(result, stages[activeStage].id)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stage Description */}
      <div className="mt-4 text-center text-sm text-gray-600">
        {stages[activeStage].description}
      </div>
    </div>
  );
};

export default SearchJourney;
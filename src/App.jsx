import React, { useState, useRef, useEffect } from 'react';
import PresentationMode from './features/presentation/components/PresentationMode';
import renderModeToggle from './components/renderModeToggle';
import EnhancedSearchInterface from './features/search/components/EnhancedSearchInterface';
import DataTable from './features/data/components/DataTable';
import {
  Search, Image, FileText, MessagesSquare, Database,
  Radar, Brain, Hand, Code, X, Info, ChevronDown,
  ChevronUp, MonitorPlay, ChevronLeft, ChevronRight,
  Maximize2, Layout
} from 'lucide-react';

// Core components
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

import SearchComparison from './SearchComparison';
import HighlightedText from './HighlightedText';
import SearchMatchIndicator from './SearchMatchIndicator';
import SearchFlowDiagram from './SearchFlowDiagram';
import ProductImage from './components/ProductImage';

// Services and config
import config from './config';
import { productImageService } from './services/productImageService';

// Presentation components - these will eventually move to features/presentation
import { presentationSlides } from './features/presentation/slides';
import { presentationMetadata } from './features/presentation/constants/metaData';
import { SearchInterface } from './features/search/components/SearchInterface';
import { VIEW_MODES, searchTypes } from './features/search/constants/SearchTypes';

export default function App() {
  // State management
  const [viewMode, setViewMode] = useState(VIEW_MODES.SEARCH);
  const [presentationState, setPresentationState] = useState({
    currentSlide: 0,
    isAutoPlaying: true,
  });

  // Search state - will move to features/search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('basic');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [searchTime, setSearchTime] = useState(null);
  const [searchOptions, setSearchOptions] = useState({
    fuzzyMatching: true,
    autoComplete: true,
    phraseMatching: true
  });
  const [tableData, setTableData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [filterText, setFilterText] = useState('');

  // UI state
  const [showDiagram, setShowDiagram] = useState(false);
  const [showCommand, setShowCommand] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [error, setError] = useState(null);
  const [imageDescription, setImageDescription] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [allData, setAllData] = useState([]);

  const fileInputRef = useRef(null);

  const handleRefreshData = async () => {
    setIsLoadingData(true);
    try {
      // Example data - replace with your actual data fetching logic
      const newData = [
        { id: 1, title: 'Sample 1', description: 'Description 1', score: 0.95 },
        { id: 2, title: 'Sample 2', description: 'Description 2', score: 0.87 },
        // Add more sample data as needed
      ];
      setTableData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/data`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  const handleExportData = () => {
    const csvContent = tableData.map(row =>
      Object.values(row).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };


  // Effect for presentation keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewMode === VIEW_MODES.PRESENTATION) {
        if (e.key === 'ArrowRight' || e.key === 'Space') {
          setPresentationState(prev => ({
            ...prev,
            currentSlide: (prev.currentSlide + 1) % presentationSlides.length
          }));
        } else if (e.key === 'ArrowLeft') {
          setPresentationState(prev => ({
            ...prev,
            currentSlide: (prev.currentSlide - 1 + presentationSlides.length) % presentationSlides.length
          }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  // Keep all your existing handlers
  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(`${config.apiUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchTerm,
          type: searchType,
          options: searchOptions
        }),
      });
  
      if (!response.ok) {
        throw new Error('Search failed');
      }
  
      const data = await response.json();
      setResults(data.results);
      setSearchTime(data.searchTime);
    } catch (error) {
      console.error('Search error:', error);
      setError(error.messagere);
    } finally {
      setIsSearching(false);
    }
  };

  const handleModeChange = (newMode) => {
    setViewMode(newMode);
  };

  const renderMainContent = () => {
    switch (viewMode) {
      case VIEW_MODES.SEARCH:
        return (
          <EnhancedSearchInterface
    searchTerm={searchTerm}
    onSearchTermChange={(value) => setSearchTerm(value)}
    onSearch={handleSearch}
    isSearching={isSearching}
    searchType={searchType}
    onSearchTypeChange={(type) => {
      console.log('Changing search type to:', type);  // Debug log
      setSearchType(type);
    }}
    searchOptions={searchOptions}
    onSearchOptionsChange={setSearchOptions}
    results={results}
    searchTime={searchTime}
    error={error}
  />
        );
      case VIEW_MODES.COMPARE:
        return <SearchComparison />;
      case VIEW_MODES.DATA:
        return (
          <DataTable
            data={tableData}
            onRefresh={handleRefreshData}
            onExport={handleExportData}
            isLoading={isLoadingData}
            filterText={filterText}
            onFilterChange={setFilterText}
          />
        );
      case VIEW_MODES.PRESENTATION:
        return (
          <PresentationMode
            currentSlide={presentationState.currentSlide}
            slides={presentationSlides}
            onNavigate={setPresentationState}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    handleRefreshData();
  }, []);

  // Keep all your existing UI components
  return (
    <div className="min-h-screen bg-black p-4">
      {/* Mode Toggle - Always Visible */}
      {/* <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4"> */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black">
        <div className="max-w-7xl mx-auto">
          {renderModeToggle({
            currentMode: viewMode,
            onModeChange: handleModeChange
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto mt-16">
        {renderMainContent()}
      </div>
    </div>
  );
}
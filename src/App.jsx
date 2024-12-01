import React, { useState, useRef, useEffect } from 'react';
import PresentationMode from './features/presentation/components/PresentationMode';
import renderModeToggle from './components/renderModeToggle';
import EnhancedSearchInterface from './features/search/components/EnhancedSearchInterface';
import DataTable from './features/data/components/DataTable';
import {
  Search, Image, FileText, MessagesSquare, Database,
  Radar, Brain, Hand, Code, X, Info, ChevronDown,
  ChevronUp, MonitorPlay, ChevronLeft, ChevronRight,
  Maximize2, Layout, Menu
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const getMobileMenuClasses = () => {
    const baseClasses = "md:hidden bg-black border-t border-white/10 transition-all duration-300";
    return isMobileMenuOpen 
      ? `${baseClasses} opacity-100 translate-y-0` 
      : `${baseClasses} opacity-0 -translate-y-2 pointer-events-none`;
  };

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
    // If in presentation mode, render without the header
    if (viewMode === VIEW_MODES.PRESENTATION) {
      return (
        <div className="fixed inset-0 bg-black">
          <PresentationMode
            currentSlide={presentationState.currentSlide}
            slides={presentationSlides}
            onNavigate={setPresentationState}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>
      );
    }

    // For all other modes, render with the header
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo/Title with fullscreen toggle */}
              <div className="flex items-center space-x-4">
                <h1 className="text-white text-xl font-semibold">MongoDB Vector Search</h1>
                <button
                  onClick={toggleFullscreen}
                  className="text-white/50 hover:text-white p-2 hidden sm:block"
                  title="Toggle fullscreen"
                >
                  <Maximize2 size={20} />
                </button>
              </div>

              {/* Desktop Mode Toggle */}
              <div className="hidden md:block">
                {renderModeToggle({
                  currentMode: viewMode,
                  onModeChange: handleModeChange
                })}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white p-2 focus:outline-none focus:ring-2 focus:ring-white/20 rounded"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Animated Mobile Menu */}
          <div className={getMobileMenuClasses()}>
            <div className="px-4 py-3 space-y-2">
              {renderModeToggle({
                currentMode: viewMode,
                onModeChange: (mode) => {
                  handleModeChange(mode);
                  setIsMobileMenuOpen(false);
                }
              })}
              <button
                onClick={() => {
                  toggleFullscreen();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left text-white/70 hover:text-white px-3 py-2 rounded flex items-center space-x-2"
              >
                <Maximize2 size={20} />
                <span>Toggle Fullscreen</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area with better height management */}
        <main className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto h-full py-8">
            {viewMode === VIEW_MODES.SEARCH && (
              <EnhancedSearchInterface
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onSearch={handleSearch}
                isSearching={isSearching}
                searchType={searchType}
                onSearchTypeChange={setSearchType}
                searchOptions={searchOptions}
                onSearchOptionsChange={setSearchOptions}
                results={results}
                searchTime={searchTime}
                error={error}
              />
            )}
            {viewMode === VIEW_MODES.COMPARE && <SearchComparison />}
            {viewMode === VIEW_MODES.DATA && (
              <DataTable
                data={tableData}
                onRefresh={handleRefreshData}
                onExport={handleExportData}
                isLoading={isLoadingData}
                filterText={filterText}
                onFilterChange={setFilterText}
              />
            )}
          </div>
        </main>
      </>
    );
  };

  useEffect(() => {
    handleRefreshData();
  }, []);

  // Keep all your existing UI components
  return (
    <div className="min-h-screen bg-black">
      {renderMainContent()}
    </div>
  );
}
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Presentation, Maximize2 } from 'lucide-react';

const PresentationMode = () => {
  const [currentMode, setCurrentMode] = useState('search'); // 'search' or 'slides'
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Sample slides data - you would replace these with your actual slides
  const slides = [
    {
      title: "From Data to Intelligence",
      subtitle: "MongoDB's Secret to AI-Powered Applications",
      image: "/api/placeholder/800/450"
    },
    {
      title: "The Evolution from Data to Intelligence",
      content: ["Data Explosion", "The Intelligence Era"],
      image: "/api/placeholder/800/450"
    },
    {
      title: "MongoDB's Vector Search",
      content: ["What is Vector Search?", "MongoDB's Approach"],
      image: "/api/placeholder/800/450"
    },
    // Add more slides as needed
  ];

  const handlePrevSlide = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
  };

  const toggleMode = () => {
    setCurrentMode(prev => prev === 'search' ? 'slides' : 'search');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex space-x-2">
            {/* Mode Toggle Buttons */}
            <button 
              className={`flex items-center px-4 py-2 rounded-lg ${
                currentMode === 'search' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
              onClick={() => setCurrentMode('search')}
            >
              <Search className="w-4 h-4 mr-2" />
              Search Mode
            </button>
            <button 
              className={`flex items-center px-4 py-2 rounded-lg ${
                currentMode === 'slides' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
              onClick={() => setCurrentMode('slides')}
            >
              <Presentation className="w-4 h-4 mr-2" />
              Slides Mode
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {currentMode === 'slides' && `Slide ${currentSlide + 1} of ${slides.length}`}
            </span>
          </div>
        </div>

        {currentMode === 'slides' ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <img 
                src={slides[currentSlide].image} 
                alt={`Slide ${currentSlide + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <h2 className="text-2xl font-bold">{slides[currentSlide].title}</h2>
                {slides[currentSlide].subtitle && (
                  <p className="text-lg opacity-90">{slides[currentSlide].subtitle}</p>
                )}
              </div>
              <button 
                className="absolute bottom-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20"
                onClick={() => {
                  // Handle fullscreen
                  const elem = document.documentElement;
                  if (!document.fullscreenElement) {
                    elem.requestFullscreen();
                  } else {
                    document.exitFullscreen();
                  }
                }}
              >
                <Maximize2 className="h-4 w-4 text-white" />
              </button>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <button
                className={`flex items-center px-4 py-2 rounded-lg border border-gray-300 ${
                  currentSlide === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={handlePrevSlide}
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              <button
                className={`flex items-center px-4 py-2 rounded-lg border border-gray-300 ${
                  currentSlide === slides.length - 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={handleNextSlide}
                disabled={currentSlide === slides.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="h-[600px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">Your search interface content here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresentationMode;
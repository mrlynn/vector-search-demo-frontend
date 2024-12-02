// src/features/presentation/components/PresentationMode.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Monitor } from 'lucide-react';
import MarkdownSlideContent from './MarkdownSlideContent';
import '../styles/presentation.css';
import PresentationWrapper from '../v2/components/PresentationWrapper';
import { PRESENTATION_FLAGS } from '../v2/config/flags';

export default function PresentationMode({ currentSlide, slides, onNavigate, onSpeakerNotesRef }) {
  console.log('PresentationMode mounting', { currentSlide, slides: !!slides });

  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);

  if (PRESENTATION_FLAGS.ENABLE_V2) {
      console.log('Attempting to use V2 component');

    const v2Component = (
      <PresentationWrapper
        currentSlide={currentSlide}
        slides={slides}
        onNavigate={onNavigate}
      />
    );

    // If V2 wrapper returned something, use it
    if (v2Component) {
      return v2Component;
    }
  }

  useEffect(() => {
    if (onSpeakerNotesRef) {
      onSpeakerNotesRef(openSpeakerNotes);
    }
  }, []);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (startX === null) return;
    const currentX = e.touches[0].clientX;
    const diffX = startX - currentX;

    if (diffX > 50) {
      handleNext(); // Swipe left: Next slide
      setStartX(null);
    } else if (diffX < -50) {
      handlePrevious(); // Swipe right: Previous slide
      setStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setStartX(null);
  };

  const slide = slides[currentSlide];
  const [startX, setStartX] = useState(null);

  const isTextOnlySlide = slide.type === 'text-full';
  const Component = slide.component;
  const [speakerWindow, setSpeakerWindow] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const getComponentWrapper = (children) => {
    // Add specific style overrides based on component type
    const componentSpecificStyles = {
      'Vector3DForce': 'bg-white rounded-lg shadow-lg',
      'CodeComparison': 'bg-white rounded-lg shadow-lg',
      'SearchComparison': 'bg-white rounded-lg shadow-lg',
      'VectorSearchDemo': 'bg-white rounded-lg shadow-lg',
      'VectorSearchDemo2': 'bg-white rounded-lg shadow-lg',
      'EmbeddingVisualizer': 'bg-white rounded-lg shadow-lg',
    };

    const componentName = Component?.name || Component?.displayName;
    const specificStyles = componentSpecificStyles[componentName] || '';

    return (
      <div className={`component-wrapper ${specificStyles}`}>
        {children}
      </div>
    );
  };

  const openSpeakerNotes = () => {
    // First check if we already have a window open
    if (speakerWindow && !speakerWindow.closed) {
      console.log('Speaker notes window already open, focusing on it');
      speakerWindow.focus();
      return;
    }

    // Open a simpler window with basic HTML
    const notesWindow = window.open(
      '',
      'speakerNotes',
      'width=800,height=600,menubar=no,toolbar=no,location=no,status=no'
    );

    if (notesWindow) {
      // Simple HTML structure
      const html = `
        <html>
          <head>
            <title>Speaker Notes</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: system-ui, -apple-system, sans-serif;
                background: #1a1a1a;
                color: white;
              }
              .notes-container {
                max-width: 800px;
                margin: 0 auto;
              }
              .slide-info {
                background: #2a2a2a;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
              .title {
                color: #00ED64;
                margin: 0 0 10px 0;
              }
              .notes {
                background: #333;
                padding: 15px;
                border-radius: 6px;
                margin-top: 10px;
              }
              .timer {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #00ED64;
                color: black;
                padding: 8px 16px;
                border-radius: 4px;
                font-family: monospace;
              }
            </style>
          </head>
          <body>
            <div id="speaker-notes-root">
              <div class="notes-container">
                <div class="timer" id="timer">00:00</div>
                <div class="slide-info">
                  <h2 class="title">Current Slide</h2>
                  <div id="current-notes"></div>
                </div>
                <div class="slide-info">
                  <h2 class="title">Next Slide</h2>
                  <div id="next-notes"></div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      notesWindow.document.write(html);
      notesWindow.document.close();

      // Set up timer
      const startTime = new Date();
      const timerElement = notesWindow.document.getElementById('timer');

      const updateTimer = () => {
        const elapsed = Math.floor((new Date() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timerElement.textContent =
          `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      };

      const timerInterval = setInterval(updateTimer, 1000);
      notesWindow.onbeforeunload = () => clearInterval(timerInterval);

      setSpeakerWindow(notesWindow);
      setStartTime(startTime);
    }
  };
  useEffect(() => {
    // Update speaker notes content
    if (speakerWindow && !speakerWindow.closed) {
      const currentNotesElement = speakerWindow.document.getElementById('current-notes');
      const nextNotesElement = speakerWindow.document.getElementById('next-notes');

      if (currentNotesElement) {
        currentNotesElement.innerHTML = `
          <h3>${slides[currentSlide].title}</h3>
          <div class="notes">
            ${slides[currentSlide].speakerNotes?.join('<br>') || 'No notes available'}
          </div>
        `;
      }

      if (nextNotesElement && currentSlide < slides.length - 1) {
        nextNotesElement.innerHTML = `
          <h3>${slides[currentSlide + 1].title}</h3>
          <div class="notes">
            ${slides[currentSlide + 1].speakerNotes?.join('<br>') || 'No notes available'}
          </div>
        `;
      }
    }
  }, [currentSlide, speakerWindow, slides]);

  const handlePrevious = () => {
    console.log('Navigating to previous slide');
    onNavigate(prev => ({
      ...prev,
      currentSlide: (prev.currentSlide - 1 + slides.length) % slides.length
    }));
  };

  const handleNext = () => {
    console.log('Navigating to next slide');
    onNavigate(prev => ({
      ...prev,
      currentSlide: (prev.currentSlide + 1) % slides.length
    }));
  };
  console.log('Rendering PresentationMode, currentSlide:', currentSlide);
  console.log('Should show speaker notes button:', true); // or whatever condition you want

  // src/features/presentation/components/PresentationMode.jsx
  return (
    <div className="relative">
      <div className="presentation-container min-h-screen bg-black"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="slide-content h-screen flex flex-col">
          {/* Navigation Controls */}
          
          <div className="absolute top-4 right-4 flex gap-4 z-20">
            <button
              onClick={handlePrevious}
              className="text-white/50 hover:text-white"
            >
              <ChevronLeft size={32} />
            </button>
            <span className="text-white/50">
              {currentSlide + 1} / {slides.length}
            </span>
            <button
              onClick={handleNext}
              className="text-white/50 hover:text-white"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex items-center justify-center p-8">
            {isTextOnlySlide ? (
              <div className="w-full h-full flex flex-col max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                  <h2 className="text-[#00ED64] text-xl tracking-wide uppercase text-center">
                    {slide.note}
                  </h2>
                  <h1 className="text-9xl font-bold tracking-tight text-center text-white">
                    {slide.title}
                  </h1>
                </div>

                {/* Component or Content */}
                <div className="flex-1 flex items-center justify-center">
                  {Component ? (
                    getComponentWrapper(<Component slide={slide} />)
                  ) : (
                    <div className="w-full max-w-4xl mx-auto">
                      <MarkdownSlideContent content={slide.content} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Split layout
              <div className="w-full h-full max-w-7xl mx-auto grid grid-cols-2 gap-16 items-center">
                {/* Text Content */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-[#00ED64] text-xl tracking-wide uppercase">
                      {slide.note}
                    </h2>
                    <h1 className="text-5xl font-bold tracking-tight text-white">
                      {slide.title}
                    </h1>
                  </div>
                  <MarkdownSlideContent content={slide.content} />
                </div>

                {/* Visual Content */}
                <div className="h-full flex items-center justify-center">
                  {Component ? (
                    getComponentWrapper(<Component />)
                  ) : slide.image ? (
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide-out Speaker Notes Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-96 bg-[#1a1a1a] transform transition-transform duration-300 shadow-xl ${
          showSpeakerNotes ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ zIndex: 9999 }}
      >
        <div className="p-6 text-white">
          <div className="mb-6">
            <h2 className="text-[#00ED64] text-xl font-bold mb-2">Current Slide</h2>
            <div className="bg-[#2a2a2a] p-4 rounded">
              <h3 className="font-medium mb-2">{slides[currentSlide].title}</h3>
              <div className="text-sm text-gray-300">
                {slides[currentSlide].speakerNotes?.map((note, index) => (
                  <p key={index} className="mb-2">{note}</p>
                )) || 'No notes available'}
              </div>
            </div>
          </div>

          {currentSlide < slides.length - 1 && (
            <div>
              <h2 className="text-[#00ED64] text-xl font-bold mb-2">Next Slide</h2>
              <div className="bg-[#2a2a2a] p-4 rounded">
                <h3 className="font-medium mb-2">{slides[currentSlide + 1].title}</h3>
                <div className="text-sm text-gray-300">
                  {slides[currentSlide + 1].speakerNotes?.map((note, index) => (
                    <p key={index} className="mb-2">{note}</p>
                  )) || 'No notes available'}
                </div>
              </div>
            </div>
          )}

          {/* Timer */}
          <div className="fixed top-4 right-4">
            <div className="bg-[#00ED64] text-black px-4 py-2 rounded font-mono">
              {/* You can add a timer here if needed */}
              00:00
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
        className="fixed bottom-4 right-4 bg-[#00ED64] hover:bg-[#00C050] text-black px-4 py-2 rounded-md flex items-center shadow-lg z-[9999]"
      >
        <Monitor className="mr-2 h-5 w-5" />
        Speaker Notes
      </button>
    </div>
  );
}
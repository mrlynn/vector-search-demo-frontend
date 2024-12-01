// src/features/presentation/components/PresentationMode.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Monitor } from 'lucide-react';
import MarkdownSlideContent from './MarkdownSlideContent';
import '../styles/presentation.css';
export default function PresentationMode({ currentSlide, slides, onNavigate }) {
  const slide = slides[currentSlide];
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
    onNavigate(prev => ({
      ...prev,
      currentSlide: (prev.currentSlide - 1 + slides.length) % slides.length
    }));
  };

  const handleNext = () => {
    onNavigate(prev => ({
      ...prev,
      currentSlide: (prev.currentSlide + 1) % slides.length
    }));
  };

  // src/features/presentation/components/PresentationMode.jsx
  return (
    <div className="presentation-container min-h-screen bg-black">
      <div className="slide-content h-screen flex flex-col">
        {/* Navigation Controls */}
        <div className="absolute top-4 right-4 flex gap-4 z-20">
          <button
            onClick={handlePrevious}
            className="text-white/50 hover:text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-white/50">
            {currentSlide + 1} / {slides.length}
          </span>
          <button
            onClick={handleNext}
            className="text-white/50 hover:text-white"
          >
            <ChevronRight size={24} />
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
                <h1 className="text-5xl font-bold tracking-tight text-center text-white">
                  {slide.title}
                </h1>
              </div>

              {/* Component or Content */}
              <div className="flex-1 flex items-center justify-center">
                {Component ? (
                  getComponentWrapper(<Component currentSlide={slide} />)
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

      {/* Speaker Notes Button */}
      <button
        onClick={openSpeakerNotes}
        className="fixed bottom-4 right-4 bg-[#00ED64] hover:bg-[#00C050] text-black px-4 py-2 rounded-md flex items-center shadow-lg z-50"
      >
        <Monitor className="mr-2 h-5 w-5" />
        Speaker Notes
      </button>
    </div>
  );
}
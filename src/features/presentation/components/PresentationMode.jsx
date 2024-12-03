import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Monitor } from 'lucide-react';
import MarkdownSlideContent from './MarkdownSlideContent';
import '../styles/presentation.css';

export default function PresentationMode({ currentSlide, slides, onNavigate, onSpeakerNotesRef }) {
  console.log('PresentationMode mounting', { currentSlide, slides: !!slides });

  const [startX, setStartX] = useState(null);
  const [speakerWindow, setSpeakerWindow] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const slide = slides[currentSlide];
  const isTextOnlySlide = slide.type === 'text-full';
  const Component = slide.component;

  useEffect(() => {
    if (onSpeakerNotesRef) {
      onSpeakerNotesRef(openSpeakerNotes);
    }
  }, []);

  const getComponentWrapper = (children) => {
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
    console.log('Opening speaker notes');
    if (speakerWindow && !speakerWindow.closed) {
      speakerWindow.focus();
      return;
    }

    const notesWindow = window.open(
      '',
      'speakerNotes',
      'width=800,height=600,menubar=no,toolbar=no,location=no,status=no'
    );

    if (notesWindow) {
      notesWindow.document.write(`
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
      `);
      notesWindow.document.close();

      const newStartTime = new Date();
      const timerElement = notesWindow.document.getElementById('timer');

      const updateTimer = () => {
        const elapsed = Math.floor((new Date() - newStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timerElement.textContent = 
          `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      };

      const timerInterval = setInterval(updateTimer, 1000);
      notesWindow.onbeforeunload = () => clearInterval(timerInterval);

      setSpeakerWindow(notesWindow);
      setStartTime(newStartTime);
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => setStartX(e.touches[0].clientX);
  const handleTouchMove = (e) => {
    if (startX === null) return;
    const currentX = e.touches[0].clientX;
    const diffX = startX - currentX;

    if (diffX > 50) {
      handleNext();
      setStartX(null);
    } else if (diffX < -50) {
      handlePrevious();
      setStartX(null);
    }
  };
  const handleTouchEnd = () => setStartX(null);

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

  // Update speaker notes when slide changes
  useEffect(() => {
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

  return (
    <>
      {/* Main presentation container */}
      <div className="min-h-screen bg-black relative">
        <div className="absolute top-4 right-4 flex gap-4 z-20">
          <button onClick={handlePrevious} className="text-white/50 hover:text-white">
            <ChevronLeft size={32} />
          </button>
          <span className="text-white/50">{currentSlide + 1} / {slides.length}</span>
          <button onClick={handleNext} className="text-white/50 hover:text-white">
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Slide Content */}
        <div className="h-screen flex items-center justify-center p-8">
          {isTextOnlySlide ? (
            <div className="w-full h-full flex flex-col max-w-7xl mx-auto">
              <div className="mb-8">
                <h2 className="text-[#00ED64] text-xl tracking-wide uppercase text-center">
                  {slide.note}
                </h2>
                <h1 className="text-9xl font-bold tracking-tight text-center text-white">
                  {slide.title}
                </h1>
              </div>
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
            <div className="w-full h-full max-w-7xl mx-auto grid grid-cols-2 gap-16 items-center">
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

      {/* Speaker Notes Button - Fixed position outside main container */}
      <button
        onClick={openSpeakerNotes}
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 99999,
          backgroundColor: '#00ED64',
          color: 'black',
          padding: '8px 16px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          border: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        <Monitor style={{ width: '20px', height: '20px' }} />
        <span>Speaker Notes</span>
      </button>
    </>
  );
}
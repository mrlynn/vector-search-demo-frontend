// src/features/presentation/components/speakerNotes.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import SpeakerNotesWindow from './SpeakerNotesWindow';

const root = createRoot(document.getElementById('speaker-notes-root'));

window.addEventListener('message', (event) => {
  if (event.data.type === 'SLIDE_CHANGE') {
    const { currentSlide, slides, startTime } = event.data;
    root.render(
      <SpeakerNotesWindow
        currentSlide={currentSlide}
        slides={slides}
        startTime={startTime}
      />
    );
  }
});
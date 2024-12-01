// src/features/presentation/v2/components/PresentationMode.tsx

import React from 'react';
import type { PresentationProps, SlideProps } from '../types';
import { TitleLayout, ContentLayout, SplitLayout, FullLayout } from '../layouts';
import { PresentationControls } from './PresentationControls';
import { PRESENTATION_FLAGS } from '../config/flags';

export default function PresentationMode({ 
  slides, 
  currentSlide, 
  onNavigate 
}: PresentationProps) {
  // Return early if V2 is not enabled
  if (!PRESENTATION_FLAGS.ENABLE_V2) {
    return null;
  }

  const slide = slides[currentSlide];
  
  const handlePrevious = () => {
    onNavigate((currentSlide - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    onNavigate((currentSlide + 1) % slides.length);
  };

  const renderSlide = (slide: SlideProps) => {
    switch (slide.layout) {
      case 'title':
        return <TitleLayout {...slide} />;
      case 'content':
        return <ContentLayout {...slide} />;
      case 'split':
        return <SplitLayout {...slide} />;
      case 'full':
        return <FullLayout {...slide} />;
      default:
        return <div>Invalid slide type</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <PresentationControls
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
      {renderSlide(slide)}
    </div>
  );
}
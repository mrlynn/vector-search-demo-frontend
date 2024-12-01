// src/features/presentation/v2/components/PresentationWrapper.tsx

import React from 'react';
import { PRESENTATION_FLAGS } from '../config/flags';
import PresentationModeV2 from './PresentationMode';
import { adaptSlides } from '../migration/slideAdapter';

interface WrapperProps {
  currentSlide: number;
  slides: any[]; // Using any for legacy slides
  onNavigate: (state: any) => void;
}

export default function PresentationWrapper(props: WrapperProps) {
  if (!PRESENTATION_FLAGS.ENABLE_V2) {
    // Return null and let the parent handle rendering the legacy version
    return null;
  }

  const adaptedSlides = adaptSlides(props.slides);

  return (
    <PresentationModeV2
      currentSlide={props.currentSlide}
      slides={adaptedSlides}
      onNavigate={props.onNavigate}
    />
  );
}
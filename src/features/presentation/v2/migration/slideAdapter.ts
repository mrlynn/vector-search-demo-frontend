// src/features/presentation/v2/migration/slideAdapter.ts
import React from 'react';
import type { SlideProps } from '../types';
import type { LegacySlide, AdapterOptions } from './types';

function adaptSlide(legacySlide: LegacySlide): SlideProps {
  // Handle title-full slides
  if (legacySlide.type === 'title-full') {
    return {
      layout: 'title',
      title: legacySlide.title,
      subtitle: legacySlide.note,
      notes: legacySlide.speakerNotes,
      // Preserve any custom text styling
      ...(legacySlide.textStyle && { textStyle: legacySlide.textStyle })
    };
  }

  // Special handling for slides with components
  if (legacySlide.component) {
    return {
      layout: 'full',
      title: legacySlide.title,
      subtitle: legacySlide.note,
      visual: React.createElement('div', 
        { className: 'w-full h-full flex items-center justify-center' },
        React.createElement(legacySlide.component, legacySlide.componentProps || {})
      ),
      notes: legacySlide.speakerNotes
    };
  }

  // Handle text-full slides
  if (legacySlide.type === 'text-full') {
    return {
      layout: 'content',
      title: legacySlide.title,
      subtitle: legacySlide.note,
      content: legacySlide.content,
      notes: legacySlide.speakerNotes
    };
  }

  // Handle split layout slides
  if (legacySlide.type === 'split') {
    return {
      layout: 'split',
      title: legacySlide.title,
      subtitle: legacySlide.note,
      content: legacySlide.content,
      visual: legacySlide.image ? 
        React.createElement('img', {
          src: legacySlide.image,
          alt: legacySlide.title || 'Slide visual',
          className: 'w-full h-full object-contain'
        }) : null,
      notes: legacySlide.speakerNotes
    };
  }

  // Default to content layout
  return {
    layout: 'content',
    title: legacySlide.title,
    subtitle: legacySlide.note,
    content: legacySlide.content,
    notes: legacySlide.speakerNotes
  };
}

export function adaptSlideWithOptions(
  legacySlide: LegacySlide, 
  options: AdapterOptions = {}
): SlideProps {
  try {
    const adapted = adaptSlide(legacySlide);
    
    if (options.preserveOriginalProps) {
      return {
        ...adapted,
        originalProps: legacySlide
      };
    }
    
    return adapted;
  } catch (error) {
    console.error('Error adapting slide:', error);
    return {
      layout: options?.defaultLayout || 'content',
      title: legacySlide.title || 'Error Slide',
      content: 'Error loading slide content'
    };
  }
}

export function adaptSlides(
  legacySlides: LegacySlide[], 
  options?: AdapterOptions
): SlideProps[] {
  return legacySlides.map((slide, index) => {
    try {
      return adaptSlideWithOptions(slide, options);
    } catch (error) {
      console.error(`Error adapting slide at index ${index}:`, error);
      return {
        layout: options?.defaultLayout || 'content',
        title: slide.title || `Slide ${index + 1}`,
        content: 'Error loading slide content'
      };
    }
  });
}

// Export the original adaptSlide for compatibility
export { adaptSlide };
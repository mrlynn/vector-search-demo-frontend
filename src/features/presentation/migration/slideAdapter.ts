// src/features/presentation/migration/slideAdapter.ts
import { SlideProps } from '../v2/types';
import { PRESENTATION_VERSION } from '../config/flags';

interface LegacySlide {
  type: string;
  title: string;
  note?: string;
  content?: any;
  component?: React.ComponentType;
  speakerNotes?: string[];
}

export function adaptSlide(legacySlide: LegacySlide): SlideProps | LegacySlide {
  // Only migrate slides if the feature flag is enabled for that type
  if (legacySlide.type === 'title' && PRESENTATION_VERSION.FEATURES.TITLE_SLIDES) {
    return {
      layout: 'title',
      title: legacySlide.title,
      subtitle: legacySlide.note,
      notes: legacySlide.speakerNotes,
    };
  }

  if (legacySlide.type === 'content' && PRESENTATION_VERSION.FEATURES.CONTENT_SLIDES) {
    return {
      layout: 'content',
      title: legacySlide.title,
      subtitle: legacySlide.note,
      content: legacySlide.content,
      notes: legacySlide.speakerNotes,
    };
  }

  // Return original slide if not migrating this type yet
  return legacySlide;
}
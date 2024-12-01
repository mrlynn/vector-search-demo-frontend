// src/features/presentation/v2/config/flags.ts

export const PRESENTATION_FLAGS = {
  ENABLE_V2: true,  // Enable V2 system
  FEATURES: {
    TITLE_SLIDES: true,  // Start with just title slides
    CONTENT_SLIDES: true,
    SPLIT_SLIDES: true,
    FULL_SLIDES: true
  }
} as const;
  
  // Helper to check if V2 and a specific feature are enabled
  export function isFeatureEnabled(feature: keyof typeof PRESENTATION_FLAGS.FEATURES): boolean {
    return PRESENTATION_FLAGS.ENABLE_V2 && PRESENTATION_FLAGS.FEATURES[feature];
  }
// src/features/presentation/config/flags.ts
export const PRESENTATION_VERSION = {
    LEGACY: 'legacy',
    V2: 'v2',
    // During migration, we can enable specific features individually
    FEATURES: {
      TITLE_SLIDES: false,
      CONTENT_SLIDES: false,
      SPLIT_SLIDES: false,
      FULL_SLIDES: false,
      SPEAKER_NOTES: false
    }
  } as const;
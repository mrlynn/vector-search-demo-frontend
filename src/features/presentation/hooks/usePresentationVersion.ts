// src/features/presentation/hooks/usePresentationVersion.ts
import { useState, useEffect } from 'react';
import { PRESENTATION_VERSION } from '../config/flags';

export function usePresentationVersion() {
  const [version, setVersion] = useState(PRESENTATION_VERSION.LEGACY);
  const [migrationStats, setMigrationStats] = useState({
    totalSlides: 0,
    migratedSlides: 0,
    errors: [] as string[]
  });

  const logMigrationError = (error: Error, slideIndex: number) => {
    console.error(`Migration error at slide ${slideIndex}:`, error);
    setMigrationStats(prev => ({
      ...prev,
      errors: [...prev.errors, `Slide ${slideIndex}: ${error.message}`]
    }));
  };

  return {
    version,
    setVersion,
    migrationStats,
    logMigrationError,
    isLegacy: version === PRESENTATION_VERSION.LEGACY,
    isV2: version === PRESENTATION_VERSION.V2
  };
}
// src/features/presentation/v2/components/PresentationControls.tsx

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ControlsProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const PresentationControls: React.FC<ControlsProps> = ({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
}) => (
  <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 rounded-full px-3 py-1 z-20">
    <button 
      onClick={onPrevious}
      className="text-white/50 hover:text-white transition-colors"
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
    <span className="text-white/50 text-sm">
      {currentSlide + 1} / {totalSlides}
    </span>
    <button 
      onClick={onNext}
      className="text-white/50 hover:text-white transition-colors"
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  </div>
);
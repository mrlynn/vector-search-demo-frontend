// src/features/presentation/v2/layouts/FullLayout.tsx

import React from 'react';
import type { SlideProps } from '../types';

export const FullLayout: React.FC<SlideProps> = ({ visual, title, subtitle }) => (
  <div className="relative h-screen w-screen flex flex-col">
    {/* Optional overlay for title/subtitle if provided */}
    {(title || subtitle) && (
      <div className="absolute top-8 left-8 z-10">
        {subtitle && (
          <h2 className="text-[#00ED64] text-xl mb-2 uppercase tracking-wider">
            {subtitle}
          </h2>
        )}
        {title && (
          <h1 className="text-4xl font-bold text-white">
            {title}
          </h1>
        )}
      </div>
    )}
    
    {/* Full-screen content container */}
    <div className="flex-1 w-full h-full">
      {visual}
    </div>
  </div>
);
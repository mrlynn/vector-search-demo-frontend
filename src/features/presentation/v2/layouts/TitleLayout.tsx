// src/features/presentation/v2/layouts/TitleLayout.tsx

import React from 'react';
import type { SlideProps } from '../types';

export const TitleLayout: React.FC<SlideProps> = ({ title, subtitle, content }) => (
  <div className="h-screen w-screen flex items-center justify-center">
    <div className="max-w-4xl text-center px-8">
      {subtitle && (
        <h2 className="text-[#00ED64] text-xl mb-4 uppercase tracking-wider">
          {subtitle}
        </h2>
      )}
      <h1 className="text-5xl font-bold text-white mb-8">
        {title}
      </h1>
      {content && (
        <div className="text-xl text-white/80">
          {content}
        </div>
      )}
    </div>
  </div>
);
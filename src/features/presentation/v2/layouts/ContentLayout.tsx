// src/features/presentation/v2/layouts/ContentLayout.tsx

import React from 'react';
import type { SlideProps } from '../types';
import { MarkdownContent } from '../components/MarkdownContent';

export const ContentLayout: React.FC<SlideProps> = ({ title, subtitle, content }) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center p-16">
      <div className="max-w-4xl w-full">
        <div className="flex flex-col">
          {subtitle && (
            <h2 className="text-[#00ED64] text-xl mb-4 uppercase tracking-wider">
              {subtitle}
            </h2>
          )}
          {title && (
            <h1 className="text-5xl font-bold text-white mb-8">
              {title}
            </h1>
          )}
          {typeof content === 'string' ? (
            <MarkdownContent 
              content={content}
              className="text-white/90"
            />
          ) : (
            <div className="text-white/90">
              {content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
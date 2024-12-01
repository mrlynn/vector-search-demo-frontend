// src/features/presentation/v2/layouts/SplitLayout.tsx

import React from 'react';
import type { SlideProps } from '../types';
import { MarkdownContent } from '../components/MarkdownContent';

export const SplitLayout: React.FC<SlideProps> = ({ title, subtitle, content, visual, image }) => (
  <div className="h-screen w-screen flex items-center justify-center">
    <div className="w-full max-w-7xl grid grid-cols-2 gap-8 px-16">
      {/* Content Side */}
      <div className="flex flex-col justify-center">
        {subtitle && (
          <h2 className="text-[#00ED64] text-xl mb-2 uppercase tracking-wider">
            {subtitle}
          </h2>
        )}
        <h1 className="text-4xl font-bold text-white mb-8">
          {title}
        </h1>
        {typeof content === 'string' ? (
          <div className="prose prose-invert prose-lg max-w-none">
            <MarkdownContent 
              content={content}
              className="prose-blockquote:border-[#00ED64] prose-blockquote:text-[#E6D5AC]"
            />
          </div>
        ) : (
          content
        )}
      </div>

      {/* Visual Side */}
      <div className="flex items-center justify-center">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-auto max-h-[70vh] rounded-lg object-contain"
          />
        ) : (
          visual
        )}
      </div>
    </div>
  </div>
);
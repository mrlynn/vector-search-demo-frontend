// src/features/presentation/v2/components/MarkdownContent.tsx

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, className = '' }) => {
  if (!content?.trim()) return null;
  
  return (
    <div className={`prose prose-invert prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          ul: ({children}) => (
            <ul className="list-disc space-y-2 text-white/90 mt-4">
              {children}
            </ul>
          ),
          li: ({children}) => (
            <li className="text-white/90">{children}</li>
          ),
          p: ({children}) => (
            <p className="text-white/90 mb-4 text-lg">{children}</p>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
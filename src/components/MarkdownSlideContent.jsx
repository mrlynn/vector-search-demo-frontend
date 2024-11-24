import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownSlideContent = ({ content }) => {
  return (
    <div className="prose prose-invert prose-lg w-full max-w-none">
      <ReactMarkdown
        components={{
          // Headings
          h1: ({node, ...props}) => <h1 className="text-4xl font-bold text-white mb-4 mt-8" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-3xl font-bold text-[#00ED64] mb-4 mt-6" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-2xl font-semibold text-white/90 mb-3 mt-4" {...props} />,
          
          // Paragraphs and lists
          p: ({node, ...props}) => <p className="text-xl text-white/80 leading-relaxed mb-4" {...props} />,
          ul: ({node, ...props}) => <ul className="space-y-2 mb-4 list-disc" {...props} />,
          ol: ({node, ...props}) => <ol className="space-y-2 mb-4 list-decimal" {...props} />,
          li: ({node, ...props}) => (
            <li className="text-xl text-white/80 ml-6 leading-relaxed marker:text-[#00ED64]" {...props} />
          ),
          
          // Emphasis and strong
          em: ({node, ...props}) => <em className="text-[#00ED64] italic" {...props} />,
          strong: ({node, ...props}) => <strong className="text-[#00ED64] font-bold" {...props} />,
          
          // Code blocks
          code: ({node, inline, className, children, ...props}) => {
            const match = /language-(\w+)/.exec(className || '');
            return inline ? (
              <code className="bg-white/10 rounded px-1.5 py-0.5 text-[#00ED64]" {...props}>
                {children}
              </code>
            ) : (
              <div className="w-full max-w-none mb-4">
                <code className="block bg-[#1E1E1E] rounded-lg p-6 text-[#00ED64] overflow-x-auto text-lg w-full" {...props}>
                  {children}
                </code>
              </div>
            );
          },
          
          // Blockquotes
          blockquote: ({node, ...props}) => (
            <blockquote 
              className="border-l-4 border-[#00ED64] pl-6 my-6 text-white/70 italic" 
              {...props} 
            />
          ),
          
          // Horizontal rules
          hr: ({node, ...props}) => <hr className="border-white/20 my-8" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownSlideContent;
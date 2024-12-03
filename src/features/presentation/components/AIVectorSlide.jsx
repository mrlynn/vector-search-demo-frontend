import React, { useState, useEffect } from 'react';
import { ArrowRight, Binary, FileText, Brain, Search } from 'lucide-react';

// Typewriter component for animated text
const TypewriterText = ({ text, isActive, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Reset when not active
    if (!isActive) {
      setDisplayText('');
      setIndex(0);
      return;
    }

    // Don't proceed if we've finished typing
    if (index >= text.length) {
      if (onComplete) onComplete();
      return;
    }

    // Add next character
    const timer = setTimeout(() => {
      setDisplayText(text.slice(0, index + 1));
      setIndex(index + 1);
    }, 100);

    return () => clearTimeout(timer);
  }, [text, index, isActive, onComplete]);

  return (
    <span className="font-mono">
      {displayText}
      {isActive && index < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

// Vector animation component
const VectorAnimation = ({ numbers, isAnimating }) => (
  <div className={`font-mono text-2xl transition-opacity duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
    [{numbers.map((n, i) => (
      <span 
        key={i} 
        className="inline-block animate-fade-in" 
        style={{ animationDelay: `${i * 200}ms` }}
      >
        {n.toFixed(2)}{i < numbers.length - 1 ? ', ' : ''}
      </span>
    ))}]
  </div>
);


const AIVectorsSlide = () => {
  const [animationStep, setAnimationStep] = useState(0);
  const [isResetting, setIsResetting] = useState(false); 
  const showTyping = animationStep >= 0 && !isResetting;
  const showProcessing = animationStep >= 1 && !isResetting;
  const showVector = animationStep >= 2 && !isResetting;
  const showSearch = animationStep >= 3 && !isResetting;
  const showSimilar = animationStep >= 4 && !isResetting;


  const STEP_DURATION = 2000;  // 2 seconds per step
  const RESET_DURATION = 1000; // 1 second reset pause
  const TOTAL_STEPS = 5;       // Total number of animation steps


  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(current => {
        if (current >= TOTAL_STEPS - 1) {
          setIsResetting(true);
          setTimeout(() => {
            setIsResetting(false);
          }, RESET_DURATION);
          return 0;
        }
        return current + 1;
      });
    }, STEP_DURATION);

    return () => clearInterval(timer);
  }, []);



  return (
    <div className="p-8 bg-white rounded-lg shadow-lg min-w-[1000px] min-h-[1000px]">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-black">AI & Vectors: The Connection</h2>
          <p className="text-4xl text-black">
            How AI transforms human content into mathematical representations
          </p>
        </div>

        {/* Main Visualization */}
        <div className="flex flex-col items-center space-y-12">
          {/* Transformation Process */}
          <div className="flex items-center justify-between w-full max-w-9xl">
            {/* Human Content */}
            <div className="flex flex-col items-center space-y-2">
              <div className="p-4 bg-green-100 rounded-lg">
                <FileText size={40} className="text-blue-600 text-4xl" />
              </div>
              <span className="text-black font-medium">Human Content</span>
              <div className="text-xl text-black h-6">
  <TypewriterText 
    text="How to use MongoDB"
    isActive={showTyping} 
  />
</div>
            </div>

            {/* AI Processing */}
            <div className="flex flex-col items-center">
              <ArrowRight size={24} className={`text-gray-400 transition-opacity duration-300 ${showProcessing ? 'opacity-100' : 'opacity-0'}`} />
              <div className="p-2 bg-green-500 rounded-lg mt-2">
                <Brain size={24} className={`text-white ${showProcessing ? 'animate-pulse' : 'opacity-0'}`} />
              </div>
              <span className="text-lg text-black mt-1">AI Processing</span>
            </div>

            {/* Vector Embedding */}
            <div className="flex flex-col items-center space-y-2">
              <div className="p-4 bg-green-100 rounded-lg">
                <Binary size={40} className="text-blue-600" />
              </div>
              <span className="text-black font-medium">Vector Embedding</span>
              <div className="text-sm text-black font-mono h-6">
                <VectorAnimation 
                  numbers={[0.2, 0.8, 0.5, 0.3]} 
                  isAnimating={showVector}
                />
              </div>
            </div>

            {/* Similarity Search */}
            <div className="flex flex-col items-center">
              <ArrowRight size={24} className={`text-gray-400 transition-opacity duration-300 ${showSearch ? 'opacity-100' : 'opacity-0'}`} />
              <div className="p-2 bg-green-500 rounded-lg mt-2">
                <Search size={24} className={`text-white ${showSearch ? 'animate-pulse' : 'opacity-0'}`} />
              </div>
              <span className="text-sm text-black mt-1">Similarity Search</span>
            </div>

            {/* Similar Content */}
            <div className="flex flex-col items-center space-y-2">
              <div className="p-4 bg-green-100 rounded-lg">
                <FileText size={40} className="text-blue-600" />
              </div>
              <span className="text-black text-lg font-medium">Similar Content</span>
              <div className="text-sm text-black h-6">
                <span className={`transition-opacity duration-500 ${showSimilar ? 'opacity-100' : 'opacity-0'}`}>
                  "MongoDB Tutorial"
                </span>
              </div>
            </div>
          </div>

          {/* Key Points */}
          <div className="grid grid-cols-3 gap-8 w-full max-w-4xl">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-black mb-2">Vector Embeddings</h3>
              <p className="text-sm text-black">
                AI models convert text, images, and other content into numerical vectors that capture meaning and relationships
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-black mb-2">Mathematical Space</h3>
              <p className="text-sm text-black">
                Similar content produces similar vectors, allowing AI to measure relationships through vector mathematics
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-black mb-2">Efficient Search</h3>
              <p className="text-sm text-black">
                Vector databases can quickly find similar content by comparing these mathematical representations
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AIVectorsSlide;
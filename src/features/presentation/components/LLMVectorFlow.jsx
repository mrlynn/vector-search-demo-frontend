import React, { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LLMVectorFlow = () => {
  const [activeWord, setActiveWord] = useState({ text: '', color: '', vector: [] });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const words = [
    'hello',
    'world',
    'neural',
    'network',
    'language',
    'model',
    'vector',
    'semantic'
  ];

  const colors = [
    'text-blue-600',
    'text-green-600',
    'text-purple-600',
    'text-amber-600',
    'text-rose-600'
  ];

  const generateVector = () => {
    return Array.from({ length: 5 }, () => (Math.random()).toFixed(3));
  };

  useEffect(() => {
    const wordInterval = setInterval(() => {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Start processing animation
      setIsProcessing(true);
      
      // Set new word
      setActiveWord({
        text: randomWord,
        color: randomColor,
        vector: []
      });

      // After a brief delay, generate the vector
      setTimeout(() => {
        setActiveWord(prev => ({
          ...prev,
          vector: generateVector()
        }));
        setIsProcessing(false);
      }, 1000);
    }, 2000);

    return () => clearInterval(wordInterval);
  }, []);

  return (
    <Card className="w-full bg-white">
      <CardHeader className="border-b">
        <CardTitle>Text to Vector Transformation</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative h-64 flex items-center justify-between bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6">
          {/* Input Word Side */}
          <div className="w-1/3 flex flex-col items-center">
            <div className={`text-2xl font-mono font-bold transition-all duration-500 ${activeWord.color}`}>
              {activeWord.text}
            </div>
          </div>

          {/* LLM Processing Center */}
          <div className="relative">
            <div className="absolute -top-8 text-sm font-semibold text-slate-600">
              Language Model
            </div>
            <div className="relative">
              {/* Processing Animation Ring */}
              <div className={`absolute inset-0 rounded-full ${isProcessing ? 'animate-[spin_2s_linear_infinite]' : ''}`}>
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-transparent"></div>
              </div>
              {/* Brain Icon */}
              <div className={`w-20 h-20 bg-white rounded-full flex items-center justify-center border-2 
                ${isProcessing ? 'border-blue-400 shadow-lg shadow-blue-200/50' : 'border-slate-200'}
                transition-all duration-300`}>
                <Brain className={`w-10 h-10 ${isProcessing ? 'text-blue-500' : 'text-slate-400'}`} />
              </div>
            </div>
            <div className="absolute -bottom-8 text-sm font-semibold text-slate-600">
              Vector Embedding
            </div>
          </div>

          {/* Output Vector Side */}
          <div className="w-1/3 flex flex-col items-center">
            {activeWord.vector.length > 0 && (
              <div className={`font-mono text-sm transition-all duration-500 ${activeWord.color}`}>
                [{activeWord.vector.join(', ')}]
              </div>
            )}
          </div>

          {/* Connecting Lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LLMVectorFlow;
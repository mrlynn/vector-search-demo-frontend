import React, { useState, useEffect, useRef } from 'react';
import { Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VectorTransformation = () => {
  const [words] = useState([
    'Understanding', 'language', 'means', 'seeing', 'patterns',
    'in', 'the', 'underlying', 'semantic', 'structure'
  ]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [vectors, setVectors] = useState([]);
  const vectorsRef = useRef([]);

  const generateVector = () => {
    return Array.from({ length: 5 }, () => (Math.random()).toFixed(3));
  };

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => {
        if (prev >= words.length - 1) {
          return 0;
        }
        return prev + 1;
      });

      const newVector = generateVector();
      vectorsRef.current = [...vectorsRef.current, newVector].slice(-5);
      setVectors([...vectorsRef.current]);
    }, 2000);

    return () => clearInterval(wordInterval);
  }, [words.length]);

  return (
    <Card className="w-full bg-white">
      <CardHeader className="border-b">
        <CardTitle>Text to Vector Transformation</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative h-48 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
          {/* Input Text Side */}
          <div className="absolute left-12 top-1/2 -translate-y-1/2 w-48 h-8 overflow-hidden">
            <div className="relative w-full h-full">
              {words.map((word, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 text-lg font-mono text-gray-800 transition-all duration-1000
                    ${index === currentWordIndex ? 
                      'opacity-100 translate-x-12' : 
                      index === ((currentWordIndex - 1 + words.length) % words.length) ?
                      'opacity-0 translate-x-24' :
                      'opacity-0 -translate-x-12'
                    }`}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>

          {/* Center Brain Icon with Pulsing Effect */}
          <div className="relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-semibold text-blue-600">
              LLM
            </div>
            <div className="relative">
              {/* Pulse Animation */}
              <div className="absolute inset-0 rounded-full bg-blue-200 animate-ping opacity-20"></div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200 shadow-lg relative z-10">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-semibold text-blue-600">
              Embedding
            </div>
          </div>

          {/* Output Vectors Side */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-64 overflow-hidden">
            <div className="space-y-1">
              {vectors.map((vector, index) => (
                <div
                  key={index}
                  className={`font-mono text-sm text-gray-800 transition-all duration-1000
                    ${index === vectors.length - 1 ? 'opacity-100 translate-x-0' : 
                    'opacity-40 translate-x'}`}
                >
                  [{vector.join(', ')}]
                </div>
              ))}
            </div>
          </div>

          {/* Connecting Lines with Animated Gradient */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-px w-full bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 animate-gradient" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VectorTransformation;
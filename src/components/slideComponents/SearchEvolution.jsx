import React, { useState, useEffect } from 'react';
import { FileText, Brain, Radar } from 'lucide-react';

const SearchEvolution = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      icon: FileText,
      title: 'Basic Search',
      description: 'Simple text matching using regex',
      color: 'bg-blue-500'
    },
    {
      icon: Radar,
      title: 'Vector Search',
      description: 'Understanding context and relationships',
      color: 'bg-purple-500'
    },
    {
      icon: Brain,
      title: 'Semantic Search',
      description: 'Intelligent understanding with LLMs',
      color: 'bg-[#00ED64]'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full h-full p-8">
      <div className="h-full flex flex-col items-center justify-center">
        <div className="space-y-12 w-full max-w-2xl">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            
            return (
              <div
                key={index}
                className={`transform transition-all duration-500 ${
                  isActive ? 'scale-110' : 'scale-90 opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${step.color}`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="h-8 w-0.5 bg-gray-200 ml-6 my-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchEvolution;

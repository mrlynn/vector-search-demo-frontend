import React, { useState } from 'react';
import { ArrowRight, Database, Search, Brain, ChevronLeft, ChevronRight } from 'lucide-react';

const VectorSearchFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const steps = [
    {
      title: "Original Document",
      content: `{
  "_id": "123",
  "title": "MongoDB Basics",
  "content": "Learn about MongoDB..."
}`,
      icon: Database
    },
    {
      title: "Generate Embeddings",
      content: `// Using LLM to create embeddings
embed("Learn about MongoDB...")`,
      icon: Brain
    },
    {
      title: "Store Embeddings",
      content: `{
  "_id": "123",
  "title": "MongoDB Basics",
  "content": "Learn about MongoDB...",
  "contentVector": [0.12, 0.34, ...]
}`,
      icon: Database
    },
    {
      title: "Vector Search Query",
      content: `db.collection.aggregate([{
  $vectorSearch: {
    queryVector: embed("How to use MongoDB"),
    path: "contentVector",
    numCandidates: 100,
    limit: 10
  }
}])`,
      icon: Search
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col space-y-8">
        <h2 className="text-2xl font-bold text-center mb-4 text-black">Vector Search Process</h2>
        
        {/* Timeline visualization */}
        <div className="flex justify-between items-center">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div key={index} className="flex items-center">
                <div className={`flex flex-col items-center ${index === activeStep ? 'scale-110 transition-transform duration-300' : ''}`}>
                  <div className={`p-4 rounded-full ${index === activeStep ? 'bg-blue-500 text-black' : 'bg-gray-200'}`}>
                    <StepIcon size={24} />
                  </div>
                  <span className="text-black text-lg mt-2 font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="mx-4 text-gray-400" />
                )}
              </div>
            );
          })}
        </div>

        {/* Code visualization */}
        <div className="bg-gray-50 p-4 rounded-lg min-h-48">
          <pre className="text-2xl overflow-x-auto">
            <code className="text-black">
              {steps[activeStep].content}
            </code>
          </pre>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
          >
            <ChevronLeft className="mr-2" /> Previous
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
          >
            Next <ChevronRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VectorSearchFlow;
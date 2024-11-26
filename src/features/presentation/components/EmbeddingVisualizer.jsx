import React, { useState, useEffect } from 'react';
import { ArrowRight, Type, Binary, ChartBar } from 'lucide-react';

const EmbeddingVisualizer = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const sampleText = "leather jacket";
  const vectorPreview = "[-0.023, 0.851, -0.142, ..., 0.467]";
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      title: "Input Text",
      icon: <Type className="w-6 h-6" />,
      content: sampleText,
      description: "Natural language input"
    },
    {
      title: "Tokenization",
      icon: <Binary className="w-6 h-6" />,
      content: "['leather', 'jacket']",
      description: "Text broken into tokens"
    },
    {
      title: "Embedding",
      icon: <ChartBar className="w-6 h-6" />,
      content: vectorPreview,
      description: "1536-dimensional vector"
    }
  ];

  const traditionalSearchCode = `db.products.find({ 
  name: "leather jacket" 
})`;

  const vectorSearchCode = `db.products.aggregate([
  { 
    "$vectorSearch": {
      "queryVector": embedding,
      "path": "description_vector"
    }
  }
])`;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-8 text-center">Text to Vector Transformation</h2>
      
      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <div className={`flex flex-col items-center w-1/3 transition-all duration-500 ${
              activeStep === index ? 'scale-110' : 'opacity-70'
            }`}>
              <div className={`p-4 rounded-full mb-4 ${
                activeStep === index ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {step.icon}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <div className="text-sm text-center mb-2">{step.description}</div>
              <div className={`p-3 rounded bg-gray-50 font-mono text-sm w-full text-center overflow-hidden ${
                activeStep === index ? 'bg-blue-50' : ''
              }`}>
                {step.content}
              </div>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className={`w-6 h-6 text-gray-400 ${
                activeStep === index ? 'text-blue-500' : ''
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Vector Search Ready</h3>
        <p className="text-sm text-gray-600">
          The resulting vector can now be used for semantic similarity search,
          finding related content based on meaning rather than exact matches.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-semibold text-sm mb-2">Traditional Search</h4>
          <pre className="text-xs overflow-x-auto">
            <code>{traditionalSearchCode}</code>
          </pre>
        </div>
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-semibold text-sm mb-2">Vector Search</h4>
          <pre className="text-xs overflow-x-auto">
            <code>{vectorSearchCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default EmbeddingVisualizer;
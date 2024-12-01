import React, { useState } from 'react';
import { Search, Brain, ChevronLeft, ChevronRight, FileText, ThumbsUp, Hash } from 'lucide-react';

const SemanticSearchExplainer = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const steps = [
    {
      title: "Traditional Keyword Search",
      icon: Hash,
      content: {
        query: "database performance",
        results: [
          "✓ Article about database performance",
          "✓ Performance tuning guide",
          "✗ Missing relevant content about 'slow queries'",
          "✗ Missing content about 'optimization'",
        ],
        explanation: "Keyword search only finds exact word matches, missing related concepts and synonyms."
      }
    },
    {
      title: "Semantic Understanding",
      icon: Brain,
      content: {
        query: "database performance",
        concepts: [
          "Speed optimization",
          "Query efficiency",
          "System resources",
          "Bottlenecks",
          "Tuning",
          "Slow queries"
        ],
        explanation: "AI understands the meaning and related concepts, not just the words."
      }
    },
    {
      title: "Vector Transformation",
      icon: FileText,
      content: {
        query: {
          text: "How to improve database performance?",
          vector: "[0.28, 0.92, 0.45, 0.67]"
        },
        similar_content: [
          {
            text: "Optimizing MongoDB query speed",
            vector: "[0.30, 0.89, 0.42, 0.71]",
            similarity: "95% similar"
          },
          {
            text: "Database tuning best practices",
            vector: "[0.25, 0.88, 0.48, 0.65]",
            similarity: "92% similar"
          },
          {
            text: "Analyzing slow running queries",
            vector: "[0.31, 0.85, 0.44, 0.69]",
            similarity: "90% similar"
          },
          {
            text: "Recipe for chocolate cake",
            vector: "[0.12, 0.15, 0.08, 0.22]",
            similarity: "15% similar"
          }
        ],
        explanation: "Similar meanings produce similar vector patterns. Distance between vectors measures semantic similarity."
      }
    },
    {
      title: "Semantic Results",
      icon: ThumbsUp,
      content: {
        query: "database performance",
        results: [
          "✓ Guide to database performance",
          "✓ How to optimize slow queries",
          "✓ Server resource management",
          "✓ Query optimization techniques"
        ],
        explanation: "Results include conceptually related content, even without exact keyword matches."
      }
    }
  ];

  const VectorDisplay = ({ text, vector, similarity }) => (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg mb-2 border border-gray-200">
      <div className="flex-1">
        <p className="text-black font-medium">{text}</p>
        <p className="font-mono text-sm text-gray-600">{vector}</p>
      </div>
      {similarity && (
        <div className={`ml-4 px-2 py-1 rounded ${
          parseFloat(similarity) > 80 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {similarity}
        </div>
      )}
    </div>
  );

  const renderContent = (content) => {
    if (content.query?.vector) {
      return (
        <div className="space-y-4">
          <div className="mb-6">
            <h4 className="text-black font-medium mb-2">Query Vector:</h4>
            <VectorDisplay text={content.query.text} vector={content.query.vector} />
          </div>
          <div>
            <h4 className="text-black font-medium mb-2">Similar Content Analysis:</h4>
            {content.similar_content.map((item, idx) => (
              <VectorDisplay 
                key={idx}
                text={item.text}
                vector={item.vector}
                similarity={item.similarity}
              />
            ))}
          </div>
          <p className="text-black italic mt-4">{content.explanation}</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {Object.entries(content).map(([key, value]) => {
          if (key === 'query') return null;
          if (Array.isArray(value)) {
            return (
              <div key={key} className="mt-4">
                <h4 className="text-black font-medium capitalize mb-2">{key}:</h4>
                <ul className="space-y-1">
                  {value.map((item, i) => (
                    <li key={i} className="text-black">{item}</li>
                  ))}
                </ul>
              </div>
            );
          }
          return (
            <div key={key} className="mt-4">
              <p className="text-black italic">{value}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-black">Understanding Semantic Search</h2>
          <p className="text-lg text-black">
            How AI-powered search understands meaning, not just keywords
          </p>
        </div>

        {/* Step Progress */}
        <div className="flex justify-between items-center px-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className={`
                    p-4 rounded-full transition-all duration-300
                    ${index === activeStep ? 'bg-blue-500 text-white scale-110' : 'bg-gray-100 text-black'}
                  `}
                >
                  <StepIcon size={24} />
                </div>
                <span className={`
                  mt-2 text-sm font-medium transition-all duration-300
                  ${index === activeStep ? 'text-blue-500' : 'text-black'}
                `}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="bg-gray-50 p-6 rounded-lg min-h-64">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Search size={20} className="text-blue-500" />
              <span className="text-black font-medium">Query: </span>
              <span className="text-black">
                {typeof steps[activeStep].content.query === 'string' 
                  ? steps[activeStep].content.query 
                  : steps[activeStep].content.query?.text}
              </span>
            </div>
            {renderContent(steps[activeStep].content)}
          </div>
        </div>

        {/* Navigation */}
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

export default SemanticSearchExplainer;
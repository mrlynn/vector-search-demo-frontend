import React, { useState, useRef } from 'react';
import { 
  Server, 
  Database, 
  Code2, 
  Search,
  ChevronRight,
  Terminal,
  PlayCircle,
  Check,
  Copy,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

const ImplementationSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showTroubleshooting, setShowTroubleshooting] = useState({});
  const [copiedStates, setCopiedStates] = useState({});
  
  const copyToClipboard = (code, stepId) => {
    navigator.clipboard.writeText(code);
    setCopiedStates({ ...copiedStates, [stepId]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [stepId]: false });
    }, 2000);
  };

  const toggleStepCompletion = (stepIndex) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepIndex)) {
      newCompleted.delete(stepIndex);
    } else {
      newCompleted.add(stepIndex);
    }
    setCompletedSteps(newCompleted);
  };

  const steps = [
    {
      icon: <Server className="w-6 h-6" />,
      title: "Set Up MongoDB Atlas",
      description: "Start with an M10 or higher cluster",
      code: `# Create a new cluster
atlas clusters create demo --tier M10
      
# Or enable vector search on existing cluster
atlas clusters describe demo`,
      verification: "Check Atlas UI: Vector Search should be available",
      type: 'terminal'
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Create Vector Index",
      description: "Define your vector search index",
      code: `db.runCommand({
  createSearchIndex: "products",
  definition: {
    mappings: {
      dynamic: true,
      fields: {
        "description_vector": {
          type: "knnVector",
          dimensions: 1536,
          similarity: "cosine"
        }
      }
    }
  }
})`,
      verification: "Index creation should complete successfully",
      type: 'mongodb'
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Generate & Store Embeddings",
      description: "Create and store vector embeddings",
      code: `const { OpenAI } = require('openai');
const openai = new OpenAI();

async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text
  });
  return response.data[0].embedding;
}

// Store product with embedding
async function storeProduct(product) {
  const embedding = await generateEmbedding(
    product.description
  );
  
  await collection.insertOne({
    ...product,
    description_vector: embedding
  });
}`,
      verification: "Check documents contain embedding vectors",
      type: 'javascript'
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Implement Vector Search",
      description: "Add vector search to your application",
      code: `async function searchProducts(queryText) {
  const embedding = await generateEmbedding(
    queryText
  );

  return await collection.aggregate([
    {
      "$vectorSearch": {
        "queryVector": embedding,
        "path": "description_vector",
        "numCandidates": 100,
        "index": "default",
      }
    },
    {
      "$project": {
        "name": 1,
        "description": 1,
        "score": { "$meta": "vectorSearchScore" }
      }
    },
    { "$limit": 5 }
  ]).toArray();
}`,
      verification: "Test search with sample queries",
      type: 'javascript'
    }
  ];

  const Progress = () => (
    <div className="mb-4">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Progress</span>
        <span>{completedSteps.size} of {steps.length} complete</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );

  const StepCard = ({ step, index }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            completedSteps.has(index) ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {completedSteps.has(index) ? (
              <Check className="w-6 h-6 text-green-600" />
            ) : (
              step.icon
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        </div>
        <button
          onClick={() => toggleStepCompletion(index)}
          className={`px-3 py-1 rounded-lg text-sm transition-all ${
            completedSteps.has(index)
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {completedSteps.has(index) ? 'Completed' : 'Mark Complete'}
        </button>
      </div>

      <div className="space-y-4">
        {/* Code Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-gray-600" />
              <h4 className="font-medium text-sm">Implementation</h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded ${
                step.type === 'terminal' ? 'bg-gray-200' :
                step.type === 'mongodb' ? 'bg-green-100' :
                'bg-yellow-100'
              }`}>
                {step.type}
              </span>
              <button
                onClick={() => copyToClipboard(step.code, step.id)}
                className="p-1 hover:bg-gray-200 rounded transition-all"
                title="Copy code"
              >
                {copiedStates[step.id] ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>
          <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
            <code>{step.code}</code>
          </pre>
        </div>

        {/* Verification Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PlayCircle className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-sm">Verification</h4>
            </div>
            {step.docsLink && (
              <a
                href={step.docsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <span>Docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">{step.verification}</p>
        </div>

        {/* Troubleshooting Section */}
        {step.troubleshooting && (
          <div className="bg-orange-50 p-4 rounded-lg">
            <button
              onClick={() => setShowTroubleshooting({
                ...showTroubleshooting,
                [step.id]: !showTroubleshooting[step.id]
              })}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <h4 className="font-medium text-sm">Troubleshooting</h4>
              </div>
              {showTroubleshooting[step.id] ? (
                <ChevronUp className="w-4 h-4 text-orange-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-orange-600" />
              )}
            </button>
            {showTroubleshooting[step.id] && (
              <div className="mt-2 space-y-2">
                {step.troubleshooting.map((item, i) => (
                  <div key={i} className="text-sm">
                    <p className="font-medium text-orange-800">{item.issue}</p>
                    <p className="text-gray-600">{item.solution}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto h-[500px] overflow-y-auto bg-white rounded-lg shadow-sm p-6">
      <Progress />
      
      {/* Steps Navigation */}
      <div className="flex justify-between mb-6 sticky top-0 bg-white z-10 pb-4">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`flex items-center space-x-2 p-2 rounded-lg transition-all ${
              currentStep === index
                ? 'bg-blue-500 text-white'
                : completedSteps.has(index)
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-opacity-20 bg-white">
              {completedSteps.has(index) ? (
                <Check className="w-5 h-5" />
              ) : (
                step.icon
              )}
            </div>
            <span className="hidden md:inline">{step.title}</span>
          </button>
        ))}
      </div>

      {/* Current Step */}
      <StepCard step={steps[currentStep]} index={currentStep} />
    </div>
  );
};

export default ImplementationSteps;
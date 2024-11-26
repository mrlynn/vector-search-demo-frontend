import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  MarkerType, 
  Position,
  useNodesState, 
  useEdgesState,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';

const DataFlowAnimationWrapper = () => {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '600px' }}>
        <DataFlowAnimation />
      </div>
    </ReactFlowProvider>
  );
};

const DataFlowAnimation = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [step, setStep] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const { fitView } = useReactFlow();
  
    const nodeStyle = {
        padding: 24,
        borderRadius: 12,
        border: '2px solid #1A1A1A',
        backgroundColor: '#1A1A1A',
        color: '#FFFFFF',
        width: 280,
        fontSize: '16px',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease'
      };
      
      const activeNodeStyle = {
        ...nodeStyle,
        backgroundColor: '#00ED64',
        color: '#000000',
        border: '2px solid #00ED64',
        boxShadow: '0 0 30px 10px rgba(0, 237, 100, 0.3)',
        zIndex: 1000,
      };

  // Define base nodes with increased spacing
  const initialNodes = [
    {
      id: 'user',
      type: 'default',
      position: { x: 400, y: 0 },
      data: { label: 'User Query' },
      style: nodeStyle,
    },
    {
      id: 'embedding',
      type: 'default',
      position: { x: 200, y: 150 },
      data: { label: 'Generate Embeddings' },
      style: nodeStyle,
    },
    {
      id: 'mongodb',
      type: 'default',
      position: { x: 400, y: 300 },
      data: { label: 'MongoDB Vector Search' },
      style: nodeStyle,
    },
    {
      id: 'results',
      type: 'default',
      position: { x: 600, y: 150 },
      data: { label: 'Similar Documents' },
      style: nodeStyle,
    },
    {
      id: 'llm',
      type: 'default',
      position: { x: 400, y: 450 },
      data: { label: 'LLM Processing' },
      style: nodeStyle,
    },
    {
      id: 'insights',
      type: 'default',
      position: { x: 400, y: 600 },
      data: { label: 'Generated Insights' },
      style: nodeStyle,
    },
  ];

  // Enhanced edge styling
  const initialEdges = [
    {
      id: 'user-embedding',
      source: 'user',
      target: 'embedding',
      animated: true,
      style: { stroke: '#00ED64', strokeWidth: 3 },
      markerEnd: { type: MarkerType.Arrow, color: '#00ED64' },
    },
    {
      id: 'embedding-mongodb',
      source: 'embedding',
      target: 'mongodb',
      animated: true,
      style: { stroke: '#00ED64', strokeWidth: 3 },
      markerEnd: { type: MarkerType.Arrow, color: '#00ED64' },
    },
    {
      id: 'mongodb-results',
      source: 'mongodb',
      target: 'results',
      animated: true,
      style: { stroke: '#00ED64', strokeWidth: 3 },
      markerEnd: { type: MarkerType.Arrow, color: '#00ED64' },
    },
    {
      id: 'results-llm',
      source: 'results',
      target: 'llm',
      animated: true,
      style: { stroke: '#00ED64', strokeWidth: 3 },
      markerEnd: { type: MarkerType.Arrow, color: '#00ED64' },
    },
    {
      id: 'llm-insights',
      source: 'llm',
      target: 'insights',
      animated: true,
      style: { stroke: '#00ED64', strokeWidth: 3 },
      markerEnd: { type: MarkerType.Arrow, color: '#00ED64' },
    },
  ];

  const nextStep = () => {
    setStep((prev) => (prev + 1) % animationSteps.length);
  };

  const previousStep = () => {
    setStep((prev) => (prev - 1 + animationSteps.length) % animationSteps.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(prev => !prev);
  };

  useEffect(() => {
    let timer;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        nextStep();
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);


  const animationSteps = [
    { node: 'user', edge: 'user-embedding', description: "User submits natural language query" },
    { node: 'embedding', edge: 'embedding-mongodb', description: "Query is converted to vector embeddings" },
    { node: 'mongodb', edge: 'mongodb-results', description: "MongoDB performs vector similarity search" },
    { node: 'results', edge: 'results-llm', description: "Retrieves most relevant documents" },
    { node: 'llm', edge: 'llm-insights', description: "LLM processes results with context" },
    { node: 'insights', description: "Returns intelligent insights to user" },
  ];

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  useEffect(() => {
    const currentStep = animationSteps[step];
    
    if (!currentStep) return;

    const updatedNodes = initialNodes.map(node => ({
      ...node,
      style: node.id === currentStep.node ? activeNodeStyle : nodeStyle,
    }));

    const updatedEdges = initialEdges.map(edge => ({
      ...edge,
      animated: edge.id === currentStep.edge,
      style: {
        ...edge.style,
        opacity: edge.id === currentStep.edge ? 1 : 0.3,
      },
    }));

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [step]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % animationSteps.length);
    }, 3000); // Increased duration to 3 seconds

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fitView({ padding: 0.2 });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [fitView]);

  return (
    <div className="w-full h-full bg-black rounded-lg relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        className="w-full h-full"
      >
        <Background color="#333" />
        <Controls className="text-white" />
      </ReactFlow>
      
      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-4">
        {/* Step Description */}
        <div className="bg-black/80 px-8 py-4 rounded-full border border-[#00ED64] text-white text-lg">
          {animationSteps[step]?.description}
        </div>

        {/* Navigation Controls */}
        <div className="flex gap-4 items-center">
          <button
            onClick={previousStep}
            className="px-6 py-2 rounded-full bg-black/80 border border-[#00ED64] text-white hover:bg-[#00ED64] hover:text-black transition-colors"
          >
            Previous
          </button>
          <button
            onClick={toggleAutoPlay}
            className={`px-6 py-2 rounded-full border border-[#00ED64] transition-colors ${
              isAutoPlaying 
                ? 'bg-[#00ED64] text-black' 
                : 'bg-black/80 text-white hover:bg-[#00ED64] hover:text-black'
            }`}
          >
            {isAutoPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={nextStep}
            className="px-6 py-2 rounded-full bg-black/80 border border-[#00ED64] text-white hover:bg-[#00ED64] hover:text-black transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataFlowAnimationWrapper;
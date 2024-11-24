import React, { useEffect, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  MarkerType, 
  useNodesState, 
  useEdgesState,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';

const SwimlaneFlowWrapper = () => {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '700px' }}>
        <SwimlaneFlow />
      </div>
    </ReactFlowProvider>
  );
};

const SwimlaneFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [step, setStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { fitView } = useReactFlow();

  const laneStyle = {
    padding: 24,
    borderRadius: 12,
    border: '2px solid #1A1A1A',
    backgroundColor: '#1A1A1A',
    color: '#FFFFFF',
    width: 200,
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  };

  const nodeStyle = {
    ...laneStyle,
    width: 180,
    padding: 16,
    fontSize: '14px',
  };

  const activeLaneStyle = {
    ...laneStyle,
    backgroundColor: '#1A1A1A',
    borderColor: '#00ED64',
    boxShadow: '0 0 30px 10px rgba(0, 237, 100, 0.1)',
    zIndex: 1000,
  };

  const activeNodeStyle = {
    ...nodeStyle,
    backgroundColor: '#00ED64',
    color: '#000000',
    border: '2px solid #00ED64',
    boxShadow: '0 0 30px 10px rgba(0, 237, 100, 0.3)',
    zIndex: 1000,
  };

  const lanes = [
    { id: 'user-lane', label: 'User', x: 100 },
    { id: 'app-lane', label: 'Application', x: 350 },
    { id: 'db-lane', label: 'MongoDB', x: 600 },
    { id: 'llm-lane', label: 'LLM', x: 850 }
  ];

  const initialNodes = [
    // Lane Headers
    ...lanes.map(lane => ({
      id: lane.id,
      type: 'default',
      position: { x: lane.x, y: 0 },
      data: { label: lane.label },
      style: laneStyle,
    })),

    // Flow Nodes
    { id: 'query', position: { x: lanes[0].x, y: 100 }, data: { label: 'Natural Language Query' }, style: nodeStyle },
    { id: 'parse', position: { x: lanes[1].x, y: 100 }, data: { label: 'Parse Query' }, style: nodeStyle },
    { id: 'vector-gen', position: { x: lanes[1].x, y: 200 }, data: { label: 'Generate Vector' }, style: nodeStyle },
    { id: 'vector-search', position: { x: lanes[2].x, y: 200 }, data: { label: 'Vector Search' }, style: nodeStyle },
    { id: 'results', position: { x: lanes[2].x, y: 300 }, data: { label: 'Return Results' }, style: nodeStyle },
    { id: 'context', position: { x: lanes[1].x, y: 300 }, data: { label: 'Build Context' }, style: nodeStyle },
    { id: 'prompt', position: { x: lanes[3].x, y: 300 }, data: { label: 'Generate Prompt' }, style: nodeStyle },
    { id: 'response', position: { x: lanes[3].x, y: 400 }, data: { label: 'Generate Response' }, style: nodeStyle },
    { id: 'format', position: { x: lanes[1].x, y: 400 }, data: { label: 'Format Response' }, style: nodeStyle },
    { id: 'store', position: { x: lanes[2].x, y: 400 }, data: { label: 'Store Conversation' }, style: nodeStyle },
    { id: 'display', position: { x: lanes[0].x, y: 400 }, data: { label: 'Display Response' }, style: nodeStyle },
  ];

  const initialEdges = [
    // Flow connections
    { id: 'e1', source: 'query', target: 'parse', animated: true, style: { stroke: '#00ED64', strokeWidth: 2 }, markerEnd: { type: MarkerType.Arrow, color: '#00ED64' } },
    { id: 'e2', source: 'parse', target: 'vector-gen', animated: true, style: { stroke: '#00ED64', strokeWidth: 2 }, markerEnd: { type: MarkerType.Arrow, color: '#00ED64' } },
    { id: 'e3', source: 'vector-gen', target: 'vector-search', animated: true, style: { stroke: '#00ED64', strokeWidth: 2 }, markerEnd: { type: MarkerType.Arrow, color: '#00ED64' } },
    { id: 'e4', source: 'vector-search', target: 'results', animated: true, style: { stroke: '#00ED64', strokeWidth: 2 }, markerEnd: { type: MarkerType.Arrow, color: '#00ED64' } },
    { id: 'e5', source: 'results', target: 'context', animated: true, style: { stroke: '#00ED64', strokeWidth: 2 }, markerEnd: { type: MarkerType.Arrow, color: '#00ED64' } },
    { id: 'e6', source: 'context', target: 'prompt', animated: true, style: { stroke: '#00ED64', strokeWidth: 2 }, markerEnd: { type: MarkerType.Arrow, color: '#00ED64' } },
    { id: 'e7', source: 'prompt', target: 'response', animated: true, style: { stroke: '#00ED64', strokeWidth: 2 }, markerEnd: { type: MarkerType.Arrow, color: '#00ED64' } },
    { id: 'e8', source: 'response', target: 'format', animated: true, style: { stroke: '#00ED64', strokeWidth: 2 }, markerEnd: { type: MarkerType.Arrow, color: '#00ED64' } },
    { id: 'e9', source: 'format', target: 'store', animated: true, style: { stroke: '#00ED64', strokeWidth: 2 }, markerEnd: { type: MarkerType.Arrow, color: '#00ED64' } },
    { id: 'e10', source: 'format', target: 'display', animated: true, style: { stroke: '#00ED64', strokeWidth: 2 }, markerEnd: { type: MarkerType.Arrow, color: '#00ED64' } },
  ];

  const animationSteps = [
    { 
      node: 'query',
      edge: 'e1',
      lanes: ['user-lane'],
      description: "User submits natural language query"
    },
    { 
      node: 'parse',
      edge: 'e2',
      lanes: ['app-lane'],
      description: "Application parses the query"
    },
    { 
      node: 'vector-gen',
      edge: 'e3',
      lanes: ['app-lane'],
      description: "Converts query to vector embedding"
    },
    { 
      node: 'vector-search',
      edge: 'e4',
      lanes: ['db-lane'],
      description: "MongoDB performs vector similarity search"
    },
    { 
      node: 'results',
      edge: 'e5',
      lanes: ['db-lane'],
      description: "Returns relevant documents"
    },
    { 
      node: 'context',
      edge: 'e6',
      lanes: ['app-lane'],
      description: "Builds context from search results"
    },
    { 
      node: 'prompt',
      edge: 'e7',
      lanes: ['llm-lane'],
      description: "Generates LLM prompt with context"
    },
    { 
      node: 'response',
      edge: 'e8',
      lanes: ['llm-lane'],
      description: "LLM generates intelligent response"
    },
    { 
      node: 'format',
      edge: 'e9',
      lanes: ['app-lane'],
      description: "Application formats the response"
    },
    { 
      node: 'store',
      edges: ['e10'],
      lanes: ['db-lane'],
      description: "Stores conversation history"
    },
    { 
      node: 'display',
      lanes: ['user-lane'],
      description: "Displays response to user"
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

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  useEffect(() => {
    const currentStep = animationSteps[step];
    
    if (!currentStep) return;

    const updatedNodes = initialNodes.map(node => ({
      ...node,
      style: node.id === currentStep.node ? 
        nodeStyle.width === 200 ? activeLaneStyle : activeNodeStyle :
        currentStep.lanes?.includes(node.id) ?
          activeLaneStyle :
          node.style,
    }));

    const updatedEdges = initialEdges.map(edge => ({
      ...edge,
      animated: currentStep.edges ? 
        currentStep.edges.includes(edge.id) : 
        edge.id === currentStep.edge,
      style: {
        ...edge.style,
        opacity: currentStep.edges ? 
          currentStep.edges.includes(edge.id) ? 1 : 0.3 : 
          edge.id === currentStep.edge ? 1 : 0.3,
      },
    }));

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [step]);

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

export default SwimlaneFlowWrapper;
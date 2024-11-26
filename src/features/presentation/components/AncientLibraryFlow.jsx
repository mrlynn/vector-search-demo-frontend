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

const AncientLibraryFlowWrapper = () => {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '700px' }}>
        <AncientLibraryFlow />
      </div>
    </ReactFlowProvider>
  );
};

const AncientLibraryFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [step, setStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { fitView } = useReactFlow();

  const laneStyle = {
    padding: 24,
    borderRadius: 12,
    border: '2px solid #2A1810',
    backgroundColor: '#2A1810',
    color: '#E6D5AC',
    width: 220,
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  };

  const nodeStyle = {
    ...laneStyle,
    width: 200,
    padding: 16,
    fontSize: '14px',
    backgroundColor: '#3C2A20',
  };

  const activeLaneStyle = {
    ...laneStyle,
    backgroundColor: '#2A1810',
    borderColor: '#00ED64',
    boxShadow: '0 0 30px 10px rgba(230, 213, 172, 0.2)',
    zIndex: 1000,
  };

  const activeNodeStyle = {
    ...nodeStyle,
    backgroundColor: '#4A3828',
    color: '#E6D5AC',
    border: '2px solid #E6D5AC',
    boxShadow: '0 0 30px 10px rgba(230, 213, 172, 0.3)',
    zIndex: 1000,
  };

  const lanes = [
    { id: 'seeker-lane', label: 'Knowledge Seeker', x: 150 },
    { id: 'sage-lane', label: 'Philosopher/Sage', x: 450 },
    { id: 'library-lane', label: 'Great Library', x: 750 }
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
    { 
      id: 'question', 
      position: { x: lanes[0].x, y: 100 }, 
      data: { label: 'Deep Question About the Nature of Things' }, 
      style: nodeStyle 
    },
    { 
      id: 'interpret', 
      position: { x: lanes[1].x, y: 100 }, 
      data: { label: 'Sage Contemplates the Question' }, 
      style: nodeStyle 
    },
    { 
      id: 'search', 
      position: { x: lanes[1].x, y: 200 }, 
      data: { label: 'Recalls Relevant Ancient Texts' }, 
      style: nodeStyle 
    },
    { 
      id: 'scrolls', 
      position: { x: lanes[2].x, y: 200 }, 
      data: { label: 'Ancient Scrolls and Manuscripts' }, 
      style: nodeStyle 
    },
    { 
      id: 'study', 
      position: { x: lanes[2].x, y: 300 }, 
      data: { label: 'Deep Study of Texts' }, 
      style: nodeStyle 
    },
    { 
      id: 'synthesis', 
      position: { x: lanes[1].x, y: 300 }, 
      data: { label: 'Synthesizes Ancient Wisdom' }, 
      style: nodeStyle 
    },
    { 
      id: 'wisdom', 
      position: { x: lanes[1].x, y: 400 }, 
      data: { label: 'Combines with Personal Wisdom' }, 
      style: nodeStyle 
    },
    { 
      id: 'answer', 
      position: { x: lanes[0].x, y: 400 }, 
      data: { label: 'Receives Illuminating Answer' }, 
      style: nodeStyle 
    },
    { 
      id: 'transcribe', 
      position: { x: lanes[2].x, y: 400 }, 
      data: { label: 'New Knowledge Transcribed' }, 
      style: nodeStyle 
    },
  ];

  const initialEdges = [
    // Flow connections with parchment-colored edges
    { 
      id: 'e1', 
      source: 'question', 
      target: 'interpret', 
      animated: true, 
      style: { stroke: '#E6D5AC', strokeWidth: 2 }, 
      markerEnd: { type: MarkerType.Arrow, color: '#E6D5AC' } 
    },
    { 
      id: 'e2', 
      source: 'interpret', 
      target: 'search', 
      animated: true, 
      style: { stroke: '#E6D5AC', strokeWidth: 2 }, 
      markerEnd: { type: MarkerType.Arrow, color: '#E6D5AC' } 
    },
    { 
      id: 'e3', 
      source: 'search', 
      target: 'scrolls', 
      animated: true, 
      style: { stroke: '#E6D5AC', strokeWidth: 2 }, 
      markerEnd: { type: MarkerType.Arrow, color: '#E6D5AC' } 
    },
    { 
      id: 'e4', 
      source: 'scrolls', 
      target: 'study', 
      animated: true, 
      style: { stroke: '#E6D5AC', strokeWidth: 2 }, 
      markerEnd: { type: MarkerType.Arrow, color: '#E6D5AC' } 
    },
    { 
      id: 'e5', 
      source: 'study', 
      target: 'synthesis', 
      animated: true, 
      style: { stroke: '#E6D5AC', strokeWidth: 2 }, 
      markerEnd: { type: MarkerType.Arrow, color: '#E6D5AC' } 
    },
    { 
      id: 'e6', 
      source: 'synthesis', 
      target: 'wisdom', 
      animated: true, 
      style: { stroke: '#E6D5AC', strokeWidth: 2 }, 
      markerEnd: { type: MarkerType.Arrow, color: '#E6D5AC' } 
    },
    { 
      id: 'e7', 
      source: 'wisdom', 
      target: 'answer', 
      animated: true, 
      style: { stroke: '#E6D5AC', strokeWidth: 2 }, 
      markerEnd: { type: MarkerType.Arrow, color: '#E6D5AC' } 
    },
    { 
      id: 'e8', 
      source: 'wisdom', 
      target: 'transcribe', 
      animated: true, 
      style: { stroke: '#E6D5AC', strokeWidth: 2 }, 
      markerEnd: { type: MarkerType.Arrow, color: '#E6D5AC' } 
    },
  ];

  const animationSteps = [
    { 
      node: 'question',
      edge: 'e1',
      lanes: ['seeker-lane'],
      description: "Seeker asks profound question about the nature of reality"
    },
    { 
      node: 'interpret',
      edge: 'e2',
      lanes: ['sage-lane'],
      description: "Sage contemplates the deeper meaning of the question"
    },
    { 
      node: 'search',
      edge: 'e3',
      lanes: ['sage-lane'],
      description: "Recalls relevant teachings from ancient texts"
    },
    { 
      node: 'scrolls',
      edge: 'e4',
      lanes: ['library-lane'],
      description: "Consults the vast collection of scrolls and manuscripts"
    },
    { 
      node: 'study',
      edge: 'e5',
      lanes: ['library-lane'],
      description: "Studies and interprets the ancient wisdom"
    },
    { 
      node: 'synthesis',
      edge: 'e6',
      lanes: ['sage-lane'],
      description: "Synthesizes knowledge from multiple sources"
    },
    { 
      node: 'wisdom',
      edges: ['e7', 'e8'],
      lanes: ['sage-lane'],
      description: "Combines ancient knowledge with personal insight"
    },
    { 
      node: 'answer',
      lanes: ['seeker-lane'],
      description: "Seeker receives illuminating answer to their question"
    },
    { 
      node: 'transcribe',
      lanes: ['library-lane'],
      description: "New wisdom is preserved for future generations"
    },
  ];

  // ... [Navigation and Control Functions] ...
  const nextStep = () => {
    setStep((prev) => (prev + 1) % animationSteps.length);
  };

  const previousStep = () => {
    setStep((prev) => (prev - 1 + animationSteps.length) % animationSteps.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(prev => !prev);
  };

  // ... [useEffect hooks] ...
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
        nodeStyle.width === 220 ? activeLaneStyle : activeNodeStyle :
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
    <div className="w-full h-full bg-[#1A0F0A] rounded-lg relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        className="w-full h-full"
      >
        <Background color="#2A1810" />
        <Controls className="text-[#E6D5AC]" />
      </ReactFlow>
      
      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-4">
        {/* Step Description */}
        <div className="bg-[#2A1810]/90 px-8 py-4 rounded-full border border-[#E6D5AC] text-[#E6D5AC] text-lg">
          {animationSteps[step]?.description}
        </div>

        {/* Navigation Controls */}
        <div className="flex gap-4 items-center">
          <button
            onClick={previousStep}
            className="px-6 py-2 rounded-full bg-[#2A1810]/90 border border-[#E6D5AC] text-[#E6D5AC] hover:bg-[#3C2A20] transition-colors"
          >
            Previous
          </button>
          <button
            onClick={toggleAutoPlay}
            className={`px-6 py-2 rounded-full border border-[#E6D5AC] transition-colors ${
              isAutoPlaying 
                ? 'bg-[#E6D5AC] text-[#2A1810]' 
                : 'bg-[#2A1810]/90 text-[#E6D5AC] hover:bg-[#3C2A20]'
            }`}
          >
            {isAutoPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={nextStep}
            className="px-6 py-2 rounded-full bg-[#2A1810]/90 border border-[#E6D5AC] text-[#E6D5AC] hover:bg-[#3C2A20] transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AncientLibraryFlowWrapper;
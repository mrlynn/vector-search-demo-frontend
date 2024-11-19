import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Panel,
  getBezierPath,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom Database Node showing document structure
const DatabaseNode = ({ data }) => {
  const [activeDoc, setActiveDoc] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDoc(prev => (prev + 1) % 5);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-white rounded-lg border-2 border-[#001E2B] p-4 w-[300px]">
      <div className="text-center font-bold mb-2">MongoDB Collection</div>
      <div className="grid grid-cols-3 gap-1">
        {[0, 1, 2, 3, 4].map((docIndex) => (
          <div
            key={docIndex}
            className={`h-16 p-2 rounded border ${
              docIndex === activeDoc 
                ? 'border-[#00ED64] bg-[#E3FCF7] shadow-lg transform scale-110 transition-all duration-300'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="h-2 w-3/4 bg-gray-200 rounded mb-1" />
            <div className="h-2 w-1/2 bg-gray-200 rounded mb-1" />
            <div className="h-2 w-2/3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom Data Packet for edges
const DataPacket = ({ edgePath }) => (
  <circle className="data-packet" r="4" fill="#00ED64">
    <animateMotion
      dur="1.5s"
      repeatCount="indefinite"
      path={edgePath}
    >
      <mpath href={edgePath} />
    </animateMotion>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </circle>
);

// Custom Edge with data packets
const CustomEdge = ({ id, source, target, sourceX, sourceY, targetX, targetY }) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={2}
        stroke="#001E2B"
      />
      {[0, 1, 2].map((i) => (
        <circle 
          key={i} 
          className="moving-packet" 
          r="4" 
          fill="#00ED64"
          filter="url(#glow)"
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={edgePath}
            begin={`${i * 0.5}s`}
          />
        </circle>
      ))}
    </>
  );
};

// Results Node showing streaming data
const ResultsNode = ({ data }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setResults(prev => {
        const newResults = [...prev];
        if (newResults.length >= 5) newResults.shift();
        newResults.push({
          id: Date.now(),
          score: Math.random() * 100
        });
        return newResults;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg border-2 border-[#001E2B] p-4 w-[250px]">
      <div className="text-center font-bold mb-2">Search Results</div>
      <div className="space-y-2">
        {results.map((result, index) => (
          <div
            key={result.id}
            className="flex items-center justify-between p-2 bg-[#E3FCF7] rounded"
            style={{
              opacity: 1 - (index * 0.2),
              transform: `translateY(${index * 2}px)`
            }}
          >
            <div className="h-2 w-1/2 bg-[#00ED64] rounded" />
            <div className="text-xs">{result.score.toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MongoDBFlow = () => {
  const nodeTypes = {
    database: DatabaseNode,
    results: ResultsNode
  };

  const edgeTypes = {
    custom: CustomEdge
  };

  const initialNodes = [
    {
      id: '1',
      type: 'input',
      position: { x: 0, y: 100 },
      data: { label: 'Query' },
      style: { background: '#E3FCF7', border: '2px solid #001E2B', padding: 20 }
    },
    {
      id: '2',
      type: 'database',
      position: { x: 400, y: 50 },
      data: { label: 'MongoDB' }
    },
    {
      id: '3',
      type: 'results',
      position: { x: 800, y: 100 },
      data: { label: 'Results' }
    }
  ];

  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', type: 'custom' },
    { id: 'e2-3', source: '2', target: '3', type: 'custom' }
  ];

  return (
    <div className="w-full h-96 bg-white rounded-lg shadow-sm">
      <style>
        {`
          .moving-packet {
            filter: drop-shadow(0 0 4px #00ED64);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .result-item {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}
      </style>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background color="#E3FCF7" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default MongoDBFlow;
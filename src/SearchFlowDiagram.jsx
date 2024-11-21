import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Panel,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  animated
}) => {
  const [edgePath] = useState(() => {
    const deltaX = targetX - sourceX;
    const deltaY = targetY - sourceY;
    const midX = sourceX + deltaX / 2;
    const midY = sourceY + deltaY / 2;

    return `M${sourceX},${sourceY} Q${midX},${sourceY} ${midX},${midY} Q${midX},${targetY} ${targetX},${targetY}`;
  });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: style.stroke || '#00ED64',
        }}
      />
      {data?.label && (
        <text>
          <textPath
            href={`#${id}`}
            style={{ fontSize: '12px' }}
            startOffset="50%"
            textAnchor="middle"
          >
            {data.label}
          </textPath>
        </text>
      )}
      {animated && (
        <circle r="4" fill="#00ED64" className="moving-packet">
          <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </>
  );
};

const SearchFlowDiagram = ({ searchType = 'basic' }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Reset animation when search type changes
    setCurrentStep(0);
    
    // Start the flow animation
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 5);
    }, 2000);
    
    return () => clearInterval(timer);
  }, [searchType]);

  const baseNodeStyle = {
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    width: 180,
    border: '1px solid #001E2B',
    transition: 'all 0.3s ease',
    textAlign: 'center'
  };

  const diagramConfigs = {
    basic: {
      nodes: [
        { id: 'query', type: 'input', position: { x: 50, y: 200 }, data: { label: 'User Query' }, sourcePosition: 'right', targetPosition: 'top' },
        { id: 'regex', type: 'default', position: { x: 300, y: 200 }, data: { label: '$regex Operator\nCase-insensitive' }, sourcePosition: 'right', targetPosition: 'left' },
        { id: 'db', type: 'default', position: { x: 550, y: 200 }, data: { label: 'MongoDB' }, sourcePosition: 'right', targetPosition: 'left' },
        { id: 'results', type: 'output', position: { x: 800, y: 200 }, data: { label: 'Search Results' }, sourcePosition: 'top', targetPosition: 'left' }
      ],
      edges: [
        { id: 'e1-2', source: 'query', target: 'regex', type: 'custom', animated: true },
        { id: 'e2-3', source: 'regex', target: 'db', type: 'custom', animated: true },
        { id: 'e3-4', source: 'db', target: 'results', type: 'custom', animated: true },
        { id: 'e4-1', source: 'results', target: 'query', type: 'custom', animated: true, data: { label: 'Query Refinement' } }
      ]
    },
    atlas: {
      nodes: [
        { 
          id: 'query', 
          type: 'input',
          position: { x: 50, y: 200 }, 
          data: { label: 'User Query' }, 
          sourcePosition: 'right', 
          targetPosition: 'left'
        },
        { 
          id: 'atlas', 
          type: 'default',
          position: { x: 300, y: 200 }, 
          data: { label: 'Atlas Search\nText Index' }, 
          sourcePosition: 'right', 
          targetPosition: 'left'
        },
        { 
          id: 'scoring', 
          type: 'default',
          position: { x: 550, y: 200 }, 
          data: { label: 'Relevance Scoring' }, 
          sourcePosition: 'right', 
          targetPosition: 'left'
        },
        { 
          id: 'results', 
          type: 'output',
          position: { x: 800, y: 200 }, 
          data: { label: 'Ranked Results' }, 
          sourcePosition: 'left',
          targetPosition: 'left'
        }
      ],
      edges: [
        { 
          id: 'e1-2', 
          source: 'query', 
          target: 'atlas', 
          type: 'custom',
          animated: true,
          style: { strokeWidth: 2 }
        },
        { 
          id: 'e2-3', 
          source: 'atlas', 
          target: 'scoring', 
          type: 'custom',
          animated: true,
          style: { strokeWidth: 2 }
        },
        { 
          id: 'e3-4', 
          source: 'scoring', 
          target: 'results', 
          type: 'custom',
          animated: true,
          style: { strokeWidth: 2 }
        },
        { 
          id: 'e4-1-top', 
          source: 'results', 
          target: 'query', 
          type: 'custom', 
          animated: true, 
          data: { label: 'Query Refinement' },
          style: { strokeWidth: 2, stroke: '#00ED64' }
        },
        { 
          id: 'e4-1-bottom', 
          source: 'results', 
          target: 'query', 
          type: 'custom', 
          animated: true, 
          data: { label: 'Results Review' },
          style: { strokeWidth: 2, stroke: '#00ED64' }
        }
      ]
    },
    vector: {
      nodes: [
        { id: 'query', type: 'input', position: { x: 50, y: 200 }, data: { label: 'User Query' }, sourcePosition: 'right', targetPosition: 'top' },
        { id: 'embedding', type: 'default', position: { x: 300, y: 200 }, data: { label: 'Generate\nVector Embedding' }, sourcePosition: 'right', targetPosition: 'left' },
        { id: 'knn', type: 'default', position: { x: 550, y: 200 }, data: { label: 'KNN Vector Search' }, sourcePosition: 'right', targetPosition: 'left' },
        { id: 'results', type: 'output', position: { x: 800, y: 200 }, data: { label: 'Similar Results' }, sourcePosition: 'top', targetPosition: 'left' }
      ],
      edges: [
        { id: 'e1-2', source: 'query', target: 'embedding', type: 'custom', animated: true },
        { id: 'e2-3', source: 'embedding', target: 'knn', type: 'custom', animated: true },
        { id: 'e3-4', source: 'knn', target: 'results', type: 'custom', animated: true },
        { id: 'e4-1', source: 'results', target: 'query', type: 'custom', animated: true, data: { label: 'Query Refinement' } }
      ]
    },
    semantic: {
      nodes: [
        { id: 'query', type: 'input', position: { x: 50, y: 200 }, data: { label: 'User Query' }, sourcePosition: 'right', targetPosition: 'top' },
        { id: 'llm', type: 'default', position: { x: 300, y: 200 }, data: { label: 'LLM Processing' }, sourcePosition: 'right', targetPosition: 'left' },
        { id: 'vector', type: 'default', position: { x: 550, y: 200 }, data: { label: 'Vector Search' }, sourcePosition: 'right', targetPosition: 'left' },
        { id: 'results', type: 'output', position: { x: 800, y: 200 }, data: { label: 'Semantic Results' }, sourcePosition: 'top', targetPosition: 'left' }
      ],
      edges: [
        { id: 'e1-2', source: 'query', target: 'llm', type: 'custom', animated: true },
        { id: 'e2-3', source: 'llm', target: 'vector', type: 'custom', animated: true },
        { id: 'e3-4', source: 'vector', target: 'results', type: 'custom', animated: true },
        { id: 'e4-1', source: 'results', target: 'query', type: 'custom', animated: true, data: { label: 'Query Refinement' } }
      ]
    },
    image: {
      nodes: [
        { id: 'query', type: 'input', position: { x: 50, y: 200 }, data: { label: 'Image Upload' }, sourcePosition: 'right', targetPosition: 'top' },
        { id: 'vision', type: 'default', position: { x: 300, y: 200 }, data: { label: 'Vision Model\nProcessing' }, sourcePosition: 'right', targetPosition: 'left' },
        { id: 'embedding', type: 'default', position: { x: 550, y: 200 }, data: { label: 'Generate\nImage Embedding' }, sourcePosition: 'right', targetPosition: 'left' },
        { id: 'results', type: 'output', position: { x: 800, y: 200 }, data: { label: 'Similar Images' }, sourcePosition: 'top', targetPosition: 'left' }
      ],
      edges: [
        { id: 'e1-2', source: 'query', target: 'vision', type: 'custom', animated: true },
        { id: 'e2-3', source: 'vision', target: 'embedding', type: 'custom', animated: true },
        { id: 'e3-4', source: 'embedding', target: 'results', type: 'custom', animated: true },
        { id: 'e4-1', source: 'results', target: 'query', type: 'custom', animated: true, data: { label: 'Similar Image Selection' } }
      ]
    }
  };

  const styles = `
    .moving-packet {
      filter: drop-shadow(0 0 2px #00ED64);
    }
  `;

  return (
    <div className="w-full h-96 bg-white rounded-lg shadow-sm">
      <style>{styles}</style>
      <ReactFlow
        key={searchType}
        nodes={diagramConfigs[searchType].nodes}
        edges={diagramConfigs[searchType].edges}
        edgeTypes={{ custom: CustomEdge }}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background color="#E3FCF7" gap={16} />
        <Controls 
          className="bg-white border border-[#E3FCF7]"
          style={{ button: { border: '1px solid #E3FCF7', background: 'white' }}}
        />
        <Panel position="top-left" className="bg-white p-2 rounded shadow-sm">
          <h3 className="text-sm font-semibold text-[#001E2B]">
            {searchType.charAt(0).toUpperCase() + searchType.slice(1)} Search Flow
          </h3>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default SearchFlowDiagram;

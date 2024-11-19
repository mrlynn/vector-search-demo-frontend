import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Panel,
  getBezierPath
} from 'reactflow';
import 'reactflow/dist/style.css';

const CustomEdge = ({ id, source, target, sourceX, sourceY, targetX, targetY, animated }) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY
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
      {animated && (
        <circle className="moving-packet" r="4" fill="#00ED64">
          <animateMotion
            dur="1.5s"
            repeatCount="1"
            path={edgePath}
          />
        </circle>
      )}
    </>
  );
};

const SearchFlowDiagram = ({ searchType = 'basic' }) => {
  const [currentStep, setCurrentStep] = useState(0);

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
        { id: 'query', type: 'input', position: { x: 50, y: 100 }, data: { label: 'User Query' } },
        { id: 'regex', type: 'process', position: { x: 300, y: 100 }, data: { label: '$regex Operator\nCase-insensitive' } },
        { id: 'db', type: 'database', position: { x: 550, y: 100 }, data: { label: 'MongoDB' } },
        { id: 'results', type: 'output', position: { x: 800, y: 100 }, data: { label: 'Search Results' } }
      ],
      edges: [
        { id: 'e1-2', source: 'query', target: 'regex' },
        { id: 'e2-3', source: 'regex', target: 'db' },
        { id: 'e3-4', source: 'db', target: 'results' }
      ]
    },
    atlas: {
      nodes: [
        { id: 'query', type: 'input', position: { x: 50, y: 100 }, data: { label: 'User Query' } },
        { id: 'fuzzy', type: 'process', position: { x: 300, y: 50 }, data: { label: 'Fuzzy Matching\nHandle typos' } },
        { id: 'auto', type: 'process', position: { x: 300, y: 100 }, data: { label: 'Autocomplete\nPartial words' } },
        { id: 'phrase', type: 'process', position: { x: 300, y: 150 }, data: { label: 'Phrase Matching\nExact matches' } },
        { id: 'score', type: 'process', position: { x: 550, y: 100 }, data: { label: 'Score & Highlight\nCompute relevance' } },
        { id: 'db', type: 'database', position: { x: 800, y: 100 }, data: { label: 'MongoDB' } },
        { id: 'results', type: 'output', position: { x: 1050, y: 100 }, data: { label: 'Scored Results' } }
      ],
      edges: [
        { id: 'q-f', source: 'query', target: 'fuzzy' },
        { id: 'q-a', source: 'query', target: 'auto' },
        { id: 'q-p', source: 'query', target: 'phrase' },
        { id: 'f-s', source: 'fuzzy', target: 'score' },
        { id: 'a-s', source: 'auto', target: 'score' },
        { id: 'p-s', source: 'phrase', target: 'score' },
        { id: 's-d', source: 'score', target: 'db' },
        { id: 'd-r', source: 'db', target: 'results' }
      ]
    },
    vector: {
      nodes: [
        { id: 'query', type: 'input', position: { x: 50, y: 100 }, data: { label: 'User Query' } },
        { id: 'openai', type: 'process', position: { x: 300, y: 100 }, data: { label: 'OpenAI\nEmbeddings' } },
        { id: 'vector', type: 'process', position: { x: 550, y: 50 }, data: { label: 'Vector Generation' } },
        { id: 'knn', type: 'process', position: { x: 550, y: 150 }, data: { label: 'k-Nearest Neighbors\nSimilarity Search' } },
        { id: 'db', type: 'database', position: { x: 800, y: 100 }, data: { label: 'MongoDB' } },
        { id: 'results', type: 'output', position: { x: 1050, y: 100 }, data: { label: 'Similarity Ranked\nResults' } }
      ],
      edges: [
        { id: 'q-o', source: 'query', target: 'openai' },
        { id: 'o-v', source: 'openai', target: 'vector' },
        { id: 'v-k', source: 'vector', target: 'knn' },
        { id: 'k-d', source: 'knn', target: 'db' },
        { id: 'd-r', source: 'db', target: 'results' }
      ]
    },
    semantic: {
      nodes: [
        { id: 'query', type: 'input', position: { x: 50, y: 100 }, data: { label: 'User Query' } },
        { id: 'gpt4', type: 'process', position: { x: 250, y: 100 }, data: { label: 'GPT-4\nQuery Enhancement' } },
        { id: 'enhance', type: 'process', position: { x: 450, y: 100 }, data: { label: 'Query Enhancement' } },
        { id: 'openai', type: 'process', position: { x: 650, y: 100 }, data: { label: 'OpenAI\nEmbeddings' } },
        { id: 'vector', type: 'process', position: { x: 850, y: 50 }, data: { label: 'Vector Generation' } },
        { id: 'knn', type: 'process', position: { x: 850, y: 150 }, data: { label: 'k-Nearest Neighbors\nSimilarity Search' } },
        { id: 'db', type: 'database', position: { x: 1050, y: 100 }, data: { label: 'MongoDB' } },
        { id: 'results', type: 'output', position: { x: 1250, y: 100 }, data: { label: 'Semantic Matches' } }
      ],
      edges: [
        { id: 'q-g', source: 'query', target: 'gpt4' },
        { id: 'g-e', source: 'gpt4', target: 'enhance' },
        { id: 'e-o', source: 'enhance', target: 'openai' },
        { id: 'o-v', source: 'openai', target: 'vector' },
        { id: 'v-k', source: 'vector', target: 'knn' },
        { id: 'k-d', source: 'knn', target: 'db' },
        { id: 'd-r', source: 'db', target: 'results' }
      ]
    },
    image: {
      nodes: [
        { id: 'image', type: 'input', position: { x: 50, y: 100 }, data: { label: 'Uploaded Image' } },
        { id: 'vision', type: 'process', position: { x: 250, y: 100 }, data: { label: 'GPT-4 Vision\nImage Analysis' } },
        { id: 'describe', type: 'process', position: { x: 450, y: 100 }, data: { label: 'Image Description' } },
        { id: 'openai', type: 'process', position: { x: 650, y: 100 }, data: { label: 'OpenAI\nEmbeddings' } },
        { id: 'vector', type: 'process', position: { x: 850, y: 50 }, data: { label: 'Vector Generation' } },
        { id: 'knn', type: 'process', position: { x: 850, y: 150 }, data: { label: 'k-Nearest Neighbors\nSimilarity Search' } },
        { id: 'db', type: 'database', position: { x: 1050, y: 100 }, data: { label: 'MongoDB' } },
        { id: 'results', type: 'output', position: { x: 1250, y: 100 }, data: { label: 'Similar Products' } }
      ],
      edges: [
        { id: 'i-v', source: 'image', target: 'vision' },
        { id: 'v-d', source: 'vision', target: 'describe' },
        { id: 'd-o', source: 'describe', target: 'openai' },
        { id: 'o-v', source: 'openai', target: 'vector' },
        { id: 'v-k', source: 'vector', target: 'knn' },
        { id: 'k-d', source: 'knn', target: 'db' },
        { id: 'd-r', source: 'db', target: 'results' }
      ]
    }
  };

  const getNodeStyle = (type, isActive) => ({
    ...baseNodeStyle,
    backgroundColor: isActive ? '#00ED64' : {
      input: '#E3FCF7',
      process: '#FFFFFF',
      database: '#00ED64',
      output: '#E3FCF7'
    }[type]
  });

  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  // Initialize or update diagram when searchType changes
  useEffect(() => {
    const config = diagramConfigs[searchType];
    if (!config) return;

    setNodes(
      config.nodes.map(node => ({
        ...node,
        style: getNodeStyle(node.type, false)
      }))
    );
    
    setEdges(
      config.edges.map(edge => ({
        ...edge,
        type: 'custom',
        animated: false
      }))
    );

    setCurrentStep(0);
  }, [searchType]);

  // Animation loop
  useEffect(() => {
    const config = diagramConfigs[searchType];
    if (!config) return;

    const animationInterval = setInterval(() => {
      setCurrentStep(prev => {
        const totalSteps = config.nodes.length + config.edges.length;
        return (prev + 1) % totalSteps;
      });
    }, 2000);

    return () => clearInterval(animationInterval);
  }, [searchType]);

  // Update node and edge animations
  useEffect(() => {
    const config = diagramConfigs[searchType];
    if (!config) return;

    const nodeIndex = Math.floor(currentStep / 2);
    const edgeIndex = Math.floor((currentStep - 1) / 2);

    setNodes(nds => 
      nds.map((node, index) => ({
        ...node,
        style: getNodeStyle(node.type, index === nodeIndex)
      }))
    );

    setEdges(eds => 
      eds.map((edge, index) => ({
        ...edge,
        type: 'custom',
        animated: index === edgeIndex && currentStep % 2 === 1
      }))
    );
  }, [currentStep, searchType]);

  return (
    <div className="w-full h-96 bg-white rounded-lg shadow-sm">
      <style>
        {`
          .moving-packet {
            filter: drop-shadow(0 0 2px #00ED64);
          }
        `}
      </style>
      <ReactFlow
        key={searchType}
        nodes={nodes}
        edges={edges}
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
import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Panel,
  getBezierPath,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

const QueryNode = ({ data }) => (
  <div className="p-4 bg-[#E3FCF7] rounded-lg border-2 border-[#001E2B] w-[250px]">
    <div className="font-bold mb-2">Query</div>
    <code className="text-sm bg-white p-2 rounded block">
      {`db.users.find({ age: { $gt: 21 } })`}
    </code>
  </div>
);

const QueryPlannerNode = ({ data }) => {
  const { isIndexed } = data;
  
  return (
    <div className="p-4 bg-white rounded-lg border-2 border-[#001E2B] w-[250px]">
      <div className="font-bold mb-2">Query Planner</div>
      <div className="space-y-2 text-sm">
        <div className="p-2 bg-[#E3FCF7] rounded">
          Selected plan: {isIndexed ? 'IXSCAN' : 'COLLSCAN'}
        </div>
        <div className="text-xs text-gray-600">
          {isIndexed 
            ? 'Using index: age_1' 
            : 'No suitable index found'}
        </div>
      </div>
    </div>
  );
};

const IndexNode = ({ data }) => {
  const { active } = data;
  const [scanPosition, setScanPosition] = useState(0);

  React.useEffect(() => {
    if (!active) return;
    
    const interval = setInterval(() => {
      setScanPosition(prev => (prev + 1) % 5);
    }, 300); // Fast scanning through index
    
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className={`p-4 rounded-lg border-2 w-[250px] transition-all duration-300
      ${active 
        ? 'bg-white border-[#00ED64]' 
        : 'bg-gray-100 border-gray-300'}`}
    >
      <div className="font-bold mb-2">Index Scan (age_1)</div>
      <div className="space-y-1">
        {[0, 1, 2, 3, 4].map(idx => (
          <div
            key={idx}
            className={`h-8 rounded flex items-center px-2 text-sm transition-all
              ${active && idx === scanPosition 
                ? 'bg-[#00ED64] text-white' 
                : 'bg-gray-50 text-gray-600'}`}
          >
            {active && idx === scanPosition && '→'} age: {20 + idx}
          </div>
        ))}
      </div>
      {active && (
        <div className="mt-2 text-xs text-[#00ED64]">
          Scanning index entries...
        </div>
      )}
    </div>
  );
};

const CollectionScanNode = ({ data }) => {
  const { active } = data;
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    if (!active) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 0.5; // Slow scanning through collection
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className={`p-4 rounded-lg border-2 w-[250px] transition-all duration-300
      ${active 
        ? 'bg-white border-[#FF4F4F]' 
        : 'bg-gray-100 border-gray-300'}`}
    >
      <div className="font-bold mb-2">Collection Scan</div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#FF4F4F] transition-all duration-200"
            style={{ width: `${active ? progress : 0}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-xs text-gray-600">
            Documents scanned: {active ? Math.floor(progress * 100) : 0}
          </div>
          <div className="text-xs text-right text-gray-600">
            Total: 10,000
          </div>
        </div>
      </div>
      {active && progress > 0 && (
        <div className="mt-2 text-xs text-[#FF4F4F]">
          Warning: Full collection scan in progress
        </div>
      )}
    </div>
  );
};

const ResultsNode = ({ data }) => {
  const { isIndexed } = data;
  const [results, setResults] = useState([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setResults(prev => {
        if (prev.length >= 5) {
          prev.shift();
        }
        return [...prev, {
          id: Date.now(),
          age: Math.floor(Math.random() * 30) + 21
        }];
      });
    }, isIndexed ? 300 : 1000); // Results come faster with index

    return () => clearInterval(interval);
  }, [isIndexed]);

  return (
    <div className="p-4 bg-[#E3FCF7] rounded-lg border-2 border-[#001E2B] w-[250px]">
      <div className="font-bold mb-2">Results</div>
      <div className="space-y-2">
        {results.map((result, idx) => (
          <div 
            key={result.id}
            className="h-8 bg-white rounded flex items-center px-2 text-sm"
            style={{
              opacity: 1 - (idx * 0.2),
              transform: `translateY(${idx * 2}px)`
            }}
          >
            age: {result.age}
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-600">
        Query time: {isIndexed ? '~2ms' : '~200ms'}
      </div>
    </div>
  );
};

const CustomEdge = ({ id, source, target, animated, style = {} }) => {
  const [edgePath] = getBezierPath({
    sourceX: source.x,
    sourceY: source.y,
    targetX: target.x,
    targetY: target.y
  });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={2}
        stroke="#001E2B"
        markerEnd={MarkerType.Arrow}
        style={style}
      />
      {animated && (
        <circle className="moving-packet" r="4" fill="#00ED64">
          <animateMotion
            dur={style.animationDuration || "1s"}
            repeatCount="indefinite"
            path={edgePath}
          />
        </circle>
      )}
    </>
  );
};

const MongoDBQueryPlanner = () => {
  const [isIndexed, setIsIndexed] = useState(false);

  const nodeTypes = {
    query: QueryNode,
    planner: QueryPlannerNode,
    index: IndexNode,
    collection: CollectionScanNode,
    results: ResultsNode
  };

  const nodes = [
    {
      id: 'query',
      type: 'query',
      position: { x: 50, y: 150 },
      data: { label: 'Query' }
    },
    {
      id: 'planner',
      type: 'planner',
      position: { x: 400, y: 150 },
      data: { label: 'Query Planner', isIndexed }
    },
    {
      id: 'index',
      type: 'index',
      position: { x: 800, y: 50 },
      data: { label: 'Index Scan', active: isIndexed }
    },
    {
      id: 'collection',
      type: 'collection',
      position: { x: 800, y: 250 },
      data: { label: 'Collection Scan', active: !isIndexed }
    },
    {
      id: 'results',
      type: 'results',
      position: { x: 1200, y: 150 },
      data: { label: 'Results', isIndexed }
    }
  ];

  const edges = [
    { 
      id: 'e1-2', 
      source: 'query', 
      target: 'planner', 
      animated: true,
      style: { animationDuration: '1s' }
    },
    { 
      id: 'e2-3', 
      source: 'planner', 
      target: 'index', 
      animated: isIndexed,
      style: { 
        stroke: isIndexed ? '#00ED64' : '#E3E3E3',
        animationDuration: '0.3s'
      }
    },
    { 
      id: 'e2-4', 
      source: 'planner', 
      target: 'collection', 
      animated: !isIndexed,
      style: { 
        stroke: !isIndexed ? '#FF4F4F' : '#E3E3E3',
        animationDuration: '1s'
      }
    },
    { 
      id: 'e3-5', 
      source: 'index', 
      target: 'results', 
      animated: isIndexed,
      style: { 
        stroke: isIndexed ? '#00ED64' : '#E3E3E3',
        animationDuration: '0.3s'
      }
    },
    { 
      id: 'e4-5', 
      source: 'collection', 
      target: 'results', 
      animated: !isIndexed,
      style: { 
        stroke: !isIndexed ? '#FF4F4F' : '#E3E3E3',
        animationDuration: '1s'
      }
    }
  ];

  return (
    <div className="w-full h-[600px] bg-white rounded-lg shadow-sm">
      <style>
        {`
          .moving-packet {
            filter: drop-shadow(0 0 4px #00ED64);
          }
        `}
      </style>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={{ custom: CustomEdge }}
        fitView
      >
        <Background color="#E3FCF7" gap={16} />
        <Controls />
        <Panel position="top-left" className="bg-white p-4 rounded shadow-lg space-y-4">
          <div className="space-y-2">
            <div className="font-semibold text-[#001E2B]">Index Configuration</div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isIndexed}
                onChange={() => setIsIndexed(!isIndexed)}
                className="form-checkbox text-[#00ED64] rounded"
              />
              <span className="text-sm">Enable age_1 index</span>
            </label>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Index: {isIndexed ? 'Active' : 'Not Applied'}</div>
            <div>Scan Type: {isIndexed ? 'Index Scan' : 'Collection Scan'}</div>
            <div>Expected Performance: {isIndexed ? 'O(log n)' : 'O(n)'}</div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default MongoDBQueryPlanner;
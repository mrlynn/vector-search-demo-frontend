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

const MongoDBBasicSearchWrapper = () => {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '600px' }}>
        <MongoDBBasicSearch />
      </div>
    </ReactFlowProvider>
  );
};

const MongoDBBasicSearch = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [step, setStep] = useState(0);
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
    transition: 'all 0.3s ease',
  };
  
  const activeNodeStyle = {
    ...nodeStyle,
    backgroundColor: '#00ED64',
    color: '#000000',
    border: '2px solid #00ED64',
    boxShadow: '0 0 30px 10px rgba(0, 237, 100, 0.3)',
    zIndex: 1000,
  };
  
  const codeNodeStyle = {
    ...nodeStyle,
    width: 400,
    height: 'auto',
    padding: 16,
    fontFamily: 'monospace',
    whiteSpace: 'pre',
    fontSize: '14px',
  };
  
  const activeCodeNodeStyle = {
    ...codeNodeStyle,
    backgroundColor: '#00ED64',
    color: '#000000',
    border: '2px solid #00ED64',
    boxShadow: '0 0 30px rgba(0, 237, 100, 0.5)',
    zIndex: 1000,
  };

  const initialNodes = [
    {
      id: 'query',
      type: 'default',
      position: { x: 400, y: 0 },
      data: { label: 'Search Query' },
      style: nodeStyle,
    },
    {
      id: 'mongodb-query',
      type: 'default',
      position: { x: 400, y: 150 },
      data: { 
        label: `db.products.find({
  category: "Electronics",
  price: { $lt: 1000 }
})`
      },
      style: codeNodeStyle,
    },
    {
      id: 'index',
      type: 'default',
      position: { x: 100, y: 300 },
      data: { label: 'Index Scan' },
      style: nodeStyle,
    },
    {
      id: 'collection',
      type: 'default',
      position: { x: 700, y: 300 },
      data: { label: 'Collection Scan' },
      style: nodeStyle,
    },
    {
      id: 'filter',
      type: 'default',
      position: { x: 400, y: 450 },
      data: { label: 'Apply Filters' },
      style: nodeStyle,
    },
    {
      id: 'results',
      type: 'default',
      position: { x: 400, y: 600 },
      data: { 
        label: `[
  { name: "Smart TV", price: 799 },
  { name: "Tablet", price: 499 },
  ...]`
      },
      style: codeNodeStyle,
    },
  ];

  const initialEdges = [
    {
      id: 'query-mongodb',
      source: 'query',
      target: 'mongodb-query',
      animated: true,
      style: { stroke: '#00ED64', strokeWidth: 3 },
      markerEnd: { type: MarkerType.Arrow, color: '#00ED64' },
    },
    {
      id: 'mongodb-index',
      source: 'mongodb-query',
      target: 'index',
      animated: true,
      style: { stroke: '#00ED64', strokeWidth: 3 },
      markerEnd: { type: MarkerType.Arrow, color: '#00ED64' },
      label: 'If index exists',
      labelStyle: { fill: '#00ED64', fontWeight: 'bold' },
    },
    {
      id: 'mongodb-collection',
      source: 'mongodb-query',
      target: 'collection',
      animated: true,
      style: { stroke: '#00ED64', strokeWidth: 3 },
      markerEnd: { type: MarkerType.Arrow, color: '#00ED64' },
      label: 'No index',
      labelStyle: { fill: '#00ED64', fontWeight: 'bold' },
    },
    {
      id: 'index-filter',
      source: 'index',
      target: 'filter',
      animated: true,
      style: { stroke: '#00ED64', strokeWidth: 3 },
      markerEnd: { type: MarkerType.Arrow, color: '#00ED64' },
    },
    {
      id: 'collection-filter',
      source: 'collection',
      target: 'filter',
      animated: true,
      style: { stroke: '#00ED64', strokeWidth: 3 },
      markerEnd: { type: MarkerType.Arrow, color: '#00ED64' },
    },
    {
      id: 'filter-results',
      source: 'filter',
      target: 'results',
      animated: true,
      style: { stroke: '#00ED64', strokeWidth: 3 },
      markerEnd: { type: MarkerType.Arrow, color: '#00ED64' },
    },
  ];

  const animationSteps = [
    { 
      node: 'query',
      edge: 'query-mongodb',
      description: "Application sends a find() query to MongoDB"
    },
    { 
      node: 'mongodb-query',
      edges: ['mongodb-index', 'mongodb-collection'],
      description: "MongoDB analyzes the query and determines execution plan"
    },
    { 
      node: 'index',
      edge: 'index-filter',
      description: "Query uses available indexes for efficient data retrieval"
    },
    { 
      node: 'collection',
      edge: 'collection-filter',
      description: "If no suitable index, performs collection scan"
    },
    { 
      node: 'filter',
      edge: 'filter-results',
      description: "Applies query filters to matching documents"
    },
    { 
      node: 'results',
      description: "Returns filtered result set to application"
    },
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
      style: node.id === currentStep.node ? 
        (node.style.width === 400 ? activeCodeNodeStyle : activeNodeStyle) : 
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
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % animationSteps.length);
    }, 3000);

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
      
      <div className="absolute bottom-100 left-1/2 transform -translate-x-1/2 bg-black/80 px-8 py-4 rounded-full border border-[#00ED64] text-white text-lg">
        {animationSteps[step]?.description}
      </div>
    </div>
  );
};

export default MongoDBBasicSearchWrapper;
import React, { useState, useRef, useEffect } from 'react';
import { Search, ZoomIn, ZoomOut, Minimize2 } from 'lucide-react';

// Define clusters
const VECTOR_CLUSTERS = {
  tech: {
    words: ['apple', 'windows', 'safari', 'python', 'java', 'ruby', 'chrome', 'shell', 'swift', 'rust'],
    color: '#2563eb',
    label: 'Technology'
  },
  nature: {
    words: ['apple', 'python', 'ruby', 'shell', 'palm', 'java', 'sage', 'mint', 'butterfly', 'spider'],
    color: '#059669',
    label: 'Nature & Food'
  },
  places: {
    words: ['palm', 'safari', 'china', 'java', 'crown', 'victoria', 'phoenix', 'amazon', 'delta', 'spring'],
    color: '#7c3aed',
    label: 'Places & Geography'
  },
  commerce: {
    words: ['amazon', 'apple', 'crown', 'shell', 'delta', 'visa', 'sprint', 'target', 'nike', 'adobe'],
    color: '#dc2626',
    label: 'Companies & Brands'
  }
};

// Helper function to generate contextual vector
const generateContextualVector = (clusterType) => {
  const baseVectors = {
    tech: [0.9, 0.1, 0.3],
    nature: [0.2, 0.9, 0.3],
    commerce: [0.3, 0.2, 0.9],
    places: [0.4, 0.4, 0.8]
  };

  const baseVector = baseVectors[clusterType] || [0.5, 0.5, 0.5];
  return baseVector.map(v => Number((v + (Math.random() * 0.1 - 0.05)).toFixed(2)));
};

// Helper function to get related concepts
const getRelatedConcepts = (word, clusterWords) => {
  return clusterWords
    .filter(w => w !== word)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
};

// Helper function to generate points
const generatePoints = (dimensions) => {
  const clusterEntries = Object.entries(VECTOR_CLUSTERS);
  const points = [];
  const allPoints = [];
  
  for (let i = 0; i < dimensions; i++) {
    const angle = (i * 2 * Math.PI) / dimensions;
    const [clusterKey, clusterInfo] = clusterEntries[i % clusterEntries.length];
    
    const numPoints = 2 + Math.floor(Math.random() * 2);
    const line = [];
    
    for (let j = 0; j < numPoints; j++) {
      const baseDistance = 0.3 + (j * 0.15);
      const variance = Math.random() * 0.08;
      const distance = baseDistance + variance;
      
      const word = clusterInfo.words[Math.floor(Math.random() * clusterInfo.words.length)];
      const vector = generateContextualVector(clusterKey);
      
      const point = {
        distance,
        angle,
        word,
        vector,
        x: distance * Math.cos(angle),
        y: distance * Math.sin(angle),
        cluster: clusterKey,
        relationships: []
      };
      
      line.push(point);
      allPoints.push(point);
    }
    
    points.push(line);
  }
  
  // Add relationships between points
  allPoints.forEach(point => {
    const sameClusterPoints = allPoints.filter(p => 
      p !== point && 
      p.cluster === point.cluster &&
      Math.random() < 0.3
    );
    
    const crossClusterPoints = allPoints.filter(p =>
      p !== point &&
      p.cluster !== point.cluster &&
      Math.random() < 0.1
    );
    
    point.relationships = [
      ...sameClusterPoints.slice(0, 2),
      ...crossClusterPoints.slice(0, 1)
    ];
  });
  
  return points;
};

const VectorSpaceVisualization = () => {
  const [dimensions] = useState(12); // This is the number of dimension angles
  const [viewportDimensions, setViewportDimensions] = useState({ width: 800, height: 800 });
  const [scale, setScale] = useState(300);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [points, setPoints] = useState(() => generatePoints(dimensions));
  const svgRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const containerRef = useRef(null);

  const handlePointHover = (point) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredPoint(point);
    }, 100);
  };

  const handlePointLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredPoint(null);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setViewportDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);


  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 1.05;
    const delta = e.deltaY > 0 ? 1 / zoomFactor : zoomFactor;
    
    // Get mouse position relative to SVG
    const svgRect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;
    
    // Calculate new scale
    const newScale = Math.min(Math.max(scale * delta, 150), 800);
    
    // Calculate new offsets to maintain zoom center
    const offsetX = (mouseX - (mouseX - offset.x) * (newScale / scale));
    const offsetY = (mouseY - (mouseY - offset.y) * (newScale / scale));
    
    setScale(newScale);
    setOffset({ x: offsetX, y: offsetY });
  };

  // Update the button handlers too
const handleZoomIn = () => {
  const zoomFactor = .8;
  const newScale = Math.min(scale * zoomFactor, 800);
  
  // Get center of the viewport
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  // Calculate new offsets
  const offsetX = (centerX - (centerX - offset.x) * (newScale / scale));
  const offsetY = (centerY - (centerY - offset.y) * (newScale / scale));
  
  setScale(newScale);
  setOffset({ x: offsetX, y: offsetY });
};

const handleZoomOut = () => {
  const zoomFactor = 1.1;
  const newScale = Math.max(scale / zoomFactor, 150);
  
  // Get center of the viewport
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  
  // Calculate new offsets
  const offsetX = (centerX - (centerX - offset.x) * (newScale / scale));
  const offsetY = (centerY - (centerY - offset.y) * (newScale / scale));
  
  setScale(newScale);
  setOffset({ x: offsetX, y: offsetY });
};

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(300);
    setOffset({ x: 0, y: 0 });
  };

  const renderConnections = (point, center) => {
    if (!point.relationships || !hoveredPoint || hoveredPoint.word !== point.word) return null;
    
    return point.relationships.map((related, index) => {
      const startX = center + 300 * point.x;
      const startY = center + 300 * point.y;
      const endX = center + 300 * related.x;
      const endY = center + 300 * related.y;
      
      return (
        <g key={`connection-${index}`} style={{ pointerEvents: 'none' }}>
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke={VECTOR_CLUSTERS[related.cluster].color}
            strokeWidth={1}
            strokeOpacity={0.5}
            strokeDasharray="4,4"
          />
          <circle
            cx={endX}
            cy={endY}
            r={4 * (300 / scale)}
            fill={VECTOR_CLUSTERS[related.cluster].color}
            fillOpacity={0.5}
          />
        </g>
      );
    });
  };

  const renderPoint = (point, i, j, center) => {
    const x = point.x * 200;
    const y = point.y * 200;
    const isHighlighted = hoveredPoint?.word === point.word;
    
    // Further reduce the radius of the sphere
    const radius = (isHighlighted ? 2 : 1) * (200 / scale); // Further reduced size

    return (
      <g 
        key={`point-${i}-${j}`}
        onMouseEnter={() => handlePointHover(point)}
        onMouseLeave={handlePointLeave}
        className="cursor-pointer"
        style={{ pointerEvents: isDragging ? 'none' : 'all' }}
      >
        {renderConnections(point, center)}
        
        <circle
          cx={x}
          cy={y}
          r={radius} // Updated to use the new radius
          fill={VECTOR_CLUSTERS[point.cluster].color}
          fillOpacity={isHighlighted ? 1 : 0.7}
        />
        
        <text
          x={x}
          y={y - 10 * (300 / scale)}
          textAnchor="middle"
          fill={isHighlighted ? VECTOR_CLUSTERS[point.cluster].color : '#E6D5AC'}
          style={{
            fontSize: `${(isHighlighted ? 0.9 : 0.7) * (300 / scale)}rem`,
            fontWeight: isHighlighted ? 500 : 400,
            transition: 'all 0.2s ease',
            pointerEvents: 'none'
          }}
        >
          {point.word}
        </text>
      </g>
    );
  };

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden bg-[#1A0F0A]">
      {/* Controls Panel - Now with better positioning */}
      <div className="absolute top-4 left-4 z-10 space-y-4">
        {/* Search Input */}
        <div className="relative bg-[#2A1810]/80 p-4 rounded-lg border border-[#E6D5AC]/10">
          <Search className="w-4 h-4 text-white absolute left-7 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vectors..."
            className="w-64 pl-10 pr-4 py-2 rounded-lg bg-[#2A1810] border border-[#E6D5AC]/20 
                     text-white placeholder-white/50 shadow-sm focus:ring-2 focus:ring-[#00ED64] outline-none"
          />
        </div>
        
        {/* Zoom Controls */}
        <div className="flex flex-col gap-2 bg-[#2A1810]/80 p-4 rounded-lg border border-[#E6D5AC]/10">
          <button
            onClick={handleZoomIn}
            className="p-2 text-white hover:bg-[#3C2A20] rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-white hover:bg-[#3C2A20] rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 text-white hover:bg-[#3C2A20] rounded transition-colors"
            title="Reset View"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Clusters Panel */}
        <div className="bg-[#2A1810]/80 p-4 rounded-lg border border-[#E6D5AC]/10">
          <h3 className="text-sm text-[#E6D5AC] font-semibold mb-2">Clusters</h3>
          {Object.entries(VECTOR_CLUSTERS).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setSelectedCluster(selectedCluster === key ? null : key)}
              className={`flex items-center gap-2 p-2 rounded w-full text-left text-sm mb-1 transition-colors ${
                selectedCluster === key ? 'bg-[#3C2A20]' : 'hover:bg-[#3C2A20]'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: info.color }}
              />
              <span className="text-white/90">{info.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Visualization - Now fullscreen */}
      <svg 
        ref={svgRef}
        width="100%" 
        height="100%"
        viewBox={`0 0 ${viewportDimensions.width} ${viewportDimensions.height}`}
        className="touch-none select-none"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <g transform={`
          translate(${viewportDimensions.width/2 + offset.x}, ${viewportDimensions.height/2 + offset.y})
          scale(${scale / 300})
        `}>
          {points.map((line, i) => (
            <g key={`group-${i}`}>
              {line.map((point, j) => renderPoint(point, i, j, 0))}
            </g>
          ))}
        </g>
      </svg>

      {/* Fixed Position Hover Card */}
      {hoveredPoint && (
        <div className="fixed top-8 right-8 max-w-sm bg-[#2A1810]/95 rounded-lg border border-[#E6D5AC]/20 p-4 text-[#E6D5AC] shadow-lg">
          <h3 className="font-medium text-[#E6D5AC] text-lg mb-2"
              style={{ color: VECTOR_CLUSTERS[hoveredPoint.cluster].color }}>
            {hoveredPoint.word}
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm">
                <span className="text-[#E6D5AC]/70">Vector: </span>
                <span className="font-mono">[{hoveredPoint.vector.join(', ')}]</span>
              </p>
              <p className="text-sm">
                <span className="text-[#E6D5AC]/70">Cluster: </span>
                <span>{VECTOR_CLUSTERS[hoveredPoint.cluster].label}</span>
              </p>
            </div>
            
            {hoveredPoint.relationships.length > 0 && (
              <div>
                <p className="text-sm text-[#E6D5AC]/70 mb-1">Connected to:</p>
                <div className="flex flex-wrap gap-2">
                  {hoveredPoint.relationships.map((related, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${VECTOR_CLUSTERS[related.cluster].color}30`,
                        color: VECTOR_CLUSTERS[related.cluster].color
                      }}
                    >
                      {related.word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions Overlay */}
      <div className="absolute bottom-4 right-4 bg-[#2A1810]/80 p-3 rounded-lg border border-[#E6D5AC]/10">
        <p className="text-sm text-[#E6D5AC]">
          🖱️ Drag to pan • Scroll to zoom • Hover over points to see details
        </p>
      </div>
    </div>
  );
};

export default VectorSpaceVisualization;
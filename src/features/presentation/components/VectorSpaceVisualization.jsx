import React, { useState, useRef, useEffect } from 'react';
import { Search, ZoomIn, ZoomOut, Minimize2 } from 'lucide-react';

// Define clusters outside the component
const VECTOR_CLUSTERS = {
    tech: {
      words: ['apple', 'windows', 'safari', 'python', 'java', 'ruby', 'chrome', 'shell', 'swift', 'rust'],
      color: '#2563eb', // blue
      label: 'Technology'
    },
    nature: {
      words: ['apple', 'python', 'ruby', 'shell', 'palm', 'java', 'sage', 'mint', 'butterfly', 'spider'],
      color: '#059669', // green
      label: 'Nature & Food'
    },
    places: {
      words: ['palm', 'safari', 'china', 'java', 'crown', 'victoria', 'phoenix', 'amazon', 'delta', 'spring'],
      color: '#7c3aed', // purple
      label: 'Places & Geography'
    },
    commerce: {
      words: ['amazon', 'apple', 'crown', 'shell', 'delta', 'visa', 'sprint', 'target', 'nike', 'adobe'],
      color: '#dc2626', // red
      label: 'Companies & Brands'
    }
  };

const RELATED_CONCEPTS = {
    winter: ['insulated', 'wool', 'cold', 'snow', 'north-face'],
    hiking: ['waterproof', 'durable', 'outdoor', 'patagonia', 'breathable'],
    wedding: ['formal', 'gucci', 'evening', 'classic', 'prada'],
    workout: ['moisture-wicking', 'nike', 'activewear', 'sportswear', 'adidas'],
    business: ['formal', 'minimalist', 'classic', 'modern', 'workwear'],
    vintage: ['classic', 'denim', 'levi\'s', 'leather', 'streetwear'],
    apple: {
        tech: ['microsoft', 'windows', 'safari', 'devices'],
        nature: ['fruit', 'orchard', 'pie', 'cider'],
        commerce: ['nasdaq', 'store', 'brand', 'retail']
    },
    // Programming Language vs Snake
    python: {
        tech: ['programming', 'coding', 'software', 'django'],
        nature: ['snake', 'reptile', 'scales', 'venom']
    },
    // Coffee/Island vs Programming
    java: {
        tech: ['programming', 'code', 'android', 'software'],
        nature: ['coffee', 'beans', 'brew', 'caffeine'],
        places: ['indonesia', 'island', 'jakarta', 'bali']
    },
    // Gemstone vs Programming
    ruby: {
        tech: ['rails', 'programming', 'code', 'gems'],
        nature: ['crystal', 'gemstone', 'mineral', 'jewelry']
    },
    // Tree vs Company
    palm: {
        tech: ['pda', 'pilot', 'computing', 'mobile'],
        nature: ['tree', 'coconut', 'tropical', 'beach'],
        places: ['palm-beach', 'palm-springs', 'desert', 'oasis']
    }
};

const CONCEPT_VECTORS = {
    tech: [0.9, 0.1, 0.3],
    nature: [0.2, 0.9, 0.3],
    commerce: [0.3, 0.2, 0.9],
    places: [0.4, 0.4, 0.8]
  };

  const MULTI_MEANING_WORDS = [
    {
      word: 'apple',
      contexts: {
        tech: {
          cluster: 'tech',
          relations: ['microsoft', 'windows', 'safari', 'devices'],
          distance: 0.4,
          angle: Math.PI * 0.2
        },
        nature: {
          cluster: 'nature',
          relations: ['fruit', 'orchard', 'pie', 'cider'],
          distance: 0.4,
          angle: Math.PI * 0.7
        },
        commerce: {
          cluster: 'commerce',
          relations: ['nasdaq', 'store', 'brand', 'retail'],
          distance: 0.4,
          angle: Math.PI * 1.2
        }
      }
    },
    {
      word: 'python',
      contexts: {
        tech: {
          cluster: 'tech',
          relations: ['programming', 'coding', 'software', 'django'],
          distance: 0.5,
          angle: Math.PI * 0.4
        },
        nature: {
          cluster: 'nature',
          relations: ['snake', 'reptile', 'scales', 'venom'],
          distance: 0.5,
          angle: Math.PI * 0.9
        }
      }
    },
    {
      word: 'java',
      contexts: {
        tech: {
          cluster: 'tech',
          relations: ['programming', 'code', 'android', 'software'],
          distance: 0.45,
          angle: Math.PI * 0.6
        },
        nature: {
          cluster: 'nature',
          relations: ['coffee', 'beans', 'brew', 'caffeine'],
          distance: 0.45,
          angle: Math.PI * 1.1
        },
        places: {
          cluster: 'places',
          relations: ['indonesia', 'island', 'jakarta', 'bali'],
          distance: 0.45,
          angle: Math.PI * 1.6
        }
      }
    }
  ];

function generatePoints(dimensions) {
    const clusterEntries = Object.entries(VECTOR_CLUSTERS);
    const lines = [];
    const multiMeaningPoints = [];
    
    // Generate regular cluster points
    for (let i = 0; i < dimensions; i++) {
      const angle = (i * 2 * Math.PI) / dimensions;
      const points = [];
      
      const clusterIndex = i % clusterEntries.length;
      const [clusterKey, clusterInfo] = clusterEntries[clusterIndex];
      
      // Skip multi-meaning words in regular generation
      const availableWords = clusterInfo.words.filter(word => 
        !MULTI_MEANING_WORDS.some(m => m.word === word)
      );
      
      const numPoints = 2 + Math.floor(Math.random() * 2);
      for (let j = 0; j < numPoints; j++) {
        if (availableWords.length === 0) continue;
  
        const baseDistance = 0.3 + (j * 0.15);
        const variance = Math.random() * 0.08;
        const distance = baseDistance + variance;
        
        const word = availableWords[Math.floor(Math.random() * availableWords.length)];
        const vector = generateContextualVector(clusterKey);
  
        points.push({
          distance,
          angle,
          word,
          vector,
          x: distance * Math.cos(angle),
          y: distance * Math.sin(angle),
          cluster: clusterKey,
          relationships: getRelatedConcepts(word, clusterInfo.words),
          concepts: getConceptualAlignment(word)
        });
      }
      
      if (points.length > 0) {
        lines.push(points);
      }
    }
  
    // Generate multi-meaning points
    MULTI_MEANING_WORDS.forEach(({ word, contexts }) => {
      Object.entries(contexts).forEach(([contextKey, contextInfo]) => {
        const x = contextInfo.distance * Math.cos(contextInfo.angle);
        const y = contextInfo.distance * Math.sin(contextInfo.angle);
        
        multiMeaningPoints.push([{
          word,
          distance: contextInfo.distance,
          angle: contextInfo.angle,
          x,
          y,
          vector: generateContextualVector(contextInfo.cluster),
          cluster: contextInfo.cluster,
          relationships: contextInfo.relations,
          concepts: [contextKey, ...getConceptualAlignment(word)],
          semanticContext: contextKey,
          isMultiMeaning: true
        }]);
      });
    });
  
    return [...lines, ...multiMeaningPoints];
  }
function generateContextualVector(clusterType) {
    // Base vectors for different contexts
    const baseVectors = {
        tech: [0.9, 0.1, 0.3],
        nature: [0.2, 0.9, 0.3],
        commerce: [0.3, 0.2, 0.9],
        places: [0.4, 0.4, 0.8]
    };

    const baseVector = baseVectors[clusterType] || [0.5, 0.5, 0.5];

    // Add slight variations while maintaining semantic relationship
    return baseVector.map(v => Number((v + (Math.random() * 0.1 - 0.05)).toFixed(2)));
}

function findRelatedWords(word, clusterWords) {
    // Return 2-3 related words from the same cluster
    return clusterWords
        .filter(w => w !== word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2 + Math.floor(Math.random() * 2));
}

function getRelatedConcepts(word, clusterWords) {
    return clusterWords
      .filter(w => w !== word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }

// function generateContextualVector(clusterType) {
//     const baseVector = CONCEPT_VECTORS[clusterType] || [0.5, 0.5, 0.5];
//     return baseVector.map(v => Number((v + (Math.random() * 0.1 - 0.05)).toFixed(2)));
//   }

  function getConceptualAlignment(word) {
    // Return 2-3 relevant concepts
    const concepts = Object.keys(CONCEPT_VECTORS)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2 + Math.floor(Math.random() * 2));
    return concepts;
  }

// Helper function to generate cluster path
function generateClusterPath(points, center, scale) {
    if (points.length < 3) return '';
  
    const hull = computeConvexHull(points.map(p => ({
      x: center + scale * p.x,
      y: center + scale * p.y
    })));
  
    return `M ${hull.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
  }

// Convex hull algorithm (Graham scan)
function computeConvexHull(points) {
    if (points.length < 3) return points;
  
    const start = points.reduce((min, p) => 
      p.y < min.y || (p.y === min.y && p.x < min.x) ? p : min
    );
  
    const sorted = points
      .filter(p => p !== start)
      .sort((a, b) => {
        const angleA = Math.atan2(a.y - start.y, a.x - start.x);
        const angleB = Math.atan2(b.y - start.y, b.x - start.x);
        return angleA - angleB;
      });
  
    const hull = [start];
    sorted.forEach(point => {
      while (hull.length >= 2) {
        const a = hull[hull.length - 2];
        const b = hull[hull.length - 1];
        if (((b.x - a.x) * (point.y - a.y) - (b.y - a.y) * (point.x - a.x)) > 0) {
          break;
        }
        hull.pop();
      }
      hull.push(point);
    });
  
    return hull;
  }
  

  const VectorSpaceVisualization = () => {
    // State management
    const [dimensions] = useState(12);
    const [scale, setScale] = useState(300);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [selectedCluster, setSelectedCluster] = useState(null);
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [points, setPoints] = useState(() => generatePoints(dimensions));
    const svgRef = useRef(null);
  
    // Filter points based on search term
    const filteredPoints = points.map(line =>
      line.filter(point => 
        point.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        point.relationships.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  
    // Event handlers for pan and zoom
    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = 1.1;
      const delta = e.deltaY > 0 ? 1 / zoomFactor : zoomFactor;
      
      // Get mouse position relative to SVG
      const svgRect = svgRef.current.getBoundingClientRect();
      const mouseX = e.clientX - svgRect.left;
      const mouseY = e.clientY - svgRect.top;
  
      // Calculate new scale
      const newScale = Math.min(Math.max(scale * delta, 100), 1000); // Limit zoom range
      
      // Adjust offset to zoom around mouse position
      const newOffset = {
        x: mouseX - (mouseX - offset.x) * delta,
        y: mouseY - (mouseY - offset.y) * delta
      };
  
      setScale(newScale);
      setOffset(newOffset);
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
  
    // Cleanup event listeners
    useEffect(() => {
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, []);
  
    const svgSize = 800;
    const center = svgSize / 2;
  
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white">
        {/* Controls */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vectors..."
              className="w-64 pl-10 pr-4 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          {/* Zoom Controls */}
          <div className="flex flex-col gap-2 bg-white p-2 rounded-lg shadow-sm">
            <button
              onClick={() => setScale(s => Math.min(s * 1.2, 1000))}
              className="p-2 hover:bg-gray-100 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setScale(s => Math.max(s / 1.2, 100))}
              className="p-2 hover:bg-gray-100 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-2 hover:bg-gray-100 rounded"
              title="Reset View"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
  
          {/* Cluster Legend */}
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h3 className="text-sm font-semibold mb-2">Clusters</h3>
            {Object.entries(VECTOR_CLUSTERS).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setSelectedCluster(selectedCluster === key ? null : key)}
                className={`flex items-center gap-2 p-1 rounded w-full text-left text-sm ${
                  selectedCluster === key ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: info.color }}
                />
                <span>{info.label}</span>
              </button>
            ))}
          </div>
        </div>
  
        {/* Main SVG Visualization */}
        <svg 
          ref={svgRef}
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="max-w-full max-h-full cursor-grab select-none"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Continue with Part 4 for the SVG content */}
          {/* Transform group for pan and zoom */}
        <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale / 300})`}>
          {/* Cluster regions */}
          {Object.entries(VECTOR_CLUSTERS).map(([key, info]) => (
            <path
              key={`cluster-${key}`}
              d={generateClusterPath(
                filteredPoints
                  .flat()
                  .filter(p => p.cluster === key),
                center,
                300 // Use base scale for paths
              )}
              fill={info.color}
              fillOpacity={selectedCluster === key || !selectedCluster ? 0.1 : 0.02}
              stroke={info.color}
              strokeOpacity={0.3}
              strokeWidth={300 / scale} // Adjust stroke width based on zoom
            />
          ))}

          {/* Points and labels */}
          {filteredPoints.map((line, i) => (
            <g key={`group-${i}`}>
              {line.map((point, j) => {
                const x = center + 300 * point.x; // Use base scale
                const y = center + 300 * point.y;
                const isHighlighted = hoveredPoint?.word === point.word ||
                  (hoveredPoint?.relationships || []).includes(point.word);
                
                return (
                  <g 
                    key={`point-${i}-${j}`}
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={(isHighlighted ? 5 : 3) * (300 / scale)} // Adjust size for zoom
                      fill={VECTOR_CLUSTERS[point.cluster].color}
                      fillOpacity={isHighlighted ? 1 : 0.7}
                    />
                    
                    <text
                      x={x}
                      y={y - 10 * (300 / scale)}
                      textAnchor="middle"
                      fill={isHighlighted ? VECTOR_CLUSTERS[point.cluster].color : '#6b7280'}
                      style={{
                        fontSize: `${(isHighlighted ? 0.9 : 0.7) * (300 / scale)}rem`,
                        fontWeight: isHighlighted ? 500 : 400,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {point.word}
                    </text>

                    {/* Hover card */}
                    {isHighlighted && (
                      <>
                        {/* Backdrop blur and shadow */}
                        <rect
                          x={x - 125}
                          y={y}
                          width="250"
                          height={point.isMultiMeaning ? 115 : 95}
                          rx="6"
                          fill="#000000"
                          fillOpacity="0.05"
                          filter="blur(8px)"
                        />
                        
                        {/* Main background card */}
                        <rect
                          x={x - 120}
                          y={y + 5}
                          width="240"
                          height={point.isMultiMeaning ? 105 : 85}
                          rx="4"
                          fill="#ffffff"
                          fillOpacity="0.98"
                          stroke={VECTOR_CLUSTERS[point.cluster].color}
                          strokeWidth="1.5"
                          filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                        />
                        
                        {/* Information layout */}
                        <g transform={`translate(${x - 110}, ${y + 20})`}>
                          {point.isMultiMeaning ? (
                            <>
                              {/* Multi-meaning word information */}
                              <text
                                x="0"
                                y="0"
                                className="text-sm font-semibold"
                                fill={VECTOR_CLUSTERS[point.cluster].color}
                              >
                                {point.word} in {point.semanticContext} context
                              </text>
                              
                              <text
                                x="0"
                                y="20"
                                className="text-xs font-mono"
                                fill="#111827"
                              >
                                Vector: [{point.vector.join(', ')}]
                              </text>
                              
                              <text
                                x="0"
                                y="40"
                                className="text-xs"
                                fill="#1f2937"
                              >
                                Related terms: 
                                <tspan fill="#4b5563">
                                  {' ' + point.relationships.join(', ')}
                                </tspan>
                              </text>
                              
                              <text
                                x="0"
                                y="60"
                                className="text-xs"
                                fill="#1f2937"
                              >
                                Other contexts: 
                                <tspan fill="#4b5563">
                                  {' ' + (
                                    point.concepts
                                      .filter(c => c !== point.semanticContext)
                                      .join(', ')
                                  )}
                                </tspan>
                              </text>
                              
                              <text
                                x="0"
                                y="80"
                                className="text-xs"
                                fill="#1f2937"
                              >
                                Cluster: 
                                <tspan 
                                  fill={VECTOR_CLUSTERS[point.cluster].color}
                                  fontWeight="500"
                                >
                                  {' ' + VECTOR_CLUSTERS[point.cluster].label}
                                </tspan>
                              </text>
                            </>
                          ) : (
                            <>
                              {/* Regular point information */}
                              <text
                                x="0"
                                y="0"
                                className="text-xs font-mono"
                                fill="#111827"
                                fontWeight="500"
                              >
                                Vector: [{point.vector.join(', ')}]
                              </text>
                              
                              <text
                                x="0"
                                y="20"
                                className="text-xs"
                                fill="#1f2937"
                              >
                                Similar: 
                                <tspan fill="#4b5563">
                                  {' ' + point.relationships.join(', ')}
                                </tspan>
                              </text>
                              
                              <text
                                x="0"
                                y="40"
                                className="text-xs"
                                fill="#1f2937"
                              >
                                Concepts: 
                                <tspan fill="#4b5563">
                                  {' ' + point.concepts.join(', ')}
                                </tspan>
                              </text>
                              
                              <text
                                x="0"
                                y="60"
                                className="text-xs"
                                fill="#1f2937"
                              >
                                Cluster: 
                                <tspan 
                                  fill={VECTOR_CLUSTERS[point.cluster].color}
                                  fontWeight="500"
                                >
                                  {' ' + VECTOR_CLUSTERS[point.cluster].label}
                                </tspan>
                              </text>
                            </>
                          )}
                        </g>
                      </>
                    )}
                  </g>
                );
              })}
            </g>
          ))}

          {/* Center label */}
          <text
            x={center}
            y={center - 20}
            textAnchor="middle"
            fill="#1e40af"
            className="text-sm font-semibold"
          >
            Vector Space
          </text>
        </g>
      </svg>
    </div>
  );
};

export default VectorSpaceVisualization;
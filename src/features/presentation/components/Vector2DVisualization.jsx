import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Vector2DVisualization = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const vectors = {
    king: [0.9, 0.6],
    queen: [0.9, 0.2],
    man: [0.2, 0.7],
    woman: [0.2, 0.2],
    prince: [0.8, 0.7],
    princess: [0.8, 0.2],
    lord: [0.6, 0.7],
    lady: [0.6, 0.2]
  };

  const [hoveredWord, setHoveredWord] = useState(null);
  const [mathDetails, setMathDetails] = useState(null);

  // Canvas setup
  const width = 400;
  const height = 400;
  const padding = 40;

  // Vector math functions
  const dotProduct = (a, b) => a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitude = v => Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
  const cosineSimilarity = (a, b) => {
    return dotProduct(a, b) / (magnitude(a) * magnitude(b));
  };
  const euclideanDistance = (a, b) => {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
  };
  
  // Enhanced coordinate conversion with pan and zoom
  const toCanvasCoords = (vector) => {
    const padding = 80 * scale; // Scale padding with zoom
    return [
      padding + (vector[0] * (dimensions.width - 2 * padding) * scale) + offset.x,
      dimensions.height - (padding + (vector[1] * (dimensions.height - 2 * padding) * scale)) + offset.y
    ];
  };

  const calculateRelationships = (word) => {
    if (!word) return null;

    const relationships = Object.entries(vectors)
      .filter(([w]) => w !== word)
      .map(([otherWord, otherVector]) => ({
        word: otherWord,
        similarity: cosineSimilarity(vectors[word], otherVector),
        distance: euclideanDistance(vectors[word], otherVector),
        vector: otherVector
      }))
      .sort((a, b) => b.similarity - a.similarity);

    // Find analogies (e.g., king:queen :: man:woman)
    const analogies = [];
    if (word === 'king') {
      const kingToQueen = vectors.king.map((v, i) => vectors.queen[i] - v);
      const manToWoman = vectors.man.map((v, i) => vectors.woman[i] - v);
      const analogyScore = cosineSimilarity(kingToQueen, manToWoman);
      analogies.push({
        pair1: 'king:queen',
        pair2: 'man:woman',
        score: analogyScore
      });
    }

    return {
      vector: vectors[word],
      relationships: relationships.slice(0, 3), // Top 3 most similar
      analogies
    };
  };

  // Enhanced draw function with zoom and pan support
  const draw = (ctx) => {
    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    
    // Draw axes with transformed coordinates
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    const padding = 80 * scale;
    // X-axis
    ctx.moveTo(padding + offset.x, dimensions.height - padding + offset.y);
    ctx.lineTo(dimensions.width - padding + offset.x, dimensions.height - padding + offset.y);
    // Y-axis
    ctx.moveTo(padding + offset.x, dimensions.height - padding + offset.y);
    ctx.lineTo(padding + offset.x, padding + offset.y);
    ctx.stroke();
    
    // Add axis labels with scaled font
    ctx.fillStyle = '#666';
    ctx.font = `${12 * scale}px sans-serif`;
    ctx.fillText('Royal/Status →', dimensions.width - padding - 80 + offset.x, dimensions.height - padding + 20 + offset.y);
    ctx.save();
    ctx.translate(padding - 20 + offset.x, padding + 60 + offset.y);
    ctx.rotate(-Math.PI/2);
    ctx.fillText('Gender →', 0, 0);
    ctx.restore();
    
    // Draw vectors and labels with scaling
    Object.entries(vectors).forEach(([word, vector]) => {
      const [x, y] = toCanvasCoords(vector);
      
      // Draw point with increased size
      ctx.beginPath();
      ctx.fillStyle = hoveredWord === word ? '#2563eb' : '#666';
      ctx.arc(x, y, 10 * scale, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw label
      ctx.fillStyle = hoveredWord === word ? '#2563eb' : '#000';
      ctx.font = hoveredWord === word 
        ? `bold ${14 * scale}px sans-serif` 
        : `${12 * scale}px sans-serif`;
      ctx.fillText(word, x + 8 * scale, y - 8 * scale);
      
      // Draw relationships when word is hovered
      if (hoveredWord === word) {
        Object.entries(vectors).forEach(([otherWord, otherVector]) => {
          if (word !== otherWord) {
            const [ox, oy] = toCanvasCoords(otherVector);
            ctx.beginPath();
            ctx.strokeStyle = '#2563eb44';
            ctx.lineWidth = 1 * scale;
            ctx.moveTo(x, y);
            ctx.lineTo(ox, oy);
            ctx.stroke();
          }
        });
      }
    });
  };

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Canvas setup and interaction handlers
  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    const canvas = document.getElementById('vectorCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set up high-DPI canvas
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(dpr, dpr);
    
    // Handle mouse movement for hover effects
    const handleMouseMove = (event) => {
      if (isDragging) {
        const dx = event.clientX - dragStart.x;
        const dy = event.clientY - dragStart.y;
        setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setDragStart({ x: event.clientX, y: event.clientY });
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * dpr;
      const y = (event.clientY - rect.top) * dpr;
      
      let closest = null;
      let minDist = Infinity;
      
      Object.entries(vectors).forEach(([word, vector]) => {
        const [vx, vy] = toCanvasCoords(vector);
        const dist = Math.hypot(x - vx * dpr, y - vy * dpr);
        if (dist < minDist && dist < 30 * dpr * scale) {
          minDist = dist;
          closest = word;
        }
      });
      
      setHoveredWord(closest);
    };

    // Handle zoom with wheel
    const handleWheel = (event) => {
      event.preventDefault();
      const delta = -event.deltaY * 0.001;
      setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
    };

    // Handle drag events
    const handleMouseDown = (event) => {
      setIsDragging(true);
      setDragStart({ x: event.clientX, y: event.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    
    draw(ctx);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [dimensions, hoveredWord, scale, offset, isDragging]);

  // Update math details when hoveredWord changes
  useEffect(() => {
    setMathDetails(calculateRelationships(hoveredWord));
  }, [hoveredWord]);

  return (
    <Card className="w-full max-w-4xl mx-auto p-4 bg-white">
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold">2D Word Vectors</h3>
          <div className="flex gap-8">
            <div>
              <canvas 
                id="vectorCanvas" 
                className="border border-gray-200 rounded-lg"
              />
            </div>
            {mathDetails && (
              <div className="w-64 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Vector: {hoveredWord}</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Coordinates: [{mathDetails.vector.map(v => v.toFixed(2)).join(', ')}]
                </p>
                
                <h5 className="font-medium mt-4 mb-2">Closest Words:</h5>
                {mathDetails.relationships.map(rel => (
                  <div key={rel.word} className="mb-2">
                    <p className="text-sm">
                      <span className="font-medium">{rel.word}</span>
                      <br />
                      Similarity: {rel.similarity.toFixed(3)}
                      <br />
                      Distance: {rel.distance.toFixed(3)}
                    </p>
                  </div>
                ))}

                {mathDetails.analogies.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Analogies:</h5>
                    {mathDetails.analogies.map((analogy, i) => (
                      <p key={i} className="text-sm">
                        {analogy.pair1} :: {analogy.pair2}
                        <br />
                        Score: {analogy.score.toFixed(3)}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 text-center">
            Hover over words to explore mathematical relationships in vector space
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Vector2DVisualization;
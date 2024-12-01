import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Vector2DVisualization = () => {
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
  
  // Function to convert vector coordinates to canvas coordinates
  const toCanvasCoords = (vector) => {
    return [
      padding + vector[0] * (width - 2 * padding),
      height - (padding + vector[1] * (height - 2 * padding))
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

  // Draw the visualization
  const draw = (ctx) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // X-axis
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    // Y-axis
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();
    
    // Add axis labels
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.fillText('Royal/Status →', width - padding - 80, height - padding + 20);
    ctx.save();
    ctx.translate(padding - 20, padding + 60);
    ctx.rotate(-Math.PI/2);
    ctx.fillText('Gender →', 0, 0);
    ctx.restore();
    
    // Draw vectors and labels
    Object.entries(vectors).forEach(([word, vector]) => {
      const [x, y] = toCanvasCoords(vector);
      
      // Draw point
      ctx.beginPath();
      ctx.fillStyle = hoveredWord === word ? '#2563eb' : '#666';
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw label
      ctx.fillStyle = hoveredWord === word ? '#2563eb' : '#000';
      ctx.font = hoveredWord === word ? 'bold 14px sans-serif' : '12px sans-serif';
      ctx.fillText(word, x + 8, y - 8);
      
      // Draw relationships when word is hovered
      if (hoveredWord === word) {
        Object.entries(vectors).forEach(([otherWord, otherVector]) => {
          if (word !== otherWord) {
            const [ox, oy] = toCanvasCoords(otherVector);
            ctx.beginPath();
            ctx.strokeStyle = '#2563eb44';
            ctx.lineWidth = 1;
            ctx.moveTo(x, y);
            ctx.lineTo(ox, oy);
            ctx.stroke();
          }
        });
      }
    });
  };

  // Set up canvas and handle interactions
  useEffect(() => {
    const canvas = document.getElementById('vectorCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set up high-DPI canvas
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    
    // Handle mouse movement
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * dpr;
      const y = (event.clientY - rect.top) * dpr;
      
      // Find closest word
      let closest = null;
      let minDist = Infinity;
      
      Object.entries(vectors).forEach(([word, vector]) => {
        const [vx, vy] = toCanvasCoords(vector);
        const dist = Math.hypot(x - vx * dpr, y - vy * dpr);
        if (dist < minDist && dist < 30 * dpr) {
          minDist = dist;
          closest = word;
        }
      });
      
      setHoveredWord(closest);
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    
    // Initial draw
    draw(ctx);
    
    // Clean up
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hoveredWord]);

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
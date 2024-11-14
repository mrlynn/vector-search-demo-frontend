// components/ui/mermaid.jsx
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Configure mermaid
mermaid.initialize({
  startOnLoad: false,  // Changed to false to handle manually
  theme: 'neutral',
  securityLevel: 'loose',
  themeVariables: {
    fontFamily: 'system-ui, sans-serif',
  },
  fontSize: 16,
  flowchart: {
    curve: 'basis',
    padding: 20
  }
});

const Mermaid = ({ chart }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        // Clear previous state
        setError(null);
        
        // Generate unique ID
        const id = `mermaid-${Date.now()}`;
        
        // Render new diagram
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
      } catch (err) {
        console.error('Mermaid rendering failed:', err);
        setError(err.message);
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <p>Failed to render diagram:</p>
        <pre className="text-sm mt-2">{error}</pre>
      </div>
    );
  }

  return (
    <div 
      className="mermaid-diagram overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default Mermaid;
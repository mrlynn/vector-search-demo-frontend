import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend } from 'recharts';
import { Upload, Info, Database, Calculator } from 'lucide-react';

const VectorFieldVisualizer = () => {
  const [documents, setDocuments] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [vectorStats, setVectorStats] = useState(null);
  
  const calculateVectorStats = (docs) => {
    if (!docs.length) return null;
    
    // Calculate average vector
    const avgVector = docs[0].embedding.map((_, dimIndex) => {
      const sum = docs.reduce((acc, doc) => acc + doc.embedding[dimIndex], 0);
      return sum / docs.length;
    });
    
    // Calculate vector distances and similarities
    const distances = docs.map(doc => {
      const euclideanDist = Math.sqrt(
        doc.embedding.reduce((sum, val, i) => 
          sum + Math.pow(val - avgVector[i], 2), 0)
      );
      return euclideanDist;
    });
    
    return {
      dimensions: docs[0].embedding.length,
      documentCount: docs.length,
      averageVector: avgVector,
      maxDistance: Math.max(...distances),
      minDistance: Math.min(...distances),
      avgDistance: distances.reduce((a, b) => a + b) / distances.length
    };
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        const docs = Array.isArray(jsonData) ? jsonData : jsonData.documents;
        if (!docs) throw new Error('No documents found in JSON');
        setDocuments(docs);
        setVectorStats(calculateVectorStats(docs));
        setError(null);
      } catch (error) {
        setError('Error parsing JSON: ' + error.message);
        console.error('Error parsing JSON:', error);
      }
    };
    
    reader.readAsText(file);
  };
  
  useEffect(() => {
    if (documents.length > 0) {
      const processed = documents.map((doc, index) => {
        if (!doc.embedding || !Array.isArray(doc.embedding)) {
          console.error('Invalid embedding for document:', doc);
          return null;
        }
        
        const x = doc.embedding[0] * 100;
        const y = doc.embedding[1] * 100;
        
        return {
          x,
          y,
          z: 1,
          name: doc.title || `Document ${index + 1}`,
          similarity: doc.similarity || 1.0,
          content: doc.content || '',
          embedding: doc.embedding,
          index
        };
      }).filter(Boolean);
      
      setProcessedData(processed);
    }
  }, [documents]);

  return (
    <div className="flex gap-4 w-full max-w-6xl">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Vector Field Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">JSON file with vector embeddings</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".json"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            
            {error && (
              <div className="text-red-500 text-center p-2">
                {error}
              </div>
            )}
            
            {processedData.length > 0 && (
              <div className="w-full h-96 mt-4">
                <ScatterChart
                  width={800}
                  height={400}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <XAxis type="number" dataKey="x" name="Component 1" domain={['auto', 'auto']} />
                  <YAxis type="number" dataKey="y" name="Component 2" domain={['auto', 'auto']} />
                  <ZAxis type="number" dataKey="z" range={[100]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border rounded shadow">
                            <p className="font-medium">{data.name}</p>
                            <p>Similarity: {data.similarity.toFixed(3)}</p>
                            {data.content && (
                              <p className="text-sm mt-1">{data.content}</p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Scatter
                    name="Documents"
                    data={processedData}
                    fill="#8884d8"
                    shape="circle"
                    onClick={(data) => setSelectedDoc(data)}
                  />
                </ScatterChart>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Sidebar */}
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={20} />
            Analysis Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Dataset Overview */}
            {vectorStats && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Database size={16} />
                  Dataset Statistics
                </h3>
                <div className="space-y-1 text-sm">
                  <p>Number of Documents: {vectorStats.documentCount}</p>
                  <p>Vector Dimensions: {vectorStats.dimensions}</p>
                  <p>Average Distance: {vectorStats.avgDistance.toFixed(4)}</p>
                  <p>Max Distance: {vectorStats.maxDistance.toFixed(4)}</p>
                  <p>Min Distance: {vectorStats.minDistance.toFixed(4)}</p>
                </div>
              </div>
            )}

            {/* Selected Document Details */}
            {selectedDoc && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Calculator size={16} />
                  Selected Document
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{selectedDoc.name}</p>
                  <p>Similarity Score: {selectedDoc.similarity.toFixed(4)}</p>
                  <p>Content: {selectedDoc.content}</p>
                  <div className="mt-2">
                    <p className="font-medium">Vector Components:</p>
                    <div className="max-h-32 overflow-y-auto">
                      {selectedDoc.embedding.map((value, idx) => (
                        <p key={idx} className="text-xs">
                          Dim {idx + 1}: {value.toFixed(4)}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VectorFieldVisualizer;
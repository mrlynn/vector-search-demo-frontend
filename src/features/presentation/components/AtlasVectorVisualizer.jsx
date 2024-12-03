import React, { useState } from 'react';
import { Database, Calculator, Info, Search } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend } from 'recharts';
import config from '../../../config.js';
const logApiResponse = async (response) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        try {
            const clonedResponse = response.clone();
            const data = await clonedResponse.json();
            console.log('API Response:', {
                status: response.status,
                statusText: response.statusText,
                data: data
            });
        } catch (error) {
            console.error('Error logging response:', error);
        }
    }
    return response;
};
const AtlasVectorVisualizer = () => {
    const [connectionDetails, setConnectionDetails] = useState({
        connectionString: 'mongodb+srv://readonly:Password123%21@performance.zbcul.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=performance',
        database: 'sample_mflix',
        collection: 'embedded_movies'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fields, setFields] = useState([]);
    const [selectedField, setSelectedField] = useState('');
    const [processedData, setProcessedData] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [vectorStats, setVectorStats] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const testConnection = async () => {
        if (!connectionDetails.connectionString.trim() || 
            !connectionDetails.database.trim() || 
            !connectionDetails.collection.trim()) return;
    
        setLoading(true);
        setError(null);
        
        try {
          console.log('Sending connection test request with:', {
            database: connectionDetails.database,
            collection: connectionDetails.collection,
            hasConnectionString: !!connectionDetails.connectionString
          });
    
          const response = await fetch(`${config.apiUrl}/atlas/test-connection`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(connectionDetails)
          }).then(logApiResponse);
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Connection failed');
          }
    
          const data = await response.json();
          console.log('Connection test successful:', data);
          
          if (!data.fields || data.fields.length === 0) {
            setError('No vector fields found in the collection');
            return;
          }
    
          setFields(data.fields || []);
          setIsConnected(true);
        } catch (err) {
          console.error('Connection test error:', err);
          setError('Failed to connect: ' + err.message);
          setIsConnected(false);
        } finally {
          setLoading(false);
        }
      };

    const analyzeVectors = async () => {
        if (!selectedField) {
            setError('Please select a vector field first');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${config.apiUrl}/atlas/analyze-vectors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...connectionDetails,
                    vectorField: selectedField,
                    sampleSize: 100
                })
            });

            if (!response.ok) {
                throw new Error('Failed to analyze vectors');
            }

            const data = await response.json();

            if (data.documents && data.stats) {
                setProcessedData(data.documents.map(doc => ({
                    x: doc.embedding[0] * 100,
                    y: doc.embedding[1] * 100,
                    z: 1,
                    name: doc.title || doc._id,
                    content: doc.content || JSON.stringify(doc).slice(0, 100) + '...',
                    embedding: doc.embedding,
                    originalDoc: doc
                })));

                setVectorStats(data.stats);
            }
        } catch (err) {
            setError('Failed to analyze vectors: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-4 w-full max-w-6xl">
            <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-[#001E2B] mb-6">Atlas Vector Field Visualization</h2>

                <div className="space-y-6">
                    {/* Connection Form */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Connection String
                                <input
                                    type="password"
                                    placeholder="mongodb+srv://..."
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                                    value={connectionDetails.connectionString}
                                    onChange={(e) => setConnectionDetails(prev => ({
                                        ...prev,
                                        connectionString: e.target.value
                                    }))}
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Database
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                                    value={connectionDetails.database}
                                    onChange={(e) => setConnectionDetails(prev => ({
                                        ...prev,
                                        database: e.target.value
                                    }))}
                                />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">
                                Collection
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                                    value={connectionDetails.collection}
                                    onChange={(e) => setConnectionDetails(prev => ({
                                        ...prev,
                                        collection: e.target.value
                                    }))}
                                />
                            </label>
                        </div>

                        <button
                            onClick={testConnection}
                            disabled={loading || !connectionDetails.connectionString || !connectionDetails.database || !connectionDetails.collection}
                            className="w-full bg-[#00ED64] text-[#001E2B] px-4 py-2 rounded-md font-medium hover:bg-[#00c753] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="animate-spin">⟳</span>
                            ) : (
                                <Database className="w-4 h-4" />
                            )}
                            Test Connection
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Field Selection */}
                    {isConnected && fields.length > 0 && (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Vector Field
                                <select
                                    value={selectedField}
                                    onChange={(e) => setSelectedField(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                                >
                                    <option value="">Select vector field</option>
                                    {fields.map((field) => (
                                        <option key={field} value={field}>
                                            {field}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <button
                                onClick={analyzeVectors}
                                disabled={loading || !selectedField}
                                className="w-full bg-[#00ED64] text-[#001E2B] px-4 py-2 rounded-md font-medium hover:bg-[#00c753] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="animate-spin">⟳</span>
                                ) : (
                                    <Calculator className="w-4 h-4" />
                                )}
                                Analyze Vectors
                            </button>
                        </div>
                    )}

                    {/* Visualization */}
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
                                                <div className="bg-white p-2 border text-black rounded shadow">
                                                    <p className="font-medium">{data.name}</p>
                                                    <p className="text-sm mt-1">{data.content}</p>
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
                                    fill="#00ED64"
                                    shape="circle"
                                    onClick={(data) => setSelectedDoc(data)}
                                />
                            </ScatterChart>
                        </div>
                    )}
                </div>
            </div>

            {/* Analysis Sidebar */}
            <div className="w-96 bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                    <Info className="w-5 h-5" />
                    <h3 className="text-xl font-bold text-[#001E2B]">Analysis Details</h3>
                </div>

                <div className="space-y-6">
                    {vectorStats && (
                        <div className="space-y-2">
                            <h4 className="text-lg text-black font-medium flex items-center gap-2">
                                <Database className="w-4 h-4" />
                                Dataset Statistics
                            </h4>
                            <div className="space-y-1 text-sm text-black">
                                <p>Number of Documents: {vectorStats.documentCount}</p>
                                <p>Vector Dimensions: {vectorStats.dimensions}</p>
                                <p>Average Distance: {vectorStats.avgDistance.toFixed(4)}</p>
                                <p>Max Distance: {vectorStats.maxDistance.toFixed(4)}</p>
                                <p>Min Distance: {vectorStats.minDistance.toFixed(4)}</p>
                            </div>
                        </div>
                    )}

                    {selectedDoc && (
                        <div className="space-y-2">
                            <h4 className="text-lg font-medium flex items-center gap-2">
                                <Calculator className="w-4 h-4" />
                                Selected Document
                            </h4>
                            <div className="space-y-1 text-sm">
                                <p className="font-medium">{selectedDoc.name}</p>
                                <p className="text-xs mt-2">Content:</p>
                                <p className="text-sm">{selectedDoc.content}</p>
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
            </div>
        </div>
    );
};

export default AtlasVectorVisualizer;
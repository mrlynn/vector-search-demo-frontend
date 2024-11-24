import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Search, Loader2, Info, Bug } from 'lucide-react';
import config from '../../config';

const VectorLibrarySearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('vector');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchMetrics, setSearchMetrics] = useState(null);
    const [debugInfo, setDebugInfo] = useState(null);
    const [showDebug, setShowDebug] = useState(false);
    const [availableConcepts, setAvailableConcepts] = useState([]);
    const [availableEras, setAvailableEras] = useState([]);
    const [selectedEra, setSelectedEra] = useState('');
    const searchTimeoutRef = useRef(null);
    const API_URL = config.apiUrl;

    // Fetch available concepts and eras on component mount
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [conceptsResponse, erasResponse] = await Promise.all([
                    fetch(`${API_URL}/ancient-texts/concepts`),
                    fetch(`${API_URL}/ancient-texts/eras`)


                ]);

                if (conceptsResponse.ok && erasResponse.ok) {
                    const concepts = await conceptsResponse.json();
                    const eras = await erasResponse.json();
                    setAvailableConcepts(concepts);
                    setAvailableEras(eras);
                }
            } catch (error) {
                console.error('Error fetching metadata:', error);
                setDebugInfo(prev => ({
                    ...prev,
                    metadataError: error.message
                }));
            }
        };

        fetchMetadata();
    }, [API_URL]);

    const performSearch = async (query) => {
        if (!query.trim()) {
            setResults([]);
            setSearchMetrics(null);
            setDebugInfo(null);
            return;
        }

        setIsSearching(true);
        setDebugInfo(null);

        try {
            // Log the request details
            const requestDetails = {
                endpoint: `${API_URL}/ancient-texts/search`,
                payload: {
                    query,
                    type: searchType,
                    ...(selectedEra && { era: selectedEra })
                }
            };
            console.log('Search request details:', requestDetails);
            setDebugInfo(prev => ({
                ...prev,
                request: requestDetails
            }));

            const response = await fetch(`${API_URL}/ancient-texts/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestDetails.payload),
            });

            const responseData = await response.json();
            console.log('Search response:', responseData);

            if (!response.ok) {
                throw new Error(responseData.error || 'Search failed');
            }

            // Debug information about the results
            const debugData = {
                resultsCount: responseData.results.length,
                queryTime: responseData.searchTime,
                firstResultScore: responseData.results[0]?.score,
                hasEmbeddings: responseData.results.some(r => r.description_embedding),
                statusCode: response.status,
                ...responseData.debug // In case the server sends additional debug info
            };

            setDebugInfo(prev => ({
                ...prev,
                response: debugData
            }));

            setResults(responseData.results);
            setSearchMetrics({
                time: responseData.searchTime,
                resultCount: responseData.results.length
            });
        } catch (error) {
            console.error('Search failed:', error);
            setDebugInfo(prev => ({
                ...prev,
                error: {
                    message: error.message,
                    stack: error.stack
                }
            }));
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            if (searchTerm) {
                performSearch(searchTerm);
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm, searchType, selectedEra]);

    const renderSemanticMatch = (score) => {
        const percentage = Math.round(score * 100);
        return (
            <div className="flex items-center gap-1">
                <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="text-xs text-gray-600">{percentage}%</span>
            </div>
        );
    };

    const getSearchTypeTip = () => {
        switch (searchType) {
            case 'vector':
                return "Describe concepts or themes you're interested in";
            case 'semantic':
                return "Ask questions or describe what you want to learn about";
            case 'concept':
                return "Search for specific concepts like 'wisdom' or 'afterlife'";
            default:
                return "Enter text to search ancient writings";
        }
    };

    const DebugPanel = ({ debugInfo, onClose }) => (
        <div className="fixed left-4 top-20 bottom-4 w-96 bg-slate-900 text-white rounded-lg shadow-xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-3 bg-slate-800">
                <h3 className="font-medium flex items-center gap-2">
                    <Bug size={16} />
                    Debug Information
                </h3>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-white"
                >
                    ×
                </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
                <div className="space-y-4 text-xs font-mono">
                    {/* Request Section */}
                    <div className="space-y-2">
                        <div className="font-medium text-slate-400">Request:</div>
                        <div className="p-2 bg-slate-800 rounded">
                            <pre className="whitespace-pre-wrap">
                                {JSON.stringify(debugInfo?.request, null, 2)}
                            </pre>
                        </div>
                    </div>

                    {/* Response Section */}
                    {debugInfo?.response && (
                        <div className="space-y-2">
                            <div className="font-medium text-slate-400">Response:</div>
                            <div className="p-2 bg-slate-800 rounded">
                                <pre className="whitespace-pre-wrap">
                                    {JSON.stringify(debugInfo.response, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Error Section */}
                    {debugInfo?.error && (
                        <div className="space-y-2">
                            <div className="font-medium text-red-400">Error:</div>
                            <div className="p-2 bg-red-900/50 rounded">
                                <pre className="whitespace-pre-wrap">
                                    {JSON.stringify(debugInfo.error, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-[800px] bg-[#FDF5E6] rounded-lg shadow-lg overflow-hidden flex flex-col">
            {/* Main content with margin when debug panel is visible */}
            <div className={`flex-1 flex flex-col ${showDebug ? 'ml-[0px]' : ''} transition-all duration-300`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white p-4">
                    {/* Header Content */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <BookOpen size={20} />
                            <h2 className="text-2xl font-serif">Ancient Library Search</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowDebug(!showDebug)}
                                className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20"
                            >
                                <Bug size={12} />
                                Debug
                            </button>
                            {searchMetrics && (
                                <div className="text-xs opacity-75">
                                    Found {searchMetrics.resultCount} results in {searchMetrics.time}ms
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search Controls */}
                    <div className="space-y-3">
                        {/* Search Type Selector */}
                        <div className="flex gap-3 text-sm">  {/* Increased from text-xs and gap-2 */}
                        <button
                                onClick={() => setSearchType('vector')}
                                className={`px-3 py-1.5 rounded-full transition-colors ${searchType === 'vector'
                                        ? 'bg-white text-amber-900'
                                        : 'bg-white/20 hover:bg-white/30'
                                    }`}
                            >
                                Vector Search
                            </button>
                            <button
                                onClick={() => setSearchType('semantic')}
                                className={`px-3 py-1.5 rounded-full transition-colors ${searchType === 'semantic'
                                        ? 'bg-white text-amber-900'
                                        : 'bg-white/20 hover:bg-white/30'
                                    }`}
                            >
                                Semantic Search
                            </button>
                            <button
                                onClick={() => setSearchType('concept')}
                                className={`px-3 py-1.5 rounded-full transition-colors ${searchType === 'concept'
                                        ? 'bg-white text-amber-900'
                                        : 'bg-white/20 hover:bg-white/30'
                                    }`}
                            >
                                Concept Search
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={getSearchTypeTip()}
    className="w-full px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-lg" />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {isSearching ? (
                                        <Loader2 className="animate-spin text-white/70" size={18} />
                                    ) : (
                                        <Search className="text-white/70" size={18} />
                                    )}
                                </div>
                            </div>

                            {/* Era Filter */}
                            <select
                                value={selectedEra}
                                onChange={(e) => setSelectedEra(e.target.value)}
                                className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                            >
                                <option value="">All Eras</option>
                                {availableEras.map((era) => (
                                    <option key={era} value={era}>{era}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search Tips */}
                        <div className="flex items-center gap-2 text-xs text-white/70">
                            <Info size={12} />
                            <span>{getSearchTypeTip()}</span>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex-1 overflow-auto">
                    {results.length > 0 ? (
                        <div className="divide-y divide-amber-100">
                            {results.map((result, index) => (
                                <div
                                    key={index}
                                    className="p-4 hover:bg-amber-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-medium text-amber-900">{result.title}</h3>
                                        {renderSemanticMatch(result.score)}
                                    </div>
                                    <div className="text-sm text-amber-800 mb-1">
                                        by {result.author} • {result.era} • {result.year}
                                    </div>
                                    <p className="text-sm text-amber-700 mb-2">
                                        {result.description}
                                    </p>
                                    {result.concepts && (
                                        <div className="flex flex-wrap gap-2">
                                            {result.concepts.map((concept, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        setSearchType('concept');
                                                        setSearchTerm(concept);
                                                    }}
                                                    className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs hover:bg-amber-200 transition-colors"
                                                >
                                                    {concept}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-amber-800">
                            <Search size={24} className="mb-2 opacity-50" />
                            <p className="text-sm">
                                {searchTerm ? 'No matching texts found' : 'Start searching to explore ancient wisdom'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Debug Panel */}
            {showDebug && (
                <DebugPanel
                    debugInfo={debugInfo}
                    onClose={() => setShowDebug(false)}
                />
            )}
        </div>
    );
};

export default VectorLibrarySearch;
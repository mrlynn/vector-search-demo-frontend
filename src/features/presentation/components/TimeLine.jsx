import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Search, Brain, NetworkIcon, Sparkles, Bot, X, Scroll, ChevronLeft, ChevronRight } from 'lucide-react';

const TimelineModal = ({ phase, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            {phase.icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{phase.title}</h3>
                            <p className="text-lg text-blue-600">{phase.year}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Overview</h4>
                            <p className="text-gray-600">{phase.description}</p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {phase.key_points.map((point, idx) => (
                                    <div key={idx} className="bg-gray-50 p-3 rounded-lg text-gray-700">
                                        • {point}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {phase.artifacts && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Notable Artifacts</h4>
                                <div className="bg-amber-50 p-4 rounded-lg">
                                    <ul className="list-disc pl-4 space-y-2 text-amber-900">
                                        {phase.artifacts.map((artifact, idx) => (
                                            <li key={idx}>{artifact}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {phase.technical_details && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Technical Details</h4>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <ul className="list-disc pl-4 space-y-2 text-gray-700">
                                        {phase.technical_details.map((detail, idx) => (
                                            <li key={idx}>{detail}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {phase.impact && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Historical Impact</h4>
                                <p className="text-gray-600">{phase.impact}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Timeline = () => {
    const [activePhase, setActivePhase] = useState(null);
    const [selectedPhase, setSelectedPhase] = useState(null);

    const phases = [
        {
            year: '3000 BCE - 500 CE',
            title: 'Ancient Knowledge Systems',
            icon: <Scroll className="w-6 h-6" />,
            description: 'The first organized systems for storing and cataloging knowledge, from Egyptian hieroglyphic archives to the Library of Alexandria.',
            key_points: [
                'Hieroglyphic records',
                'Papyrus scrolls',
                'Library catalogs',
                'Temple archives'
            ],
            artifacts: [
                'The Rosetta Stone - key to deciphering hieroglyphics',
                'Library of Alexandria catalog system',
                'Egyptian temple record rooms',
                'Mesopotamian clay tablets'
            ],
            impact: 'Established the first systematic approaches to organizing and preserving human knowledge, laying the groundwork for all future information systems.'
        }, {
            year: '1960s-1990s',
            title: 'RDBMS',
            icon: <Database className="w-6 h-6" />,
            description: 'Basic data storage and retrieval using traditional databases. Focus on structured data and exact matches.',
            key_points: [
                'Relational databases',
                'SQL queries',
                'ACID compliance',
                'Structured data only'
            ],
            technical_details: [
                'Introduction of SQL and relational algebra',
                'ACID transaction properties ensure data consistency',
                'Table-based schema with strict type enforcement',
                'B-tree indexing for efficient lookups'
            ],
            impact: 'Established the foundation for modern data management and enabled the first wave of business computing applications.'
        },
        {
            year: '1990s-2000s',
            title: 'Text Search',
            icon: <Search className="w-6 h-6" />,
            description: 'Introduction of full-text search and basic analytics capabilities. Beginning of unstructured data handling.',
            key_points: [
                'Full-text search',
                'Basic analytics',
                'Document databases',
                'Keyword matching'
            ],
            technical_details: [
                'Inverted indexes for text search',
                'TF-IDF scoring for relevance',
                'Regular expression matching',
                'Basic aggregation frameworks'
            ],
            impact: 'Enabled the first generation of search engines and text-heavy applications, revolutionizing information retrieval.'
        },
        {
            year: '2000s-2015',
            title: 'Big Data',
            icon: <NetworkIcon className="w-6 h-6" />,
            description: 'Rise of distributed databases and NoSQL. Handling massive amounts of varied data types.',
            key_points: [
                'Distributed systems',
                'Unstructured data',
                'Horizontal scaling',
                'Real-time processing'
            ],
            technical_details: [
                'CAP theorem trade-offs',
                'Sharding and replication strategies',
                'Document-based data models',
                'MapReduce processing framework'
            ],
            impact: 'Made big data processing accessible and enabled the scale needed for modern web applications.'
        },
        {
            year: '2015-2020',
            title: 'Machine Learning',
            icon: <Brain className="w-6 h-6" />,
            description: 'Databases begin integrating with ML pipelines. Early vector similarity search implementations.',
            key_points: [
                'ML model integration',
                'Feature stores',
                'Data pipelines',
                'Basic vector operations'
            ],
            technical_details: [
                'Feature engineering pipelines',
                'Model serving infrastructure',
                'Early vector similarity algorithms',
                'Integration with ML frameworks'
            ],
            impact: 'Bridged the gap between data storage and machine learning, enabling AI-driven applications.'
        },
        {
            year: '2020-2023',
            title: 'Vector Search',
            icon: <Sparkles className="w-6 h-6" />,
            description: 'MongoDB introduces vector search capabilities. Semantic search and similarity matching become mainstream.',
            key_points: [
                'Vector embeddings',
                'Semantic search',
                'Neural search',
                'Similarity matching'
            ],
            technical_details: [
                'HNSW index implementation',
                'Cosine similarity search',
                'Multi-dimensional vector storage',
                'Hybrid search capabilities'
            ],
            impact: 'Enabled semantic understanding and similarity-based search, revolutionizing how we interact with data.'
        },
        {
            year: '2023+',
            title: 'AI-Native Databases',
            icon: <Bot className="w-6 h-6" />,
            description: 'Full AI integration with MongoDB Vector Search. Intelligent applications become the norm.',
            key_points: [
                'LLM integration',
                'Multimodal search',
                'Hybrid ranking',
                'Intelligent applications'
            ],
            technical_details: [
                'Real-time vector generation',
                'Multi-modal embedding support',
                'Advanced relevance scoring',
                'Integrated LLM capabilities'
            ],
            impact: 'Making AI capabilities native to databases, enabling a new generation of intelligent applications.'
        }
    ];

    return (
        <Card className="w-full h-[400px] bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader className="border-b bg-white bg-opacity-50">
                <CardTitle className="text-2xl font-bold text-blue-900">
                    The Evolution: From Data to Intelligence
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="relative h-full">
                    {/* Timeline Container */}
                    <div
                        id="timeline-scroll"
                        className="flex items-center justify-between px-12 h-full pt-16" // Added pt-16 for top spacing
                    >
                        {/* Timeline Line */}
                        <div className="absolute left-12 right-12 top-1/2 h-1 bg-blue-200 -translate-y-1/2" />

                        {/* Timeline Points */}
                        {phases.map((phase, index) => (
                            <div
                                key={index}
                                className="relative flex flex-col items-center w-32" // Added fixed width
                                onMouseEnter={() => setActivePhase(index)}
                                onMouseLeave={() => setActivePhase(null)}
                            >
                                {/* Year Label Top */}
                                <div
                                    className="absolute -top-14 left-1/2 -translate-x-1/2 text-sm font-medium text-green-600"
                                    style={{
                                        width: 'max-content',
                                        maxWidth: '150px',
                                        textAlign: 'center',
                                        lineHeight: '1.2'
                                    }}
                                >
                                    {phase.year}
                                </div>

                                {/* Dot */}
                                <button
                                    onClick={() => setSelectedPhase(phase)}
                                    className={`
                    w-14 h-14 rounded-full z-10 transition-all duration-300 
                    flex items-center justify-center
                    ${activePhase === index
                                            ? 'bg-green-600 scale-110'
                                            : 'bg-green-400 hover:bg-green-500'
                                        }
                  `}
                                >
                                    {phase.icon && <div className="text-white w-8 h-8">{phase.icon}</div>}
                                </button>

                                {/* Content */}
                                <div
                                    className={`
                    mt-4 text-center transition-all duration-300
                    ${activePhase === index ? 'transform -translate-y-1' : ''}
                  `}
                                    style={{
                                        width: '120px',
                                        position: 'absolute',
                                        top: '64px' // Position below the dot
                                    }}
                                >
                                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                        {phase.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>

            {/* Detail Modal */}
            {selectedPhase && (
                <TimelineModal
                    phase={selectedPhase}
                    onClose={() => setSelectedPhase(null)}
                />
            )}
        </Card>
    );
};

export default Timeline;
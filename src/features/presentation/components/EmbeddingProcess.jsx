import React, { useState } from 'react';
import { Brain, SplitSquareVertical, Network, ChevronRight, ChevronLeft, Search, X, Table } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Modal Component with fixed table layout
const LookupTableModal = ({ isOpen, onClose }) => {
    const [selectedToken, setSelectedToken] = useState(null);

    const embeddings = {
        "jump": [0.33, 0.54, -0.22, 0.14, 0.43],
        "leap": [0.31, 0.52, -0.21, 0.15, 0.41],
        "run": [0.32, 0.51, -0.20, 0.16, 0.42],
        "cat": [0.82, -0.12, 0.45, 0.67, -0.29],
        "dog": [0.81, -0.15, 0.48, 0.65, -0.32],
        "the": [-0.02, 0.03, 0.01, -0.05, 0.02],
        "and": [-0.03, 0.02, 0.02, -0.04, 0.01]
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-blue-100 rounded-2xl w-full max-w-5xl flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Vector Embeddings</h2>
                    <p className="text-2xl text-gray-500 mt-1">Each word maps to a 5-dimensional vector</p>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left p-4 text-2xl text-gray-700 border">Word</th>
                                {[0, 1, 2, 3, 4].map(i => (
                                    <th key={i} className="p-4 text-xl text-gray-700 border text-center w-[150px]">
                                        dim_{i}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(embeddings).map(([word, vector]) => (
                                <tr
                                    key={word}
                                    onClick={() => setSelectedToken(word)}
                                    className={`
                                        cursor-pointer transition-all
                                        ${selectedToken === word ? 'bg-purple-50' : 'hover:bg-gray-50'}
                                    `}
                                >
                                    <td className="p-4 border font-mono text-4xl text-gray-900">
                                        {word}
                                    </td>
                                    {vector.map((value, idx) => (
                                        <td key={idx} className="p-2 border">
                                            <div
                                                className={`
                                                    text-center p-2 rounded text-2xl
                                                    ${value > 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}
                                                    ${Math.abs(value) > 0.5 ? 'font-bold' : ''}
                                                `}
                                            >
                                                {value.toFixed(2)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-6 bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">Key Patterns:</h3>
                        <ul className="space-y-1 text-xl     text-gray-600">
                            <li>• Similar words (jump/leap/run) have similar vector patterns</li>
                            <li>• Related concepts (cat/dog) share similar values</li>
                            <li>• Function words (the/and) have very small values</li>
                            <li>• Blue = positive values, Red = negative values</li>
                        </ul>
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Component
const EmbeddingProcess = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [showLookupTable, setShowLookupTable] = useState(false);
    const [word] = useState("playing");

    const steps = [
        {
            title: "Original Word",
            content: word,
            description: "We start with a single word",
            color: "border-blue-500",
            activeColor: "bg-blue-500"
        },
        {
            title: "Tokenization",
            content: '["play", "ing"]',
            description: "Break into subword tokens",
            color: "border-green-500",
            activeColor: "bg-green-500"
        },
        {
            title: "Token Embeddings",
            content: `play → [0.2, -0.1, 0.5]
ing → [0.1, 0.3, -0.2]`,
            description: "Look up initial vectors for each token",
            color: "border-purple-500",
            activeColor: "bg-green-500",
            extraButton: {
                label: "View Lookup Table",
                onClick: () => setShowLookupTable(true)
            }
        },
        {
            title: "Neural Processing",
            content: `Layer 1 → [0.3, 0.2, 0.4]
Layer 2 → [0.5, 0.3, 0.6]`,
            description: "Process through transformer layers",
            color: "border-amber-500",
            activeColor: "bg-amber-500"
        },
        {
            title: "Final Embedding",
            content: "[0.8, 0.4, 0.7]",
            description: "Final vector representation",
            color: "border-rose-500",
            activeColor: "bg-rose-500"
        }
    ];

    return (
        <Card className="w-full bg-white h-full">
            <CardHeader className="border-b">
                <CardTitle className="text-xl">How LLMs Convert Words to Vectors</CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-full min-h-[500px]">
                <div className="flex items-start space-x-4">
                    {steps.map((step, index) => (
                        <div key={index} className="flex-1 min-h-[400px]">
                            <div className="text-2xl min-h-[50px] font-medium text-gray-500 mb-2">
                                Step {index + 1}
                            </div>

                            <div
                                className={`
                                    p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer h-[600px] min-h-[400px]
                                    ${activeStep === index ?
                                        `${step.activeColor} text-black border-transparent shadow-lg` :
                                        index < activeStep ?
                                            `bg-gray-50 ${step.color} opacity-50` :
                                            `bg-blue    -200 ${step.color}`
                                    }
                                `}
                                onClick={() => setActiveStep(index)}
                            >
                                <div className="text-xl mb-2">
                                    [{step.title}]
                                </div>
                                <div className="font-mono text-3xl whitespace-pre">
                                    {step.content}
                                </div>
                                <div className={`text-4xl mt-2 ${activeStep === index ? 'text-black-500' : 'text-gray-500'}`}>
                                    {step.description}
                                </div>
                                {activeStep === index && step.extraButton && (
                                    <button
                                        onClick={step.extraButton.onClick}
                                        className="mt-4 px-3 py-1.5 bg-white text-purple-600 rounded-md text-2xl hover:bg-purple-50 text-black transition-colors"
                                    >
                                        {step.extraButton.label}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-between items-center">
                    <button
                        onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                        disabled={activeStep === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                            ${activeStep === 0 ?
                                'bg-gray-100 text-gray-400 cursor-not-allowed' :
                                'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-xl">Previous</span>
                    </button>

                    <div className="flex gap-2">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                onClick={() => setActiveStep(index)}
                                className={`w-3 h-3 rounded-full cursor-pointer transition-all
                                    ${activeStep === index ?
                                        'bg-blue-500 scale-125' :
                                        index < activeStep ?
                                            'bg-blue-200' :
                                            'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                        disabled={activeStep === steps.length - 1}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                            ${activeStep === steps.length - 1 ?
                                'bg-gray-100 text-gray-400 cursor-not-allowed' :
                                'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }`}
                    >
                        <span className="text-xl">Next</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </CardContent>

            <LookupTableModal
                isOpen={showLookupTable}
                onClose={() => setShowLookupTable(false)}
            />
        </Card>
    );
};

export default EmbeddingProcess;
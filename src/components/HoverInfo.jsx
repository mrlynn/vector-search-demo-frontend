// components/HoverInfo.jsx

import React from 'react';
import { DOMAIN_CONTEXTS, ENHANCED_MULTI_MEANING_WORDS } from '../constants/semanticConstants';

export const HoverInfo = ({ point }) => {
    const wordData = ENHANCED_MULTI_MEANING_WORDS[point.word];

    if (!wordData) {
        return (
            <div className="fixed bg-white/95 rounded-lg shadow-lg border border-gray-200 max-w-sm p-4"
                style={{
                    left: '50%',
                    top: '20px',
                    transform: 'translateX(-50%)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 1000
                }}>
                <h3 className="font-semibold mb-2 text-lg">
                    {point.word}
                </h3>
                <p className="text-gray-600">
                    Basic word in {point.domain} context
                </p>
            </div>
        );
    }

    return (
        <div className="fixed bg-white/95 rounded-lg shadow-lg border border-gray-200 max-w-sm p-4"
            style={{
                left: '50%',
                top: '20px',
                transform: 'translateX(-50%)',
                backdropFilter: 'blur(8px)',
                zIndex: 1000
            }}>
            <h3 className="font-semibold mb-2 text-lg">
                {point.word}
            </h3>
            <div className="max-h-[70vh] overflow-y-auto space-y-4">
                {Object.entries(wordData).map(([domain, domainData]) => (
                    <div key={domain} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-lg mb-2 text-gray-800">
                            {domain.charAt(0).toUpperCase() + domain.slice(1)}
                        </h4>
                        {Object.entries(domainData.contexts || {}).map(([context, contextData]) => (
                            <div key={context} className="mb-4">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor: DOMAIN_CONTEXTS[domain]?.subdomains[context]?.color || '#666'
                                        }}
                                    />
                                    <span className="font-medium">
                                        {DOMAIN_CONTEXTS[domain]?.subdomains[context]?.label || context}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        (Relevance: {(contextData.weight * 100).toFixed(0)}%)
                                    </span>
                                </div>
                                <p className="text-sm my-1 text-gray-700">{contextData.meaning}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {contextData.related.map(({ term, strength }) => (
                                        <span
                                            key={term}
                                            className="px-2 py-1 rounded text-xs"
                                            style={{
                                                backgroundColor: `${DOMAIN_CONTEXTS[domain]?.subdomains[context]?.color || '#666'}${Math.round(strength * 255).toString(16).padStart(2, '0')}`,
                                                color: strength > 0.6 ? 'white' : 'black'
                                            }}
                                        >
                                            {term} ({(strength * 100).toFixed(0)}%)
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
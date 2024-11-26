// constants/semanticConstants.js

export const DOMAIN_CONTEXTS = {
    tech: {
        subdomains: {
            ai: { label: 'Artificial Intelligence', color: '#2563eb' },
            web: { label: 'Web Development', color: '#7c3aed' },
            security: { label: 'Cybersecurity', color: '#dc2626' },
            data: { label: 'Data Science', color: '#059669' },
            cloud: { label: 'Cloud Computing', color: '#0284c7' },
            mobile: { label: 'Mobile Development', color: '#db2777' }
        }
    },
    science: {
        subdomains: {
            physics: { label: 'Physics', color: '#9333ea' },
            biology: { label: 'Biology', color: '#16a34a' },
            chemistry: { label: 'Chemistry', color: '#ca8a04' },
            astronomy: { label: 'Astronomy', color: '#0369a1' },
            geology: { label: 'Geology', color: '#b45309' }
        }
    },
    business: {
        subdomains: {
            finance: { label: 'Finance', color: '#15803d' },
            marketing: { label: 'Marketing', color: '#be185d' },
            operations: { label: 'Operations', color: '#0891b2' },
            strategy: { label: 'Strategy', color: '#7e22ce' }
        }
    }
};

export const ENHANCED_MULTI_MEANING_WORDS = {
    data: {
        tech: {
            contexts: {
                ai: {
                    meaning: 'Training information for machine learning models',
                    weight: 0.95,
                    related: [
                        { term: 'dataset', strength: 0.9 },
                        { term: 'features', strength: 0.85 },
                        { term: 'training', strength: 0.8 },
                        { term: 'preprocessing', strength: 0.75 }
                    ]
                },
                web: {
                    meaning: 'Information transmitted between client and server',
                    weight: 0.85,
                    related: [
                        { term: 'API', strength: 0.9 },
                        { term: 'JSON', strength: 0.85 },
                        { term: 'REST', strength: 0.8 }
                    ]
                },
                security: {
                    meaning: 'Sensitive information requiring protection',
                    weight: 0.8,
                    related: [
                        { term: 'encryption', strength: 0.95 },
                        { term: 'privacy', strength: 0.9 },
                        { term: 'GDPR', strength: 0.85 }
                    ]
                }
            },
            vector: [0.9, 0.1, 0.2]
        },
        science: {
            contexts: {
                physics: {
                    meaning: 'Experimental measurements and observations',
                    weight: 0.8,
                    related: [
                        { term: 'measurement', strength: 0.9 },
                        { term: 'observation', strength: 0.85 },
                        { term: 'analysis', strength: 0.8 }
                    ]
                },
                biology: {
                    meaning: 'Genetic information and sequences',
                    weight: 0.75,
                    related: [
                        { term: 'DNA', strength: 0.95 },
                        { term: 'genome', strength: 0.9 },
                        { term: 'sequence', strength: 0.85 }
                    ]
                }
            },
            vector: [0.2, 0.9, 0.3]
        }
    },
    model: {
        tech: {
            contexts: {
                ai: {
                    meaning: 'Mathematical representation for machine learning',
                    weight: 0.95,
                    related: [
                        { term: 'neural-network', strength: 0.95 },
                        { term: 'training', strength: 0.9 },
                        { term: 'prediction', strength: 0.85 },
                        { term: 'inference', strength: 0.8 }
                    ]
                },
                data: {
                    meaning: 'Statistical or mathematical representation',
                    weight: 0.85,
                    related: [
                        { term: 'regression', strength: 0.9 },
                        { term: 'classification', strength: 0.85 },
                        { term: 'clustering', strength: 0.8 }
                    ]
                }
            },
            vector: [0.9, 0.2, 0.1]
        },
        science: {
            contexts: {
                physics: {
                    meaning: 'Theoretical representation of physical system',
                    weight: 0.8,
                    related: [
                        { term: 'simulation', strength: 0.9 },
                        { term: 'theory', strength: 0.85 },
                        { term: 'approximation', strength: 0.8 }
                    ]
                }
            },
            vector: [0.3, 0.8, 0.4]
        },
        business: {
            contexts: {
                finance: {
                    meaning: 'Financial projection or analysis framework',
                    weight: 0.75,
                    related: [
                        { term: 'forecast', strength: 0.9 },
                        { term: 'projection', strength: 0.85 },
                        { term: 'analysis', strength: 0.8 }
                    ]
                }
            },
            vector: [0.4, 0.3, 0.9]
        }
    }
};
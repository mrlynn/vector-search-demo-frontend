import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Search, RotateCcw, Eye, Network, EyeOff } from 'lucide-react';
import * as d3 from 'd3';

const VECTOR_CLUSTERS = {
    wisdom: {
        words: ['wisdom', 'maat', 'knowledge', 'truth', 'virtue', 'justice', 'harmony', 'order', 'balance', 'teachings'],
        color: '#c4a484', // Papyrus brown
        label: 'Wisdom & Truth'
    },
    afterlife: {
        words: ['soul', 'ka', 'ba', 'osiris', 'anubis', 'immortality', 'resurrection', 'judgment', 'eternity', 'rebirth'],
        color: '#ffa700', // Gold
        label: 'Afterlife & Spirits'
    },
    ritual: {
        words: ['temple', 'priest', 'offering', 'prayer', 'ceremony', 'ritual', 'sacrifice', 'purification', 'worship', 'sacred'],
        color: '#800020', // Ancient red
        label: 'Rituals & Ceremonies'
    },
    knowledge: {
        words: ['scribe', 'papyrus', 'scroll', 'library', 'hieroglyph', 'text', 'writing', 'record', 'document', 'inscription'],
        color: '#2b580c', // Deep green
        label: 'Records & Writing'
    }
};

const ENHANCED_VECTOR_CLUSTERS = {
    wisdom: {
        words: ['wisdom', 'maat', 'knowledge', 'truth', 'virtue', 'justice', 'harmony', 'order', 'balance', 'teachings'],
        related: {
            'maat': ['truth', 'justice', 'order', 'harmony', 'balance'],
            'wisdom': ['knowledge', 'virtue', 'teachings', 'truth'],
            'knowledge': ['wisdom', 'teachings', 'truth'],
            'truth': ['maat', 'justice', 'virtue'],
            'virtue': ['wisdom', 'truth', 'justice'],
            'justice': ['maat', 'truth', 'order'],
            'harmony': ['maat', 'balance', 'order'],
            'order': ['maat', 'harmony', 'balance'],
            'balance': ['harmony', 'order', 'maat'],
            'teachings': ['wisdom', 'knowledge', 'virtue']
        },
        color: '#c4a484',
        label: 'Wisdom & Truth'
    },
    afterlife: {
        words: ['soul', 'ka', 'ba', 'osiris', 'anubis', 'immortality', 'resurrection', 'judgment', 'eternity', 'rebirth'],
        related: {
            'soul': ['ka', 'ba', 'immortality'],
            'ka': ['ba', 'soul', 'immortality'],
            'ba': ['ka', 'soul', 'eternity'],
            'osiris': ['judgment', 'resurrection', 'anubis'],
            'anubis': ['judgment', 'osiris', 'rebirth'],
            'immortality': ['eternity', 'resurrection', 'soul'],
            'resurrection': ['rebirth', 'osiris', 'immortality'],
            'judgment': ['osiris', 'anubis', 'soul'],
            'eternity': ['immortality', 'ba', 'soul'],
            'rebirth': ['resurrection', 'anubis', 'eternity']
        },
        color: '#ffd700',
        label: 'Afterlife & Spirits'
    },
    ritual: {
        words: ['temple', 'priest', 'offering', 'prayer', 'ceremony', 'ritual', 'sacrifice', 'purification', 'worship', 'sacred'],
        related: {
            'temple': ['priest', 'worship', 'ceremony'],
            'priest': ['ritual', 'temple', 'offering'],
            'offering': ['sacrifice', 'prayer', 'ritual'],
            'prayer': ['worship', 'ceremony', 'sacred'],
            'ceremony': ['ritual', 'temple', 'worship'],
            'ritual': ['ceremony', 'priest', 'purification'],
            'sacrifice': ['offering', 'ritual', 'sacred'],
            'purification': ['ritual', 'sacred', 'ceremony'],
            'worship': ['temple', 'prayer', 'sacred'],
            'sacred': ['purification', 'worship', 'ritual']
        },
        color: '#800020',
        label: 'Rituals & Ceremonies'
    },
    knowledge: {
        words: ['scribe', 'papyrus', 'scroll', 'library', 'hieroglyph', 'text', 'writing', 'record', 'document', 'inscription'],
        related: {
            'scribe': ['writing', 'papyrus', 'hieroglyph'],
            'papyrus': ['scroll', 'writing', 'text'],
            'scroll': ['papyrus', 'text', 'document'],
            'library': ['scroll', 'document', 'record'],
            'hieroglyph': ['inscription', 'writing', 'text'],
            'text': ['writing', 'document', 'scroll'],
            'writing': ['scribe', 'hieroglyph', 'text'],
            'record': ['document', 'inscription', 'library'],
            'document': ['text', 'record', 'scroll'],
            'inscription': ['hieroglyph', 'record', 'writing']
        },
        color: '#2b580c',
        label: 'Records & Writing'
    }
};

const MULTI_MEANING_WORDS = {
    maat: {
        wisdom: {
            related: ['truth', 'justice', 'harmony', 'order', 'balance', 'rightness'],
            vector: [0.9, 0.1, 0.2],
            description: 'Concept of cosmic order, truth, and justice'
        },
        ritual: {
            related: ['temple', 'offering', 'ceremony', 'worship', 'priest', 'sacred'],
            vector: [0.2, 0.9, 0.3],
            description: 'Religious practices and rituals to maintain cosmic order'
        }
    },
    scroll: {
        knowledge: {
            related: ['papyrus', 'writing', 'scribe', 'document', 'record', 'text'],
            vector: [0.85, 0.15, 0.25],
            description: 'Written records of knowledge and wisdom'
        },
        ritual: {
            related: ['sacred', 'prayer', 'temple', 'ceremony', 'worship'],
            vector: [0.2, 0.8, 0.4],
            description: 'Sacred texts used in religious ceremonies'
        }
    },
    ka: {
        afterlife: {
            related: ['soul', 'ba', 'spirit', 'immortality', 'eternity', 'life-force'],
            vector: [0.95, 0.2, 0.15],
            description: 'Life force or spiritual double in Egyptian afterlife'
        },
        wisdom: {
            related: ['knowledge', 'truth', 'virtue', 'teaching', 'understanding'],
            vector: [0.3, 0.9, 0.2],
            description: 'Inner wisdom and understanding of cosmic truth'
        }
    },
    temple: {
        ritual: {
            related: ['priest', 'ceremony', 'worship', 'sacred', 'offering'],
            vector: [0.9, 0.2, 0.3],
            description: 'Place of religious ceremonies and worship'
        },
        knowledge: {
            related: ['library', 'scribe', 'record', 'writing', 'hieroglyph'],
            vector: [0.3, 0.9, 0.2],
            description: 'Center of learning and preservation of knowledge'
        }
    }
};

const Vector3DForce = () => {
    // Refs
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const pointsRef = useRef({});
    const labelsContainerRef = useRef(null);
    const hoverTimeoutRef = useRef(null);
    const activeLines = useRef([]);
    const lineAnimationRef = useRef(null);
    const simulationRef = useRef(null);
    const [showSemanticClouds, setShowSemanticClouds] = useState(false);
    const [showAllConnections, setShowAllConnections] = useState(false);
    const [cloudOpacity, setCloudOpacity] = useState(0.2);
    const [connectionOpacity, setConnectionOpacity] = useState(0.3);
    // State
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLayoutActive, setIsLayoutActive] = useState(false);
    const semanticCloudsRef = useRef([]);
    const connectionsRef = useRef([]);

    // Basic Functions
    const resetCamera = () => {
        if (cameraRef.current && controlsRef.current) {
            cameraRef.current.position.set(-2, 0, 5);
            controlsRef.current.reset();
        }
    };

    const createSemanticClouds = () => {
        if (!sceneRef.current || !showSemanticClouds) return;

        // Remove existing clouds
        semanticCloudsRef.current.forEach(cloud => sceneRef.current.remove(cloud));
        semanticCloudsRef.current = [];

        Object.entries(VECTOR_CLUSTERS).forEach(([clusterKey, cluster]) => {
            const positions = cluster.words
                .map(word => pointsRef.current[word]?.position)
                .filter(Boolean);

            if (positions.length > 0) {
                // Calculate cluster center and size
                const center = positions.reduce((acc, pos) =>
                    acc.add(pos), new THREE.Vector3()).multiplyScalar(1 / positions.length);

                const radius = Math.max(...positions.map(pos =>
                    pos.distanceTo(center))) + 0.8;

                // Create main cloud sphere
                const cloudGeometry = new THREE.SphereGeometry(radius, 32, 32);
                const cloudMaterial = new THREE.MeshPhongMaterial({
                    color: cluster.color,
                    transparent: true,
                    opacity: cloudOpacity,
                    side: THREE.DoubleSide,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending
                });

                const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
                cloud.position.copy(center);

                // Add pulsing glow effect
                const glowGeometry = new THREE.SphereGeometry(radius * 1.2, 32, 32);
                const glowMaterial = new THREE.MeshBasicMaterial({
                    color: cluster.color,
                    transparent: true,
                    opacity: cloudOpacity * 0.5,
                    side: THREE.DoubleSide,
                    blending: THREE.AdditiveBlending
                });

                const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                cloud.add(glow);

                // Animate cloud opacity
                const animate = () => {
                    const pulse = (Math.sin(Date.now() * 0.001) + 1) * 0.5;
                    glowMaterial.opacity = cloudOpacity * 0.3 * pulse;
                    requestAnimationFrame(animate);
                };
                animate();

                sceneRef.current.add(cloud);
                semanticCloudsRef.current.push(cloud);
            }
        });
    };

    const createPointPosition = (word, cluster) => {
        const wordData = MULTI_MEANING_WORDS[word];
        if (wordData && wordData[cluster]?.vector) {
            const vector = wordData[cluster].vector;
            return new THREE.Vector3(
                (vector[0] * 4 - 2) - 1, // Subtract 2 to shift everything left
                vector[1] * 4 - 4,
                vector[2] * 4 - 4
            );
        }

        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 4;
        const radius = 1 + Math.random() * 2;

        return new THREE.Vector3(
            (radius * Math.cos(angle)) - 100, // Subtract 2 to shift left
            height,
            radius * Math.sin(angle)
        );
    };

    // Line Creation and Animation Functions
    const createAnimatedLine = (start, end, color, opacity = 0.8) => {
        const material = new THREE.LineBasicMaterial({
            color: color,
            opacity: opacity,
            transparent: true,
            linewidth: 2,
            depthTest: true,
            depthWrite: false
        });

        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const line = new THREE.Line(geometry, material);

        return line;
    };

    const createRelationshipLines = (word, cluster, scene) => {
        // Clear existing lines
        activeLines.current.forEach(({ line }) => {
            scene.remove(line);
        });
        activeLines.current = [];

        const startPoint = pointsRef.current[word]?.position;
        if (!startPoint) return;

        // Create lines from ENHANCED_VECTOR_CLUSTERS
        if (ENHANCED_VECTOR_CLUSTERS[cluster]?.related?.[word]) {
            const relatedWords = ENHANCED_VECTOR_CLUSTERS[cluster].related[word];

            relatedWords.forEach((relatedWord, index) => {
                const endPoint = pointsRef.current[relatedWord]?.position;
                if (endPoint) {
                    setTimeout(() => {
                        const line = createAnimatedLine(
                            startPoint,
                            endPoint,
                            VECTOR_CLUSTERS[cluster].color,
                            0.8
                        );
                        scene.add(line);
                        activeLines.current.push({
                            line,
                            material: line.material
                        });
                    }, index * 50);
                }
            });
        }

        // Create lines from MULTI_MEANING_WORDS
        if (MULTI_MEANING_WORDS[word]?.[cluster]?.related) {
            const relatedTerms = MULTI_MEANING_WORDS[word][cluster].related;

            relatedTerms.forEach((relatedTerm, index) => {
                Object.entries(pointsRef.current).forEach(([pointWord, point]) => {
                    if (pointWord.toLowerCase().includes(relatedTerm.toLowerCase())) {
                        setTimeout(() => {
                            const line = createAnimatedLine(
                                startPoint,
                                point.position,
                                VECTOR_CLUSTERS[cluster].color,
                                0.6
                            );
                            scene.add(line);
                            activeLines.current.push({
                                line,
                                material: line.material
                            });
                        }, (index + relatedTerms.length) * 50);
                    }
                });
            });
        }
    };

    // Force Layout Functions
    const initializeForceLayout = () => {
        const nodes = [];
        const links = [];
        const nodeMap = new Map();

        // Create nodes
        Object.entries(VECTOR_CLUSTERS).forEach(([clusterKey, cluster]) => {
            cluster.words.forEach(word => {
                const nodeId = `${word}-${clusterKey}`;
                const vectorData = MULTI_MEANING_WORDS[word]?.[clusterKey]?.vector;

                const node = {
                    id: nodeId,
                    word,
                    cluster: clusterKey,
                    vector: vectorData,
                    x: vectorData ? vectorData[0] * 4 - 2 : Math.random() * 4 - 2,
                    y: vectorData ? vectorData[1] * 4 - 2 : Math.random() * 4 - 2,
                    z: vectorData ? vectorData[2] * 4 - 2 : Math.random() * 4 - 2
                };

                nodes.push(node);
                nodeMap.set(nodeId, node);
            });
        });

        // Create links
        Object.entries(ENHANCED_VECTOR_CLUSTERS).forEach(([clusterKey, cluster]) => {
            Object.entries(cluster.related).forEach(([word, relatedWords]) => {
                const sourceId = `${word}-${clusterKey}`;

                if (nodeMap.has(sourceId)) {
                    relatedWords.forEach(relatedWord => {
                        const targetId = `${relatedWord}-${clusterKey}`;
                        if (nodeMap.has(targetId)) {
                            links.push({
                                source: sourceId,
                                target: targetId,
                                value: 1
                            });
                        }
                    });
                }
            });
        });

        // Create force simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links)
                .id(d => d.id)
                .distance(50)
                .strength(0.1))
            .force('charge', d3.forceManyBody()
                .strength(-30)
                .distanceMax(100))
            .force('center', d3.forceCenter(-8, 0)) // Center shifted left
            .force('collision', d3.forceCollide().radius(20))
            .alpha(0.5)
            .alphaDecay(0.01);


        return simulation;
    };

    // Event Handlers
    const handlePointHover = (word, cluster, sphere, label) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        setHoveredPoint({ word, cluster });
        sphere.material.opacity = 1;
        sphere.scale.setScalar(1.5);
        label.style.fontWeight = '600';
        label.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        label.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

        createRelationshipLines(word, cluster, sceneRef.current);
    };

    const handlePointLeave = (sphere, label) => {
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredPoint(null);
            sphere.material.opacity = 0.8;
            sphere.scale.setScalar(1);
            label.style.fontWeight = '500';
            label.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            label.style.boxShadow = 'none';

            activeLines.current.forEach(({ line }) => {
                sceneRef.current?.remove(line);
            });
            activeLines.current = [];
        }, 100);
    };

    // Search Effect
    useEffect(() => {
        if (!pointsRef.current) return;

        Object.entries(pointsRef.current).forEach(([word, point]) => {
            const matches = word.toLowerCase().includes(searchTerm.toLowerCase());
            point.mesh.material.opacity = matches || !searchTerm ? 0.8 : 0.1;
            point.label.style.opacity = matches || !searchTerm ? '1' : '0.1';
        });
    }, [searchTerm]);

    // semantic clouds
    // First, add this function to update clouds when the state changes
    useEffect(() => {
        if (!sceneRef.current) return;

        // Remove any existing clouds
        const existingClouds = sceneRef.current.children.filter(child => child.userData.isSemanticCloud);
        existingClouds.forEach(cloud => sceneRef.current.remove(cloud));

        if (showSemanticClouds) {
            // Create new clouds
            Object.entries(VECTOR_CLUSTERS).forEach(([clusterKey, cluster]) => {
                const positions = cluster.words
                    .map(word => pointsRef.current[word]?.position)
                    .filter(Boolean);

                if (positions.length > 0) {
                    // Calculate center
                    const center = positions.reduce((acc, pos) =>
                        acc.add(pos), new THREE.Vector3()).multiplyScalar(1 / positions.length);

                    // Calculate radius based on maximum distance from center
                    const radius = Math.max(...positions.map(pos =>
                        pos.distanceTo(center))) + 0.5;

                    // Create cloud geometry
                    const geometry = new THREE.SphereGeometry(radius, 32, 32);
                    const material = new THREE.MeshPhongMaterial({
                        color: cluster.color,
                        transparent: true,
                        opacity: 0.15,
                        side: THREE.DoubleSide,
                        depthWrite: false
                    });

                    const cloud = new THREE.Mesh(geometry, material);
                    cloud.position.copy(center);
                    cloud.userData.isSemanticCloud = true; // Mark for later identification
                    sceneRef.current.add(cloud);
                }
            });
        }
    }, [showSemanticClouds]);

    // Main Setup Effect
    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#1A0F0A'); // Dark background
        scene.fog = new THREE.Fog('#1A0F0A', 2, 15);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(-5, 0, 5); // Move further left (-8 instead of 0)
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        rendererRef.current = renderer;
        containerRef.current.appendChild(renderer.domElement);

        // Labels container
        const labelsContainer = document.createElement('div');
        labelsContainer.style.position = 'absolute';
        labelsContainer.style.top = '0';
        labelsContainer.style.left = '0';
        labelsContainer.style.pointerEvents = 'none';
        containerRef.current.appendChild(labelsContainer);
        labelsContainerRef.current = labelsContainer;

        // Controls setup
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;
        controls.zoomSpeed = 0.7;
        controls.minDistance = 2;
        controls.maxDistance = 10;
        controls.target.set(-2, 0, 0); // Set the orbit target to the new center
        controls.update();
        controlsRef.current = controls;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Reduced intensity
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Initialize force layout
        simulationRef.current = initializeForceLayout();

        // Create points for each cluster
        Object.entries(VECTOR_CLUSTERS).forEach(([clusterKey, cluster]) => {
            cluster.words.forEach(word => {
                const position = createPointPosition(word, clusterKey);
                const contexts = Object.keys(MULTI_MEANING_WORDS[word] || {});
                const isMultiContext = contexts.length > 1;

                // Create point
                const geometry = new THREE.SphereGeometry(isMultiContext ? 0.1 : 0.08);
                const material = new THREE.MeshPhongMaterial({
                    color: cluster.color,
                    opacity: 0.8,
                    transparent: true,
                    emissive: cluster.color,
                    emissiveIntensity: isMultiContext ? 0.3 : 0.2
                });
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.copy(position);

                // Glow effect
                const glowGeometry = new THREE.SphereGeometry(isMultiContext ? 0.15 : 0.12);
                const glowMaterial = new THREE.MeshBasicMaterial({
                    color: cluster.color,
                    transparent: true,
                    opacity: isMultiContext ? 0.3 : 0.2
                });
                const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                sphere.add(glow);

                // Create label
                const label = document.createElement('div');
                
                label.className = 'absolute text-sm font-semibold pointer-events-auto cursor-pointer bg-white/90 px-2 py-1 rounded shadow-sm vector-label';
                label.textContent = word;
                label.style.color = cluster.color;
                labelsContainer.appendChild(label);

                // Store reference
                pointsRef.current[word] = {
                    mesh: sphere,
                    label,
                    position: sphere.position,
                    cluster: clusterKey
                };

                // Add event listeners
                label.addEventListener('mouseenter', () => {
                    handlePointHover(word, clusterKey, sphere, label);
                });

                label.addEventListener('mouseleave', () => {
                    handlePointLeave(sphere, label);
                });

                scene.add(sphere);
            });
        });

        // Update label positions function
        function updateLabels() {
            Object.entries(pointsRef.current).forEach(([word, point]) => {
                const vector = point.position.clone();
                vector.project(camera);

                const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

                if (vector.z < 1) {
                    point.label.style.display = 'block';
                    point.label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
                    point.label.style.zIndex = (-vector.z * 100000).toString();
                } else {
                    point.label.style.display = 'none';
                }
            });
        }

        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            controls.update();

            // Update force simulation positions
            if (simulationRef.current && simulationRef.current.alpha() > simulationRef.current.alphaMin()) {
                const nodes = simulationRef.current.nodes();
                nodes.forEach(node => {
                    const point = pointsRef.current[node.word];
                    if (point?.mesh) {
                        const targetPos = new THREE.Vector3(
                            node.x / 100,
                            node.y / 100,
                            point.mesh.position.z
                        );
                        point.mesh.position.lerp(targetPos, 0.1);
                    }
                });
            }

            renderer.render(scene, camera);
            updateLabels();
        }

        // Start animation
        animate();

        // Handle window resize
        function handleResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
                containerRef.current.removeChild(labelsContainer);
            }
            if (simulationRef.current) {
                simulationRef.current.stop();
            }
        };
    }, []);

    const showConnections = () => {
        if (!sceneRef.current || !showAllConnections) {
            connectionsRef.current.forEach(line => sceneRef.current.remove(line));
            connectionsRef.current = [];
            return;
        }

        // Clear existing connections
        connectionsRef.current.forEach(line => sceneRef.current.remove(line));
        connectionsRef.current = [];

        // Create connections for each cluster
        Object.entries(ENHANCED_VECTOR_CLUSTERS).forEach(([clusterKey, cluster]) => {
            Object.entries(cluster.related).forEach(([word, relatedWords]) => {
                const startPoint = pointsRef.current[word]?.position;
                if (!startPoint) return;

                relatedWords.forEach(relatedWord => {
                    const endPoint = pointsRef.current[relatedWord]?.position;
                    if (!endPoint) return;

                    const material = new THREE.LineBasicMaterial({
                        color: VECTOR_CLUSTERS[clusterKey].color,
                        transparent: true,
                        opacity: connectionOpacity,
                        linewidth: 1,
                        depthTest: true
                    });

                    const geometry = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);
                    const line = new THREE.Line(geometry, material);

                    sceneRef.current.add(line);
                    connectionsRef.current.push(line);
                });
            });
        });
    };

    useEffect(() => {
        createSemanticClouds();
    }, [showSemanticClouds]);

    useEffect(() => {
        showConnections();
    }, [showAllConnections, connectionOpacity]);
    // Debug Components
    const DebugButton = () => (
        <button
            onClick={() => {
                console.log('Points:', pointsRef.current);
                console.log('Clusters:', ENHANCED_VECTOR_CLUSTERS);
                console.log('Meanings:', MULTI_MEANING_WORDS);

                Object.entries(pointsRef.current).forEach(([word, point]) => {
                    console.log(`Testing ${word} in ${point.cluster}`);
                    createRelationshipLines(word, point.cluster, sceneRef.current);
                });
            }}
            className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-sm"
        >
            Debug Lines
        </button>
    );

    const AdvancedControls = () => (
        <div className="flex flex-col gap-2">
            {/* Existing controls remain... */}

            {/* Semantic Clouds Controls */}
            <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                <span className="text-[#E6D5AC]/70 text-sm">Semantic Clouds</span>
                <button
                        onClick={() => setShowSemanticClouds(prev => !prev)}
                        className="text-[#E6D5AC]/70 hover:text-[#E6D5AC]">
                    
                        {showSemanticClouds ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                <input type="range" min="0.1" max="0.5" step="0.05" value={cloudOpacity}
                            onChange={(e) => setCloudOpacity(parseFloat(e.target.value))}
                            className="w-full accent-[#00ED64]" />
            </div>

            {/* Connections Controls */}
            <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[#E6D5AC]/70 text-sm">Connections</span>
                            <button onClick={() => setShowAllConnections(prev => !prev)}
                                className="text-[#E6D5AC]/70 hover:text-[#E6D5AC]">
                                <Network className="w-4 h-4" />
                            </button>
                        </div>
                        <input type="range" min="0.1" max="0.5" step="0.05" value={connectionOpacity}
                            onChange={(e) => setConnectionOpacity(parseFloat(e.target.value))}
                            className="w-full accent-[#00ED64]" disabled={!showAllConnections} />
                    </div>
        </div>
    );

    // Main Render
    return (
        <div className="absolute inset-0 overflow-hidden">
            <div ref={containerRef} className="w-full h-full" />

            {/* Controls */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-4 bg-[#2A1810]/80 p-4 rounded-lg border border-[#E6D5AC]/20">
                {/* Search */}
                <div className="relative">
                <Search className="w-4 h-4 text-[#E6D5AC]/50 absolute left-2 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-48 pl-8 pr-3 py-1.5 text-sm rounded bg-[#1A0F0A] border border-[#E6D5AC]/20 
                                 text-[#E6D5AC] placeholder-[#E6D5AC]/30 outline-none focus:border-[#00ED64]/50"
                    />
                </div>

                <DebugButton />
                <AdvancedControls />

                {/* Reset View */}
                <button
                    onClick={resetCamera}
                    className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-sm flex items-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset View
                </button>

                {/* Cluster Legend */}
                <div className="space-y-2">
                    <span className="text-[#E6D5AC]/70 text-sm">Clusters</span>
                    {Object.entries(VECTOR_CLUSTERS).map(([key, info]) => (
                        <div key={key} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: info.color }} />
                            <span className="text-[#E6D5AC]/70 text-xs">{info.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hover Information */}
            {hoveredPoint && (
                <div className="fixed top-8 right-8 max-w-sm bg-[#2A1810]/95 rounded-lg border border-[#E6D5AC]/20 p-4 text-[#E6D5AC]">
                <h3 className="font-medium text-[#E6D5AC]/70 text-lg mb-2"
                    style={{ color: VECTOR_CLUSTERS[hoveredPoint.cluster].color }}>
                    {hoveredPoint.word}
                </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                        <p>
                            <span className="font-medium text-[#ffffff]/70">Current Context: </span>
                            <span className="text-[#ffffff]/70">{VECTOR_CLUSTERS[hoveredPoint.cluster].label}</span>
                        </p>
                        {MULTI_MEANING_WORDS[hoveredPoint.word] && (
                            <div className="mt-3">
                                <p className="font-medium mb-2 text-[#ffffff]/70">Other Meanings & Contexts:</p>
                                <div className="space-y-3">
                                    {Object.entries(MULTI_MEANING_WORDS[hoveredPoint.word]).map(([context, data]) => (
                                        <div
                                            key={context}
                                            className="bg-gray-50 rounded-md p-2"
                                        >
                                            <p className="font-medium text-sm mb-1" style={{
                                                color: VECTOR_CLUSTERS[context]?.color || '#4B5563'
                                            }}>
                                                {context.charAt(0).toUpperCase() + context.slice(1)}:
                                            </p>
                                            <p className="text-sm mb-1 text-gray-600">{data.description}</p>
                                            <p className="text-xs text-gray-500">
                                                Related: {data.related.join(', ')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vector3DForce;
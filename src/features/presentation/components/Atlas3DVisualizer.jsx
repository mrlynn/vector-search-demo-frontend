import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Database, Calculator, Info, Search, RotateCcw } from 'lucide-react';
import config from '../../../config';

const Atlas3DVisualizer = () => {
    // Refs for Three.js
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const pointsRef = useRef({});
    const labelsContainerRef = useRef(null);
    const activeLines = useRef([]);

    

    // State for Atlas connection
    const [connectionDetails, setConnectionDetails] = useState({
        connectionString: 'mongodb+srv://readonly:Password123%21@performance.zbcul.mongodb.net/vector-search-demo?retryWrites=true&w=majority&appName=performance',
        database: 'sample_mflix',
        collection: 'embedded_movies'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fields, setFields] = useState([]);
    const [selectedField, setSelectedField] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [vectorStats, setVectorStats] = useState(null);

    
    // Connection and data fetching
    const testConnection = async () => {
        if (!connectionDetails.connectionString.trim() ||
            !connectionDetails.database.trim() ||
            !connectionDetails.collection.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${config.apiUrl}/atlas/test-connection`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(connectionDetails)
            });

            if (!response.ok) {
                throw new Error('Connection failed');
            }

            const data = await response.json();
            setFields(data.fields || []);
            setIsConnected(true);
        } catch (err) {
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
            console.log('Sending analyze request with params:', {
                connectionDetails,
                selectedField
            });

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

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Received data:', data);

            if (data.documents && data.stats) {
                console.log('Number of documents:', data.documents.length);
                console.log('First document sample:', data.documents[0]);

                setDocuments(data.documents);
                setVectorStats(data.stats);
                createVectorVisualization(data.documents);
            }
        } catch (err) {
            console.error('Error analyzing vectors:', err);
            setError('Failed to analyze vectors: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Three.js setup and visualization
    const initThreeJS = () => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        scene.fog = new THREE.Fog(0xffffff, 50, 1000);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(15, 15, 15);
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
        controls.enableZoom = true;
        controls.zoomSpeed = 2.0;
        controls.enablePan = true;
        controls.panSpeed = 1.0;
        controls.enableRotate = true;
        controls.rotateSpeed = 1.0;

        // Conservative zoom limits
        controls.minDistance = -100;
        controls.maxDistance = 20000;

        controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
        };

        controlsRef.current = controls;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        scene.add(directionalLight);

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            updateLabels();
            renderer.render(scene, camera);
        }
        animate();
    };

    const setupControls = (camera, domElement) => {
        const controls = new OrbitControls(camera, domElement);

        // Enable all controls
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.zoomSpeed = 1.0;
        controls.enablePan = true;
        controls.panSpeed = 1.0;
        controls.enableRotate = true;
        controls.rotateSpeed = 1.0;

        // Set control limits
        controls.minDistance = 1;
        controls.maxDistance = 50;

        // Enable right mouse button for panning
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
        };

        // Enable key controls
        controls.keyPanSpeed = 7.0;
        controls.keys = {
            LEFT: 'ArrowLeft',
            UP: 'ArrowUp',
            RIGHT: 'ArrowRight',
            BOTTOM: 'ArrowDown'
        };

        // Add touch support
        controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        };

        controlsRef.current = controls;
    };

    const drawEdge = (startPosition, endPosition) => {
        const points = [startPosition, endPosition];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xFFFFFF, opacity: 0.5 });
        const line = new THREE.Line(geometry, material);
        sceneRef.current.add(line);
    };


    const createVectorVisualization = (documents) => {
        if (!sceneRef.current) {
            console.error('No scene reference available');
            return;
        }

        // Clear existing points and edges
        Object.values(pointsRef.current).forEach(point => {
            sceneRef.current.remove(point.mesh);
            point.label?.remove();
        });
        pointsRef.current = {};

        // Clear existing edges
        const existingEdges = sceneRef.current.children.filter(child => child.type === 'Line');
        existingEdges.forEach(edge => sceneRef.current.remove(edge));

        const SCALE_FACTOR = 100;
        const proximityThreshold = 1.5; // Adjust this value to control edge connections

        const positions = []; // Store positions for proximity checking

        documents.forEach((doc, index) => {
            const position = new THREE.Vector3(
                doc.embedding[0] * SCALE_FACTOR,
                doc.embedding[1] * SCALE_FACTOR,
                doc.embedding[2] * SCALE_FACTOR
            );

            // Create sphere for each document
            const geometry = new THREE.SphereGeometry(0.2); // Adjusted size
            const material = new THREE.MeshPhongMaterial({
                color: 0x00ED64,
                opacity: 0.8,
                transparent: true,
                emissive: 0x00ED64,
                emissiveIntensity: 0.2
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.copy(position);

            // Create label with hover functionality
            const label = document.createElement('div');
            label.className = 'absolute text-sm font-medium pointer-events-auto cursor-pointer bg-white/80 px-1.5 py-0.5 rounded';
            label.textContent = doc.title || `Doc ${index + 1}`;
            label.style.color = '#001E2B';

            // Hover effects
            const handleMouseEnter = () => {
                setHoveredPoint(doc);
                label.style.fontWeight = 'bold';
                label.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                sphere.scale.setScalar(1.5); // Scale up on hover
                material.emissive.set(0x00FF00); // Change color to green on hover
            };

            const handleMouseLeave = () => {
                setHoveredPoint(null);
                label.style.fontWeight = 'normal';
                label.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                sphere.scale.setScalar(1.0); // Reset scale
                material.emissive.set(0x00ED64); // Reset color
            };

            label.addEventListener('mouseenter', handleMouseEnter);
            label.addEventListener('mouseleave', handleMouseLeave);
            labelsContainerRef.current?.appendChild(label);

            pointsRef.current[doc._id] = {
                mesh: sphere,
                label,
                position,
                data: doc,
                cleanup: () => {
                    label.removeEventListener('mouseenter', handleMouseEnter);
                    label.removeEventListener('mouseleave', handleMouseLeave);
                }
            };

            sceneRef.current.add(sphere);
            positions.push(position); // Store position for proximity checking
        });

        // Draw edges based on proximity
        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const distance = positions[i].distanceTo(positions[j]);
                if (distance < proximityThreshold) {
                    drawEdge(positions[i], positions[j]);
                }
            }
        }

        // Function to draw edges between points
        
        return () => {
            Object.values(pointsRef.current).forEach(point => {
                point.cleanup?.();
            });
        };
    };


    const updateLabels = () => {
        if (!cameraRef.current || !pointsRef.current) return;

        Object.values(pointsRef.current).forEach(point => {
            const vector = point.position.clone();
            vector.project(cameraRef.current);

            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

            if (vector.z < 1) {
                point.label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
                point.label.style.display = 'block';
            } else {
                point.label.style.display = 'none';
            }
        });
    };

    const resetCamera = () => {
        if (cameraRef.current && controlsRef.current) {
            cameraRef.current.position.set(200, 200, 200);
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
        }
    };

    // Initialize Three.js
    useEffect(() => {
        initThreeJS();

        // Cleanup
        return () => {
            if (rendererRef.current && containerRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
                if (labelsContainerRef.current) {
                    containerRef.current.removeChild(labelsContainerRef.current);
                }
            }
        };
    }, []);

    return (
        <div className="w-full h-full relative">
            <div ref={containerRef} className="w-full h-full" />

            {/* Controls Panel */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 max-w-sm">
                {/* Connection Form */}
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-lg font-bold text-[#001E2B] mb-4">Atlas Connection</h2>

                    <div className="space-y-8">
                        <input
                            type="password"
                            defaultValue="mongodb+srv://readonly:Password123%21@performance.zbcul.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=performance"
                            placeholder="Connection String"
                            className="w-full p-2 border rounded text-black"
                            value={connectionDetails.connectionString}
                            onChange={(e) => setConnectionDetails(prev => ({
                                ...prev,
                                connectionString: e.target.value
                            }))}
                        />


                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    placeholder="Database"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                                    value={connectionDetails.database}
                                    onChange={(e) => setConnectionDetails(prev => ({
                                        ...prev,
                                        database: e.target.value
                                    }))}
                                />
                                <input
                                    type="text"
                                    placeholder="Collection"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                                    value={connectionDetails.collection}
                                    onChange={(e) => setConnectionDetails(prev => ({
                                        ...prev,
                                        collection: e.target.value
                                    }))}
                                />
                            </div>
                        </div>

                        <button
                            onClick={testConnection}
                            disabled={loading}
                            className="w-full bg-[#00ED64] text-[#001E2B] px-4 py-2 rounded-lg font-medium 
                       hover:bg-[#00c753] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Database className="w-4 h-4" />
                            {loading ? 'Connecting...' : 'Test Connection'}
                        </button>
                    </div>
                </div>

                {/* Field Selection */}
                {isConnected && (
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <select
                            value={selectedField}
                            onChange={(e) => setSelectedField(e.target.value)}
                            className="w-full p-2 border rounded mb-4 text-black"
                        >
                            <option value="">Select vector field</option>
                            {fields.map(field => (
                                <option key={field} value={field}>{field}</option>
                            ))}
                        </select>

                        <button
                            onClick={analyzeVectors}
                            disabled={loading || !selectedField}
                            className="w-full bg-[#00ED64] text-[#001E2B] px-4 py-2 rounded-md font-medium 
                       hover:bg-[#00c753] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Calculator className="w-4 h-4" />
                            {loading ? 'Analyzing...' : 'Analyze Vectors'}
                        </button>
                    </div>
                )}

                {/* Vector Statistics */}
                {vectorStats && (
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h3 className="text-md font-bold text-[#001E2B] mb-2 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Vector Statistics
                        </h3>
                        <div className="space-y-1 text-sm text-black">
                            <p>Documents: {vectorStats.documentCount}</p>
                            <p>Dimensions: {vectorStats.dimensions}</p>
                            <p>Avg Distance: {vectorStats.avgDistance.toFixed(4)}</p>
                            <p>Max Distance: {vectorStats.maxDistance.toFixed(4)}</p>
                            <p>Min Distance: {vectorStats.minDistance.toFixed(4)}</p>
                        </div>
                    </div>
                )}

                {/* Reset View Button */}
                <button
                    onClick={resetCamera}
                    className="bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 
                   text-sm text-black flex items-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset View
                </button>
            </div>

            {/* Hover Information */}
            {hoveredPoint && (
                <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
                    <h3 className="font-bold text-lg text-[#001E2B] mb-2">{hoveredPoint.title}</h3>
                    <div className="text-black space-y-2 text-sm">
                        <p>{hoveredPoint.content}</p>
                        <div className="mt-2">
                            <p className="font-medium text-black">Vector Values:</p>
                            <div className="grid grid-cols-4 gap-1 mt-1">
                                {hoveredPoint.embedding.slice(0, 12).map((value, idx) => (
                                    <span key={idx} className="text-xs text-gray-600">
                                        {value.toFixed(4)}
                                    </span>
                                ))}
                                {hoveredPoint.embedding.length > 12 && (
                                    <span className="text-xs text-gray-400">...</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="absolute bottom-4 left-4 bg-red-50 text-red-600 p-3 rounded-lg shadow">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Atlas3DVisualizer;
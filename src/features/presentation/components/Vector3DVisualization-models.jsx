import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Search, RotateCcw } from 'lucide-react';
import { DOMAIN_CONTEXTS, ENHANCED_MULTI_MEANING_WORDS } from '../../../constants/semanticConstants';
import { HoverInfo } from '../../../components/HoverInfo';

const Vector3DVisualization = () => {
    // Declare all refs at the start
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const pointsRef = useRef({});
    const labelsContainerRef = useRef(null);
    const animationRef = useRef(null);

    // State declarations
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeLines, setActiveLines] = useState([]);

    const resetCamera = () => {
        if (cameraRef.current && controlsRef.current) {
            cameraRef.current.position.set(0, 0, 5);
            controlsRef.current.reset();
        }
    };

    const createAnimatedLine = (start, end, color, strength) => {
        const points = [start, end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Create a custom shader material for line animation
        const material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                color: { value: new THREE.Color(color) },
                opacity: { value: 0 },
                strength: { value: strength }
            },
            vertexShader: `
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float opacity;
                uniform float strength;
                void main() {
                    gl_FragColor = vec4(color, opacity * strength);
                }
            `
        });
    
        const line = new THREE.Line(geometry, material);
        return line;
    };

    const animateLines = (lines, fadeIn = true) => {
        const duration = 300; // Reduced animation duration for smoother transitions
        const startTime = Date.now();
    
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const opacity = fadeIn ? progress : 1 - progress;
            
            lines.forEach(line => {
                if (line.material && line.material.uniforms) {
                    line.material.uniforms.opacity.value = opacity;
                }
            });
    
            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else if (!fadeIn) {
                // Remove lines after fade out
                lines.forEach(line => {
                    if (sceneRef.current && sceneRef.current.remove) {
                        sceneRef.current.remove(line);
                    }
                });
                setActiveLines([]);
            }
        };
    
        animate();
    };

    const createRelationshipLines = (word, domain, subdomain) => {
        // Clear existing lines with animation
        if (activeLines.length > 0) {
            animateLines(activeLines, false);
        }
    
        const newLines = [];
        const wordData = ENHANCED_MULTI_MEANING_WORDS[word];
        
        if (wordData && wordData[domain]?.contexts) {
            const contextData = wordData[domain].contexts[subdomain];
            const startPoint = pointsRef.current[`${word}-${domain}-${subdomain}`].position;
    
            contextData.related.forEach(({ term, strength }) => {
                // Look for any matching point that contains the term
                const relatedPointKey = Object.keys(pointsRef.current).find(key => key.startsWith(`${term}-`));
                if (relatedPointKey) {
                    const endPoint = pointsRef.current[relatedPointKey].position;
                    const line = createAnimatedLine(
                        startPoint,
                        endPoint,
                        DOMAIN_CONTEXTS[domain].subdomains[subdomain].color,
                        strength
                    );
                    sceneRef.current.add(line);
                    newLines.push(line);
                }
            });
        }
    
        setActiveLines(newLines);
        if (newLines.length > 0) {
            animateLines(newLines, true);
        }
    };

    const addPointEventListeners = (point, word, domain, subdomain) => {
        let hoverTimeout;
    
        point.label.addEventListener('mouseenter', () => {
            // Clear any existing timeout
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
            }
    
            setHoveredPoint({ word, domain, subdomain });
            point.mesh.material.opacity = 1;
            point.mesh.scale.setScalar(1.5);
            point.label.style.fontWeight = '600';
            createRelationshipLines(word, domain, subdomain);
        });
    
        point.label.addEventListener('mouseleave', () => {
            // Add a small delay before resetting
            hoverTimeout = setTimeout(() => {
                setHoveredPoint(null);
                point.mesh.material.opacity = 0.8;
                point.mesh.scale.setScalar(1);
                point.label.style.fontWeight = '500';
                
                // Only clear lines if we're not hovering over a related point
                if (activeLines.length > 0 && !document.querySelector(':hover > .vector-label')) {
                    animateLines(activeLines, false);
                }
            }, 100);
        });
    };

// Modify the createPoint function to include word vectors
const createPoints = () => {
    // Clear existing points - with safety checks
    if (pointsRef.current && Object.values(pointsRef.current).length > 0) {
        Object.values(pointsRef.current).forEach(point => {
            if (point.mesh && sceneRef.current) {
                sceneRef.current.remove(point.mesh);
            }
            if (point.label && labelsContainerRef.current && labelsContainerRef.current.contains(point.label)) {
                labelsContainerRef.current.removeChild(point.label);
            }
        });
    }
    pointsRef.current = {};

    // Skip if scene or labels container isn't ready
    if (!sceneRef.current || !labelsContainerRef.current) return;

    // Create points for each word in ENHANCED_MULTI_MEANING_WORDS
    Object.entries(ENHANCED_MULTI_MEANING_WORDS).forEach(([word, domains]) => {
        Object.entries(domains).forEach(([domain, domainData]) => {
            if (domainData.vector) {
                const vector = domainData.vector;
                Object.entries(domainData.contexts).forEach(([subdomain, contextData]) => {
                    // Add some random offset to spread out points with same vector
                    const offset = new THREE.Vector3(
                        (Math.random() - 0.5) * 0.5,
                        (Math.random() - 0.5) * 0.5,
                        (Math.random() - 0.5) * 0.5
                    );
                    
                    const position = new THREE.Vector3(
                        vector[0] * 4 - 2,
                        vector[1] * 4 - 2,
                        vector[2] * 4 - 2
                    ).add(offset);

                    const geometry = new THREE.SphereGeometry(0.08);
                    const material = new THREE.MeshPhongMaterial({
                        color: DOMAIN_CONTEXTS[domain].subdomains[subdomain].color,
                        opacity: 0.8,
                        transparent: true,
                        emissive: DOMAIN_CONTEXTS[domain].subdomains[subdomain].color,
                        emissiveIntensity: 0.2
                    });

                    const sphere = new THREE.Mesh(geometry, material);
                    sphere.position.copy(position);

                    // Add glow effect
                    const glowGeometry = new THREE.SphereGeometry(0.12);
                    const glowMaterial = new THREE.MeshBasicMaterial({
                        color: DOMAIN_CONTEXTS[domain].subdomains[subdomain].color,
                        transparent: true,
                        opacity: 0.2
                    });
                    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                    sphere.add(glow);

                    // Create HTML label
                    const label = document.createElement('div');
                    label.className = 'absolute text-sm font-semibold pointer-events-auto cursor-pointer bg-white/90 px-2 py-1 rounded shadow-sm vector-label';
                    label.textContent = `${word} (${DOMAIN_CONTEXTS[domain].subdomains[subdomain].label})`;
                    label.style.color = DOMAIN_CONTEXTS[domain].subdomains[subdomain].color;
                    labelsContainerRef.current.appendChild(label);

                    const point = { mesh: sphere, label, position, word, domain, subdomain };
                    pointsRef.current[`${word}-${domain}-${subdomain}`] = point;

                    // Event listeners
                    label.addEventListener('mouseenter', () => {
                        setHoveredPoint({ word, domain, subdomain });
                        sphere.material.opacity = 1;
                        sphere.scale.setScalar(1.5);
                        label.style.fontWeight = '600';
                        createRelationshipLines(word, domain, subdomain);
                    });

                    label.addEventListener('mouseleave', () => {
                        setHoveredPoint(null);
                        sphere.material.opacity = 0.8;
                        sphere.scale.setScalar(1);
                        label.style.fontWeight = '500';
                    });

                    sceneRef.current.add(sphere);
                });
            }
        });
    });
};

useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 2, 15);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
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
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Update label positions
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

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
        updateLabels();
    }

    // Handle resize - defined within useEffect
    function handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        if (camera && renderer) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    }

    // Initialize points
    requestAnimationFrame(() => {
        createPoints();
    });

    // Start animation
    animate();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
        // Clean up points
        if (pointsRef.current) {
            Object.values(pointsRef.current).forEach(point => {
                if (point.mesh && sceneRef.current) {
                    sceneRef.current.remove(point.mesh);
                }
                if (point.label && labelsContainerRef.current && labelsContainerRef.current.contains(point.label)) {
                    labelsContainerRef.current.removeChild(point.label);
                }
            });
        }
        
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        // Remove resize listener
        window.removeEventListener('resize', handleResize);

        // Clean up DOM elements
        if (containerRef.current) {
            if (rendererRef.current && rendererRef.current.domElement) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }
            if (labelsContainerRef.current) {
                containerRef.current.removeChild(labelsContainerRef.current);
            }
        }
    };
}, []);

    const handleSearch = (e) => {
            const value = e.target.value;
            setSearchTerm(value);
    
            if (!pointsRef.current) return;
    
            Object.entries(pointsRef.current).forEach(([key, point]) => {
                const matches = key.toLowerCase().includes(value.toLowerCase());
                if (point.mesh && point.label) {
                    point.mesh.material.opacity = matches || !value ? 0.8 : 0.1;
                    point.label.style.opacity = matches || !value ? '1' : '0.1';
                }
            });
        };

    return (
        <div className="w-full h-full relative">
            <div ref={containerRef} className="w-full h-full" />

            {/* Controls */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-4">
                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search vectors..."
                        className="w-64 pl-10 pr-4 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                </div>

                <button
                    onClick={resetCamera}
                    className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-sm flex items-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset View
                </button>

                {/* Domain Context Legend */}
                <div className="bg-white p-3 rounded-lg shadow-sm">
                    <h3 className="text-sm font-semibold mb-2">Domains</h3>
                    {Object.entries(DOMAIN_CONTEXTS).map(([domain, { subdomains }]) => (
                        <div key={domain} className="mb-2">
                            <h4 className="text-sm font-medium mb-1 capitalize">{domain}</h4>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(subdomains).map(([key, { label, color }]) => (
                                    <div
                                        key={key}
                                        className="flex items-center gap-1 text-xs"
                                    >
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hover Information */}
            {hoveredPoint && <HoverInfo point={hoveredPoint} />}
        </div>
    );
};

export default Vector3DVisualization;
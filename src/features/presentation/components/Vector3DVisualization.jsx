// This version works with lines and debugging Tue Nov 26 2024
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Search, RotateCcw } from 'lucide-react';

// Add this at the top of your Vector3DVisualization.jsx file, after your imports
const ENHANCED_VECTOR_CLUSTERS = {
  tech: {
      words: ['apple', 'windows', 'safari', 'python', 'java', 'ruby', 'chrome', 'shell', 'swift', 'rust'],
      related: {
          'python': ['java', 'ruby', 'shell', 'swift'],
          'java': ['python', 'ruby', 'spring', 'shell'],
          'ruby': ['python', 'java', 'shell'],
          'swift': ['apple', 'python', 'rust'],
          'shell': ['python', 'java', 'ruby'],
          'chrome': ['safari', 'windows'],
          'safari': ['chrome', 'apple'],
          'windows': ['chrome', 'apple'],
          'apple': ['safari', 'windows', 'swift'],
          'rust': ['swift', 'python']
      },
      color: '#2563eb',
      label: 'Technology'
  },
  nature: {
      words: ['apple', 'python', 'ruby', 'shell', 'palm', 'java', 'sage', 'mint', 'butterfly', 'spider'],
      related: {
          'python': ['snake', 'spider'],
          'ruby': ['mint', 'sage'],
          'shell': ['palm', 'butterfly'],
          'palm': ['shell', 'sage'],
          'java': ['mint', 'sage'],
          'sage': ['mint', 'ruby', 'palm'],
          'mint': ['sage', 'ruby', 'java'],
          'butterfly': ['spider', 'shell'],
          'spider': ['butterfly', 'python'],
          'apple': ['palm', 'mint']
      },
      color: '#059669',
      label: 'Nature & Food'
  },
  places: {
      words: ['palm', 'safari', 'china', 'java', 'crown', 'victoria', 'phoenix', 'amazon', 'delta', 'spring'],
      related: {
          'palm': ['victoria', 'java'],
          'safari': ['amazon', 'delta'],
          'china': ['java', 'victoria'],
          'java': ['china', 'palm'],
          'crown': ['victoria', 'phoenix'],
          'victoria': ['crown', 'palm'],
          'phoenix': ['crown', 'spring'],
          'amazon': ['delta', 'safari'],
          'delta': ['amazon', 'spring'],
          'spring': ['phoenix', 'delta']
      },
      color: '#7c3aed',
      label: 'Places & Geography'
  },
  commerce: {
      words: ['amazon', 'apple', 'crown', 'shell', 'delta', 'visa', 'sprint', 'target', 'nike', 'adobe'],
      related: {
          'amazon': ['apple', 'target'],
          'apple': ['amazon', 'adobe'],
          'crown': ['shell', 'visa'],
          'shell': ['crown', 'delta'],
          'delta': ['shell', 'sprint'],
          'visa': ['crown', 'nike'],
          'sprint': ['delta', 'target'],
          'target': ['amazon', 'sprint'],
          'nike': ['visa', 'adobe'],
          'adobe': ['apple', 'nike']
      },
      color: '#dc2626',
      label: 'Companies & Brands'
  }
};
// Define clusters and their properties
const VECTOR_CLUSTERS = {
  tech: {
    words: ['apple', 'windows', 'safari', 'python', 'java', 'ruby', 'chrome', 'shell', 'swift', 'rust'],
    color: '#2563eb',
    label: 'Technology'
  },
  nature: {
    words: ['apple', 'python', 'ruby', 'shell', 'palm', 'java', 'sage', 'mint', 'butterfly', 'spider'],
    color: '#059669',
    label: 'Nature & Food'
  },
  places: {
    words: ['palm', 'safari', 'china', 'java', 'crown', 'victoria', 'phoenix', 'amazon', 'delta', 'spring'],
    color: '#7c3aed',
    label: 'Places & Geography'
  },
  commerce: {
    words: ['amazon', 'apple', 'crown', 'shell', 'delta', 'visa', 'sprint', 'target', 'nike', 'adobe'],
    color: '#dc2626',
    label: 'Companies & Brands'
  }
};

// Multi-meaning word definitions
const MULTI_MEANING_WORDS = {
  apple: {
    tech: {
      related: ['microsoft', 'windows', 'safari', 'devices', 'iphone', 'macbook'],
      vector: [0.9, 0.1, 0.2],
      description: 'Technology company known for iPhone, Mac, and other devices'
    },
    nature: {
      related: ['fruit', 'orchard', 'pie', 'cider', 'tree', 'harvest'],
      vector: [0.2, 0.9, 0.3],
      description: 'Edible fruit growing on apple trees'
    },
    commerce: {
      related: ['nasdaq', 'store', 'brand', 'retail', 'market', 'stock'],
      vector: [0.3, 0.2, 0.9],
      description: 'One of the world\'s most valuable public companies'
    }
  },
  swift: {
    tech: {
      related: ['apple', 'ios', 'programming', 'xcode', 'development', 'mobile'],
      vector: [0.85, 0.15, 0.25],
      description: 'Programming language developed by Apple for iOS development'
    },
    nature: {
      related: ['bird', 'fast', 'flight', 'speed', 'agile', 'quick'],
      vector: [0.2, 0.8, 0.4],
      description: 'Type of bird known for fast flight'
    },
    attributes: {
      related: ['quick', 'rapid', 'speedy', 'immediate', 'prompt', 'efficient'],
      vector: [0.4, 0.3, 0.9],
      description: 'Characteristic of being fast or quick in motion'
    },
    music: {
      related: ['taylor', 'artist', 'singer', 'songwriter', 'performer'],
      vector: [0.6, 0.2, 0.7],
      description: 'Reference to Taylor Swift, popular music artist'
    }
  },
  python: {
    tech: {
      related: ['programming', 'coding', 'software', 'django', 'machine-learning', 'AI'],
      vector: [0.95, 0.2, 0.15],
      description: 'Popular programming language used in web development and AI'
    },
    nature: {
      related: ['snake', 'reptile', 'scales', 'venom', 'constrictor', 'serpent'],
      vector: [0.3, 0.9, 0.2],
      description: 'Large constricting snake species'
    }
  },
  java: {
    tech: {
      related: ['programming', 'code', 'android', 'software', 'enterprise', 'spring'],
      vector: [0.95, 0.2, 0.15],
      description: 'Programming language widely used in enterprise software'
    },
    nature: {
      related: ['coffee', 'beans', 'brew', 'caffeine', 'roasted', 'beverage'],
      vector: [0.3, 0.9, 0.2],
      description: 'Popular coffee variety and beverage'
    },
    places: {
      related: ['indonesia', 'island', 'jakarta', 'bali', 'culture', 'southeast-asia'],
      vector: [0.4, 0.3, 0.9],
      description: 'Indonesian island with rich cultural heritage'
    }
  },
  ruby: {
    tech: {
      related: ['rails', 'programming', 'web', 'gems', 'development', 'backend'],
      vector: [0.9, 0.2, 0.3],
      description: 'Programming language known for Ruby on Rails framework'
    },
    nature: {
      related: ['gemstone', 'crystal', 'precious', 'mineral', 'red', 'jewelry'],
      vector: [0.2, 0.9, 0.3],
      description: 'Precious red gemstone'
    }
  },
  shell: {
    tech: {
      related: ['bash', 'terminal', 'command-line', 'unix', 'scripting', 'zsh'],
      vector: [0.9, 0.1, 0.3],
      description: 'Command-line interface for operating systems'
    },
    nature: {
      related: ['ocean', 'beach', 'mollusk', 'seashell', 'protective', 'marine'],
      vector: [0.2, 0.8, 0.4],
      description: 'Hard protective covering of marine creatures'
    },
    commerce: {
      related: ['oil', 'gas', 'energy', 'petroleum', 'company', 'fuel'],
      vector: [0.3, 0.2, 0.9],
      description: 'Global energy and petrochemical company'
    }
  },
  crown: {
    nature: {
      related: ['tree', 'foliage', 'canopy', 'branches', 'leaves', 'forest'],
      vector: [0.3, 0.9, 0.2],
      description: 'Upper part of a tree with branches and leaves'
    },
    objects: {
      related: ['royalty', 'jewels', 'monarch', 'gold', 'throne', 'kingdom'],
      vector: [0.8, 0.3, 0.4],
      description: 'Ceremonial headwear worn by royalty'
    },
    anatomy: {
      related: ['tooth', 'dental', 'molar', 'dentistry', 'restoration'],
      vector: [0.4, 0.3, 0.8],
      description: 'Top part of a tooth or dental prosthetic'
    }
  },
  amazon: {
    tech: {
      related: ['aws', 'cloud', 'ecommerce', 'alexa', 'prime', 'retail'],
      vector: [0.9, 0.2, 0.1],
      description: 'Global technology company known for ecommerce and cloud services'
    },
    nature: {
      related: ['river', 'rainforest', 'jungle', 'biodiversity', 'south-america', 'ecosystem'],
      vector: [0.2, 0.9, 0.3],
      description: 'World\'s largest rainforest and river system'
    },
    mythology: {
      related: ['warrior', 'women', 'greek', 'mythology', 'ancient', 'legends'],
      vector: [0.4, 0.3, 0.9],
      description: 'Female warriors in Greek mythology'
    }
  },

  sage: {
    tech: {
      related: ['software', 'accounting', 'enterprise', 'business', 'erp', 'finance'],
      vector: [0.85, 0.2, 0.3],
      description: 'Business software and solutions provider'
    },
    nature: {
      related: ['herb', 'plant', 'garden', 'cooking', 'aromatherapy', 'medicinal'],
      vector: [0.3, 0.9, 0.2],
      description: 'Aromatic herb used in cooking and medicine'
    },
    attributes: {
      related: ['wisdom', 'wise', 'knowledge', 'expert', 'advisor', 'scholar'],
      vector: [0.4, 0.3, 0.8],
      description: 'Person of great wisdom and experience'
    }
  },

  mint: {
    tech: {
      related: ['crypto', 'nft', 'blockchain', 'token', 'digital', 'create'],
      vector: [0.9, 0.1, 0.3],
      description: 'Creating new cryptocurrency tokens or NFTs'
    },
    nature: {
      related: ['herb', 'plant', 'fresh', 'garden', 'aromatic', 'leaves'],
      vector: [0.2, 0.9, 0.4],
      description: 'Aromatic herb known for its fresh taste'
    },
    commerce: {
      related: ['money', 'coins', 'currency', 'treasury', 'facility', 'production'],
      vector: [0.3, 0.2, 0.9],
      description: 'Facility where currency is produced'
    },
    attributes: {
      related: ['condition', 'perfect', 'pristine', 'new', 'fresh', 'unused'],
      vector: [0.5, 0.5, 0.7],
      description: 'Perfect or pristine condition'
    }
  },

  delta: {
    tech: {
      related: ['change', 'difference', 'variation', 'increment', 'calculation', 'math'],
      vector: [0.9, 0.2, 0.3],
      description: 'Mathematical term for change or difference'
    },
    nature: {
      related: ['river', 'estuary', 'sediment', 'geography', 'wetland', 'ecosystem'],
      vector: [0.2, 0.9, 0.3],
      description: 'Where a river meets the sea, forming sediment deposits'
    },
    commerce: {
      related: ['airline', 'travel', 'aviation', 'transportation', 'flights', 'carrier'],
      vector: [0.3, 0.2, 0.9],
      description: 'Major airline company'
    },
    science: {
      related: ['variant', 'mutation', 'covid', 'genetics', 'strain', 'evolution'],
      vector: [0.7, 0.4, 0.5],
      description: 'Term used for variants in science and medicine'
    }
  },

  spring: {
    tech: {
      related: ['java', 'framework', 'backend', 'development', 'microservices', 'boot'],
      vector: [0.9, 0.1, 0.2],
      description: 'Popular Java development framework'
    },
    nature: {
      related: ['season', 'bloom', 'flowers', 'growth', 'renewal', 'warm'],
      vector: [0.2, 0.9, 0.3],
      description: 'Season between winter and summer'
    },
    physics: {
      related: ['coil', 'elastic', 'mechanical', 'tension', 'compression', 'bounce'],
      vector: [0.4, 0.3, 0.9],
      description: 'Elastic device that can store mechanical energy'
    },
    geography: {
      related: ['water', 'source', 'fountain', 'natural', 'groundwater', 'fresh'],
      vector: [0.3, 0.7, 0.6],
      description: 'Natural source of water from underground'
    }
  },

  torch: {
    tech: {
      related: ['pytorch', 'deep-learning', 'AI', 'neural-networks', 'machine-learning', 'tensors'],
      vector: [0.9, 0.2, 0.3],
      description: 'Deep learning framework (PyTorch)'
    },
    objects: {
      related: ['light', 'fire', 'flame', 'illumination', 'portable', 'flashlight'],
      vector: [0.3, 0.8, 0.4],
      description: 'Portable light source or flame'
    },
    symbolism: {
      related: ['enlightenment', 'knowledge', 'guidance', 'olympic', 'symbol', 'bearer'],
      vector: [0.4, 0.3, 0.9],
      description: 'Symbol of enlightenment and guidance'
    }
  },

  beam: {
    tech: {
      related: ['apache', 'data-processing', 'streaming', 'pipeline', 'analytics', 'cloud'],
      vector: [0.9, 0.1, 0.3],
      description: 'Apache Beam data processing framework'
    },
    physics: {
      related: ['light', 'laser', 'radiation', 'particle', 'energy', 'focused'],
      vector: [0.3, 0.8, 0.4],
      description: 'Directed flow of energy or particles'
    },
    construction: {
      related: ['support', 'structural', 'steel', 'architecture', 'load-bearing', 'girder'],
      vector: [0.4, 0.3, 0.9],
      description: 'Structural support element in construction'
    }
  },

  graph: {
    tech: {
      related: ['database', 'neo4j', 'network', 'nodes', 'relationships', 'traversal'],
      vector: [0.9, 0.2, 0.1],
      description: 'Data structure with nodes and edges'
    },
    math: {
      related: ['plot', 'chart', 'visualization', 'coordinates', 'function', 'data'],
      vector: [0.3, 0.8, 0.4],
      description: 'Visual representation of mathematical relationships'
    },
    social: {
      related: ['network', 'connections', 'social-media', 'relationships', 'friends', 'links'],
      vector: [0.4, 0.3, 0.9],
      description: 'Network of social connections and relationships'
    }
  },

  key: {
    tech: {
      related: ['encryption', 'security', 'authentication', 'password', 'cryptography', 'access'],
      vector: [0.9, 0.1, 0.3],
      description: 'Cryptographic or authentication credential'
    },
    music: {
      related: ['musical', 'tone', 'signature', 'scale', 'notes', 'harmony'],
      vector: [0.3, 0.8, 0.4],
      description: 'Musical scale or signature'
    },
    objects: {
      related: ['lock', 'door', 'physical', 'metal', 'unlock', 'access'],
      vector: [0.4, 0.3, 0.9],
      description: 'Physical device for operating a lock'
    },
    concepts: {
      related: ['important', 'crucial', 'essential', 'fundamental', 'critical', 'core'],
      vector: [0.5, 0.5, 0.7],
      description: 'Essential or crucial element'
    }
  }
};

const Vector3DVisualization = () => {
  const containerRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const controlsRef = useRef();
  const pointsRef = useRef({});
  const labelsContainerRef = useRef();
  const hoverTimeoutRef = useRef(null);
  const activeLines = useRef([]);
  const lineAnimationRef = useRef(null);

  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, 5);
      controlsRef.current.reset();
    }
  };

  const createPointPosition = (word, cluster) => {
    const wordData = MULTI_MEANING_WORDS[word];
    if (wordData && wordData[cluster]?.vector) {
      // Use the actual vector data for positioning
      const vector = wordData[cluster].vector;
      return new THREE.Vector3(
        vector[0] * 4 - 2, // Scale and center the positions
        vector[1] * 4 - 2,
        vector[2] * 4 - 2
      );
    }

    // Fallback to cluster-based positioning if no vector data
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 4;
    const radius = 1 + Math.random() * 2;

    return new THREE.Vector3(
      radius * Math.cos(angle),
      height,
      radius * Math.sin(angle)
    );
  };

  const handlePointHover = (word, cluster, sphere, label) => {
    if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
    }

    console.log('Hovering:', word, cluster); // Debug log

    setHoveredPoint({ word, cluster });
    sphere.material.opacity = 1;
    sphere.scale.setScalar(1.5);
    label.style.fontWeight = '600';
    label.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    label.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

    createRelationshipLines(word, cluster, sceneRef.current);
};

  const handlePointLeave = (sphere, label) => {
    // Add a small delay before removing hover state
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredPoint(null);
      sphere.material.opacity = 0.8;
      sphere.scale.setScalar(1);
      label.style.fontWeight = '500';
      label.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      label.style.boxShadow = 'none';

      // Clear relationship lines
      activeLines.current.forEach(line => {
        sceneRef.current.remove(line);
      });
      activeLines.current = [];
    }, 100);
  };

  const createRelationshipLines = (word, cluster, scene) => {
    console.log('Creating lines for:', word, cluster);
    
    // Clear existing lines
    activeLines.current.forEach(({ line }) => {
        scene.remove(line);
    });
    activeLines.current = [];

    const startPoint = pointsRef.current[word]?.position;
    if (!startPoint) {
        console.log('No start point found for:', word);
        return;
    }

    // Create lines from ENHANCED_VECTOR_CLUSTERS
    if (ENHANCED_VECTOR_CLUSTERS[cluster]?.related?.[word]) {
        const relatedWords = ENHANCED_VECTOR_CLUSTERS[cluster].related[word];
        console.log('Related words:', relatedWords);

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
                    console.log('Created line to:', relatedWord);
                }, index * 100);
            }
        });
    }

    // Create lines from MULTI_MEANING_WORDS
    if (MULTI_MEANING_WORDS[word]?.[cluster]?.related) {
        const relatedTerms = MULTI_MEANING_WORDS[word][cluster].related;
        console.log('MULTI_MEANING related terms:', relatedTerms);

        relatedTerms.forEach((relatedTerm, index) => {
            Object.entries(pointsRef.current).forEach(([pointWord, point]) => {
                if (pointWord.toLowerCase().includes(relatedTerm.toLowerCase())) {
                    setTimeout(() => {
                        const line = createAnimatedLine(
                            startPoint,
                            point.position,
                            VECTOR_CLUSTERS[cluster].color,
                            0.8
                        );
                        scene.add(line);
                        activeLines.current.push({ 
                            line, 
                            material: line.material
                        });
                        console.log('Created MULTI_MEANING line to:', pointWord);
                    }, (index + relatedTerms.length) * 100);
                }
            });
        });
    }
};

const fadeOutLines = (callback) => {
  const duration = 500;
  const startTime = Date.now();

  const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      activeLines.current.forEach(({ line, material }) => {
          // Check if material has uniforms (ShaderMaterial)
          if (material.uniforms) {
              material.uniforms.opacity.value = 1 - progress;
          } else {
              // Regular material
              material.opacity = 1 - progress;
          }
      });

      if (progress < 1) {
          lineAnimationRef.current = requestAnimationFrame(animate);
      } else {
          activeLines.current.forEach(({ line }) => {
              if (sceneRef.current && line) {
                  sceneRef.current.remove(line);
              }
          });
          if (callback) callback();
      }
  };

  animate();
};

const animateLines = () => {
  const time = Date.now() * 0.001;
  activeLines.current.forEach(({ material, pulse }) => {
      // Only try to animate shader materials
      if (material.uniforms) {
          material.uniforms.dashOffset.value = -time;
          material.uniforms.time.value = time;
      }
      
      // Animate pulse effect if it exists
      if (pulse) {
          pulse.scale.setScalar(1 + Math.sin(time * 3) * 0.2);
          pulse.material.opacity = 0.5 + Math.sin(time * 3) * 0.2;
      }
  });
};

  const createCurvedPath = (start, end) => {
    // Calculate control point for curve
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    mid.y += distance * 0.2; // Add some height to the curve

    // Create curved path
    const curve = new THREE.QuadraticBezierCurve3(
      start,
      mid,
      end
    );

    return curve;
  };

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



  const createAnimatedLineMaterial = (color) => {
    return new THREE.ShaderMaterial({
        uniforms: {
            color: { value: new THREE.Color(color) },
            dashOffset: { value: 0 },
            opacity: { value: 0.8 }, // Increased base opacity
            time: { value: 0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            uniform float dashOffset;
            uniform float opacity;
            uniform float time;
            varying vec2 vUv;

            void main() {
                float dash = fract(vUv.x * 10.0 + dashOffset); // Reduced dash frequency
                float glow = sin(time * 2.0) * 0.5 + 0.5;
                float alpha = smoothstep(0.45, 0.55, dash) * opacity;
                
                // Enhanced glow effect
                vec3 finalColor = mix(color, color * 2.0, vUv.x);
                finalColor += color * glow * 0.5;
                
                gl_FragColor = vec4(finalColor, alpha);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false, // Added to ensure lines are visible
        depthTest: true
    });
};

  const createPulseEffect = (start, end) => {
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const geometry = new THREE.SphereGeometry(0.05);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    });
    const pulse = new THREE.Mesh(geometry, material);
    pulse.position.copy(midPoint);
    return pulse;
  };

  useEffect(() => {
    if (!pointsRef.current) return;

    Object.entries(pointsRef.current).forEach(([word, point]) => {
      const matches = word.toLowerCase().includes(searchTerm.toLowerCase());
      point.mesh.material.opacity = matches || !searchTerm ? 0.8 : 0.1;
      point.label.style.opacity = matches || !searchTerm ? '1' : '0.1';
    });
  }, [searchTerm]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 2, 15);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
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

    // Create points for each cluster
    Object.entries(VECTOR_CLUSTERS).forEach(([clusterKey, cluster]) => {
      cluster.words.forEach(word => {
        const position = createPointPosition(word, clusterKey);

        // Create multi-context indicator if word appears in multiple clusters
        const contexts = Object.keys(MULTI_MEANING_WORDS[word] || {});
        const isMultiContext = contexts.length > 1;

        // Create point with enhanced visuals
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

        // Enhanced glow effect for multi-context terms
        const glowGeometry = new THREE.SphereGeometry(isMultiContext ? 0.15 : 0.12);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: cluster.color,
          transparent: true,
          opacity: isMultiContext ? 0.3 : 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        sphere.add(glow);

        // Create HTML label
        const label = document.createElement('div');
        label.className = 'absolute text-sm font-semibold pointer-events-auto cursor-pointer bg-white/90 px-2 py-1 rounded shadow-sm';
        label.textContent = word;
        label.style.color = cluster.color;
        labelsContainer.appendChild(label);

        // Store reference
        pointsRef.current[word] = {
          mesh: sphere,
          label,
          position: sphere.position, // Use sphere's position
          cluster: clusterKey
      };

        // Event listeners
        label.addEventListener('mouseenter', () => {
          setHoveredPoint({ word, cluster: clusterKey });
          sphere.material.opacity = 1;
          sphere.scale.setScalar(1.5);
          label.style.fontWeight = '600';
          label.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
          label.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          handlePointHover(word, clusterKey, sphere, label);

        });

        label.addEventListener('mouseleave', () => {
          setHoveredPoint(null);
          sphere.material.opacity = 0.8;
          sphere.scale.setScalar(1);
          label.style.fontWeight = '500';
          label.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
          label.style.boxShadow = 'none';
          handlePointLeave(sphere, label);

        });

        scene.add(sphere);
      });
    });

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
      animateLines(); // Add this line
      renderer.render(scene, camera);
      updateLabels();
    }
    animate();

    // Handle resize
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }


    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (lineAnimationRef.current) {
        cancelAnimationFrame(lineAnimationRef.current);
      }
      activeLines.current.forEach(({ line }) => {
        sceneRef.current?.remove(line);
      });
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      containerRef.current?.removeChild(labelsContainer);
      activeLines.current.forEach(line => {
        sceneRef.current?.remove(line);
      });
      activeLines.current = [];
    };
  }, []);
  const DebugButton = () => (
    <button
        onClick={() => {
            console.log('Points:', pointsRef.current);
            console.log('Clusters:', ENHANCED_VECTOR_CLUSTERS);
            console.log('Meanings:', MULTI_MEANING_WORDS);
            
            // Test line creation
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
  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />

      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vectors..."
            className="w-64 pl-10 pr-4 py-2 rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          />
        </div>
        <DebugButton />

        {/* Reset View */}
        <button
          onClick={resetCamera}
          className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-sm flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset View
        </button>

        {/* Cluster Legend */}
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold mb-2">Clusters</h3>
          {Object.entries(VECTOR_CLUSTERS).map(([key, info]) => (
            <div
              key={key}
              className="flex items-center gap-2 p-1 text-sm"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: info.color }}
              />
              <span>{info.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hover Information */}
      {hoveredPoint && (
        <div
          className="fixed bg-white/95 rounded-lg shadow-lg border border-gray-200 max-w-sm p-4"
          style={{
            left: '50%',
            top: '20px',
            transform: 'translateX(-50%)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000
          }}
        >
          <h3
            className="font-semibold mb-2 text-lg"
            style={{ color: VECTOR_CLUSTERS[hoveredPoint.cluster].color }}
          >
            {hoveredPoint.word}
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Current Context: </span>
              {VECTOR_CLUSTERS[hoveredPoint.cluster].label}
            </p>
            {MULTI_MEANING_WORDS[hoveredPoint.word] && (
              <div className="mt-3">
                <p className="font-medium mb-2">Other Meanings & Contexts:</p>
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

export default Vector3DVisualization;
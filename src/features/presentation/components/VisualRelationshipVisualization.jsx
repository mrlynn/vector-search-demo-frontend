import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ENHANCED_MULTI_MEANING_WORDS } from '../../../constants/semanticConstants';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';


const InteractiveVectorVisualization = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Scene and Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Raycaster and Mouse for Interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Node and Edge Storage
    const nodes = [];
    const edges = [];
    const labels = [];

    // Font Loader for Labels
    const loader = new FontLoader(); // Corrected loader initialization
    const fontUrl = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';

    // Add Nodes and Edges
    Object.entries(ENHANCED_MULTI_MEANING_WORDS).forEach(([word, contexts]) => {
      Object.entries(contexts).forEach(([domain, data]) => {
        const position = {
          x: Math.random() * 10 - 5,
          y: Math.random() * 10 - 5,
          z: Math.random() * 10 - 5,
        };

        // Create Node
        const geometry = new THREE.SphereGeometry(0.2, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x007bff });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(position.x, position.y, position.z);
        sphere.userData = { word, domain };
        nodes.push(sphere);
        scene.add(sphere);

        // Create Edges
        if (data.contexts) {
          Object.values(data.contexts).forEach((context) => {
            context.related.forEach((related) => {
              const targetPosition = {
                x: position.x + (Math.random() * 2 - 1),
                y: position.y + (Math.random() * 2 - 1),
                z: position.z + (Math.random() * 2 - 1),
              };

              const points = [
                new THREE.Vector3(position.x, position.y, position.z),
                new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z),
              ];
              const edgeGeometry = new THREE.BufferGeometry().setFromPoints(points);
              const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
              const line = new THREE.Line(edgeGeometry, edgeMaterial);
              edges.push(line);
              scene.add(line);
            });
          });
        }

        // Load and Add Labels
        loader.load(fontUrl, (font) => {
            nodes.forEach((node) => {
              const textGeometry = new TextGeometry(node.userData.word, {
                font: font,
                size: 0.2,
                height: 0.05,
              });
          
              const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
              const label = new THREE.Mesh(textGeometry, textMaterial);
              label.position.set(node.position.x + 0.3, node.position.y + 0.3, node.position.z);
              scene.add(label);
            });
          });
      });
    });

    // Handle Mouse Movement
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodes);

      nodes.forEach((node) => {
        node.material.color.set(0x007bff); // Reset color
      });

      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        intersected.material.color.set(0xff0000); // Highlight color
      }
    };

    // Add Event Listeners
    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default InteractiveVectorVisualization;

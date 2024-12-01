import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const VECTOR_CLUSTERS = {
  cluster1: {
    label: "Cluster 1",
    color: "#FF5733",
    words: ["apple", "banana", "cherry"],
    related: { apple: ["banana"], banana: ["cherry"] },
  },
  cluster2: {
    label: "Cluster 2",
    color: "#33FF57",
    words: ["dog", "cat", "mouse"],
    related: { dog: ["cat"], cat: ["mouse"] },
  },
  cluster3: {
    label: "Cluster 3",
    color: "#3357FF",
    words: ["car", "bus", "train"],
    related: { car: ["bus"], bus: ["train"] },
  },
};

const Vector3DForce = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const pointsRef = useRef({});
  const labelsContainerRef = useRef(null);
  const linesRef = useRef([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConnections, setShowConnections] = useState(true);

  // Helper to create positions
  const createPointPosition = (word, clusterIndex) => {
    return new THREE.Vector3(
      Math.random() * 2 - 1 + clusterIndex * 5,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
  };

  // Create Connections
  const createConnections = (scene, cluster) => {
    Object.entries(cluster.related).forEach(([word, relatedWords]) => {
      const startPoint = pointsRef.current[word]?.position;
      if (!startPoint) return;

      relatedWords.forEach((relatedWord) => {
        const endPoint = pointsRef.current[relatedWord]?.position;
        if (!endPoint) return;

        const material = new THREE.LineBasicMaterial({
          color: cluster.color,
          transparent: true,
          opacity: 0.5,
        });

        const geometry = new THREE.BufferGeometry().setFromPoints([
          startPoint,
          endPoint,
        ]);

        const line = new THREE.Line(geometry, material);
        scene.add(line);
        linesRef.current.push(line);
      });
    });
  };

  // Main Effect
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene and Renderer Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000");
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Labels Container
    const labelsContainer = document.createElement("div");
    labelsContainer.style.position = "absolute";
    labelsContainer.style.top = "0";
    labelsContainer.style.left = "0";
    labelsContainer.style.pointerEvents = "none";
    containerRef.current.appendChild(labelsContainer);
    labelsContainerRef.current = labelsContainer;

    // Create Nodes and Labels
    Object.entries(VECTOR_CLUSTERS).forEach(([clusterKey, cluster], index) => {
      cluster.words.forEach((word) => {
        const position = createPointPosition(word, index);
        const geometry = new THREE.SphereGeometry(0.2, 16, 16);
        const material = new THREE.MeshPhongMaterial({
          color: cluster.color,
        });
        const sphere = new THREE.Mesh(geometry, material);

        sphere.position.copy(position);
        pointsRef.current[word] = { mesh: sphere, position };

        // Label
        const label = document.createElement("div");
        label.textContent = word;
        label.style.position = "absolute";
        label.style.color = cluster.color;
        label.style.background = "rgba(255, 255, 255, 0.7)";
        label.style.padding = "2px 5px";
        label.style.borderRadius = "3px";
        label.style.fontSize = "12px";
        labelsContainer.appendChild(label);
        pointsRef.current[word].label = label;

        scene.add(sphere);
      });

      if (showConnections) {
        createConnections(scene, cluster);
      }
    });

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);

      // Update label positions
      Object.values(pointsRef.current).forEach(({ position, label }) => {
        const vector = position.clone().project(camera);
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

        if (vector.z < 1) {
          label.style.display = "block";
          label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        } else {
          label.style.display = "none";
        }
      });
    };

    animate();

    // Cleanup
    return () => {
      linesRef.current.forEach((line) => scene.remove(line));
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        containerRef.current.removeChild(labelsContainer);
      }
    };
  }, [showConnections]);

  // Search Effect
  useEffect(() => {
    Object.values(pointsRef.current).forEach(({ mesh, label }) => {
      const matches = mesh.name?.toLowerCase().includes(searchTerm.toLowerCase());
      mesh.material.opacity = matches || !searchTerm ? 1 : 0.1;
      label.style.opacity = matches || !searchTerm ? "1" : "0.1";
    });
  }, [searchTerm]);

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={containerRef}
        style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
      />
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          style={{
            padding: "5px",
            borderRadius: "3px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
        />
        <label>
          <input
            type="checkbox"
            checked={showConnections}
            onChange={(e) => setShowConnections(e.target.checked)}
          />
          Show Connections
        </label>
      </div>
    </div>
  );
};

export default Vector3DForce;

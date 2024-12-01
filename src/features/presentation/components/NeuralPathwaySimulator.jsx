import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const NeuralPathwaySimulator = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const pathwaysRef = useRef([]);

  // Data structure for nodes and connections
  const nodes = [
    { id: "raw1", label: "Raw Data 1", position: new THREE.Vector3(-5, 2, 0) },
    { id: "raw2", label: "Raw Data 2", position: new THREE.Vector3(-5, -2, 0) },
    { id: "cluster1", label: "Cluster 1", position: new THREE.Vector3(0, 0, 0) },
    { id: "intelligence", label: "Intelligence", position: new THREE.Vector3(5, 0, 0) },
  ];

  const connections = [
    { from: "raw1", to: "cluster1" },
    { from: "raw2", to: "cluster1" },
    { from: "cluster1", to: "intelligence" },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000");
    sceneRef.current = scene;

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);
    cameraRef.current = camera;

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Create Nodes
    const nodeMeshes = {};
    nodes.forEach((node) => {
      const geometry = new THREE.SphereGeometry(0.3, 16, 16);
      const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
      const sphere = new THREE.Mesh(geometry, material);

      sphere.position.copy(node.position);
      sphere.userData = { label: node.label };
      scene.add(sphere);
      nodeMeshes[node.id] = sphere;

      // Add Label
      const labelDiv = document.createElement("div");
      labelDiv.textContent = node.label;
      labelDiv.style.position = "absolute";
      labelDiv.style.color = "#fff";
      labelDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      labelDiv.style.padding = "5px";
      labelDiv.style.borderRadius = "5px";
      labelDiv.style.transform = "translate(-50%, -50%)";
      labelDiv.style.pointerEvents = "none";
      containerRef.current.appendChild(labelDiv);
      sphere.userData.labelDiv = labelDiv;
    });

    // Create Connections
    connections.forEach(({ from, to }) => {
      const material = new THREE.LineBasicMaterial({
        color: 0x0077ff,
        transparent: true,
        opacity: 0.5,
      });

      const geometry = new THREE.BufferGeometry().setFromPoints([
        nodeMeshes[from].position,
        nodeMeshes[to].position,
      ]);

      const line = new THREE.Line(geometry, material);
      scene.add(line);
      pathwaysRef.current.push(line);
    });

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update Labels
      nodes.forEach((node) => {
        const sphere = nodeMeshes[node.id];
        const vector = sphere.position.clone().project(camera);
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

        if (sphere.userData.labelDiv) {
          sphere.userData.labelDiv.style.left = `${x}px`;
          sphere.userData.labelDiv.style.top = `${y}px`;
          sphere.userData.labelDiv.style.display = vector.z < 1 ? "block" : "none";
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      pathwaysRef.current.forEach((line) => scene.remove(line));
      Object.values(nodeMeshes).forEach((mesh) => {
        if (mesh.userData.labelDiv) {
          containerRef.current.removeChild(mesh.userData.labelDiv);
        }
      });
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />
  );
};

export default NeuralPathwaySimulator;

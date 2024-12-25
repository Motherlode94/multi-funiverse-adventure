import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SurvivalGame = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerRef = useRef<THREE.Mesh | null>(null);
  const scoreRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Player
    const playerGeometry = new THREE.BoxGeometry();
    const playerMaterial = new THREE.MeshPhongMaterial({
      color: 0x00f2ff,
    });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    scene.add(player);
    playerRef.current = player;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (playerRef.current) {
        playerRef.current.rotation.x += 0.01;
        playerRef.current.rotation.y += 0.01;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full h-screen" />
      <div className="absolute top-4 left-4 z-10">
        <Button
          onClick={() => navigate('/')}
          className="bg-game-primary hover:bg-game-primary/80"
        >
          Retour au menu
        </Button>
      </div>
      <div className="absolute top-4 right-4 z-10 bg-gray-900/80 p-4 rounded-lg">
        <p className="text-game-primary font-rajdhani text-2xl">
          Score: {scoreRef.current}
        </p>
      </div>
    </div>
  );
};

export default SurvivalGame;
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BattleRoyaleGame = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerRef = useRef<THREE.Group | null>(null);
  const playersAliveRef = useRef<number>(100);
  const moveSpeed = 0.1;
  const keysPressed = useRef<{ [key: string]: boolean }>({});

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
    camera.position.set(0, 2, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 5, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a472a,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Player (human-like model)
    const player = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b00 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    body.castShadow = true;
    player.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2;
    head.castShadow = true;
    player.add(head);

    // Arms
    const armGeometry = new THREE.CapsuleGeometry(0.15, 0.7, 4, 8);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b00 });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.7, 1.2, 0);
    leftArm.castShadow = true;
    player.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.7, 1.2, 0);
    rightArm.castShadow = true;
    player.add(rightArm);

    // Legs
    const legGeometry = new THREE.CapsuleGeometry(0.2, 0.8, 4, 8);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x4444ff });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.3, 0.4, 0);
    leftLeg.castShadow = true;
    player.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.3, 0.4, 0);
    rightLeg.castShadow = true;
    player.add(rightLeg);

    scene.add(player);
    playerRef.current = player;

    // Keyboard controls
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current[event.key.toLowerCase()] = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (playerRef.current) {
        // Handle movement
        const keys = keysPressed.current;
        
        if (keys['z'] || keys['w']) {
          playerRef.current.position.z -= moveSpeed;
          camera.position.z -= moveSpeed;
        }
        if (keys['s']) {
          playerRef.current.position.z += moveSpeed;
          camera.position.z += moveSpeed;
        }
        if (keys['q'] || keys['a']) {
          playerRef.current.position.x -= moveSpeed;
          camera.position.x -= moveSpeed;
        }
        if (keys['d']) {
          playerRef.current.position.x += moveSpeed;
          camera.position.x += moveSpeed;
        }

        // Update camera to follow player
        camera.lookAt(playerRef.current.position);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
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
          Joueurs restants: {playersAliveRef.current}
        </p>
      </div>
      <div className="absolute bottom-4 left-4 z-10 bg-gray-900/80 p-4 rounded-lg">
        <p className="text-white font-rajdhani">
          Utilisez ZQSD/WASD pour vous déplacer
        </p>
      </div>
    </div>
  );
};

export default BattleRoyaleGame;
import * as THREE from 'three';
import { PlayerModel } from './PlayerModel';
import { PlayerControls } from './PlayerControls';

export class GameScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private player: PlayerModel;
  private controls: PlayerControls;

  constructor(container: HTMLDivElement) {
    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 2, 5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    // Lighting
    this.setupLighting();

    // Ground
    this.createGround();

    // Player
    this.player = new PlayerModel();
    this.scene.add(this.player.group);

    // Controls
    this.controls = new PlayerControls();

    // Handle window resize
    window.addEventListener('resize', this.handleResize);
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 5, 1);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  private createGround(): void {
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a472a,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  private handleResize = (): void => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  public animate = (): void => {
    requestAnimationFrame(this.animate);
    
    // Update player movement
    this.controls.update(this.player.group, this.camera);
    
    // Update camera to follow player
    this.camera.lookAt(this.player.group.position);
    
    this.renderer.render(this.scene, this.camera);
  };

  public cleanup(): void {
    this.controls.cleanup();
    window.removeEventListener('resize', this.handleResize);
    this.renderer.dispose();
  }
}
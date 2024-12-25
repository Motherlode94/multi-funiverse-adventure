import * as THREE from 'three';

export class PlayerControls {
  private keysPressed: { [key: string]: boolean } = {};
  private moveSpeed: number = 0.1;
  private jumpForce: number = 0.15;
  private gravity: number = 0.006;
  private verticalVelocity: number = 0;
  private isJumping: boolean = false;
  private mouseSensitivity: number = 0.002;
  private playerRotation: number = 0;

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    // Lock the pointer when clicking in the game
    document.addEventListener('click', () => {
      document.body.requestPointerLock();
    });
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    console.log('Key pressed:', event.key.toLowerCase());
    this.keysPressed[event.key.toLowerCase()] = true;

    // Handle jump
    if (event.code === 'Space' && !this.isJumping) {
      this.verticalVelocity = this.jumpForce;
      this.isJumping = true;
      console.log('Jump initiated');
    }
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    this.keysPressed[event.key.toLowerCase()] = false;
  };

  private handleMouseMove = (event: MouseEvent) => {
    if (document.pointerLockElement) {
      this.playerRotation -= event.movementX * this.mouseSensitivity;
      console.log('Mouse rotation:', this.playerRotation);
    }
  };

  public update(player: THREE.Group, camera: THREE.Camera): void {
    // Apply rotation from mouse movement
    player.rotation.y = this.playerRotation;

    // Calculate forward and right directions based on player rotation
    const forward = new THREE.Vector3(0, 0, -1);
    const right = new THREE.Vector3(1, 0, 0);
    forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerRotation);
    right.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerRotation);

    // Movement relative to player rotation
    if (this.keysPressed['z'] || this.keysPressed['w']) {
      player.position.add(forward.multiplyScalar(this.moveSpeed));
      camera.position.add(forward.multiplyScalar(this.moveSpeed));
      console.log('Moving forward', player.position.z);
    }
    if (this.keysPressed['s']) {
      player.position.sub(forward.multiplyScalar(this.moveSpeed));
      camera.position.sub(forward.multiplyScalar(this.moveSpeed));
      console.log('Moving backward', player.position.z);
    }
    if (this.keysPressed['q'] || this.keysPressed['a']) {
      player.position.sub(right.multiplyScalar(this.moveSpeed));
      camera.position.sub(right.multiplyScalar(this.moveSpeed));
      console.log('Moving left', player.position.x);
    }
    if (this.keysPressed['d']) {
      player.position.add(right.multiplyScalar(this.moveSpeed));
      camera.position.add(right.multiplyScalar(this.moveSpeed));
      console.log('Moving right', player.position.x);
    }

    // Apply gravity and vertical movement
    this.verticalVelocity -= this.gravity;
    player.position.y += this.verticalVelocity;
    camera.position.y += this.verticalVelocity;

    // Ground check
    if (player.position.y <= 1) {
      player.position.y = 1;
      camera.position.y = 3; // Reset camera height
      this.verticalVelocity = 0;
      this.isJumping = false;
    }
  }

  public cleanup(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    document.exitPointerLock();
  }
}
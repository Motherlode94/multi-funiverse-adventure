import * as THREE from 'three';

export class PlayerControls {
  private keysPressed: { [key: string]: boolean } = {};
  private moveSpeed: number = 0.1;

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    console.log('Key pressed:', event.key.toLowerCase());
    this.keysPressed[event.key.toLowerCase()] = true;
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    this.keysPressed[event.key.toLowerCase()] = false;
  };

  public update(player: THREE.Group, camera: THREE.Camera): void {
    if (this.keysPressed['z'] || this.keysPressed['w']) {
      player.position.z -= this.moveSpeed;
      camera.position.z -= this.moveSpeed;
      console.log('Moving forward', player.position.z);
    }
    if (this.keysPressed['s']) {
      player.position.z += this.moveSpeed;
      camera.position.z += this.moveSpeed;
      console.log('Moving backward', player.position.z);
    }
    if (this.keysPressed['q'] || this.keysPressed['a']) {
      player.position.x -= this.moveSpeed;
      camera.position.x -= this.moveSpeed;
      console.log('Moving left', player.position.x);
    }
    if (this.keysPressed['d']) {
      player.position.x += this.moveSpeed;
      camera.position.x += this.moveSpeed;
      console.log('Moving right', player.position.x);
    }
  }

  public cleanup(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}
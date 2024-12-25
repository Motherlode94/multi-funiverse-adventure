import * as THREE from 'three';

export class PlayerModel {
  public group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.createModel();
  }

  private createModel(): void {
    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b00 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    body.castShadow = true;
    this.group.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2;
    head.castShadow = true;
    this.group.add(head);

    // Arms
    const armGeometry = new THREE.CapsuleGeometry(0.15, 0.7, 4, 8);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b00 });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.7, 1.2, 0);
    leftArm.castShadow = true;
    this.group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.7, 1.2, 0);
    rightArm.castShadow = true;
    this.group.add(rightArm);

    // Legs
    const legGeometry = new THREE.CapsuleGeometry(0.2, 0.8, 4, 8);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x4444ff });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.3, 0.4, 0);
    leftLeg.castShadow = true;
    this.group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.3, 0.4, 0);
    rightLeg.castShadow = true;
    this.group.add(rightLeg);
  }
}
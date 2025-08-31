import * as THREE from 'three';
let embers;
let emberParticlesData = [];

function createEmberTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );
  gradient.addColorStop(0, 'rgba(255, 200, 0, 1)');   // Bright yellow center
  gradient.addColorStop(0.2, 'rgba(255, 100, 0, 1)'); // Orange
  gradient.addColorStop(0.8, 'rgba(255, 0, 0, 0.4)'); // Faint red glow
  gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');     // Transparent edge
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  return new THREE.CanvasTexture(canvas);
}
export function createEmbers(scene) {
  const particleCount = 50;
  const emberGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  const emberMaterial = new THREE.PointsMaterial({
    map: createEmberTexture(),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    size: 0.2,
  });
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = Math.random() * 10 - 5;
    positions[i3 + 1] = Math.random() * -10;
    positions[i3 + 2] = Math.random() * 4 - 2;

    emberParticlesData.push({
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        Math.random() * 0.5,
        0
      ),
      wobble: Math.random() * 2,
      wobbleSpeed: Math.random() * 0.01 + 0.01,
    });
  }
  emberGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  embers = new THREE.Points(emberGeometry, emberMaterial);
  scene.add(embers);
}

export function animateEmbers(delta, elapsedTime) {
  if (embers) {
    const positions = embers.geometry.attributes.position.array;
    for (let i = 0; i < emberParticlesData.length; i++) {
      const i3 = i * 3;
      const data = emberParticlesData[i];
      positions[i3 + 1] += data.velocity.y * delta * 5;
      positions[i3] += Math.sin(elapsedTime * data.wobble) * data.wobbleSpeed;
      if (positions[i3 + 1] > 6) { // if it goes above y=6
        positions[i3 + 1] = -6; // Reset to the bottom
        positions[i3] = Math.random() * 10 - 5; // Give it a new random x
      }
    }
    embers.geometry.attributes.position.needsUpdate = true;
  }
}
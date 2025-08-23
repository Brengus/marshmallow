import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
export function loadMarshmallow(scene,model){
    const mainLight = new THREE.DirectionalLight(0xFFF8E7, 3.0); // A bright, slightly warm white
    mainLight.position.set(5, 10, 7.5); // High and to the side, like a morning sun
    mainLight.castShadow = true;

    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.bias = -0.0001;
    mainLight.shadow.radius = 5; // Increase radius for extra softness

    const shadowCamSize = 10;
    mainLight.shadow.camera.left = -shadowCamSize;
    mainLight.shadow.camera.right = shadowCamSize;
    mainLight.shadow.camera.top = shadowCamSize;
    mainLight.shadow.camera.bottom = -shadowCamSize;

    scene.add(mainLight);

    const bounceLight = new THREE.HemisphereLight(
        0xFFFFFF, // Sky color (pure white)
        0xCCCCCC, // Ground color (light gray)
        0.6      // A gentle intensity
    );
    scene.add(bounceLight);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4);
    scene.add(ambientLight);

    const shadowCatcher = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.ShadowMaterial({ opacity: 0.15 })
    );
    shadowCatcher.rotation.x = -Math.PI / 2;
    shadowCatcher.position.y = -2;
    shadowCatcher.receiveShadow = true;
    scene.add(shadowCatcher);
    
}
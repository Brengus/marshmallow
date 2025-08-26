// assets/src/carousel.js

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import gsap from 'gsap';

let isAnimating = false;

// Create loaders once to be reused
const loader = new GLTFLoader();
const ktx2Loader = new KTX2Loader();


export function goToSlide(nextIndex,currentIndex,models,carouselGroup) {
    if (isAnimating || models.length === 0) return;
    isAnimating = true;

    const currentModel = models[currentIndex];
    const nextModel = models[nextIndex];

    const tl = gsap.timeline({
        onComplete: () => { 
            currentModel.visible = false;

            currentIndex = nextIndex;
            isAnimating = false;
         }
    });

    tl.to(currentModel.rotation, { z: 0.1, duration: 0.08, ease: 'power2.inOut' })
      .to(currentModel.rotation, { z: -0.1, duration: 0.08, ease: 'power2.inOut' })
      .to(currentModel.rotation, { z: 0, duration: 0.08, ease: 'power2.inOut' });

    
    const targetAngle = -currentIndex * ((Math.PI * 2) / models.length);
    tl.to(carouselGroup.rotation, {
        y: targetAngle,
        duration: 0.8,
        ease: 'power2.inOut'
    }, "-=0.2");
}

// --- NEW: Function for handling window resize ---
export function resizeCarousel() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// --- NEW: Function to clean up Three.js objects to prevent memory leaks ---
export function cleanupCarousel() {
    if (scene) {
        scene.traverse(object => {
            if (object.isMesh) {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (object.material.map) object.material.map.dispose();
                    object.material.dispose();
                }
            }
        });
    }
    ktx2Loader.dispose();
    models = [];
    currentIndex = 0;
}
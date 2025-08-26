<script setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import gsap from 'gsap';

const container = ref(null);
let scene, camera, renderer, carouselGroup, animationId;
let models = [];
let currentIndex = 0;
let isAnimating = false;
// import { goToSlide } from '~/assets/src/carousel.js';
const prevSlide = () => {
    goToSlide(-1);
};
const nextSlide = () => {
  goToSlide(1);
};

function goToSlide(direction) {
    if (isAnimating || models.length < 2) return;
    isAnimating = true;
    const currentModel = models[currentIndex];
    const nextIndex = (currentIndex + direction + models.length) % models.length;
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
      .to(currentModel.rotation, { z: 0, duration: 0.08, ease: 'power2.inOut' })
      .to(currentModel.rotation, { z: 0.1, duration: 0.08, ease: 'power2.inOut' })
      .to(currentModel.rotation, { z: -0.1, duration: 0.08, ease: 'power2.inOut' })
      .to(currentModel.rotation, { z: 0, duration: 0.08, ease: 'power2.inOut' });

    currentModel.traverse(child => {
        if (child.isMesh && child.material) {
            tl.to(child.material, {
                opacity: 0,
                duration: 0.3,
                onStart: () => { child.material.transparent = true; }
            }, "<"); // Animate all materials at the same time as the scale
        }
    });

    tl.set(nextModel, { visible: true }, "<");
    nextModel.traverse(child => {
        if (child.isMesh && child.material) {
            // Set initial state
            child.material.transparent = true;
            child.material.opacity = 0;
            // Animate to full opacity
            tl.to(child.material, {
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out'
            });
        }
    });
}

function init(){
    const loader = new GLTFLoader();
    const ktx2Loader = new KTX2Loader();
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#EAE0D5');

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3;
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.value.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 2.0);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    ktx2Loader.setTranscoderPath('/basis/');
    ktx2Loader.detectSupport(renderer);
    loader.setKTX2Loader(ktx2Loader);
    loader.setMeshoptDecoder(MeshoptDecoder);

    const modelPaths = [
        '/models/gltf/reeses_ktx2.glb', // Example paths
        '/models/gltf/mms_ktx2.glb',
    ];

    const loadPromises = modelPaths.map(path => loader.loadAsync(path));
    carouselGroup = new THREE.Group();
    scene.add(carouselGroup);

    Promise.all(loadPromises).then(gltfs => {
        gltfs.forEach((gltf, index) => {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            box.getCenter(center);
            model.position.sub(center);
            carouselGroup.add(model); 
            model.scale.set(3, 3, 3);
            model.position.set(0, 0, 0);
            model.visible = (index === 0);
            const reesesModel = model.getObjectByName('prop_reeses_pieces');
            if (reesesModel) {
                reesesModel.rotation.x += THREE.MathUtils.degToRad(90);
                model.scale.set(8,8,8);
            } else {
                console.log("This model is not the Reese's model, skipping custom rotation.");
            }
            model.lookAt(0, 0, 0);
            models.push(model);
        });
    }).catch(error => {
        console.error("Error loading carousel models:", error);
    });
}

function animate() {
  animationId = requestAnimationFrame(animate);
  if (scene && camera && renderer) {
    renderer.render(scene, camera);
  }
}

function onWindowResize() {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

onMounted(async () => {
  await nextTick();
  if (container.value) {
    init();
    animate(); // Start the animation loop
    window.addEventListener('resize', onWindowResize);
  }
});

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener('resize', onWindowResize);
  // Add cleanup for Three.js objects if this component can be destroyed
});
</script>

<template>
  <client-only>
    <div ref="container" class="modeli-container">
      <button class="carousel-button prev" @click="prevSlide">
        <img src="/left.svg" alt="Previous" style="width:100%; height:100%;"/>
      </button>
      <button class="carousel-button next" @click="nextSlide">
        <img src="/right.svg" alt="Next" style="width:100%; height:100%;"/>
      </button>
    </div>
  </client-only>
</template>

<style scoped>
:global(html), :global(body) {
  margin: 0;
  padding: 0;
  overflow-x: hidden;

}
.modeli-container {
  width: 100%;
  height: 100vh;
  background: #EAE0D5;
}

:deep(.carousel-button) {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 101;
  cursor:pointer;
  width:8rem;
  height:8rem;
  font-size: 5rem;
  text-align:center;
  font-family: "Fredoka", sans-serif;
  background-color: rgba(255, 255, 255, 0.8);
  border: 2px solid #4C3F30;
  color: #4C3F30;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

:deep(.carousel-button:hover) {
  background-color: white;
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

:deep(.carousel-button.prev) {
  left: 10%;
}

:deep(.carousel-button.next) {
  right: 10%;
}

/* Responsive styles for buttons on small screens */
@media (max-width: 768px) {
  :deep(.carousel-button) {
    padding: 0.8rem 1.2rem;
    font-size: 0.9rem;
  }
  :deep(.carousel-button.prev) {
    left: 2%;
  }
  :deep(.carousel-button.next) {
    right: 2%;
  }
}
</style>
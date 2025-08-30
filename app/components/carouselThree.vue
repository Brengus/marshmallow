<script setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from 'gsap';

const container = ref(null);
let scene, camera, renderer, carouselGroup, animationId;
let models = [];
let currentIndex = 0;
let isAnimating = false;
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
            child.material.transparent = true;
            child.material.opacity = 0;
            tl.to(child.material, {
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out'
            });
        }
    });
}

function rotateClipPaths () {
  const rotationTween = gsap.to(".element-one", {
  rotation: 360,      // Rotate a full 360 degrees
  duration: 10,       // Make one full rotation every 10 seconds
  ease: "none",       // A linear ease for a smooth, constant spin
  repeat: -1,         // Repeat indefinitely
  paused: true        // IMPORTANT: Start in a paused state
});
const rotationTween1 = gsap.to(".element-two", {
  rotation: -360,      // Rotate a full 360 degrees
  duration: 10,       // Make one full rotation every 10 seconds
  ease: "none",       // A linear ease for a smooth, constant spin
  repeat: -1,         // Repeat indefinitely
  paused: true        // IMPORTANT: Start in a paused state
});
ScrollTrigger.create({
  trigger: ".section-7",  // The trigger is your sixth section
  start: "top bottom",    // Start when the top of section 6 hits the middle of the screen
  onEnter: () => {rotationTween.play(); rotationTween1.play();},      // When it enters the viewport, play the animation
  onLeave: () => {rotationTween.pause(); rotationTween1.pause();},     // When it leaves, pause the animation
  onEnterBack: () => {rotationTween.play(); rotationTween1.play();},  // Also play when scrolling back up into view
  onLeaveBack: () => {rotationTween.pause(); rotationTween1.pause();}
});
}

function init(){
  const loader = new GLTFLoader();
  const ktx2Loader = new KTX2Loader();
  scene = new THREE.Scene();
  // scene.background = new THREE.Color('#EAE0D5');
  scene.background = null;

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
    rotateClipPaths();
  }
});
onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener('resize', onWindowResize);
});
</script>
<template>
  <client-only>
    <div class="background">
      <div class="element-one"></div>
      <div class="element-two"></div>
      <div ref="container" class="modeli-container">
        <button class="carousel-button prev" @click="prevSlide">
          <img src="/left.png" alt="Previous" style="width:50%; height:50%;"/>
        </button>
        <button class="carousel-button next" @click="nextSlide">
          <img src="/right.png" alt="Next" style="width:50%; height:50%;"/>
        </button>
      </div>
    </div>
    
  </client-only>
</template>
<style scoped>
:global(html), :global(body) {
  margin: 0;
  padding: 0;
}

body{
  overflow-x:hidden;
}

:deep(.element-one) {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  position:absolute;
  right:calc(50% - 400px);
  top:calc(50% - 400px);
  width: 800px;
  height: 800px;
  z-index:1;
  background: linear-gradient(45deg, #00467f, #a5cc82);
}
:deep(.element-two) {
  clip-path: polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%);
  position:absolute;
  right:calc(50% - 300px);
  top:calc(50% - 300px);
  width: 600px;
  height: 600px;
  z-index:2;
  background: linear-gradient(45deg, #f7971e, #ffd200);
}

.background{
  position:relative;
  width: 100%;
  height: 100vh;
  background: #EAE0D5;
  overflow:hidden;
}
.modeli-container {
  position: relative;
  z-index:3;
  width: 100%;
  height: 100vh;
  background:transparent;
  /* background: #EAE0D5; */
}
:deep(.carousel-button) {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 101;
  cursor:pointer;
  width:8rem;
  height:8rem;
  text-align:center;
  /* background-color: rgba(255, 255, 255, 0.8); */
  border-radius: 100px;
  border:none;
  cursor: pointer;
  transition: all 0.3s ease;
  /* box-shadow: 0 4px 15px rgba(0,0,0,0.1); */
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
@media (max-width: 768px) {
  :deep(.carousel-button) {
    width:4rem;
    height:4rem;
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
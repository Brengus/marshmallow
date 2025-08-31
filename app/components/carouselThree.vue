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
  scene.background = null;

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 3;
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // Transparent background
  container.value.appendChild(renderer.domElement);

  const keyLight = new THREE.DirectionalLight(0xfff8e7, 3.5); // A bright, slightly warm white
  keyLight.position.set(5, 5, 5);
  keyLight.lookAt(0, 0, 0); // Make sure it's pointing at the center
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xe7f8ff, 0.4); // A very soft, cool white
  fillLight.position.set(-5, 2, 5);
  fillLight.lookAt(0, 0, 0);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffd6b3, 1.0); // A warm, golden color
  rimLight.position.set(2, 3, -8); // Positioned behind the scene
  rimLight.lookAt(0, 0, 0);
  scene.add(rimLight);

  const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // A soft gray, not too bright
  scene.add(ambientLight);

  ktx2Loader.setTranscoderPath('/basis/');
  ktx2Loader.detectSupport(renderer);
  loader.setKTX2Loader(ktx2Loader);
  loader.setMeshoptDecoder(MeshoptDecoder);

  const modelPaths = [
    { path: '/models/gltf/reeses_ktx2.glb', scale: 8, rotation: { x: 90, y: 0, z: 0 }, nameTarget: 'prop_reeses_pieces' },
    { path: '/models/gltf/mms_ktx3.glb', scale: 2, rotation: { x: 0, y: 0, z: 0 }, nameTarget: 'M&M_bag_0' },
    { path: '/models/gltf/marshmallow1_ktx3.glb', scale: 0.05, rotation: { x: 0, y: 90, z: 0 }, nameTarget: 'Object_3' , nameTarget2: 'Object_2', position:{x:0,y:-3,z:0}},
    { path: '/models/gltf/marshmallow3_ktx2.glb', scale: 0.02, rotation: { x: 45, y: 0, z: 0 }, nameTarget: 'node-0_0' },
    { path: '/models/gltf/marshmallow4_ktx2.glb', scale: 0.5, rotation: { x: 45, y: 0, z: 0 }, nameTarget: 'smoresfbx' }
  ];

  const loadPromises = modelPaths.map(path => loader.loadAsync(path.path));
  carouselGroup = new THREE.Group();
  scene.add(carouselGroup);

  Promise.all(loadPromises).then(gltfs => {
    gltfs.forEach((gltf, index) => {
      const model = gltf.scene;
      console.log(model);
      const data = modelPaths[index];
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);
      
      const rotationTarget = data.nameTarget ? model.getObjectByName(data.nameTarget) : model;
      if(data.nameTarget2){
        model.traverse((child)=>{
          if(child.isMesh && child.name === data.nameTarget2){
            child.visible = false;
          }
        })
      }
      if (rotationTarget) {
        if(data.position){
          rotationTarget.position.set(data.position.x,data.position.y,data.position.z);
        }
        rotationTarget.rotation.x += THREE.MathUtils.degToRad(data.rotation.x);
        rotationTarget.rotation.y += THREE.MathUtils.degToRad(data.rotation.y);
        rotationTarget.rotation.z += THREE.MathUtils.degToRad(data.rotation.z);
      }
      carouselGroup.add(model); 
      model.scale.set(data.scale, data.scale, data.scale);
      model.position.set(0, 0, 0);
      model.visible = (index === 0);
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
<script setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from 'gsap';
const container = ref(null);
let scene, camera, renderer, carouselGroup, animationId;
const models = ref([]);
const currentIndex = ref(0);
const isAnimating = ref(false);
const prevSlide = () => goToSlide(-1);
const nextSlide = () => goToSlide(1);
const goToSlide = (direction) => {
  if (isAnimating.value || models.value.length < 2) return;
  isAnimating.value = true;
  const currentModel = models.value[currentIndex.value];
  const nextIndex = (currentIndex.value + direction + models.value.length) % models.value.length;
  const nextModel = models.value[nextIndex];
  const tl = gsap.timeline({
    onComplete: () => {
      currentModel.visible = false;
      currentIndex.value = nextIndex;
      isAnimating.value = false;
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
      tl.to(child.material, {opacity: 0, duration: 0.3, onStart: () => { child.material.transparent = true; }}, "<");
    }
  });

  tl.set(nextModel, { visible: true }, "<");
  nextModel.traverse(child => {
      if (child.isMesh && child.material) {
        child.material.transparent = true;
        child.material.opacity = 0;
        tl.to(child.material, { opacity: 1, duration: 0.4, ease: 'power2.out'});
      }
  });
}
const rotateClipPaths = () => {
  const rotationTween = gsap.to(".element-one", {rotation: 360, duration: 10,ease: "none",repeat: -1,paused: true});
  const rotationTween1 = gsap.to(".element-two", {rotation: -360,duration: 10,ease: "none", repeat: -1, paused: true});
  ScrollTrigger.create({
    trigger: ".section-7",
    start: "top bottom",
    onEnter: () => {rotationTween.play(); rotationTween1.play();},
    onLeave: () => {rotationTween.pause(); rotationTween1.pause();},
    onEnterBack: () => {rotationTween.play(); rotationTween1.play();},
    onLeaveBack: () => {rotationTween.pause(); rotationTween1.pause();}
  });
}

const init = () => {
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
      models.value.push(model);
    });
  }).catch(error => {
    console.error("Error loading carousel models:", error);
  });
}
const animate = () => {
  animationId = requestAnimationFrame(animate);
  if (scene && camera && renderer) {
    renderer.render(scene, camera);
  }
}
const onWindowResize = () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
onMounted(() => {
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
    <div class="background">
      <div class="element-one"></div>
      <div class="element-two"></div>
      <div ref="container" class="modeli-container">
        <button class="carousel-button prev" @click="prevSlide">
          <svg class="arrow-icon" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button class="carousel-button next" @click="nextSlide">
          <svg class="arrow-icon" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
</template>
<style scoped>
:global(html), :global(body) {
  margin: 0;
  padding: 0;
}
body{
  overflow-x:hidden;
}
.element-one, .element-two {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.element-one {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  width: 800px;
  height: 800px;
  z-index: 1;
  background: linear-gradient(45deg, #00467f, #a5cc82);
}
.element-two {
  clip-path: polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%);
  width: 600px;
  height: 600px;
  z-index: 2;
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
}
:deep(.carousel-button) {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 101;
  width: 5rem;  /* 80px on standard screens */
  height: 5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* For Safari */
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); /* Smooth transition */
  animation: breathe 4s ease-in-out infinite;
}
:deep(.carousel-button:hover) {
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.15);
  animation-play-state: paused; /* Pause the breathing on hover */
}
:deep(.carousel-button.prev) {
  left: 10%;
}
:deep(.carousel-button.next) {
  right: 10%;
}
.arrow-icon {
  width: 40%;
  height: 40%;
  stroke: rgba(0, 0, 0, 0.7); /* Icon color */
  stroke-width: 2.5px;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: all 0.3s ease;
}
.carousel-button:hover .arrow-icon {
  stroke: rgba(0, 0, 0, 0.9);
  transform: scale(1.1); /* Make the icon slightly bigger */
}
.carousel-button:active {
  transform: translateY(-50%) scale(1.0); /* Scale back down for a "push" effect */
  background: rgba(255, 255, 255, 0.5);
  transition-duration: 0.1s;
}
@keyframes breathe {
  0%, 100% {
    transform: translateY(-50%) scale(1.0);
  }
  50% {
    transform: translateY(-50%) scale(1.03);
  }
}
@media (max-width: 768px) {
  .element-one { width: 90vw; height: 90vw; }
  .element-two { width: 70vw; height: 70vw; }
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
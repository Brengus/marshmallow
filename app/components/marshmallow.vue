<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {createEmbers, animateEmbers} from '@/assets/src/createEmbers.js';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { setupTextAnimations } from '@/assets/src/textAnimations.js';
import { setupScrollAnimations } from '@/assets/src/scrollAnimations.js';
import { loadMarshmallow } from '@/assets/src/loadMarshmallow.js';
const modelContainer = ref(null);
let scene, camera, renderer, model, animationId;
const clock = new THREE.Clock();

function initThree() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  camera.position.y = 1;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // Transparent background
  modelContainer.value.appendChild(renderer.domElement);
  createEmbers(scene);
  const loader = new GLTFLoader();
  const ktx2Loader = new KTX2Loader();
  ktx2Loader.setTranscoderPath('/basis/');
  ktx2Loader.detectSupport(renderer);
  loader.setKTX2Loader(ktx2Loader);
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load("/models/gltf/marshmallow_ktx3.glb", (gltf) => {
    model = gltf.scene;

    model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
    });
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);
    model.position.sub(center); // Center the model
    model.position.set(0, 0, 0);
    model.scale.set(0.5, 0.5, 0.5);

    scene.add(model);
    setupScrollAnimations(model);
    setupTextAnimations();
    ScrollTrigger.refresh();
  }, undefined, (error) => {
    console.error("An error happened while loading the model:", error);
  });
  loadMarshmallow(scene,model);  
}

function animate() {
  animationId = requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();
  if(model){
    const levitationAmplitude = 0.1;
    const levitationSpeed = 1.5;
    model.position.y = Math.sin(elapsedTime * levitationSpeed) * levitationAmplitude; // Levitate up and down
  }
    animateEmbers(delta,elapsedTime);
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

onMounted(async () => {
  await nextTick();
  if (modelContainer.value) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(SplitText);
    initThree();
    animate();
    window.addEventListener('resize', onWindowResize);
  }
});

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId);
  window.removeEventListener('resize', onWindowResize);
  ScrollTrigger.getAll().forEach(t => t.kill());
});
</script>
  <template>
    <client-only>
      <div ref="modelContainer" class="model-container"></div>
      <main class="scroll-content">
          <section class="content-section-title">
              <h2>MarshMalloW</h2>
          </section>
          <section class="content-section section-1">
              <div class="content one">
                  <h2>A Treat for Royalty</h2>
                  <span class="span1">The history of marshmallows dates back to ancient Egypt around 2000 B.C. The treat was made by extracting sap from the mallow plant and mixing it with honey and nuts.</span>
              </div>
          </section>
          <section class="content-section section-2">
              <div class="content one">
                  <h2>From Marsh Plant to Modern Sweet</h2>
                  <span class="span2">The name "marshmallow" comes from the mallow plant (Althaea officinalis), which grows wild in marshes. Originally, the key ingredient was the sap from this plant's root.</span>
              </div>
          </section>
          <section class="content-section section-3">
              <div class="content one">
                  <h2>A French Makeover</h2>
                  <span class="span3">In the 1800s, French confectioners began whipping the mallow root sap with sugar and egg whites to create a fluffy, molded candy called Pâte de Guimauve.</span>
              </div>
          </section>
          <section class="content-section section-4">
              <div class="content two">
                  <h2>An American Invention</h2>
                  <span class="span4">The mass production of marshmallows was revolutionized in 1948 by an American, Alex Doumak. He invented and patented the extrusion process, where the marshmallow mixture is pushed through tubes, cut into pieces, cooled, and packaged.</span>
              </div>
          </section>
          <section class="content-section section-5">
              <div class="content one">
                  <h2>Mostly Air</h2>
                  <span class="span5">Marshmallows are a type of foam, consisting of about 50% air. The four main ingredients are sugar, water, air, and a whipping agent like gelatin.</span>
              </div>
          </section>
          <section class="content-section section-6">
              <div class="content two">
                  <h2>The "S'more" Story</h2>
                  <span class="span6">The first documented recipe for a s'more appeared in the 1927 Girl Scout handbook. The name is believed to be a contraction of the phrase "some more." More than half of all marshmallows sold during the summer are toasted over a fire, often to make this iconic campfire treat.</span>
              </div>
          </section>
      </main>
    </client-only>
  </template>
<style >

.model-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 11;
  pointer-events: none; 
}
.scroll-content {
  position: relative;
  z-index: 10;
}
.content-section {
  position:relative;
  height: 100vh; 
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: "Fredoka", sans-serif;
  text-align: center;
}
.content {
  position:relative;
  display:flex;
  z-index:12;
  flex-direction:column;
}
.word, .line, .char{
  outline: 2px dashed rgba(255,255,255,0.7);
  border-radius:15px;
}
.one{
  left:-20%;
  width:40%;
}
.two{
  right:-20%;
  width:30%;
}
.content span {
  font-size:2rem;
  font-weight:medium;
  text-shadow:2px 2px 8px rgba(0,0,0,0.5);
}
.full-width-height{
  width:100%;
  height:100%;
  font-size:9rem;
}
.content-section-title {
  height: 130px; 
  width: 100%;
  position:absolute;
  background:transparent;
  display: flex;
  justify-content: center;
  flex-direction:column;
  font-family: 'Bitcount Grid Single', sans-serif;
  align-items: center;
  z-index:1000;
  color: #ffd200;
  text-align: center;
  font-size:5rem;
}
.content-section h2 {
  font-size: 4rem;
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.section-1 {background: linear-gradient(45deg, #1d2b64, #f8cdda); /* Deep Blue to Pink */}
.section-2 {background: linear-gradient(45deg, #134e5e, #71f5de); /* Teal to Mint */}
.section-3 {background: linear-gradient(45deg, #ff9a9e, #fad0c4); /* Coral to Peach */}
.section-4 {background: linear-gradient(45deg, #6a3093, #a044ff); /* Deep Purple to Lavender */}
.section-5 {background: linear-gradient(45deg, #f7971e, #ffd200); /* Orange to Gold */}
.section-6 {background: linear-gradient(45deg, #00467f, #a5cc82); /* Ocean Blue to Sage Green */}

.section-1 h2 {color: #FCEFF9; }
.section-1 span {color: rgba(240, 240, 255, 0.9);}

.section-2 h2 {color: #F0FFFDE6;}
.section-2 span {color: rgba(240, 255, 253, 0.85);}

.section-3 h2 {color: #5D2E2E; }
.section-3 span {color: #784A4A; }

.section-4 h2 {color: #F3E8FF;}
.section-4 span {color: rgba(235, 225, 255, 0.9);}

.section-5 h2 {color: #4C3F30; }
.section-5 span { color: #6F5B45;}

.section-6 h2 {color: #E8F5E9;}
.section-6 span {color: rgba(240, 255, 245, 0.9);}
@media (max-width: 768px) {
  /* Center the content blocks and give them more width */
  .one,
  .two {
    left: auto; /* Remove the horizontal positioning */
    right: auto;
    width:100%; /* Take up most of the screen width */
  }

  .content-section-title {
    font-size: 2rem; /* Make the main title smaller */
    padding: 15px 0;
  }
  
  .content-section h2 {
    font-size: 2.5rem; /* Reduce section titles */
  }
  
  .content span {
    font-size: 1.1rem; /* Make the body text much more readable */
    line-height: 1.6; /* Increase line height for small text */
  }
}
</style>
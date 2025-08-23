

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

const modelContainer = ref(null);
let scene, camera, renderer, model, animationId;
const clock = new THREE.Clock();
let embers;
let emberParticlesData = [];

function initThree() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  camera.position.y = 1;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // Transparent background
  modelContainer.value.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const loader = new GLTFLoader();
  loader.load("/models/gltf/marshmallow.glb", (gltf) => {
    model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);
    model.position.sub(center); // Center the model
    model.position.set(0, 0, 0);
    model.scale.set(0.5, 0.5, 0.5);

    scene.add(model);
    setupScrollAnimations();
    setupTextAnimations();
    SplitText.refresh();
    ScrollTrigger.refresh();
  }, undefined, (error) => {
    console.error("An error happened while loading the model:", error);
  });
  createEmbers();
  animate();
}

function createEmberTexture(){
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

function createEmbers() {
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
function setupScrollAnimations() {
  if (!model) return;
    
  gsap.to(model.position, {
    x: 3,
    y: 2,
    scrollTrigger: {
      trigger: ".section-1",
      start: "top bottom", 
      end: "bottom top", 
      scrub: 1, 
    }
  });

  gsap.to(model.rotation, {
    y: Math.PI * 2, 
    scrollTrigger: {
      trigger: ".section-2",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    }
  });

  gsap.to(model.position, {
    scrollTrigger: {
      trigger: ".section-3",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    }
  });
    gsap.to(model.position, {
    x: -1.5,
    y: 10.5,
    scrollTrigger: {
      trigger: ".section-4",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    }
  });
  gsap.to(model.scale, {
    x: 1,
    y: 1,
    scrollTrigger: {
      trigger: ".section-4",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    }
  });

    gsap.to(model.position, {
    x: 3, 
    scrollTrigger: {
      trigger: ".section-5",
      start: "top center",
      end: "bottom top",
      scrub: 1,
    }
  });
  gsap.to(model.rotation, {
      y: Math.PI * 4, 
      scrollTrigger: {
      trigger: ".section-5",
      start: "top center",
      end: "bottom top",
      scrub: 1,
      }
  });

  gsap.to(model.rotation, {
      z: Math.PI * 4, 
      y: Math.PI * 4, 
      ease: "power1.inOut",
      scrollTrigger: {
      trigger: ".section-6",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      }
  });
  gsap.to(model.position, {
      x: -3,
      y: 0,
      scrollTrigger: {
      trigger: ".section-6",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      }
  });
  gsap.to(model.scale, {
      x: 0.5,
      y: 0.5,
      scrollTrigger: {
      trigger: ".section-6",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      }
  });

}

function setupTextAnimations(){
    let span1 = new SplitText(".span1", { type: "words" });
    let span2 = new SplitText(".span2", { type: "words" });
    let span3 = new SplitText(".span3", { type: "words" });
    let span4 = new SplitText(".span4", { type: "words" });
    let span5 = new SplitText(".span5", { type: "words" });
    let span6 = new SplitText(".span6", { type: "words" });

    gsap.from(span1.words, {
        y:100,
        autoAlpha:0,
        stagger: 0.05
    });

    // You can now create similar animations for the other spans
    gsap.from(span2.words, {
        scrollTrigger:{
            trigger: ".section-2",
            start: "top center",
            end: "top top",
            scrub:1,
        },
        y:100,
        autoAlpha:0,
        stagger: 0.05
    });
    // ... and so on for span3, span4, etc.
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

<style scoped>
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
    font-family: 'Arial', sans-serif;
    text-align: center;
}

.content{
    position:relative;
    display:flex;
    flex-direction:column;
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
    font-weight:bold;
    text-shadow:2px 2px 8px rgba(0,0,0,0.5);
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

.section-1 {
  background: linear-gradient(45deg, #1d2b64, #f8cdda); /* Deep Blue to Pink */
}
.section-2 {
  background: linear-gradient(45deg, #134e5e, #71f5de); /* Teal to Mint */
}
.section-3 {
  background: linear-gradient(45deg, #ff9a9e, #fad0c4); /* Coral to Peach */
}
.section-4 {
  background: linear-gradient(45deg, #6a3093, #a044ff); /* Deep Purple to Lavender */
}
.section-5 {
  background: linear-gradient(45deg, #f7971e, #ffd200); /* Orange to Gold */
}
.section-6 {
  background: linear-gradient(45deg, #00467f, #a5cc82); /* Ocean Blue to Sage Green */
}
</style>
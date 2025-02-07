import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { gsap } from 'gsap';

class SceneManager {
  constructor() {
    this.canvas = document.querySelector('.webgl');
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2();
    this.shapes = [];
    this.composer = null;

    this.init();
  }

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupLights();
    this.setupPostProcessing();
    this.createHiddenShapes();
    this.setupEventListeners();
    this.animate();
  }

  setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  setupCamera() {
    this.camera.position.set(0, 0, 5);
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 3, 1);
    this.scene.add(directionalLight);
  }

  setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.2,
      0.4,
      0.7
    );
    this.composer.addPass(bloomPass);
  }

  createHiddenShapes() {
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.05,
      metalness: 0.6,
      roughness: 0.4
    });

    for (let i = 0; i < 15; i++) {
      // Clone the material so each shape can have its own opacity
      const shape = new THREE.Mesh(geometry, material.clone());
      shape.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      shape.scale.setScalar(0.6 + Math.random());
      this.scene.add(shape);
      this.shapes.push(shape);
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Dynamic movement and reveal effect
    this.shapes.forEach((shape, index) => {
      const dist = Math.hypot(
        shape.position.x - this.mouse.x * 5,
        shape.position.y - this.mouse.y * 5
      );
      const opacity = Math.max(0.2, 1 - dist * 0.2);

      gsap.to(shape.material, {
        opacity: opacity,
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.to(shape.position, {
        x: shape.position.x + (Math.random() - 0.5) * 0.1,
        y: shape.position.y + (Math.random() - 0.5) * 0.1,
        z: shape.position.z + (Math.random() - 0.5) * 0.1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  }

  animate() {
    const time = this.clock.getElapsedTime();

    // Animate shapes with subtle rotation
    this.shapes.forEach((shape) => {
      shape.rotation.x = time * 0.2;
      shape.rotation.y = time * 0.3;
    });

    this.composer.render();
    requestAnimationFrame(this.animate.bind(this));
  }
}

// Initialize scene
const sceneManager = new SceneManager();

// Button routing functions with fade-out effect
// ... existing code ...

// Button routing functions with fade-out effect
function launchAI() {
    gsap.to('.content-wrapper', {
      opacity: 0,
      duration: 0.5,
      onComplete: () => (window.location.href = '../Frontend/GradonixAI/main.html')
    });
  }
  
  function openLibrary() {
    gsap.to('.content-wrapper', {
      opacity: 0,
      duration: 0.5,
      onComplete: () => (window.location.href = '../Frontend/Books/page.html')
    });
  }
  
  // Expose functions to the global scope
  window.launchAI = launchAI;
  window.openLibrary = openLibrary;
  
  // Ripple effect for buttons
  const buttons = document.querySelectorAll('.cta-button');
  buttons.forEach((button) => {
    button.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      circle.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
      circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });
  
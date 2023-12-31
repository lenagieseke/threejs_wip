import * as THREE from 'three';
// We want to use the "OrbitCamera" Addon provided by Three.JS
// So we import it from the folder and give the imported object (the addon) a name: "OrbitControls"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// SCENE
const scene = new THREE.Scene();
// A fog is implemented to give distance to the scene and smoothly transition from the bottom plane to the background color
scene.background = new THREE.Color('#a6a6a6');
scene.fog = new THREE.FogExp2(scene.background, 0.02);

// CAMERA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// RENDERER
const canvas = document.querySelector("#canvasThree");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// We want light to cast a shadow, so we have to enable a shadowMap with certain properties in the render pipeline
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

// make sure the scene adjusts to the browser window size
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// CONTROLS FOR NAVIGATION
// Here the camera is given OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// LIGHTING
// AMBIENT
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// POINT LIGHT
const pointLight = new THREE.PointLight(0xc9efff, 25);
pointLight.position.set(0, 4, 2);
// Enabling shadows for the pointlight
// Max and Min Distances are needed for the renderer
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 1;
pointLight.shadow.camera.far = 600;
// The radius is the "smoothness" of the light's shadow
pointLight.shadow.radius = 10;
scene.add(pointLight);

const sphereSize = 1;
// A pointLightHelper draws a bounding box around the light to show us its position in the scene
const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
scene.add(pointLightHelper);

// GEOMETRY
// PLANE
const planeGeometry = new THREE.PlaneGeometry(300, 300);
const planeMaterial = new THREE.MeshPhongMaterial({ color: '#9c9595' });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -Math.PI / 2;
planeMesh.position.y = -10;
// Enable shadows on the plane
planeMesh.receiveShadow = true;
scene.add(planeMesh);

// ICOSAHEDRON
const geometry = new THREE.IcosahedronGeometry(1.5, 0); //radius, detail
const material = new THREE.MeshPhongMaterial({ color: 0xaa5e82, shininess: 0.5 });
const icosa = new THREE.Mesh(geometry, material);
// Make the icosa cast shadows
icosa.castShadow = true;
scene.add(icosa);

// ICOSAHEDRON 2
const icosaGeometry_2 = new THREE.IcosahedronGeometry(2.0, 0); //radius, detail
const material_2 = new THREE.MeshPhongMaterial({ color: 0x2d2d2d, wireframe: true });
const icosa_2 = new THREE.Mesh(icosaGeometry_2, material_2);
scene.add(icosa_2);

// CUBECIRCLE
const nCubes = 6;
const radius = 10;
const cubeSize = 5;
let angle = 0;
const step = (2*Math.PI) / nCubes;
for(let i = 0; i < nCubes; i++){
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = -10;
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x5e82aa  });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // Make the cube cast shadows
    cube.receiveShadow = true;
    // Enable shadows on the cube
    cube.castShadow = true;
    cube.position.set(x,y,z);
    cube.lookAt(0,0,0);
    scene.add(cube);
    angle += step;
}

// ANIMATE/RENDER like draw() in p5
function animate() {
    requestAnimationFrame(animate);

    // Offset the elements over time

    icosa.rotation.x += 0.004;
    icosa.rotation.y += 0.007;
    icosa_2.rotation.x += 0.008;
    icosa_2.rotation.z += 0.005;


    const t = Date.now() / 3000;
    // move light in circle around center
    // change light height with sine curve
    const r = 3.0;
    const lx = r * Math.cos(t);
    const lz = r * Math.sin(t);
    const ly = pointLight.position.y; //2 + 2 * Math.sin(t / 3.0);
    pointLight.position.set(lx, ly, lz);

    renderer.render(scene, camera);
}

animate();

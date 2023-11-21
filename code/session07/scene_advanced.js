/* TODOs:
- Make it work with the online library links
- Take out the gui
- Take out the animation
*/

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// SCENE
let scene = new THREE.Scene();
scene.background = new THREE.Color('#a6a6a6');
scene.fog = new THREE.FogExp2(scene.background, 0.02);

// CAMERA
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// RENDERER
const canvas = document.querySelector("#canvasThree");
let renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
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
let controls = new OrbitControls(camera, renderer.domElement);

// LIGHTING
// AMBIENT
let ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// POINT LIGHT
let pointLight = new THREE.PointLight(0xc9efff, 25);
pointLight.position.set(0, 4, 2);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 1;
pointLight.shadow.camera.far = 600;
pointLight.shadow.radius = 10;
scene.add(pointLight);

const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
scene.add(pointLightHelper);

// GEOMETRY
// PLANE
let planeGeometry = new THREE.PlaneGeometry(300, 300);
let planeMaterial = new THREE.MeshPhongMaterial({ color: '#9c9595', depthWrite: false });
let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -Math.PI / 2;
planeMesh.position.y = -10;
planeMesh.receiveShadow = true;
scene.add(planeMesh);

// ICOSAHEDRON
let geometry = new THREE.IcosahedronGeometry(1.5, 0); //radius, detail
let material = new THREE.MeshPhongMaterial({ color: 0xaa5e82, shininess: 0.5 });
let icosa = new THREE.Mesh(geometry, material);
icosa.castShadow = true;
scene.add(icosa);

// ICOSAHEDRON 2
let icosaGeometry_2 = new THREE.IcosahedronGeometry(2.0, 0); //radius, detail
let material_2 = new THREE.MeshPhongMaterial({ color: 0x2d2d2d, wireframe: true });
let icosa_2 = new THREE.Mesh(icosaGeometry_2, material_2);
scene.add(icosa_2);


// ANIMATE/RENDER like draw() in p5
function animate() {
    requestAnimationFrame(animate);

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

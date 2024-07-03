import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from './FirstPersonControls';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 10); 

const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(boxGeometry, boxMaterial);
cube.position.set(0, 5, 0);
scene.add(cube);

const controls = new FirstPersonControls(camera, renderer.domElement);
controls.translation_.y = 3.5;
controls.translation_.z = 10;
controls.update();

function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}


renderer.setAnimationLoop(() => {
    animate();
    controls.update();
    renderer.render(scene, camera);
});

const size = 5000;
const divisions = 100;
const planeGeometry = new THREE.PlaneGeometry(size, size);
const planeMaterial = new THREE.MeshBasicMaterial({ map: createCheckerboardTexture(divisions), side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;  // Rotate the plane to be horizontal
scene.add(plane);

function createCheckerboardTexture(divisions) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const size = 1024;

    canvas.width = size;
    canvas.height = size;

    const colors = ['#ffffff', '#000000'];
    const tileSize = size / divisions;

    for (let y = 0; y < divisions; y++) {
        for (let x = 0; x < divisions; x++) {
            context.fillStyle = colors[(x + y) % 2];
            context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(size / divisions, size / divisions);

    return texture;
}

import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import * as THREE from 'three';

const viewer = new GaussianSplats3D.DropInViewer({
    'sharedMemoryForWorkers': false, //todo: this should be configurable
    'gpuAcceleratedSort': true
});




const quat = new THREE.Quaternion();
// rotate the scene 90 degrees around the x-axis
quat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(150));

viewer.addSplatScenes([{
        'path': 'garden.ksplat',
        'rotation': quat.toArray(),
        'scale': [1.5, 1.5, 1.5],
        'position': [0, 5, 0],
        'splatAlphaRemovalThreshold': 5
    }
], true);
scene.add(viewer);
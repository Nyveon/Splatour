import * as THREE from 'three';
import { FirstPersonControls } from './FirstPersonControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

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
cube.position.set(-10, 5, -10);
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
    stats.begin();
    animate();
    controls.update();
    renderer.render(scene, camera);
    stats.end();
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
// flip y
quat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(180));

const quat2 = new THREE.Quaternion();
// flip y
quat2.setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(180));
//fllip x
quat2.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(180)));

viewer.addSplatScenes([{
        'path': 'Khachkar_2924.ply',
        'rotation': quat.toArray(),
        'scale': [10, 10, 10],
        'position': [0, 3.5, 0],
        'splatAlphaRemovalThreshold': 5
    },
    {
        'path': 'Khachkar_2925.ply',
        'rotation': quat2.toArray(),
        'scale': [10, 10, 10],
        'position': [10, 4, 0],
        'splatAlphaRemovalThreshold': 5
    },
    {
        'path': 'Khachkar_2923.ply',
        'rotation': quat2.toArray(),
        'scale': [10, 10, 10],
        'position': [-10, 3.5, 0],
        'splatAlphaRemovalThreshold': 5
    },
], true);
scene.add(viewer);

document.addEventListener('keydown', (event) => {
    if (event.key === 'v') {
        viewer.visible = !viewer.visible;
    }
});

const infoBox = document.getElementById('infoBox');

document.addEventListener('keydown', (event) => {
    if (event.key === 'x') {
        infoBox.style.display = infoBox.style.display === 'none' ? 'block' : 'none';
    }
});

const sky = new Sky();
sky.scale.setScalar( 450000 );
scene.add( sky );
sun = new THREE.Vector3();

const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 180,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
};

const uniforms = sky.material.uniforms;
uniforms[ 'turbidity' ].value = effectController.turbidity;
uniforms[ 'rayleigh' ].value = effectController.rayleigh;
uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
const theta = THREE.MathUtils.degToRad( effectController.azimuth );

sun.setFromSphericalCoords( 1, phi, theta );

uniforms[ 'sunPosition' ].value.copy( sun );

renderer.toneMappingExposure = effectController.exposure;




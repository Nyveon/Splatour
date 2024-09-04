import * as THREE from 'three';
import FirstPersonController from './FirstPersonController.js';
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

const controls = new FirstPersonController(camera, renderer.domElement);
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
    // 'gpuAcceleratedSort': true 
});




const quat = new THREE.Quaternion();
// flip y
quat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(180));

const quat2 = new THREE.Quaternion();
// flip y
quat2.setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(180));
//fllip x
quat2.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(180)));

viewer.addSplatScenes([
    // {
    //     'path': 'Khachkar_2924.ply',
    //     'rotation': quat.toArray(),
    //     'scale': [10, 10, 10],
    //     'position': [0, 3.5, 0],
    //     'splatAlphaRemovalThreshold': 5
    // },
    {
        'path': 'LivingRoom.ply',
        'scale': [10, 10, 10],
        'position': [0, 0, 0],
        'splatAlphaRemovalThreshold': 5
    },
    // {
    //     'path': 'Khachkar_2923.ply',
    //     'rotation': quat2.toArray(),
    //     'scale': [10, 10, 10],
    //     'position': [-10, 3.5, 0],
    //     'splatAlphaRemovalThreshold': 5
    // },
], true);
scene.add(viewer);


// viewer preset:


//Rotation (degrees):
// X: 168.00, Y: 0.00, Z: 352.00

// Translation:
// X: 0.00, Y: 3.00, Z: 0.00

viewer.rotation.set(THREE.MathUtils.degToRad(168), 0, THREE.MathUtils.degToRad(352));
viewer.position.set(0, 3, 0);


function updateSplatRotation(splat, axis, angleDegrees) {
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(axis, THREE.MathUtils.degToRad(angleDegrees));
    splat.rotation.copy(quaternion);
    splat.updateMatrix(); // Make sure the matrix is updated with the new rotation
}


document.addEventListener('keydown', (event) => {
    if (event.key === 'v') {
        viewer.visible = !viewer.visible;
    } else if (event.key === 'r') {
        console.log(viewer)
        const axis = new THREE.Vector3(0, 1, 0);  // Rotate around Y-axis
        const angle = THREE.MathUtils.degToRad(45);  // Rotate by 45 degrees
        
        // Create a quaternion for the rotation
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(axis, angle);

        // Apply the quaternion to the viewer's rotation
        viewer.quaternion.multiplyQuaternions(quaternion, viewer.quaternion);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('rotationModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const exportBtn = document.getElementById('exportBtn');
    
    // Rotation sliders
    const xRotationSlider = document.getElementById('xRotation');
    const yRotationSlider = document.getElementById('yRotation');
    const zRotationSlider = document.getElementById('zRotation');

    // Translation sliders
    const xTranslationSlider = document.getElementById('xTranslation');
    const yTranslationSlider = document.getElementById('yTranslation');
    const zTranslationSlider = document.getElementById('zTranslation');

    // Display area for current transform values
    const transformValuesDisplay = document.getElementById('transformValues');

    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        updateTransformDisplay(); // Display current values when opening
    });

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Update viewer rotation and translation based on slider values
    function updateViewerTransform() {
        // Rotation values
        const xRotation = THREE.MathUtils.degToRad(xRotationSlider.value);
        const yRotation = THREE.MathUtils.degToRad(yRotationSlider.value);
        const zRotation = THREE.MathUtils.degToRad(zRotationSlider.value);

        // Translation values
        const xTranslation = parseFloat(xTranslationSlider.value);
        const yTranslation = parseFloat(yTranslationSlider.value);
        const zTranslation = parseFloat(zTranslationSlider.value);

        // Update viewer rotation
        viewer.rotation.set(xRotation, yRotation, zRotation);

        // Update viewer translation (position)
        viewer.position.set(xTranslation, yTranslation, zTranslation);

        // Update the display
        updateTransformDisplay();
    }

    // Function to update the displayed transform values
    function updateTransformDisplay() {
        const rotation = {
            x: THREE.MathUtils.radToDeg(viewer.rotation.x).toFixed(2),
            y: THREE.MathUtils.radToDeg(viewer.rotation.y).toFixed(2),
            z: THREE.MathUtils.radToDeg(viewer.rotation.z).toFixed(2),
        };
        const translation = {
            x: viewer.position.x.toFixed(2),
            y: viewer.position.y.toFixed(2),
            z: viewer.position.z.toFixed(2),
        };
        
        transformValuesDisplay.textContent = `Rotation (degrees):\nX: ${rotation.x}, Y: ${rotation.y}, Z: ${rotation.z}\n\n` +
                                             `Translation:\nX: ${translation.x}, Y: ${translation.y}, Z: ${translation.z}`;
    }

    // Function to export the current transform values as JSON
    function exportTransform() {
        const transformData = {
            rotation: {
                x: viewer.rotation.x,
                y: viewer.rotation.y,
                z: viewer.rotation.z,
            },
            translation: {
                x: viewer.position.x,
                y: viewer.position.y,
                z: viewer.position.z,
            }
        };
        const jsonString = JSON.stringify(transformData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transform.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Add event listeners to rotation sliders
    xRotationSlider.addEventListener('input', updateViewerTransform);
    yRotationSlider.addEventListener('input', updateViewerTransform);
    zRotationSlider.addEventListener('input', updateViewerTransform);

    // Add event listeners to translation sliders
    xTranslationSlider.addEventListener('input', updateViewerTransform);
    yTranslationSlider.addEventListener('input', updateViewerTransform);
    zTranslationSlider.addEventListener('input', updateViewerTransform);

    // Add event listener to export button
    exportBtn.addEventListener('click', exportTransform);
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




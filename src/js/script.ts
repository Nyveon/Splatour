import * as THREE from 'three';
import FirstPersonController from './FirstPersonController.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import GS3dScene from './GS3dScene.ts'; 
import { Sky } from 'three/examples/jsm/objects/Sky.js';

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(0, 2, 10); 

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
    const canvas = document.createElement('canvas')!;
    const context = canvas.getContext('2d')!;
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

const gs = new GS3dScene('LivingRoom.ply');
gs.setScale(10, 10, 10);
gs.setPosition(0, 3, 0);
gs.setRotationDegrees(168, 0, 352);
gs.addToScene(scene);


function updateSplatRotation(splat, axis, angleDegrees) {
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(axis, THREE.MathUtils.degToRad(angleDegrees));
    splat.rotation.copy(quaternion);
    splat.updateMatrix(); // Make sure the matrix is updated with the new rotation
}


document.addEventListener('keydown', (event) => {
    if (event.key === 'v') {
        gs.viewer.visible = !gs.viewer.visible;
    } else if (event.key === 'r') {
        console.log(gs.viewer)
        const axis = new THREE.Vector3(0, 1, 0);  // Rotate around Y-axis
        const angle = THREE.MathUtils.degToRad(45);  // Rotate by 45 degrees
        
        // Create a quaternion for the rotation
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(axis, angle);

        // Apply the quaternion to the viewer's rotation
        gs.viewer.quaternion.multiplyQuaternions(quaternion, gs.viewer.quaternion);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('rotationModal')!;
    const openModalBtn = document.getElementById('openModalBtn')!;
    const closeModalBtn = document.getElementById('closeModalBtn')!;
    const exportBtn = document.getElementById('exportBtn')!;
    
    // Rotation sliders
    // const xRotationSlider = document.getElementById('xRotation')!;
    const xRotationSlider = document.getElementById('xRotation') as HTMLInputElement;
    const yRotationSlider = document.getElementById('yRotation') as HTMLInputElement;
    const zRotationSlider = document.getElementById('zRotation') as HTMLInputElement;

    // Translation sliders
    const xTranslationSlider = document.getElementById('xTranslation') as HTMLInputElement;
    const yTranslationSlider = document.getElementById('yTranslation') as HTMLInputElement;
    const zTranslationSlider = document.getElementById('zTranslation') as HTMLInputElement;

    // Display area for current transform values
    const transformValuesDisplay = document.getElementById('transformValues')!;

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
        const xRotation = THREE.MathUtils.degToRad(parseInt(xRotationSlider.value));
        const yRotation = THREE.MathUtils.degToRad(parseInt(yRotationSlider.value));
        const zRotation = THREE.MathUtils.degToRad(parseInt(zRotationSlider.value));

        // Translation values
        const xTranslation = parseFloat(xTranslationSlider.value);
        const yTranslation = parseFloat(yTranslationSlider.value);
        const zTranslation = parseFloat(zTranslationSlider.value);

        // Update viewer rotation
        gs.viewer.rotation.set(xRotation, yRotation, zRotation);

        // Update viewer translation (position)
        gs.viewer.position.set(xTranslation, yTranslation, zTranslation);

        // Update the display
        updateTransformDisplay();
    }

    // Function to update the displayed transform values
    function updateTransformDisplay() {
        const rotation = {
            x: THREE.MathUtils.radToDeg(gs.viewer.rotation.x).toFixed(2),
            y: THREE.MathUtils.radToDeg(gs.viewer.rotation.y).toFixed(2),
            z: THREE.MathUtils.radToDeg(gs.viewer.rotation.z).toFixed(2),
        };
        const translation = {
            x: gs.positionX.toFixed(2),
            y: gs.positionY.toFixed(2),
            z: gs.positionZ.toFixed(2),
        };
        
        transformValuesDisplay.textContent = `Rotation (degrees):\nX: ${rotation.x}, Y: ${rotation.y}, Z: ${rotation.z}\n\n` +
                                             `Translation:\nX: ${translation.x}, Y: ${translation.y}, Z: ${translation.z}`;
    }

    // Function to export the current transform values as JSON
    function exportTransform() {
        const transformData = {
            rotation: {
                x: gs.viewer.rotation.x,
                y: gs.viewer.rotation.y,
                z: gs.viewer.rotation.z,
            },
            translation: {
                x: gs.viewer.position.x,
                y: gs.viewer.position.y,
                z: gs.viewer.position.z,
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

const infoBox = document.getElementById('infoBox')!;

document.addEventListener('keydown', (event) => {
    if (event.key === 'x') {
        infoBox.style.display = infoBox.style.display === 'none' ? 'block' : 'none';
    }
});

const sky = new Sky();
sky.scale.setScalar( 450000 );
scene.add( sky );
const sun = new THREE.Vector3();

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




import * as THREE from "three";

function createCheckerboardTexture(divisions) {
	const canvas = document.createElement("canvas")!;
	const context = canvas.getContext("2d")!;
	const size = 1024;

	canvas.width = size;
	canvas.height = size;

	const colors = ["#ffffff", "#000000"];
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

export default function createCheckerboard(): THREE.Mesh {
	const size = 5000;
	const divisions = 100;
	const planeGeometry = new THREE.PlaneGeometry(size, size);
	const planeMaterial = new THREE.MeshBasicMaterial({
		map: createCheckerboardTexture(divisions),
		side: THREE.DoubleSide,
	});
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = -Math.PI / 2;

	return plane;
}

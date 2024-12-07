import * as THREE from "three";

function createCheckerboardTexture(divisions: number) {
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d")!;
	const size = 1000;

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

export default function Checkerboard() {
	const size = 1000;
	const divisions = 100;
	const texture = createCheckerboardTexture(divisions);

	return (
		<mesh rotation={[-Math.PI / 2, 0, 0]}>
			<planeGeometry args={[size, size]} />
			<meshBasicMaterial
				map={texture}
				side={THREE.DoubleSide}
			></meshBasicMaterial>
		</mesh>
	);
}

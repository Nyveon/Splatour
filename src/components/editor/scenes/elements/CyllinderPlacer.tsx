import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";

function CylinderPlacer() {
	const { camera, gl } = useThree();
	const [previewPosition, setPreviewPosition] = useState(null);
	const [placedCylinders, setPlacedCylinders] = useState([]);

	const raycaster = new THREE.Raycaster();
	const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // y = 0 plane

	console.log("redraw");

	useFrame(() => {
		// Get the camera's direction
		const direction = new THREE.Vector3();
		camera.getWorldDirection(direction);

		// Set the raycaster from the camera's position and direction
		raycaster.set(camera.position, direction);

		// Compute the intersection point with the ground plane
		const intersectPoint = new THREE.Vector3();
		if (raycaster.ray.intersectPlane(groundPlane, intersectPoint)) {
			setPreviewPosition(intersectPoint.clone());
		} else {
			setPreviewPosition(null);
		}
	});

	const handleClick = (event) => {
		// Ensure it's a left-click
		if (event.button === 0 && previewPosition) {
			setPlacedCylinders((prev) => [...prev, previewPosition.clone()]);
		}
	};

	useEffect(() => {
		gl.domElement.addEventListener("mousedown", handleClick);
		return () => {
			gl.domElement.removeEventListener("mousedown", handleClick);
		};
	}, [gl.domElement, handleClick]);

	return (
		<>
			{/* Preview Cylinder */}
			{previewPosition && (
				<mesh position={previewPosition}>
					<cylinderGeometry args={[0.5, 0.5, 1, 32]} />
					<meshBasicMaterial color="blue" opacity={0.5} transparent />
				</mesh>
			)}

			{/* Placed Cylinders */}
			{placedCylinders.map((position, index) => (
				<mesh key={index} position={position}>
					<cylinderGeometry args={[0.5, 0.5, 1, 32]} />
					<meshStandardMaterial color="red" />
				</mesh>
			))}
		</>
	);
}

export default CylinderPlacer;

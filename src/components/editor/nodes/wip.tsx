import { useInteractions } from "@/hooks/useInteractions";
import { useState } from "react";

export default function WIP() {
	const [isActive, setIsActive] = useState<boolean>(false);
	const setInteractable = useInteractions((state) => state.setInteractable);

	console.log("redraw");

	return (
		<mesh
			position={[0, 2, 0]}
			onPointerOver={() => {
				setIsActive(true);
				setInteractable(true);
			}}
			onPointerOut={() => {
				setIsActive(false);
				setInteractable(false);
			}}
		>
			<cylinderGeometry args={[0.5, 0.5, 1, 32]} />
			<meshBasicMaterial
				color={isActive ? "blue" : "green"}
				opacity={0.7}
				transparent
			/>
		</mesh>
	);
}

// import { useFrame, useThree } from "@react-three/fiber";
// import { useEffect, useState } from "react";
// import * as THREE from "three";

// const [previewPosition, setPreviewPosition] = useState(null);
// const [placedCylinders, setPlacedCylinders] = useState([]);

//const raycaster = new THREE.Raycaster();
// const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // y = 0 plane

// useFrame((state) => {
// 	console.log(state);
// // Get the camera's direction
// const direction = new THREE.Vector3();
// camera.getWorldDirection(direction);

// // Set the raycaster from the camera's position and direction
// raycaster.set(camera.position, direction);

// // Compute the intersection point with the ground plane
// const intersectPoint = new THREE.Vector3();
// if (raycaster.ray.intersectPlane(groundPlane, intersectPoint)) {
// 	setPreviewPosition(intersectPoint.clone());
// } else {
// 	setPreviewPosition(null);
// }
// });

// const handleClick = (event) => {
// 	// Ensure it's a left-click
// 	if (event.button === 0 && previewPosition) {
// 		setPlacedCylinders((prev) => [...prev, previewPosition.clone()]);
// 	}
// };

// useEffect(() => {
// 	gl.domElement.addEventListener("mousedown", handleClick);
// 	return () => {
// 		gl.domElement.removeEventListener("mousedown", handleClick);
// 	};
// }, [gl.domElement, handleClick]);

{
	/* Preview Cylinder */
}
{
	/* {previewPosition && (
				<mesh position={previewPosition}>
					<cylinderGeometry args={[0.5, 0.5, 1, 32]} />
					<meshBasicMaterial color="blue" opacity={0.5} transparent />
				</mesh>
			)} */
}

{
	/* Placed Cylinders */
}
{
	/* {placedCylinders.map((position, index) => (
				<mesh key={index} position={position}>
					<cylinderGeometry args={[0.5, 0.5, 1, 32]} />
					<meshStandardMaterial color="red" />
				</mesh>
			))} */
}

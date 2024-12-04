import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";
import { Plane, Vector3 } from "three";

const plane = new Plane(new Vector3(0, 1, 0), 0);
const intersectPoint = new Vector3();
const shadowPoint = new Vector3();
const lookDirection = new Vector3();
const placementClose = 4;
const placementFar = 15;
const height = 4;

export default function CylinderPlacer() {
	const ref = useRef<Mesh>(null);

	useFrame(({ raycaster }) => {
		if (!ref.current) {
			return;
		}

		const distance = raycaster.ray.distanceToPlane(plane);

		//todo: when too close make it red instead?
		if (!distance || distance < placementClose) {
			ref.current.visible = false;
			return;
		}
		ref.current.visible = true;

		raycaster.ray.intersectPlane(plane, intersectPoint);

		shadowPoint.copy(raycaster.ray.origin);
		shadowPoint.y = 0;
		const flatDistance = shadowPoint.distanceTo(intersectPoint);

		if (flatDistance > placementFar) {
			lookDirection.copy(raycaster.ray.direction);
			lookDirection.y = 0;
			lookDirection.normalize();
			shadowPoint.addScaledVector(lookDirection, placementFar);
			intersectPoint.copy(shadowPoint);
		} else {
			raycaster.ray.intersectPlane(plane, intersectPoint);
		}

		intersectPoint.y = height / 2;
		ref.current.position.copy(intersectPoint);
	});

	return (
		<mesh ref={ref} position={[0, 2, 0]}>
			<cylinderGeometry args={[1, 1, height, 32]} />
			<meshBasicMaterial color="blue" />
		</mesh>
	);
}

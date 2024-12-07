import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions, UserState } from "@/hooks/useInteractions";
import { gssArtifactCreate } from "@/model/GSSceneArtifact";
import { playerHeight } from "@/utils/constants";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";
import { Plane, Vector3 } from "three";

const plane = new Plane(new Vector3(0, 1, 0), 0);
const intersectPoint = new Vector3();
const shadowPoint = new Vector3();
const lookDirection = new Vector3();
const placementClose = 2;
const placementFar = 10;
const height = playerHeight * 1.2;
const radius = playerHeight * 0.3;

export default function CylinderPlacer() {
	const ref = useRef<Mesh>(null);

	useFrame(({ raycaster }) => {
		const placer = ref.current;

		if (!placer) {
			return;
		}

		const userState = useInteractions.getState().userState;
		const currentSceneId = useInteractions.getState().currentSceneId;

		if (userState !== UserState.Artifacts || !currentSceneId) {
			placer.visible = false;
			return;
		}

		const distance = raycaster.ray.distanceToPlane(plane);

		//todo: make it clear why it is not visible (too close or too far) (maybe make it red or show a message?)
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

	function handleClick() {
		const isLocked = useInteractions.getState().isLocked;

		if (!isLocked) {
			return;
		}

		const placer = ref.current;
		const currentSceneId = useInteractions.getState().currentSceneId;

		if (!placer || !currentSceneId) {
			//todo: error toast
			return;
		}

		const currentScene = useGSStore.getState().gsmap.scenes[currentSceneId];

		const relativePosition = {
			x: placer.position.x - currentScene.position.x,
			y: placer.position.y - currentScene.position.y,
			z: placer.position.z - currentScene.position.z,
		};

		const newArtifact = gssArtifactCreate(relativePosition, radius, height);
		useGSStore.getState().setAddArtifact(currentSceneId, newArtifact);
		useInteractions.getState().setUserState(UserState.None);
		useInteractions.getState().setCurrentNode(newArtifact.id, "artifact");
	}

	return (
		<mesh ref={ref} position={[0, 0, 0]} visible={false} onClick={handleClick}>
			<cylinderGeometry args={[radius, radius, height, 16]} />
			<meshBasicMaterial color="blue" />
		</mesh>
	);
}

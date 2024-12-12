import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions, UserState } from "@/hooks/useInteractions";
import { gsnSolidCreate, NodeType } from "@/model/GSNode";
import { playerHeight } from "@/utils/constants";
import { toastError, toastSuccess, toastUnknownError } from "@/utils/toasts";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import {
	DoubleSide,
	Euler,
	Matrix4,
	Plane,
	Quaternion,
	Vector3,
	type Mesh,
} from "three";

const plane = new Plane(new Vector3(0, 1, 0), 0);
const intersectPoint = new Vector3();
const shadowPoint = new Vector3();
const lookDirection = new Vector3();
const rotationQuaternion = new Quaternion();
const transformMatrix = new Matrix4();
const radius = 0.5;
const placementClose = 0;
const placementFar = 10;
const height = playerHeight * 1.5;

export default function BarrierSolidPlacer() {
	const ref = useRef<Mesh>(null);

	useFrame(({ raycaster }) => {
		const placer = ref.current;

		if (!placer) return;

		const userState = useInteractions.getState().userState;
		const currentSceneId = useInteractions.getState().currentSceneId;

		if (userState !== UserState.BarrierSolids || !currentSceneId) {
			placer.visible = false;
			return;
		}

		const distance = raycaster.ray.distanceToPlane(plane);

		if (!distance || distance < placementClose) {
			placer.visible = false;
			return;
		}
		placer.visible = true;

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
		placer.position.copy(intersectPoint);
	});

	function handleClick(event: ThreeEvent<MouseEvent>) {
		try {
			const isLocked = useInteractions.getState().isLocked;

			if (!isLocked) {
				return;
			}

			const placer = ref.current;
			const currentSceneId = useInteractions.getState().currentSceneId;

			if (!placer || !currentSceneId) {
				return;
			}

			if (event.button === 2) {
				useInteractions.getState().setUserState(UserState.None);
				return;
			}

			const currentScene = useGSStore.getState().gsmap.scenes[currentSceneId];

			rotationQuaternion.setFromEuler(
				new Euler(
					currentScene.rotation.x,
					currentScene.rotation.y,
					currentScene.rotation.z
				)
			);
			transformMatrix.compose(
				new Vector3(
					currentScene.position.x,
					currentScene.position.y,
					currentScene.position.z
				),
				rotationQuaternion,
				new Vector3(
					currentScene.scale.x,
					currentScene.scale.y,
					currentScene.scale.z
				)
			);
			transformMatrix.invert();

			placer.position.applyMatrix4(transformMatrix);

			const relativePosition = {
				x: placer.position.x,
				y: placer.position.y,
				z: placer.position.z,
			};

			const transformedRadius = radius / currentScene.scale.x;

			const newSolid = gsnSolidCreate(relativePosition, transformedRadius);
			useGSStore.getState().setAddNode(currentSceneId, newSolid);
			useInteractions.getState().setUserState(UserState.None);
			useInteractions.getState().setCurrentNode(newSolid.id, NodeType.Barrier);
			toastSuccess("Solid barrier created");
		} catch (error) {
			console.error(error);

			if (!(error instanceof Error)) {
				toastUnknownError();
				return;
			}

			toastError(`Solid creation failed: ${error.message}`);
		}
	}

	//todo: scroll wheel radius

	return (
		<mesh
			ref={ref}
			position={[0, 0, 0]}
			visible={false}
			onClick={(e) => handleClick(e)}
		>
			<cylinderGeometry args={[radius, radius, height, 16]} />
			<meshBasicMaterial
				color="blue"
				transparent={true}
				opacity={0.5}
				side={DoubleSide}
			/>
		</mesh>
	);
}

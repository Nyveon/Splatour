import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions, UserState } from "@/hooks/useInteractions";
import { gsnWallCreate, NodeType } from "@/model/GSNode";
import { barrierHeight, barrierWallThickness } from "@/utils/constants";
import { color } from "@/utils/theme";
import { toastError, toastSuccess, toastUnknownError } from "@/utils/toasts";
import { RoundedBox } from "@react-three/drei";
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
const startPositionVector = new Vector3();
const rotationQuaternion = new Quaternion();
const transformMatrix = new Matrix4();
const placementFar = 10;

export default function BarrierWallPlacer() {
	const previewRef = useRef<Mesh>(null);
	const placerRef = useRef<Mesh>(null);
	const startPosition = useRef<Vector3>();

	function reset() {
		startPosition.current = undefined;
		const preview = previewRef.current;

		if (!preview) return;

		preview.scale.set(1, 1, 1);
		preview.rotation.set(0, 0, 0);
	}

	useFrame(({ raycaster }) => {
		const placer = placerRef.current;
		const preview = previewRef.current;

		if (!placer || !preview) return;

		const userState = useInteractions.getState().userState;
		const currentSceneId = useInteractions.getState().currentSceneId;

		if (userState !== UserState.BarrierWalls || !currentSceneId) {
			placer.visible = false;
			preview.visible = false;
			return;
		}

		const distance = raycaster.ray.distanceToPlane(plane);

		if (!distance) {
			placer.visible = false;
			preview.visible = false;
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

		intersectPoint.y = -0.1 + barrierHeight / 2;
		placer.position.copy(intersectPoint);

		if (startPosition.current) {
			preview.visible = true;

			preview.position.copy(startPosition.current);

			intersectPoint.sub(startPosition.current);
			const distance = intersectPoint.length();
			const angle = Math.atan2(intersectPoint.x, intersectPoint.z);

			preview.scale.z = 1 + distance / barrierWallThickness;

			preview.position
				.copy(startPosition.current)
				.add(placer.position)
				.divideScalar(2);

			preview.rotation.set(0, angle, 0);
		}
	});

	function handleClick(event: ThreeEvent<MouseEvent>) {
		try {
			const isLocked = useInteractions.getState().isLocked;

			if (!isLocked) {
				return;
			}

			const placer = placerRef.current;
			const currentSceneId = useInteractions.getState().currentSceneId;
			const userState = useInteractions.getState().userState;

			if (userState !== UserState.BarrierWalls || !placer || !currentSceneId) {
				return;
			}

			if (event.button === 2) {
				useInteractions.getState().setUserState(UserState.None);
				reset();
				return;
			}

			// Start wall draw
			if (!startPosition.current) {
				startPositionVector.copy(placer.position);
				startPosition.current = startPositionVector;
				return;
			}

			// End wall draw
			const currentScene = useGSStore.getState().gsmap.scenes[currentSceneId];

			// rotationQuaternion.setFromEuler(
			// 	new Euler(
			// 		currentScene.rotation.x,
			// 		currentScene.rotation.y,
			// 		currentScene.rotation.z
			// 	)
			// );
			// transformMatrix.compose(
			// 	new Vector3(
			// 		currentScene.position.x,
			// 		currentScene.position.y,
			// 		currentScene.position.z
			// 	),
			// 	rotationQuaternion,
			// 	new Vector3(
			// 		currentScene.scale.x,
			// 		currentScene.scale.y,
			// 		currentScene.scale.z
			// 	)
			// );
			// transformMatrix.invert();

			// startPosition.current.applyMatrix4(transformMatrix);
			// placer.position.applyMatrix4(transformMatrix);

			// const relativeStartPosition = {
			// 	x: startPosition.current.x,
			// 	y: 0,
			// 	z: startPosition.current.z,
			// };

			// const relativeEndPosition = {
			// 	x: placer.position.x,
			// 	y: 0,
			// 	z: placer.position.z,
			// };

			const relativeStartPosition = {
				x: startPosition.current.x - currentScene.position.x,
				y: 0,
				z: startPosition.current.z - currentScene.position.z,
			};

			const relativeEndPosition = {
				x: placer.position.x - currentScene.position.x,
				y: 0,
				z: placer.position.z - currentScene.position.z,
			};

			// const transformedThickness = barrierWallThickness / currentScene.scale.x;

			const newWall = gsnWallCreate(
				relativeStartPosition,
				relativeEndPosition,
				barrierWallThickness
			);
			useGSStore.getState().setAddNode(currentSceneId, newWall);
			useInteractions.getState().setUserState(UserState.None);
			useInteractions
				.getState()
				.setCurrentNode(newWall.id, NodeType.BarrierWall);
			reset();
			toastSuccess("Wall barrier created");
		} catch (error) {
			console.error(error);

			if (!(error instanceof Error)) {
				toastUnknownError();
				return;
			}

			toastError(`Wall creation failed: ${error.message}`);
		}
	}

	return (
		<>
			<RoundedBox
				args={[barrierWallThickness, barrierHeight, barrierWallThickness]}
				radius={barrierWallThickness / 2}
				ref={previewRef}
			>
				<meshStandardMaterial
					color={color.barrierNode}
					side={DoubleSide}
					transparent
					opacity={0.25}
				/>
			</RoundedBox>
			<mesh ref={placerRef} onClick={(e) => handleClick(e)}>
				<cylinderGeometry
					args={[
						barrierWallThickness / 2,
						barrierWallThickness / 2,
						barrierHeight,
						8,
					]}
				/>
				<meshStandardMaterial
					color={color.barrierNode}
					side={DoubleSide}
					transparent
					opacity={0.5}
				/>
			</mesh>
		</>
	);
}

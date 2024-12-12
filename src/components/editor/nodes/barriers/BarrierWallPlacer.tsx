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
	const ref = useRef<Mesh>(null);
	const startPosition = useRef<Vector3>();

	function reset() {
		startPosition.current = undefined;
		const placer = ref.current;

		if (!placer) return;

		placer.scale.set(1, 1, 1);
	}

	useFrame(({ raycaster }) => {
		const placer = ref.current;

		if (!placer) return;

		const userState = useInteractions.getState().userState;
		const currentSceneId = useInteractions.getState().currentSceneId;

		if (userState !== UserState.BarrierWalls || !currentSceneId) {
			placer.visible = false;
			return;
		}

		const distance = raycaster.ray.distanceToPlane(plane);

		if (!distance) {
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

		intersectPoint.y = -0.1 + barrierHeight / 2;

		if (startPosition.current) {
			const distance = startPosition.current.distanceTo(intersectPoint);
			const currentWidth = barrierWallThickness;
			placer.scale.x = 1 + distance / currentWidth;
			placer.position
				.copy(startPosition.current)
				.add(intersectPoint)
				.divideScalar(2);
			placer.lookAt(intersectPoint);
			placer.rotateOnAxis(new Vector3(0, 1, 0), Math.PI / 2);
		} else {
			placer.position.copy(intersectPoint);
		}
	});

	function handleClick(event: ThreeEvent<MouseEvent>) {
		try {
			const isLocked = useInteractions.getState().isLocked;

			if (!isLocked) {
				return;
			}

			const placer = ref.current;
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

			startPosition.current.applyMatrix4(transformMatrix);
			placer.position.applyMatrix4(transformMatrix);

			const relativeStartPosition = {
				x: startPosition.current.x,
				y: 0,
				z: startPosition.current.z,
			};

			const relativeEndPosition = {
				x: placer.position.x,
				y: 0,
				z: placer.position.z,
			};

			const newWall = gsnWallCreate(relativeStartPosition, relativeEndPosition);
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
		<RoundedBox
			args={[barrierWallThickness, barrierHeight, barrierWallThickness]}
			radius={barrierWallThickness / 2}
			ref={ref}
			visible={false}
			onClick={(e) => handleClick(e)}
		>
			<meshStandardMaterial
				color={color.barrierNode}
				side={DoubleSide}
				transparent
				opacity={0.5}
			/>
		</RoundedBox>
	);
}

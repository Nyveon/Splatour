import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions, UserState } from "@/hooks/useInteractions";
import { gssArtifactCreate } from "@/model/GSSceneArtifact";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Euler, Matrix4, Quaternion, Vector3, type Mesh } from "three";

const rotationQuaternion = new Quaternion();
const transformMatrix = new Matrix4();
const radius = 0.5;
const placementMinDistance = 1;
const placementMaxDistance = 5;
const placementScrollSpeed = 0.005;

export default function ArtifactPlacer() {
	const ref = useRef<Mesh>(null);
	const placementDistance = useRef(4);

	useFrame(({ camera }) => {
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

		ref.current.visible = true;

		// Place at placementDistance away from the camera in the look direction

		const lookDirection = new Vector3();
		camera.getWorldDirection(lookDirection);
		lookDirection.normalize();
		lookDirection.multiplyScalar(placementDistance.current);
		const position = new Vector3();
		camera.getWorldPosition(position);
		position.add(lookDirection);

		ref.current.position.copy(position);
	});

	function handleClick() {
		const isLocked = useInteractions.getState().isLocked;

		if (!isLocked) {
			return;
		}

		const placer = ref.current;
		const currentSceneId = useInteractions.getState().currentSceneId;

		if (!placer || !currentSceneId) {
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

		const newArtifact = gssArtifactCreate(relativePosition, transformedRadius);
		useGSStore.getState().setAddArtifact(currentSceneId, newArtifact);
		useInteractions.getState().setUserState(UserState.None);
		useInteractions.getState().setCurrentNode(newArtifact.id, "artifact");
	}

	return (
		<mesh
			ref={ref}
			position={[0, 0, 0]}
			visible={false}
			onClick={handleClick}
			onWheel={(e) => {
				placementDistance.current -= e.deltaY * placementScrollSpeed;
				placementDistance.current = Math.min(
					placementMaxDistance,
					Math.max(placementMinDistance, placementDistance.current)
				);
			}}
		>
			<sphereGeometry args={[radius, 16]} />
			<meshBasicMaterial color="blue" />
		</mesh>
	);
}

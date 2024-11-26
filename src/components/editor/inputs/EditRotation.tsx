import Icon from "@/components/Icon";
import Stepper from "@/components/input/Stepper";
import { useGSStore } from "@/hooks/useGSStore";
import { GSScene } from "@/model/GSScene";
import styled from "@emotion/styled";
import * as THREE from "three";

const EditWrapper = styled.div`
	display: flex;
	justify-content: space-around;
	width: 100%;
`;

const EditFields = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`;

export default function EditRotation({ scene }: { scene: GSScene }) {
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);

	const quaternion = new THREE.Quaternion(
		scene.rotation.a,
		scene.rotation.b,
		scene.rotation.c,
		scene.rotation.d
	);
	const euler = new THREE.Euler().setFromQuaternion(quaternion);

	const handleRotationChange = (axis: "x" | "y" | "z", value: number) => {
		const updatedEuler = new THREE.Euler(euler.x, euler.y, euler.z);
		updatedEuler[axis] = THREE.MathUtils.degToRad(value);
		const updatedQuaternion = new THREE.Quaternion().setFromEuler(updatedEuler);

		console.log("updatedQuaternion: ", updatedQuaternion);

		setSceneTransform(scene.id, {
			rotation: {
				a: updatedQuaternion.x,
				b: updatedQuaternion.y,
				c: updatedQuaternion.z,
				d: updatedQuaternion.w,
			},
		});
	};

	const axes = ["x", "y", "z"] as const;

	return (
		<EditWrapper
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			<Icon icon="rotate-cw"></Icon>
			<EditFields>
				{axes.map((axis) => (
					<li key={axis}>
						<Stepper
							value={THREE.MathUtils.radToDeg(euler[axis])}
							valueHandler={(value) => handleRotationChange(axis, value)}
							label={axis}
						/>
					</li>
				))}
			</EditFields>
		</EditWrapper>
	);
}

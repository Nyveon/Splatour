import Icon from "@/components/Icon";
import Slider from "@/components/input/Slider";
import { useGSStore } from "@/hooks/useGSStore";
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
	max-width: 7.25rem;
`;

export default function EditRotation({ sceneId }: { sceneId: string }) {
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);
	const sceneRotation = useGSStore(
		(state) => state.gsmap.scenes[sceneId].rotation
	);

	const handleRotationChange = (axis: "x" | "y" | "z", value: number) => {
		setSceneTransform(sceneId, {
			rotation: {
				...sceneRotation,
				[axis]: THREE.MathUtils.degToRad(value),
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
						<Slider
							min={-180}
							max={180}
							value={THREE.MathUtils.radToDeg(sceneRotation[axis])}
							valueHandler={(value) => handleRotationChange(axis, value)}
							label={axis}
						/>
					</li>
				))}
			</EditFields>
		</EditWrapper>
	);
}

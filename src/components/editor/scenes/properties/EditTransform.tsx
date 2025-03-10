import Icon from "@/components/Icon";
import AxisInputs from "@/components/input/AxisInputs";
import Button from "@/components/input/Button";
import { useGSStore } from "@/hooks/useGSStore";
import { axes, axis } from "@/utils/constants";
import styled from "@emotion/styled";
import { FeatherIconNames } from "feather-icons";
import { useState } from "react";

const EditWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-right: 0.5rem;
`;

const EditBar = styled.div`
	flex-grow: 1;
	display: flex;
	justify-content: center;
	align-items: center;
`;

interface EditTransformProps {
	sceneId: string;
	type: "rotation" | "scale" | "position";
	icon: FeatherIconNames;
	min: number;
	max: number;
	step: number;
	slider?: boolean;
	linkable?: boolean;
	convertTo?: (value: number) => number;
	convertFrom?: (value: number) => number;
}

export default function EditTransform({
	sceneId,
	type,
	icon,
	min,
	max,
	step,
	slider = false,
	linkable = false,
	convertTo = (value) => value,
	convertFrom = (value) => value,
}: EditTransformProps) {
	const [linked, setLinked] = useState(linkable);
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);
	const sceneTransformValue = useGSStore(
		(state) => state.gsmap.scenes[sceneId][type]
	);

	const handleChange = (ax: axis, value: number) => {
		const newValue = convertTo(value);
		if (linked) {
			setSceneTransform(sceneId, {
				[type]: {
					[axes[0]]: newValue,
					[axes[1]]: newValue,
					[axes[2]]: newValue,
				},
			});
		} else {
			setSceneTransform(sceneId, {
				[type]: { ...sceneTransformValue, [ax]: newValue },
			});
		}
	};

	return (
		<EditWrapper
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			<EditBar>
				{linkable ? (
					<Button
						title={`${linked ? "Unlink" : "Link"} axes`}
						variant="small"
						icon={icon}
						onClick={() => {
							setLinked(!linked);
						}}
					></Button>
				) : (
					<Icon icon={icon}></Icon>
				)}
			</EditBar>
			<AxisInputs
				values={sceneTransformValue}
				handleChange={handleChange}
				min={min}
				max={max}
				step={step}
				convertFrom={convertFrom}
				linked={linked}
				slider={slider}
			/>
		</EditWrapper>
	);
}

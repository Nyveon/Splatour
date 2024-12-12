import Slider from "@/components/input/Slider";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import styled from "@emotion/styled";

const StyledSlider = styled(Slider)`
	display: flex;
	flex-direction: column-reverse;
	align-items: center;
	justify-content: center;
	gap: 0;
`;

export default function FlySpeed() {
	const setFlySpeed = useSettingsStore((state) => state.setFlySpeed);
	const flySpeed = useSettingsStore((state) => state.flySpeed);

	return (
		<StyledSlider
			label="Speed"
			min={0.1}
			max={10}
			step={0.1}
			value={flySpeed}
			valueHandler={(value) => setFlySpeed(value)}
		/>
	);
}

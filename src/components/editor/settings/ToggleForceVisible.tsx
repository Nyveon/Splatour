import Checkbox from "@/components/input/Checkbox";
import { SettingsState, useSettingsStore } from "@/hooks/useSettingsStore";

export default function ToggleForceVisible() {
	const forceVisible = useSettingsStore(
		(state: SettingsState) => state.forceVisible
	);
	const setForceVisible = useSettingsStore((state) => state.setForceVisible);

	return (
		<Checkbox
			label="All Splats"
			title="Show all splat scenes simultaneously"
			value={forceVisible}
			onChange={(e: boolean) => {
				setForceVisible(e);
			}}
		/>
	);
}

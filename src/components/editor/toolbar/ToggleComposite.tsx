import Checkbox from "@/components/input/Checkbox";
import { SettingsState, useSettingsStore } from "@/hooks/useSettingsStore";

export default function ToggleComposite() {
	const composite = useSettingsStore(
		(state: SettingsState) => state.compositeViewer
	);
	const setComposite = useSettingsStore((state) => state.setCompositeViewer);

	return (
		<Checkbox
			label="Composite"
			title="Show all scenes together to check their alignment"
			value={composite}
			onChange={(e: boolean) => {
				setComposite(e);
			}}
		/>
	);
}

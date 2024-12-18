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
			title="Composite 3DGS renderer"
			value={composite}
			onChange={(e: boolean) => {
				setComposite(e);
			}}
		/>
	);
}

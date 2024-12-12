import Checkbox from "@/components/input/Checkbox";
import { SettingsState, useSettingsStore } from "@/hooks/useSettingsStore";

export default function ToogleNodeVisibility() {
	const debugNodes = useSettingsStore(
		(state: SettingsState) => state.debugNodes
	);
	const setDebugNodes = useSettingsStore((state) => state.setDebugNodes);
	const debug = useSettingsStore((state: SettingsState) => state.debug);

	if (!debug) {
		return null;
	}

	return (
		<Checkbox
			label="Show Nodes"
			value={debugNodes}
			onChange={(e: boolean) => {
				setDebugNodes(e);
			}}
		/>
	);
}

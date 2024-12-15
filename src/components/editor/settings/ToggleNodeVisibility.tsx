import Checkbox from "@/components/input/Checkbox";
import { useSettingsStore } from "@/hooks/useSettingsStore";

export default function ToogleNodeVisibility() {
	const debugNodes = useSettingsStore((state) => state.debugNodes);
	const setDebugNodes = useSettingsStore((state) => state.setDebugNodes);
	const debug = useSettingsStore((state) => state.debug);

	if (!debug) {
		return null;
	}

	return (
		<Checkbox
			label="Nodes"
			title="Show nodes (barriers, portals, artifacts, etc.)"
			value={debugNodes}
			onChange={(e: boolean) => {
				setDebugNodes(e);
			}}
		/>
	);
}

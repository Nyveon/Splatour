import Checkbox from "@/components/input/Checkbox";
import { SettingsState, useSettingsStore } from "@/hooks/useSettingsStore";

export default function ToogleDebug() {
	const debug = useSettingsStore((state: SettingsState) => state.debug);
	const setDebug = useSettingsStore((state) => state.setDebug);

	return (
		<Checkbox
			label="Preview"
			value={!debug}
			onChange={(e: boolean) => {
				setDebug(!e);
			}}
		/>
	);
}

import Checkbox from "@/components/input/Checkbox";
import { useSettingsStore } from "@/hooks/useSettingsStore";

export default function ToggleNoclip() {
	const noclip = useSettingsStore((state) => state.noclip);
	const setNoclip = useSettingsStore((state) => state.setNoclip);
	const debug = useSettingsStore((state) => state.debug);

	if (!debug) {
		return null;
	}

	return (
		<Checkbox
			label="Noclip"
			value={noclip}
			onChange={(e: boolean) => {
				setNoclip(e);
			}}
		/>
	);
}

import Checkbox from "@/components/input/Checkbox";
import { useSettingsStore } from "@/hooks/useSettingsStore";

export default function ToogleDebug() {
	const mobileDebug = useSettingsStore((state) => state.mobileDebug);
	const setMobileDebug = useSettingsStore((state) => state.setMobileDebug);

	return (
		<Checkbox
			label="Mobile"
			value={mobileDebug}
			onChange={(e) => {
				setMobileDebug(e);
			}}
		/>
	);
}

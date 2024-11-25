import { useSettingsStore } from "../../hooks/useSettingsStore";
import Checkbox from "../Checkbox";

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

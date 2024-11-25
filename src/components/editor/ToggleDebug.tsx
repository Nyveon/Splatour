import { useSettingsStore } from "../../hooks/useSettingsStore";
import Checkbox from "../Checkbox";

export default function ToogleDebug() {
	const debug = useSettingsStore((state) => state.debug);
	const setDebug = useSettingsStore((state) => state.setDebug);

	return (
		<Checkbox
			label="Debug"
			value={debug}
			onChange={(e) => {
				setDebug(e);
			}}
		/>
	);
}

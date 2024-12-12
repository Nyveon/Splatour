import ToggleDebug from "@/components/editor/settings/ToggleDebug";
import ToggleMobileDebug from "@/components/editor/settings/ToggleMobileDebug";
import ToggleNodeVisibility from "./ToggleNodeVisibility";

export default function SettingsToolbar() {
	return (
		<>
			<ToggleDebug />
			<ToggleMobileDebug />
			<ToggleNodeVisibility />
		</>
	);
}

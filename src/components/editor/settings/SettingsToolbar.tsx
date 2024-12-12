import ToggleDebug from "@/components/editor/settings/ToggleDebug";
import ToggleMobileDebug from "@/components/editor/settings/ToggleMobileDebug";
import ToggleNoclip from "./ToggleNoclip";
import ToggleNodeVisibility from "./ToggleNodeVisibility";

export default function SettingsToolbar() {
	return (
		<>
			<ToggleDebug />
			<ToggleMobileDebug />
			<ToggleNoclip />
			<ToggleNodeVisibility />
		</>
	);
}

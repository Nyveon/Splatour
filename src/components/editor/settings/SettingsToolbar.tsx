import ToggleDebug from "@/components/editor/settings/ToggleDebug";
import ToggleMobileDebug from "@/components/editor/settings/ToggleMobileDebug";

export default function SettingsToolbar() {
	return (
		<>
			<ToggleDebug />
			<ToggleMobileDebug />
		</>
	);

	//todo: toggle node visibility
	//todo: toggle collider visibility
}

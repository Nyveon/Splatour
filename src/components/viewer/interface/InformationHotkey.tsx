import { useSettingsStore } from "@/hooks/useSettingsStore";
import { useEffect } from "react";

/** Viewing shortcut; the editor retains N for its debug geometry. */
export default function InformationHotkey() {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.key.toLowerCase() !== "n" ||
				event.repeat ||
				event.ctrlKey ||
				event.metaKey ||
				event.altKey
			)
				return;
			const target = event.target;
			if (
				target instanceof HTMLElement &&
				(target.isContentEditable ||
					target.closest("input, textarea, select, [role='textbox']"))
			)
				return;
			const settings = useSettingsStore.getState();
			if (settings.debug) return;
			settings.setInformationNodesVisible(!settings.informationNodesVisible);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
	return null;
}

import ToggleDebug from "./ToggleDebug";
import ToggleMobileDebug from "./ToggleMobileDebug";
import ToolbarSection from "./ToolbarSection";

const helpInfo = `
# *:icon-monitor* Modes

## Preview

When active, simulates the *:Exported view* disabling debug utils
and hiding editor-only features.

## Mobile

When active, simulates *:Mobile Device Input* disabling pointer lock
and enabling joysticks for movement and looking.
`;

export default function ToolbarModes() {
	return (
		<ToolbarSection label="Modes" icon="monitor" helpInfo={helpInfo}>
			<ToggleDebug />
			<ToggleMobileDebug />
		</ToolbarSection>
	);
}

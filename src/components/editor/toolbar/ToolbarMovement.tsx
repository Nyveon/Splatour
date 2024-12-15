import FlySpeed from "./FlySpeed";
import ToggleNoclip from "./ToggleNoclip";
import ToolbarSection from "./ToolbarSection";

const helpInfo = `
# *:icon-move* Movement

## Noclip

When active, disables collisions with *:barriers* and *:portals*.

## Speed

Multiplier for the movement speed (default = 1).
`;

export default function ToolbarMovement() {
	return (
		<ToolbarSection label="Movement" icon="move" helpInfo={helpInfo}>
			<ToggleNoclip />
			<FlySpeed />
		</ToolbarSection>
	);
}

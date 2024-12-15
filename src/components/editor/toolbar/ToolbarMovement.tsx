import FlySpeed from "./FlySpeed";
import ResetCamera from "./ResetCamera";
import ToggleNoclip from "./ToggleNoclip";
import ToolbarSection from "./ToolbarSection";

const helpInfo = `
# *:icon-move* Movement

## Reset Camera

Resets the camera position and height to the starting position.

## Noclip

When active, disables collisions with *:barriers* and *:portals*.

## Speed

Multiplier for the movement speed (default = 1).
`;

export default function ToolbarMovement() {
	return (
		<ToolbarSection label="Movement" icon="move" helpInfo={helpInfo}>
			<ResetCamera />
			<ToggleNoclip />
			<FlySpeed />
		</ToolbarSection>
	);
}

import ToggleForceVisible from "./ToggleForceVisible";
import ToggleNodeVisibility from "./ToggleNodeVisibility";
import ToolbarSection from "./ToolbarSection";

const helpInfo = `
# *:icon-eye* Visibility

## Nodes

When active, shows all *:nodes* in the scene.
This includes artifacts, barriers and portals.

## All Splats

When active in a *:Dynamic Viewer* map, forces all splat scenes to be
visible simultaneously. Note that the gaussians are not sorted in this
type of map, so the splats may overlap and obscure each other.

`;

export default function ToolbarVisibility() {
	return (
		<ToolbarSection label="Visibility" icon="eye" helpInfo={helpInfo}>
			<ToggleNodeVisibility />
			<ToggleForceVisible />
		</ToolbarSection>
	);
}

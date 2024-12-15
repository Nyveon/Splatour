import SceneCardPanel from "@/components/editor/scenes/card/SceneCardPanel";
import EditRotation from "@/components/editor/scenes/properties/EditRotation";
import EditScale from "@/components/editor/scenes/properties/EditScale";
import EditTranslation from "@/components/editor/scenes/properties/EditTranslation";
import { AppIcons } from "@/utils/theme";

const helpInfo = `
# Transform

The scene's 3D transformations. These also affect *:child nodes*, although some node types have special restrictions.

## *icon-move* Translation

The scene's X, Y and Z offsets relative to the map center.

## *icon-maximize-2* Scale

The scaling factor. By default this links all axes, but you can unlink them by clicking the *:icon-maximize-2* *:Scale*  icon.

## *icon-rotate-cw* Rotation

The X, Y and Z rotation angles in degrees.
`;

export default function PanelPlacement({ sceneId }: { sceneId: string }) {
	return (
		<SceneCardPanel
			label="Transform"
			icon={AppIcons.Placement}
			helpInfo={helpInfo}
		>
			<EditTranslation sceneId={sceneId} />
			<EditScale sceneId={sceneId} />
			<EditRotation sceneId={sceneId} />
		</SceneCardPanel>
	);
}

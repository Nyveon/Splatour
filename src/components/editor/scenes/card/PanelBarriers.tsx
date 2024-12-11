import { NodeType } from "@/model/GSNode";
import { AppIcons } from "@/utils/theme";
import NodeList from "../elements/NodeList";
import SceneCardPanel from "./SceneCardPanel";

export default function Barriers({ sceneId }: { sceneId: string }) {
	return (
		<SceneCardPanel label="Barriers" icon={AppIcons.Barrier}>
			<NodeList sceneId={sceneId} type={NodeType.Barrier} />
		</SceneCardPanel>
	);
}

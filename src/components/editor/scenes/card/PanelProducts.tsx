import { NodeType } from "@/model/GSNode";
import NodeList from "../elements/NodeList";
import SceneCardPanel from "./SceneCardPanel";

export default function PanelProducts({ sceneId }: { sceneId: string }) {
	return (
		<SceneCardPanel
			label="Products"
			icon="shopping-bag"
			helpInfo="Select a product to edit it. To add one, place a New Artifact and enable Sell as product."
		>
			<NodeList sceneId={sceneId} type={NodeType.Artifact} kind="product" />
		</SceneCardPanel>
	);
}

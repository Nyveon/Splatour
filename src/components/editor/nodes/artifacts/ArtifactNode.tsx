import { useGSStore } from "@/hooks/useGSStore";
import { AppIcons } from "@/utils/theme";
import NodeContainer from "../shared/NodeContainer";
import NodePanel from "../shared/NodePanel";
import ArtifactContent from "./ArtifactContent";
import ArtifactSize from "./ArtifactSize";
import ArtifactTranslation from "./ArtifactTranslation";
import ProductProperties from "./ProductProperties";

export default function ArtifactNode({
	nodeId,
	sceneId,
}: {
	nodeId: string;
	sceneId: string;
}) {
	const artifact = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[nodeId]
	);
	const product = artifact.product;
	return (
		<NodeContainer
			sceneId={sceneId}
			nodeId={nodeId}
			icon={product ? "shopping-bag" : AppIcons.Artifact}
		>
			<NodePanel label="Product" icon="shopping-bag">
				<label>
					<input
						type="checkbox"
						checked={!!product}
						onChange={(event) => {
							const size = Math.max(0.001, artifact.radius * 2);
							useGSStore.getState().setNodeTransform(sceneId, nodeId, {
								product: event.target.checked
									? {
											image: "",
											imageCrop: {
												x: 0,
												y: 0,
												width: 1,
												height: 1,
												sourceWidth: 1,
												sourceHeight: 1,
											},
											price: 0,
											currency: "USD",
											unit: "kg",
											hitbox: { x: size, y: size, z: size },
										}
									: undefined,
							});
						}}
					/>{" "}
					Sell as product
				</label>
			</NodePanel>
			{product ? (
				<ProductProperties
					key={`${sceneId}:${nodeId}`}
					sceneId={sceneId}
					nodeId={nodeId}
				/>
			) : (
				<>
					<NodePanel label="Offset" icon="move">
						<ArtifactTranslation nodeId={nodeId} sceneId={sceneId} />
					</NodePanel>

					<NodePanel label="Radius" icon="maximize-2">
						<ArtifactSize nodeId={nodeId} sceneId={sceneId} />
					</NodePanel>

					<NodePanel label="Content" icon="file-text" vertical={true}>
						<ArtifactContent nodeId={nodeId} sceneId={sceneId} />
					</NodePanel>
				</>
			)}
		</NodeContainer>
	);
}

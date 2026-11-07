import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { NodeType } from "@/model/GSNode";
import { Edges, Html } from "@react-three/drei";

export default function ProductMarker({
	sceneId,
	artifactId,
}: {
	sceneId: string;
	artifactId: string;
}) {
	const artifact = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[artifactId]
	);
	const editing = useSettingsStore((state) => state.debug && state.debugNodes);
	const currentScene = useInteractions((state) => state.currentSceneId);
	const selected = useInteractions(
		(state) => state.currentNodeId === artifactId
	);
	const product = artifact.product;
	if (!editing || !product || currentScene !== sceneId) return null;
	const select = () => {
		useInteractions.getState().unlock();
		if (document.pointerLockElement) document.exitPointerLock();
		useInteractions.getState().setCurrentNode(artifactId, NodeType.Artifact);
	};
	const tint = selected ? "#ffd166" : "#06c167";
	return (
		<group
			position={[artifact.position.x, artifact.position.y, artifact.position.z]}
		>
			<mesh
				name={`Product hitbox: ${artifactId}`}
				onClick={(event) => {
					event.stopPropagation();
					event.nativeEvent.stopImmediatePropagation();
					select();
				}}
			>
				<boxGeometry
					args={[product.hitbox.x, product.hitbox.y, product.hitbox.z]}
				/>
				<meshBasicMaterial
					color={tint}
					transparent
					opacity={selected ? 0.2 : 0.06}
					depthWrite={false}
				/>
				<Edges color={tint} />
			</mesh>
			<Html center zIndexRange={selected ? [100, 51] : [50, 0]}>
				<button
					type="button"
					aria-label={`Edit ${artifact.name}`}
					aria-pressed={selected}
					onClick={(event) => {
						event.stopPropagation();
						select();
					}}
					style={{
						whiteSpace: "nowrap",
						padding: "4px 8px",
						borderRadius: 5,
						border: `1px solid ${tint}`,
						background: "#16201eef",
						color: "white",
						font: "12px Arial, sans-serif",
						cursor: "pointer",
					}}
				>
					{artifact.name}
				</button>
			</Html>
		</group>
	);
}

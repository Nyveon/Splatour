import { Vec3 } from "@/utils/data";
import { AppIcons } from "@/utils/theme";
import { FeatherIconNames } from "feather-icons";

export enum NodeType {
	None,
	Artifact,
	Barrier,
}

interface GSNodeBase {
	type: NodeType;
	id: string;
	name: string;
}

export interface GSNodeWall extends GSNodeBase {
	type: NodeType.Barrier;
	startPosition: Vec3;
	endPosition: Vec3;
}

export interface GSNodeArtifact extends GSNodeBase {
	type: NodeType.Artifact;

	content: string;
	position: Vec3;
	radius: number;
	//todo: box shape?
}

export function nodeIsArtifact(node: GSNode): node is GSNodeArtifact {
	return node.type === NodeType.Artifact;
}

export function gsnArtifactCreate(
	position: Vec3,
	radius: number
): GSNodeArtifact {
	return {
		type: NodeType.Artifact,
		id: crypto.randomUUID(),
		name: "New Artifact",
		content: "...",
		position: position,
		radius: radius,
	};
}

export type GSNode = GSNodeArtifact | GSNodeWall;

export const NodeIconMap: Record<NodeType, FeatherIconNames> = {
	[NodeType.None]: "alert-circle",
	[NodeType.Artifact]: AppIcons.Artifact,
	[NodeType.Barrier]: AppIcons.Barrier,
};

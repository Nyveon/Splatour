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

//#region Barriers
export enum BarrierShape {
	Wall,
	Solid,
}

export interface GSNodeBarrier extends GSNodeBase {
	type: NodeType.Barrier;
	shape: BarrierShape;
}

export interface GSNodeWall extends GSNodeBarrier {
	shape: BarrierShape.Wall;
	startPosition: Vec3;
	endPosition: Vec3;
}

export function nodeIsWall(node: GSNode): node is GSNodeWall {
	return node.type === NodeType.Barrier && node.shape === BarrierShape.Wall;
}

export function gsnWallCreate(
	startPosition: Vec3,
	endPosition: Vec3
): GSNodeWall {
	return {
		type: NodeType.Barrier,
		shape: BarrierShape.Wall,
		id: crypto.randomUUID(),
		name: "Wall",
		startPosition: startPosition,
		endPosition: endPosition,
	};
}

export interface GSNodeSolid extends GSNodeBarrier {
	shape: BarrierShape.Solid;
	position: Vec3;
	radius: number;
}

export function nodeIsSolid(node: GSNode): node is GSNodeSolid {
	return node.type === NodeType.Barrier && node.shape === BarrierShape.Solid;
}

export function gsnSolidCreate(position: Vec3, radius: number): GSNodeSolid {
	return {
		type: NodeType.Barrier,
		shape: BarrierShape.Solid,
		id: crypto.randomUUID(),
		name: "Solid",
		position: position,
		radius: radius,
	};
}

//#endregion

//#region Artifacts
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
//#endregion

export type GSNode = GSNodeArtifact | GSNodeBarrier;

export const NodeIconMap: Record<NodeType, FeatherIconNames> = {
	[NodeType.None]: "alert-circle",
	[NodeType.Artifact]: AppIcons.Artifact,
	[NodeType.Barrier]: AppIcons.Barrier,
};

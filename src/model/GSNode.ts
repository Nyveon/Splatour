import { Vec3 } from "@/utils/data";
import { AppIcons } from "@/utils/theme";
import { FeatherIconNames } from "feather-icons";

export enum NodeType {
	None,
	Artifact,
	BarrierSolid,
	BarrierWall,
}

interface GSNodeBase {
	type: NodeType;
	id: string;
	name: string;
}

//#region Barriers

export interface GSNodeBarrier extends GSNodeBase {
	type: Barrier;
}

export type Barrier = NodeType.BarrierWall | NodeType.BarrierSolid;
export function nodeIsBarrier(node: GSNode): node is GSNodeBarrier {
	return (
		node.type === NodeType.BarrierSolid || node.type === NodeType.BarrierWall
	);
}

export interface GSNodeWall extends GSNodeBarrier {
	type: NodeType.BarrierWall;
	startPosition: Vec3;
	endPosition: Vec3;
	thickness: number;
}

export function nodeIsWall(node: GSNode): node is GSNodeWall {
	return node.type === NodeType.BarrierWall;
}

export function assertNodeIsWall(node: GSNode): asserts node is GSNodeWall {
	if (!nodeIsWall(node)) {
		throw new Error("Type error: Node is not a wall barrier");
	}
}

export function gsnWallCreate(
	startPosition: Vec3,
	endPosition: Vec3,
	thickness: number
): GSNodeWall {
	return {
		type: NodeType.BarrierWall,
		id: crypto.randomUUID(),
		name: "Wall",
		startPosition: startPosition,
		endPosition: endPosition,
		thickness: thickness,
	};
}

export interface GSNodeSolid extends GSNodeBarrier {
	type: NodeType.BarrierSolid;
	position: Vec3;
	radius: number;
}

export function nodeIsSolid(node: GSNode): node is GSNodeSolid {
	return node.type === NodeType.BarrierSolid;
}

export function assertNodeIsSolid(node: GSNode): asserts node is GSNodeSolid {
	if (!nodeIsSolid(node)) {
		throw new Error("Type error: Node is not a solid barrier");
	}
}

export function gsnSolidCreate(position: Vec3, radius: number): GSNodeSolid {
	return {
		type: NodeType.BarrierSolid,
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
	[NodeType.BarrierWall]: AppIcons.BarrierWall,
	[NodeType.BarrierSolid]: AppIcons.BarrierSolid,
};

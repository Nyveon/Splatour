import { Vec3 } from "@/utils/data";
import { AppIcons } from "@/utils/theme";
import { FeatherIconNames } from "feather-icons";

export enum NodeType {
	None,
	Artifact,
	BarrierSolid,
	BarrierWall,
	PortalEdge,
	PortalWarp,
}

interface GSNodeBase {
	type: NodeType;
	id: string;
	name: string;
}

export interface SegmentNode extends GSNodeBase {
	startPosition: Vec3;
	endPosition: Vec3;
}

export function nodeIsSegment(node: GSNodeBase): node is SegmentNode {
	return "startPosition" in node && "endPosition" in node;
}

export function assertNodeIsSegment(
	node: GSNodeBase
): asserts node is SegmentNode {
	if (!nodeIsSegment(node)) {
		throw new Error("Type error: Node is not a segment");
	}
}

//#region Barriers
export type Barrier = NodeType.BarrierWall | NodeType.BarrierSolid;
export interface GSNodeBarrier extends GSNodeBase {
	type: Barrier;
}

export function nodeIsBarrier(node: GSNodeBase): node is GSNodeBarrier {
	return (
		node.type === NodeType.BarrierSolid || node.type === NodeType.BarrierWall
	);
}

export interface GSNodeWall extends GSNodeBarrier, SegmentNode {
	type: NodeType.BarrierWall;
	thickness: number;
}

export function nodeIsWall(node: GSNodeBase): node is GSNodeWall {
	return node.type === NodeType.BarrierWall;
}

export function assertNodeIsWall(node: GSNodeBase): asserts node is GSNodeWall {
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

export function nodeIsSolid(node: GSNodeBase): node is GSNodeSolid {
	return node.type === NodeType.BarrierSolid;
}

export function assertNodeIsSolid(
	node: GSNodeBase
): asserts node is GSNodeSolid {
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

export function nodeIsArtifact(node: GSNodeBase): node is GSNodeArtifact {
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

//#region Portals
export type Portal = NodeType.PortalEdge | NodeType.PortalWarp;
export interface GSNodePortal extends GSNodeBase {
	type: Portal;
}

export function nodeIsPortal(node: GSNodeBase): node is GSNodePortal {
	return node.type === NodeType.PortalEdge || node.type === NodeType.PortalWarp;
}

export interface GSNodePortalEdge extends GSNodePortal, SegmentNode {
	type: NodeType.PortalEdge;
	thickness: number;
	destination: string;
}

export function nodeIsPortalEdge(node: GSNodeBase): node is GSNodePortalEdge {
	return node.type === NodeType.PortalEdge;
}

export function assertNodeIsPortalEdge(
	node: GSNodeBase
): asserts node is GSNodePortalEdge {
	if (!nodeIsPortalEdge(node)) {
		throw new Error("Type error: Node is not a portal edge");
	}
}

export function gsnEdgeCreate(
	startPosition: Vec3,
	endPosition: Vec3,
	thickness: number
): GSNodePortalEdge {
	return {
		type: NodeType.PortalEdge,
		id: crypto.randomUUID(),
		name: "Edge",
		startPosition: startPosition,
		endPosition: endPosition,
		thickness: thickness,
		destination: "",
	};
}

//#endregion

// ! this feels like a typescript crime but no tie to figure it out :(
export type GSNode =
	| GSNodeArtifact
	| GSNodeSolid
	| GSNodeWall
	| GSNodeBarrier
	| GSNodePortalEdge
	| GSNodePortal;

export const NodeIconMap: Record<NodeType, FeatherIconNames> = {
	[NodeType.None]: "alert-circle",
	[NodeType.Artifact]: AppIcons.Artifact,
	[NodeType.BarrierWall]: AppIcons.BarrierWall,
	[NodeType.BarrierSolid]: AppIcons.BarrierSolid,
	[NodeType.PortalEdge]: AppIcons.PortalEdge,
	[NodeType.PortalWarp]: AppIcons.PortalWarp,
};

import { Vec3 } from "@/utils/data";

export interface GSSceneArtifact {
	id: string;
	name: string;
	content: string;

	position: Vec3;
	radius: number;
	height: number;
	//todo: shapes - cyllinder, cube, sphere
}

export function gssArtifactCreate(
	position: Vec3,
	radius: number,
	height: number
): GSSceneArtifact {
	return {
		id: crypto.randomUUID(),
		name: "New Artifact",
		content: "",
		position: position,
		radius: radius,
		height: height,
	};
}

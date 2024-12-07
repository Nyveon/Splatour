import { Vec3 } from "@/utils/data";

export interface GSSceneArtifact {
	id: string;
	name: string;
	content: string;

	position: Vec3;
	radius: number;
	//todo: box shape
}

export function gssArtifactCreate(
	position: Vec3,
	radius: number
): GSSceneArtifact {
	return {
		id: crypto.randomUUID(),
		name: "New Artifact",
		content: "",
		position: position,
		radius: radius,
	};
}

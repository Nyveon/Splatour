type HEX = `#${string}`;
export type GSSkyType = "flat" | "hemi";
export type GSSkyValue = GSSkyFlat | GSSkyHemi;

interface GSSkyFlat {
	type: "flat";
	color: HEX;
}

interface GSSkyHemi {
	type: "hemi";
	topColor: HEX;
	bottomColor: HEX;
}

export type GSSky = GSSkyFlat | GSSkyHemi;

export interface SkyboxGradient {
	stops: number[];
	colors: string[];
}

export function gssSkyGradient(sky: GSSky | undefined): SkyboxGradient | null {
	if (!sky) {
		return null;
	}

	switch (sky.type) {
		case "flat":
			return {
				stops: [0, 1],
				colors: [sky.color, sky.color],
			};
		case "hemi":
			return {
				stops: [0, 0.49999, 0.5, 1],
				colors: [sky.topColor, sky.topColor, sky.bottomColor, sky.bottomColor],
			};
		default:
			return null;
	}
}

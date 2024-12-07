import { HEX } from "@/utils/data";

export type GSSkyType = "flat" | "hemi";
export type GSSkyValue = GSSkyFlat | GSSkyHemi;

export interface GSSkyFlat {
	type: "flat";
	primary: HEX;
}

export const defaultSkyFlat: GSSkyFlat = {
	type: "flat",
	primary: "#FFFFFF",
};

export interface GSSkyHemi {
	type: "hemi";
	primary: HEX;
	secondary: HEX;
}

export const defaultSkyHemi: GSSkyHemi = {
	type: "hemi",
	primary: "#FFFFFF",
	secondary: "#000000",
};

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
				colors: [sky.primary, sky.primary],
			};
		case "hemi":
			return {
				stops: [0, 0.49999, 0.5, 1],
				colors: [sky.primary, sky.primary, sky.secondary, sky.secondary],
			};
		default:
			return null;
	}
}

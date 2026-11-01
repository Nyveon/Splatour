export interface PostProcessingSettings {
	autoExposure: boolean;
	exposure: number;
	exposureRange: number;
	adaptationTime: number;
	contrast: number;
	saturation: number;
	temperature: number;
	tint: number;
}

export const defaultPostProcessing: Readonly<PostProcessingSettings> = {
	autoExposure: true,
	exposure: 0,
	exposureRange: 1,
	adaptationTime: 1.5,
	contrast: 1,
	saturation: 1,
	temperature: 0,
	tint: 0,
};

/** Old projects inherit defaults; malformed values never reach the shaders. */
export function resolvePostProcessing(
	input?: Partial<PostProcessingSettings>
): PostProcessingSettings {
	const number = (
		key: Exclude<keyof PostProcessingSettings, "autoExposure">,
		min: number,
		max: number
	) => {
		const value = input?.[key];
		return typeof value === "number" && Number.isFinite(value)
			? Math.min(max, Math.max(min, value))
			: defaultPostProcessing[key];
	};
	return {
		autoExposure:
			typeof input?.autoExposure === "boolean" ? input.autoExposure : true,
		exposure: number("exposure", -3, 3),
		exposureRange: number("exposureRange", 0, 2),
		adaptationTime: number("adaptationTime", 0.2, 5),
		contrast: number("contrast", 0.5, 1.5),
		saturation: number("saturation", 0, 2),
		temperature: number("temperature", -1, 1),
		tint: number("tint", -1, 1),
	};
}

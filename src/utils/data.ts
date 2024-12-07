// Vectors
export interface Vec3 {
	x: number;
	y: number;
	z: number;
}


// Hex colors
export type HEX = `#${string}`;

export function isHexColor(hex: string): hex is HEX {
	return (
		typeof hex === "string" &&
		hex.length === 7 && // Ensure it includes the '#' symbol and has the correct length
		hex.startsWith("#") &&
		!isNaN(Number("0x" + hex.slice(1))) // Validate hexadecimal value
	);
}


//
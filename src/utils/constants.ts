export enum Controls {
	forward = "forward",
	backward = "backward",
	left = "left",
	right = "right",
	up = "up",
	down = "down",
}

export const KeyMap = [
	{ name: Controls.forward, keys: ["ArrowUp", "w", "W"] },
	{ name: Controls.backward, keys: ["ArrowDown", "s", "S"] },
	{ name: Controls.left, keys: ["ArrowLeft", "a", "A"] },
	{ name: Controls.right, keys: ["ArrowRight", "d", "D"] },
	{ name: Controls.up, keys: ["Space", "Q", "q"] },
	{ name: Controls.down, keys: ["Shift", "E", "e"] },
];

export type axis = "x" | "y" | "z";
export const axes = ["x", "y", "z"] as axis[];

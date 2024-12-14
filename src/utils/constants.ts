export enum Controls {
	forward = "forward",
	backward = "backward",
	left = "left",
	right = "right",
	up = "up",
	down = "down",

	//toggles
	togglePreview = "togglePreview",
	toggleMobile = "toggleMobile",
	toggleNoclip = "toggleNoclip",
	toggleNodeVisibility = "toggleNodeVisibility",

	//current scene
	newWall = "newWall",
	newSolid = "newSolid",
	newArtifact = "newArtifact",
	newPortal = "newPortal",
	closeReturn = "closeReturn",

	//other
	speedUp = "speedUp",
	speedDown = "speedDown",
	speedReset = "speedReset",
}

export const KeyMap = [
	{ name: Controls.forward, keys: ["ArrowUp", "w", "W"] },
	{ name: Controls.backward, keys: ["ArrowDown", "s", "S"] },
	{ name: Controls.left, keys: ["ArrowLeft", "a", "A"] },
	{ name: Controls.right, keys: ["ArrowRight", "d", "D"] },
	{ name: Controls.up, keys: ["Space", "Q", "q"] },
	{ name: Controls.down, keys: ["Shift", "E", "e"] },

	{ name: Controls.closeReturn, keys: ["x"] },
	{ name: Controls.newWall, keys: ["1"] },
	{ name: Controls.newSolid, keys: ["2"] },
	{ name: Controls.newArtifact, keys: ["3"] },
	{ name: Controls.newPortal, keys: ["4"] },

	{ name: Controls.togglePreview, keys: ["v"] },
	{ name: Controls.toggleMobile, keys: ["m"] },
	{ name: Controls.toggleNoclip, keys: ["b"] },
	{ name: Controls.toggleNodeVisibility, keys: ["n"] },

	{ name: Controls.speedUp, keys: ["r", "R"] },
	{ name: Controls.speedDown, keys: ["f", "F"] },
	{ name: Controls.speedReset, keys: ["c", "C"] },
];

export type axis = "x" | "y" | "z";
export const axes = ["x", "y", "z"] as axis[];

export const formatVersion = 1;

export const mapAssetsSubfolder = "gsmap";

//* 1 unit = 100cm
export const playerHeight = 1.7;
export const barrierHeight = playerHeight * 1.5;
export const barrierWallThickness = 0.1;

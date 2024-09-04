interface MouseState {
	leftButton: boolean;
	rightButton: boolean;
	mouseX: number;
	mouseY: number;
	mouseXDelta: number;
	mouseYDelta: number;
}

export const KEYS = {
	w: "KeyW",
	s: "KeyS",
	a: "KeyA",
	d: "KeyD",
	q: "KeyQ",
	e: "KeyE",
};

type KeysState = { [key: string]: boolean };

export default class InputController {
	canvas: HTMLCanvasElement;
	private current: MouseState; //todo: not any
	private previous: MouseState | null; //todo: not any
	private keys: KeysState; //todo: not any
	private previousKeys: KeysState; //todo: not any

	constructor(canvas) {
		this.canvas = canvas;
		this.initialize();
	}

	private initialize() {
		this.current = {
			leftButton: false,
			rightButton: false,
			mouseX: 0,
			mouseY: 0,
			mouseXDelta: 0,
			mouseYDelta: 0,
		};

		this.previous = null;
		this.keys = {};
		this.previousKeys = {};

		document.addEventListener("mousedown", (e) => this.onMouseDown_(e), false);
		document.addEventListener("mouseup", (e) => this.onMouseUp_(e), false);
		document.addEventListener("mousemove", (e) => this.onMouseMove_(e), false);
		document.addEventListener("keydown", (e) => this.onKeyDown_(e), false);
		document.addEventListener("keyup", (e) => this.onKeyUp_(e), false);
		this.canvas.addEventListener("click", () =>
			this.canvas.requestPointerLock()
		);
		document.addEventListener(
			"pointerlockchange",
			() => this.onPointerLockChange_(),
			false
		);
		document.addEventListener(
			"pointerlockerror",
			() => this.onPointerLockError_(),
			false
		);
	}

	private onMouseDown_(e: MouseEvent): void {
		if (e.button === 0) {
			this.current.leftButton = true;
		} else if (e.button === 2) {
			this.current.rightButton = true;
		}
	}

	private onMouseUp_(e: MouseEvent): void {
		if (e.button === 0) {
			this.current.leftButton = false;
		} else if (e.button === 2) {
			this.current.rightButton = false;
		}
	}

	private onMouseMove_(e: MouseEvent): void {
		if (document.pointerLockElement === this.canvas) {
			this.current.mouseX += e.movementX;
			this.current.mouseY += e.movementY;

			if (this.previous === null) {
				this.previous = { ...this.current };
			}

			this.current.mouseXDelta = this.current.mouseX - this.previous.mouseX;
			this.current.mouseYDelta = this.current.mouseY - this.previous.mouseY;
		}
	}

	private onKeyDown_(e: KeyboardEvent): void {
		this.keys[e.code] = true;
	}

	private onKeyUp_(e: KeyboardEvent): void {
		this.keys[e.code] = false;
	}

	public key(keyCode: string): boolean {
		return !!this.keys[keyCode];
	}

	private onPointerLockChange_(): void {
		if (document.pointerLockElement === this.canvas) {
			console.log("Pointer lock enabled");
		} else {
			console.log("Pointer lock disabled");
		}
	}

	private onPointerLockError_(): void {
		console.log("Pointer lock error");
	}

	update(): void {
		if (this.previous !== null) {
			this.current.mouseXDelta = this.current.mouseX - this.previous.mouseX;
			this.current.mouseYDelta = this.current.mouseY - this.previous.mouseY;

			this.previous = { ...this.current };
		}
	}

	getXH(): number {
		return this.current.mouseXDelta / window.innerWidth;
	}

	getYH(): number {
		return this.current.mouseYDelta / window.innerHeight;
	}
}

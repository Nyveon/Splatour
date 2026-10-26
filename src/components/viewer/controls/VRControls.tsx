import { useInteractions } from "@/hooks/useInteractions";
import { playerHeight } from "@/utils/constants";
import { useFrame, useThree } from "@react-three/fiber";
import { Hand, SparkXr, type JointSplats } from "@sparkjsdev/spark";
import { useEffect, useRef, type RefObject } from "react";
import { Euler, Group, PerspectiveCamera, Vector3 } from "three";

/** Experimental free movement viewer. Tour collisions and portals are not used. */
export default function VRControls({
	containerRef,
	onSessionChange,
}: {
	containerRef: RefObject<HTMLDivElement | null>;
	onSessionChange: (active: boolean) => void;
}) {
	const { gl, camera, scene } = useThree();
	const xrRef = useRef<SparkXr | null>(null);
	const handMeshesRef = useRef<JointSplats[]>([]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		let disposed = false;
		let active = false;
		const rig = new Group();
		rig.name = "DCC Norte VR player";
		const savedPosition = camera.position.clone();
		const savedQuaternion = camera.quaternion.clone();
		let savedParent = camera.parent;

		// Own the DOM element: SparkXr has no dispose method, and its default
		// button is appended to document.body (including during StrictMode setup).
		const panel = document.createElement("div");
		Object.assign(panel.style, {
			display: "none",
			position: "absolute",
			top: "16px",
			left: "50%",
			transform: "translateX(-50%)",
			zIndex: "1000",
			padding: "12px",
			borderRadius: "8px",
			maxWidth: "420px",
			width: "calc(100% - 32px)",
			boxSizing: "border-box",
			background: "rgba(0,0,0,0.8)",
			color: "white",
			textAlign: "center",
			font: "14px sans-serif",
		});
		const button = document.createElement("button");
		button.textContent = "Enter VR";
		button.style.cssText = "padding:12px 24px;cursor:pointer;font:inherit";
		button.style.display = "none";
		const status = document.createElement("p");
		status.setAttribute("role", "status");
		panel.append(button, status);
		container.append(panel);

		const enter = () => {
			if (disposed) return;
			active = true;
			savedPosition.copy(camera.position);
			savedQuaternion.copy(camera.quaternion);
			savedParent = camera.parent;
			// local-floor supplies the user's actual eye height. Only the desktop
			// floor offset belongs on the rig, avoiding a second 1.7 m offset.
			rig.position.set(
				savedPosition.x,
				savedPosition.y - playerHeight,
				savedPosition.z
			);
			rig.rotation.y = new Euler().setFromQuaternion(savedQuaternion, "YXZ").y;
			scene.add(rig);
			rig.add(camera);
			camera.position.set(0, 0, 0);
			camera.quaternion.identity();
			rig.updateMatrixWorld(true);
			if (document.pointerLockElement) document.exitPointerLock();
			useInteractions.getState().unlock();
			panel.style.display = "none";
			onSessionChange(true);
		};
		const exit = () => {
			if (!active) return;
			active = false;
			for (const hand of handMeshesRef.current) hand.updateJoints(undefined);
			if (savedParent) savedParent.add(camera);
			else camera.removeFromParent();
			camera.position.copy(savedPosition);
			camera.quaternion.copy(savedQuaternion);
			camera.updateMatrixWorld(true);
			rig.removeFromParent();
			if (!disposed) {
				panel.style.display = "";
				onSessionChange(false);
			}
		};
		gl.xr.addEventListener("sessionstart", enter);
		gl.xr.addEventListener("sessionend", exit);

		let xr: SparkXr | undefined;
		// React StrictMode replays effects. Cancel the first setup before Spark
		// starts its asynchronous initialization (it has no cancellation API).
		void Promise.resolve().then(async () => {
			if (disposed || !navigator.xr) return;
			try {
				if (
					!(await navigator.xr.isSessionSupported("immersive-vr")) ||
					disposed
				)
					return;
			} catch {
				// A missing device or denied feature policy should leave the normal
				// viewer untouched, without a VR prompt or an error banner.
				return;
			}
			xr = new SparkXr({
				renderer: gl,
				element: button,
				mode: "vr",
				referenceSpaceType: "local-floor",
				enableHands: true,
				frameBufferScaleFactor: 0.7,
				onEnterXr: () => {
					// A session request can finish after navigating away from the demo.
					if (disposed && xr?.session)
						void xr.session.end().catch(console.error);
				},
				controllers: {
					moveSpeed: 1,
					rotateSpeed: 1,
					moveDirection: true,
					// Flat movement only; Spark's defaults also allow trigger flight.
					getMove: ({ left }) =>
						new Vector3(
							Math.abs(left?.axes[2] ?? 0) > 0.15 ? left!.axes[2] : 0,
							0,
							Math.abs(left?.axes[3] ?? 0) > 0.15 ? left!.axes[3] : 0
						),
					getRotate: ({ right }) =>
						new Vector3(
							Math.abs(right?.axes[2] ?? 0) > 0.15 ? right!.axes[2] : 0,
							0,
							0
						),
					getFast: () => false,
					getSlow: () => false,
				},
				onReady: (supported) => {
					if (disposed || !supported) return;
					status.textContent =
						"VR test: left stick moves, right stick turns. Free movement; barriers, portals and information panels are not active in VR. Exit using the Quest menu.";
					panel.style.display = "";
				},
			});
			const hands = [
				xr.makeJointSplats(Hand.left),
				xr.makeJointSplats(Hand.right),
			];
			for (const hand of hands) {
				hand.name = `VR ${hand.hand} hand`;
				hand.raycastable = false;
				hand.visible = false;
				// Update explicitly below: Spark skips invisible meshes, so an
				// onFrame callback alone cannot bring back a hand after tracking loss.
				hand.onFrame = undefined;
			}
			rig.add(...hands);
			handMeshesRef.current = hands;
			xrRef.current = xr;
		});

		// Spark logs request failures. Also keep them visible on the page so a
		// denied permission or failed graphics session can be retried on-headset.
		button.addEventListener(
			"click",
			(event) => {
				event.stopImmediatePropagation();
				if (!xr || disposed) return;
				button.disabled = true;
				const instance = xr;
				void instance
					.toggleXr()
					.then(() => {
						if (!disposed && !instance.session)
							status.textContent =
								"VR did not start. Check browser permissions and try again.";
					})
					.catch((error: unknown) => {
						console.error("Could not toggle VR", error);
						if (!disposed) status.textContent = "VR session failed. Try again.";
					})
					.finally(() => {
						if (!disposed) button.disabled = false;
					});
			},
			{ capture: true }
		);

		return () => {
			disposed = true;
			xrRef.current = null;
			exit();
			for (const hand of handMeshesRef.current) {
				hand.removeFromParent();
				hand.dispose();
			}
			handMeshesRef.current = [];
			gl.xr.removeEventListener("sessionstart", enter);
			gl.xr.removeEventListener("sessionend", exit);
			const session = xr?.session;
			if (session) void session.end().catch(console.error);
			panel.remove();
		};
	}, [gl, camera, scene, containerRef, onSessionChange]);

	useFrame((_state, _delta, xrFrame) => {
		if (!gl.xr.isPresenting || !(camera instanceof PerspectiveCamera)) return;
		gl.xr.updateCamera(camera);
		const xr = xrRef.current;
		if (!xr) return;
		xr.updateControllers(camera);
		// Clear stale poses even when this frame has no usable hand tracking.
		for (const hand of xr.hands) hand.joints = undefined;
		if (xrFrame) xr.updateHands({ xrFrame });
		for (const mesh of handMeshesRef.current) {
			const hand = mesh.hand === Hand.left ? xr.left() : xr.right();
			mesh.updateJoints(hand?.joints);
		}
	}, -1);
	return null;
}

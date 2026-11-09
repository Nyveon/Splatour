import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { useJoystickControls } from "@/hooks/useJoystickControls";
import { useProductStore } from "@/hooks/useProductStore";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { Controls } from "@/utils/constants";
import { invalidateScene } from "@/utils/rendering";
import { useKeyboardControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function RenderOnChange() {
	const invalidate = useThree((state) => state.invalidate);
	const scene = useThree((state) => state.scene);
	const canvas = useThree((state) => state.gl.domElement);
	const [subscribeKeys] = useKeyboardControls<Controls>();
	useEffect(() => {
		const changed = () => invalidateScene(scene, invalidate);
		const subscriptions = [
			subscribeKeys((keys, previous) => {
				if (Object.values(Controls).some((key) => keys[key] !== previous[key]))
					invalidate();
			}),
			useJoystickControls.subscribe(() => invalidate()),
			useGSStore.subscribe(changed),
			useSettingsStore.subscribe(changed),
			useInteractions.subscribe(changed),
			useProductStore.subscribe(() => invalidate()),
		];
		const visible = () => {
			if (!document.hidden) changed();
		};
		window.addEventListener("focus", changed);
		// Editor placement previews follow the pointer even without mouse-look.
		const pointerChanged = () => invalidate();
		canvas.addEventListener("pointermove", pointerChanged);
		canvas.addEventListener("pointerdown", pointerChanged);
		canvas.addEventListener("pointerup", pointerChanged);
		document.addEventListener("visibilitychange", visible);
		changed();
		return () => {
			for (const unsubscribe of subscriptions) unsubscribe();
			window.removeEventListener("focus", changed);
			canvas.removeEventListener("pointermove", pointerChanged);
			canvas.removeEventListener("pointerdown", pointerChanged);
			canvas.removeEventListener("pointerup", pointerChanged);
			document.removeEventListener("visibilitychange", visible);
		};
	}, [invalidate, scene, canvas, subscribeKeys]);
	return null;
}

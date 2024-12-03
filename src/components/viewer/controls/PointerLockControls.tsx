import {
	EventManager,
	ReactThreeFiber,
	RootState,
	useThree,
} from "@react-three/fiber";
import { DomEvent } from "@react-three/fiber/dist/declarations/src/core/events";
import {
	forwardRef,
	ForwardRefExoticComponent,
	PropsWithoutRef,
	RefAttributes,
	useEffect,
	useMemo,
} from "react";
import * as THREE from "three";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";

type ForwardRefComponent<P, T> = ForwardRefExoticComponent<
	PropsWithoutRef<P> & RefAttributes<T>
>;

export type PointerLockControlsProps = ReactThreeFiber.Object3DNode<
	PointerLockControlsImpl,
	typeof PointerLockControlsImpl
> & {
	domElement?: HTMLElement;
	selector?: string;
	enabled?: boolean;
	camera?: THREE.Camera;
	onChange?: (e?: THREE.Event) => void;
	onLock?: (e?: THREE.Event) => void;
	onUnlock?: (e?: THREE.Event) => void;
	makeDefault?: boolean;
};

export const PointerLockControls: ForwardRefComponent<
	PointerLockControlsProps,
	PointerLockControlsImpl
> = /* @__PURE__ */ forwardRef<
	PointerLockControlsImpl,
	PointerLockControlsProps
>(function PointerLockControls(
	{
		domElement,
		selector,
		onChange,
		onLock,
		onUnlock,
		enabled = true,
		makeDefault,
		...props
	},
	ref
) {
	const { camera, ...rest } = props;
	const setEvents = useThree((state) => state.setEvents);
	const gl = useThree((state) => state.gl);
	const defaultCamera = useThree((state) => state.camera);
	const invalidate = useThree((state) => state.invalidate);
	const events = useThree((state) => state.events) as EventManager<HTMLElement>;
	const get = useThree((state) => state.get);
	const set = useThree((state) => state.set);
	const explCamera = camera ?? defaultCamera;
	const explDomElement = domElement ?? events.connected ?? gl.domElement;

	const controls = useMemo(
		() => new PointerLockControlsImpl(explCamera),
		[explCamera]
	);

	useEffect(() => {
		if (enabled) {
			controls.connect(explDomElement);
			// Force events to be centered while PLC is active
			const oldComputeOffsets = get().events.compute;
			setEvents({
				compute(_: DomEvent, state: RootState) {
					const offsetX = state.size.width / 2;
					const offsetY = state.size.height / 2;
					state.pointer.set(
						(offsetX / state.size.width) * 2 - 1,
						-(offsetY / state.size.height) * 2 + 1
					);
					state.raycaster.setFromCamera(state.pointer, state.camera);
				},
			});
			return () => {
				controls.disconnect();
				setEvents({ compute: oldComputeOffsets });
			};
		}
	}, [enabled, controls, explDomElement, get, setEvents]);

	useEffect(() => {
		const callback = (e: THREE.Event) => {
			invalidate();
			if (onChange) onChange(e);
		};

		const ctrls = controls as THREE.EventDispatcher<{
			change: undefined;
			lock: undefined;
			unlock: undefined;
		}>;

		ctrls.addEventListener("change", callback);

		if (onLock) ctrls.addEventListener("lock", onLock);
		if (onUnlock) ctrls.addEventListener("unlock", onUnlock);

		return () => {
			ctrls.removeEventListener("change", callback);
			if (onLock) ctrls.removeEventListener("lock", onLock);
			if (onUnlock) ctrls.removeEventListener("unlock", onUnlock);
		};
	}, [onChange, onLock, onUnlock, selector, controls, invalidate]);

	useEffect(() => {
		if (makeDefault) {
			const old = get().controls;
			set({ controls });
			return () => set({ controls: old });
		}
	}, [makeDefault, controls, get, set]);

	return <primitive ref={ref} object={controls} {...rest} />;
});

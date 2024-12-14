import { useInteractions, UserState } from "@/hooks/useInteractions";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { Controls } from "@/utils/constants";
import { toastError } from "@/utils/toasts";
import { useKeyboardControls as kb } from "@react-three/drei";

export default function Hotkeys() {
	const setUserState = useInteractions((state) => state.setUserState);
	const setDebug = useSettingsStore((state) => state.setDebug);
	const setMobileDebug = useSettingsStore((state) => state.setMobileDebug);
	const setDebugNodes = useSettingsStore((state) => state.setDebugNodes);
	const setNoclip = useSettingsStore((state) => state.setNoclip);

	const newWall = kb<Controls>((state) => state.newWall);
	const newSolid = kb<Controls>((state) => state.newSolid);
	const newArtifact = kb<Controls>((state) => state.newArtifact);
	const newPortal = kb<Controls>((state) => state.newPortal);
	const closeReturn = kb<Controls>((state) => state.closeReturn);
	const togglePreview = kb<Controls>((state) => state.togglePreview);
	const toggleMobile = kb<Controls>((state) => state.toggleMobile);
	const toggleNoclip = kb<Controls>((state) => state.toggleNoclip);
	const toggleNodes = kb<Controls>((state) => state.toggleNodeVisibility);
	const speedUp = kb<Controls>((state) => state.speedUp);
	const speedDown = kb<Controls>((state) => state.speedDown);
	const speedReset = kb<Controls>((state) => state.speedReset);

	if (!useInteractions.getState().isLocked) {
		return;
	}

	if (closeReturn) {
		setUserState(UserState.None);
		useInteractions.getState().resetCurrentNode();
	}

	if (newWall || newSolid || newArtifact || newPortal) {
		if (!useInteractions.getState().currentSceneId) {
			toastError("No scene selected");
		} else {
			if (newWall) setUserState(UserState.BarrierWalls);
			if (newSolid) setUserState(UserState.BarrierSolids);
			if (newArtifact) setUserState(UserState.Artifacts);
			if (newPortal) setUserState(UserState.PortalEdges);
		}
	}

	if (togglePreview) setDebug(!useSettingsStore.getState().debug);
	if (toggleMobile) setMobileDebug(!useSettingsStore.getState().mobileDebug);
	if (toggleNoclip) setNoclip(!useSettingsStore.getState().noclip);
	if (toggleNodes) setDebugNodes(!useSettingsStore.getState().debugNodes);

	if (speedUp) {
		const speed = useSettingsStore.getState().flySpeed;
		useSettingsStore.getState().setFlySpeed(speed * 1.5);
	}

	if (speedDown) {
		const speed = useSettingsStore.getState().flySpeed;
		useSettingsStore.getState().setFlySpeed(speed * 0.75);
	}

	if (speedReset) {
		useSettingsStore.getState().setFlySpeed(1);
	}

	return null;
}

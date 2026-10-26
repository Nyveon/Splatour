import Button from "@/components/input/Button";
import { useScaleCalibration } from "@/hooks/useScaleCalibration";
import {
	calibrationDistance,
	calibrationMultiplier,
} from "@/utils/scaleCalibration";
import { toastError, toastSuccess } from "@/utils/toasts";
import styled from "@emotion/styled";
import SceneCardPanel from "./SceneCardPanel";

const Controls = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	p {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.4;
	}
	input {
		display: block;
		width: 6rem;
		margin-top: 0.25rem;
	}
`;

export default function PanelScaleCalibration({
	sceneId,
}: {
	sceneId: string;
}) {
	const calibration = useScaleCalibration();
	const active = calibration.sceneId === sceneId;
	let distance: number | undefined,
		multiplier: number | undefined,
		error = "";
	if (active && calibration.points.length === 2) {
		try {
			distance = calibrationDistance(calibration.points);
			multiplier = calibrationMultiplier(
				calibration.points,
				calibration.meters
			);
		} catch (cause) {
			error = cause instanceof Error ? cause.message : String(cause);
		}
	}
	const perform = (action: () => void, message: string) => {
		try {
			action();
			toastSuccess(message);
		} catch (cause) {
			toastError(cause instanceof Error ? cause.message : String(cause));
		}
	};
	return (
		<SceneCardPanel
			label="Calibrate scale"
			icon="maximize-2"
			helpInfo={
				"# Calibrate scale\n\nPick two visible points whose real separation you know, then enter that distance in meters. Use the same edge or center on both tape marks, preferably the widest pair. This measures the straight-line distance, so height differences work for vertically aligned marks. Review the correction before applying. All three scale axes are multiplied equally, preserving their proportions. The scene is scaled around its ground-level X/Z origin; information markers, barriers and portals follow. Check connections to other scenes and realign the floor if needed. Undo restores the previous scale and ground nodes unless those properties have since changed. Save the project to keep the result."
			}
		>
			<Controls>
				<p>Pick two reference marks and enter their real separation.</p>
				<label>
					Real distance (meters)
					<input
						type="number"
						aria-label="Scale reference distance in meters"
						min="0.001"
						step="0.01"
						value={
							Number.isFinite(calibration.meters) ? calibration.meters : ""
						}
						onChange={(event) =>
							calibration.setMeters(event.target.valueAsNumber)
						}
					/>
				</label>
				{!active ? (
					<Button
						label="Pick two reference points"
						title="Click two known reference marks in the viewer"
						icon="crosshair"
						onClick={() => calibration.start(sceneId)}
					/>
				) : (
					<>
						<p role="status">
							{calibration.points.length}/2 points.{" "}
							{calibration.points.length < 2
								? "Click a reference mark in the viewer."
								: "Review the correction, then apply."}{" "}
							Esc cancels.
						</p>
						{distance !== undefined && (
							<p>Current separation: {distance.toFixed(4)} scene units.</p>
						)}
						{multiplier !== undefined && (
							<p>
								Scale correction: ×{multiplier.toFixed(4)} (
								{((multiplier - 1) * 100).toFixed(1)}%).
							</p>
						)}
						{error && <p role="alert">{error}</p>}
						<Button
							label="Remove last point"
							title="Choose the last mark again"
							variant={calibration.points.length ? "primary" : "disabled"}
							onClick={calibration.removePoint}
						/>
						<Button
							label="Apply scale calibration"
							title="Scale this scene and its ground nodes"
							variant={multiplier !== undefined ? "primary" : "disabled"}
							onClick={() =>
								perform(
									calibration.apply,
									"Scale calibrated. Save the project to keep the change."
								)
							}
						/>
						<Button
							label="Cancel calibration"
							title="Discard the selected reference points"
							onClick={calibration.cancel}
						/>
					</>
				)}
				{calibration.undoState?.sceneId === sceneId && (
					<Button
						label="Undo scale calibration"
						title="Restore the previous scale and ground nodes"
						icon="rotate-ccw"
						onClick={() =>
							perform(calibration.undo, "Scale calibration undone")
						}
					/>
				)}
			</Controls>
		</SceneCardPanel>
	);
}

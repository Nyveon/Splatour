import Button from "@/components/input/Button";
import Checkbox from "@/components/input/Checkbox";
import { useFloorAlignment } from "@/hooks/useFloorAlignment";
import { floorPlane } from "@/utils/floorAlignment";
import { toastError, toastSuccess } from "@/utils/toasts";
import styled from "@emotion/styled";
import SceneCardPanel from "./SceneCardPanel";

const Controls = styled.div`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	gap: 0.5rem;
	p {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.4;
	}
	input[type="number"] {
		display: block;
		width: 4.5rem;
		margin-top: 0.25rem;
	}
`;

export default function PanelFloorAlignment({ sceneId }: { sceneId: string }) {
	const alignment = useFloorAlignment();
	const active = alignment.sceneId === sceneId;
	let tilt: number | undefined,
		error = "";
	if (active && alignment.points.length === 3) {
		try {
			tilt = floorPlane(alignment.points).tilt;
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
			label="Floor alignment"
			icon="anchor"
			helpInfo={
				"# Floor alignment\n\nFirst place the floor roughly at Y = 0 and approximately horizontal. Detect floor automatically fits a broad plane to the scene's splats near ground level, ignoring outliers. It corrects up to 15 degrees of tilt. Review the triangle, tilt and fit error, then apply. Widen the search height if necessary. If detection fails, pick three widely spaced floor points manually. Information markers follow the scene; barriers and portals are repositioned along the floor. Only this scene is changed: check connections to neighboring scenes, then save the project."
			}
		>
			<Controls>
				<p>Start with the floor approximately level and near Y = 0.</p>
				<label>
					Search height (± meters)
					<input
						type="number"
						aria-label="Floor search height"
						min={0.1}
						max={2}
						step={0.1}
						value={alignment.searchHeight}
						onChange={(event) => {
							const value = Number(event.target.value);
							if (Number.isFinite(value) && value >= 0.1 && value <= 2)
								alignment.setSearchHeight(value);
						}}
					/>
				</label>
				<Button
					title="Fit a horizontal floor plane near the current ground level"
					label={
						active && alignment.status === "detecting"
							? "Detecting floor…"
							: "Detect floor automatically"
					}
					icon="target"
					variant={
						active && alignment.status === "detecting" ? "disabled" : "primary"
					}
					onClick={() => alignment.autoDetect(sceneId)}
				/>
				{!active ? (
					<Button
						title="Pick three floor points in the viewer"
						label="Pick floor points manually"
						icon="crosshair"
						onClick={() => alignment.start(sceneId)}
					/>
				) : (
					<>
						<p role="status">
							{alignment.mode === "manual"
								? `Click three points on the floor: ${alignment.points.length}/3.`
								: alignment.status === "detecting"
									? "Fitting the floor plane…"
									: "Review the detected floor below."}{" "}
							Press Esc to cancel.
						</p>
						{alignment.error && <p role="alert">{alignment.error}</p>}
						{alignment.detection && (
							<p>
								{alignment.detection.inliers} of {alignment.detection.samples}{" "}
								samples fit; error {(alignment.detection.rms * 100).toFixed(1)}{" "}
								cm.
							</p>
						)}
						{tilt !== undefined && <p>Detected tilt: {tilt.toFixed(2)}°</p>}
						{error && <p role="alert">{error}</p>}
						<Checkbox
							label="Move floor to walking height (Y = 0)"
							value={alignment.placeAtZero}
							onChange={alignment.setPlaceAtZero}
						/>
						{alignment.mode === "manual" && (
							<Button
								label="Remove last point"
								title="Choose the last floor point again"
								variant={alignment.points.length ? "primary" : "disabled"}
								onClick={alignment.removePoint}
							/>
						)}
						{alignment.mode === "automatic" &&
							alignment.status !== "detecting" && (
								<Button
									title="Pick three floor points instead"
									label="Pick floor points manually"
									onClick={() => alignment.start(sceneId)}
								/>
							)}
						<Button
							label="Apply floor alignment"
							title="Level this scene using the selected floor"
							variant={tilt !== undefined ? "primary" : "disabled"}
							onClick={() =>
								perform(
									alignment.apply,
									"Floor aligned. Save the project to keep the change."
								)
							}
						/>
						<Button
							label="Cancel alignment"
							title="Discard the picked points"
							onClick={alignment.cancel}
						/>
					</>
				)}
				{alignment.undoState?.sceneId === sceneId && (
					<Button
						label="Undo floor alignment"
						title="Restore placement before the last alignment"
						icon="rotate-ccw"
						onClick={() => perform(alignment.undo, "Floor alignment undone")}
					/>
				)}
			</Controls>
		</SceneCardPanel>
	);
}

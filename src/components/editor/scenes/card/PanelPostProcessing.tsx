import Button from "@/components/input/Button";
import Checkbox from "@/components/input/Checkbox";
import { useGSStore } from "@/hooks/useGSStore";
import {
	resolvePostProcessing,
	type PostProcessingSettings,
} from "@/model/PostProcessing";
import styled from "@emotion/styled";
import SceneCardPanel from "./SceneCardPanel";

const Control = styled.label`
	display: grid;
	grid-template-columns: 1fr auto;
	gap: 0.3rem;
	margin-block: 0.6rem;
	input {
		grid-column: 1 / -1;
		width: 100%;
		accent-color: currentColor;
	}
	output {
		font-variant-numeric: tabular-nums;
	}
`;

const controls = [
	["exposure", "Exposure (stops)", -3, 3, 0.05],
	["exposureRange", "Auto range (± stops)", 0, 2, 0.1],
	["adaptationTime", "Adaptation (seconds)", 0.2, 5, 0.1],
	["contrast", "Contrast", 0.5, 1.5, 0.01],
	["saturation", "Saturation", 0, 2, 0.01],
	["temperature", "Temperature (cool / warm)", -1, 1, 0.01],
	["tint", "Tint (green / magenta)", -1, 1, 0.01],
] as const;

export default function PanelPostProcessing({ sceneId }: { sceneId: string }) {
	const stored = useGSStore(
		(state) => state.gsmap.scenes[sceneId].postProcessing
	);
	const settings = resolvePostProcessing(stored);
	const update = (values: Partial<PostProcessingSettings>) => {
		const store = useGSStore.getState();
		store.setSceneTransform(sceneId, {
			postProcessing: resolvePostProcessing({
				...store.gsmap.scenes[sceneId].postProcessing,
				...values,
			}),
		});
	};
	return (
		<SceneCardPanel
			label="Post-processing"
			icon="sliders"
			helpInfo={
				"# Post-processing\n\nAuto exposure gently adapts to the view within the chosen range around Exposure. Bright highlights have less influence. Adaptation pauses while splats load. Contrast, saturation and white balance stay fixed. Settings are saved with this scene and exported tours."
			}
		>
			<div>
				<Checkbox
					label="Auto exposure"
					value={settings.autoExposure}
					onChange={(autoExposure) => update({ autoExposure })}
				/>
				{controls.map(([key, label, min, max, step]) => (
					<Control key={key}>
						<span>{label}</span>
						<output>{settings[key].toFixed(2)}</output>
						<input
							type="range"
							aria-label={label}
							min={min}
							max={max}
							step={step}
							value={settings[key]}
							disabled={
								!settings.autoExposure &&
								(key === "exposureRange" || key === "adaptationTime")
							}
							onChange={(e) => update({ [key]: Number(e.target.value) })}
						/>
					</Control>
				))}
				<Button
					label="Reset look"
					title="Restore default post-processing"
					icon="rotate-ccw"
					onClick={() => update(resolvePostProcessing())}
				/>
			</div>
		</SceneCardPanel>
	);
}

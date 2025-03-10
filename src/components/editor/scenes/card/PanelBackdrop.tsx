import { useGSStore } from "@/hooks/useGSStore";
import { defaultSkyFlat, defaultSkyHemi } from "@/model/GSSky";
import { AppIcons, createDropdownStyles } from "@/utils/theme";
import { useState } from "react";
import Select from "react-select";
import BackdropFlat from "../elements/BackdropFlat";
import BackdropHemi from "../elements/BackdropHemi";
import SceneCardPanel from "./SceneCardPanel";

type BackdropStyle = "sky" | "flat" | "hemi";

interface Option {
	value: BackdropStyle;
	label: string;
}

const options: Option[] = [
	{ value: "sky", label: "Default sky" },
	{ value: "flat", label: "Flat color" },
	{ value: "hemi", label: "Hemispheres" },
];

function getInitialValue(sceneId: string) {
	const sky = useGSStore.getState().gsmap.scenes[sceneId].sky;
	const value = sky ? sky.type : "sky";
	return options.find((option) => option.value === value) ?? options[0];
}

const helpInfo = `
# *icon-${AppIcons.Backdrop}* Backdrop

The scene's background and lighting settings. All scenes have a backdrop.
Setting this can be useful for patching holes in the scene.

## Default sky

A realistic blue sky with the sun placed close to the horizon.

## Flat color

A single color that fills the entire sky.

## Hemispheres

Two colors that split the sky into two hemispheres (upper and lower).
`;

export default function PanelBackdrop({ sceneId }: { sceneId: string }) {
	const [backdrop, setBackdrop] = useState<Option>(getInitialValue(sceneId));
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);

	function handleChange(option: Option) {
		setBackdrop(option);

		switch (option.value) {
			case "sky":
				setSceneTransform(sceneId, {
					sky: undefined,
				});
				break;
			case "flat":
				setSceneTransform(sceneId, {
					sky: defaultSkyFlat,
				});
				break;
			case "hemi":
				setSceneTransform(sceneId, {
					sky: defaultSkyHemi,
				});
				break;
			default:
				return option.value satisfies never;
		}
	}

	return (
		<SceneCardPanel
			label="Backdrop"
			icon={AppIcons.Backdrop}
			helpInfo={helpInfo}
		>
			<Select
				styles={createDropdownStyles<Option>()}
				menuPosition="fixed"
				options={options}
				value={backdrop}
				onChange={(option) => {
					if (option) handleChange(option);
				}}
			/>

			{backdrop.value === "flat" && <BackdropFlat sceneId={sceneId} />}
			{backdrop.value === "hemi" && <BackdropHemi sceneId={sceneId} />}
		</SceneCardPanel>
	);
}

import { useGSStore } from "@/hooks/useGSStore";
import { assertNodeIsPortalEdge } from "@/model/GSNode";
import { createDropdownStyles } from "@/utils/theme";
import Select from "react-select";
import { useShallow } from "zustand/react/shallow";
import NodePanel from "../shared/NodePanel";

interface Option {
	value: string; // scene id
	label: string; // scene name + id hint
}

export default function PortalSceneDestination({
	leavingFrom,
	portalId,
}: {
	leavingFrom: string;
	portalId: string;
}) {
	const sceneIds = useGSStore(
		useShallow((state) => Object.keys(state.gsmap.scenes))
	);
	const portalDestination = useGSStore((state) => {
		const portal = state.gsmap.scenes[leavingFrom].portals[portalId];
		assertNodeIsPortalEdge(portal);
		return portal.destination;
	});
	const setNodeTransform = useGSStore((state) => state.setNodeTransform);

	const handleChange = (option: Option) => {
		setNodeTransform(leavingFrom, portalId, {
			destination: option.value,
		});
	};

	//* a node panel only renders if its scene is also the selecte scene
	//? so, in theory, names and ids should never change after render

	const options: Option[] = sceneIds.map((sceneId) => {
		const sceneName = useGSStore.getState().gsmap.scenes[sceneId].name;
		const abbrSceneId =
			sceneId === leavingFrom ? "self" : sceneId.split("-")[0];

		return {
			value: sceneId,
			label: `${sceneName} [${abbrSceneId}]`,
		};
	});

	const currentOption = options.find(
		(option) => option.value === portalDestination
	);

	console.log("rerender");

	return (
		<NodePanel label="Destination" icon="log-out" vertical={true}>
			<Select
				styles={createDropdownStyles()}
				menuPosition="fixed"
				options={options}
				value={currentOption}
				onChange={(option) => {
					if (option) handleChange(option);
				}}
			/>
		</NodePanel>
	);
}

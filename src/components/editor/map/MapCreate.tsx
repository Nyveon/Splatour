import Button from "@/components/input/Button";
import { useGSStore } from "@/hooks/useGSStore";
import { gsmCreateEmpty } from "@/model/GSMap";

function createBlankMap() {
	const newMap = gsmCreateEmpty();
	useGSStore.setState({ gsmap: newMap });
}

//todo: re-do this to require a folder
export default function MapCreate() {
	return (
		<Button
			title="Create a new (blank) map"
			label="Create"
			icon="file-plus"
			variant="disabled"
			onClick={createBlankMap}
		/>
	);
}

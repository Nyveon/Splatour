import Button from "@/components/input/Button";
import { useGSStore } from "@/hooks/useGSStore";
import { gsmCreateEmpty } from "@/model/GSMap";

function createBlankMap() {
	const newMap = gsmCreateEmpty();
	useGSStore.setState({ gsmap: newMap });
}

export default function MapCreate() {
	return (
		<Button
			title="Create a new (blank) map"
			label="Create"
			icon="file-plus"
			onClick={createBlankMap}
		/>
	);
}

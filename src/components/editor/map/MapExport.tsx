import Button from "@/components/input/Button";
import { useGSStore } from "@/hooks/useGSStore";
import { gsmSerialize } from "@/model/GSMap";

function downloadMap() {
	const gsmap = useGSStore.getState().gsmap;
	const serializedMap = JSON.stringify(gsmSerialize(gsmap));
	const blob = new Blob([serializedMap], { type: "application/json" });
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	const filename = gsmap.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
	link.download = filename + ".json";
	link.click();
}

export default function MapExport() {
	const directoryHandle = useGSStore((state) => state.gsmap.directoryHandle);

	return (
		<Button
			title={
				directoryHandle
					? "Export the project as a website .zip file"
					: "Can't export without a project directory"
			}
			label="Export"
			icon="download"
			// variant={directoryHandle ? "primary" : "disabled"}
			variant="disabled" //todo proper map exporting
			onClick={downloadMap}
		/>
	);
}

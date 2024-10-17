import GS3dMap from "./maps/GS3dMap.ts";
import GS3dViewer from "./maps/GS3dViewer.ts";

function handleModalSubmit() {
	const modal = document.getElementById("myModal")!;
	const fileInput: HTMLInputElement = document.getElementById(
		"fileInput"
	) as HTMLInputElement;

	if (!fileInput || !fileInput.files) {
		alert("File input not found.");
		return;
	}

	const file = fileInput.files[0];

	if (!file) {
		alert("Please select a JSON file");
		return;
	}

	const reader = new FileReader();

	reader.onload = function (e) {
		try {
			if (!e.target || !e.target.result) {
				throw new Error("Invalid file data.");
			}

			console.log("JSON data uploaded:", e.target.result);
			const gsmap = GS3dMap.deserialize(e.target.result.toString());
			const world = new GS3dViewer(gsmap, false);
		} catch (error) {
			alert("Invalid JSON file." + error);
		}
	};

	reader.readAsText(file);

	modal.classList.add("hidden");
}

document
	.getElementById("modalButton")!
	.addEventListener("click", handleModalSubmit);

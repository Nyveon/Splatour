import feather from "feather-icons";
import Alpine from "alpinejs";

import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

import GS3dMap from "./maps/GS3dMap.ts";
import GS3dViewer from "./maps/GS3dViewer.ts";

window.GS3dMap = GS3dMap;
window.GS3dViewer = GS3dViewer;

/**
 * Alpine.js directive to render Feather icons
 * Replaces data-feather
 * Reasoning: x-if and similar would mean having to do feather.replace() every time the element is added to the DOM
 */
Alpine.directive(
	"feather",
	(el: HTMLElement, { expression }: { expression: string }) => {
		const icons = feather.icons as Record<string, { toSvg: () => string }>;

		if (typeof expression !== "string" || !icons[expression]) {
			console.warn(`Invalid feather icon name: ${expression}`);
			return;
		}

		const svgString = icons[expression].toSvg();
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = svgString;
		const icon = tempDiv.firstElementChild as SVGElement | null;

		el.classList.add("feather");

		if (icon) {
			el.appendChild(icon);
		}
	}
);

window.Alpine = Alpine;
Alpine.start();

window.successToast = function (message: string) {
	Toastify({
		text: message,
		duration: 3000,
		gravity: "bottom",
		style: {
			background: "var(--primary-color)",
		},
	}).showToast();
};

window.warningToast = function (message: string) {
	Toastify({
		text: message,
		duration: 3000,
		gravity: "bottom",
		style: {
			background: "var(--danger-color)",
		},
	}).showToast();
};

window.copyToClipboard = function (valueName: string, value: string) {
	navigator.clipboard
		.writeText(value)
		.then(() => {
			successToast("Copied " + valueName + " to clipboard");
		})
		.catch((_) => {
			warningToast("Failed to copy " + valueName + " to clipboard");
		});
};

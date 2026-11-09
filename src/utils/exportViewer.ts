export const viewerTemplateFiles: Record<string, string> = {
	"assets/index.css": "text/css",
	"assets/index.js": "text/javascript",
	"assets/main.woff2": "font/woff2",
	"assets/feather-sprite.svg": "image/svg+xml",
	"coi.js": "text/javascript",
	"index.html": "text/html",
};

export async function fetchViewerTemplate(basePath = "./export/") {
	const files: Record<string, Uint8Array> = {};
	for (const fileName of Object.keys(viewerTemplateFiles)) {
		const response = await fetch(`${basePath}${fileName}`);
		if (!response.ok) {
			throw new Error(
				`Could not load export viewer ${fileName} (${response.status}).`
			);
		}
		const bytes = new Uint8Array(await response.arrayBuffer());
		const text = new TextDecoder().decode(bytes.subarray(0, 4096));
		const isHtml =
			response.headers.get("content-type")?.includes("text/html") === true ||
			/^\s*(?:<!doctype html|<html)/i.test(text);
		if (
			(fileName !== "index.html" && isHtml) ||
			(fileName === "index.html" &&
				(!isHtml || /\/@vite|\/@react-refresh|\/src\//.test(text)))
		) {
			throw new Error(
				`Invalid export viewer ${fileName}. The built viewer template is unavailable.`
			);
		}
		files[fileName] = bytes;
	}
	return files;
}

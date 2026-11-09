import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react-swc";
import { existsSync, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, type Rolldown } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { viewerTemplateFiles } from "./src/utils/exportViewer.ts";

function sceneAssets(folder: string, extensions: RegExp) {
	return readdirSync(folder)
		.filter(
			(name) => extensions.test(name) || /\.spz\.(parts|part\d+)$/i.test(name)
		)
		.filter(
			(name) => !/\.spz$/i.test(name) || !existsSync(`${folder}/${name}.parts`)
		)
		.map((name) => ({ src: `./${folder}/${name}`, dest: `./${folder}` }));
}

export default defineConfig(({ mode }) => {
	const isViewer = mode === "viewer";

	// coi-serviceworker
	const staticFiles = [{ src: "./public/coi.js", dest: "./" }];
	const rollupOutputOptions: Rolldown.OutputOptions = {};

	if (!isViewer) {
		staticFiles.push({
			src: "./src/assets/images/feather-sprite.svg",
			dest: "./assets",
		});
		staticFiles.push({ src: "./public/CNAME", dest: "./" });
		// mobile.json
		// staticFiles.push({ src: "./public/converted_file.ksplat", dest: "./" });
		// staticFiles.push({ src: "./public/test.ksplat", dest: "./" });
		// staticFiles.push({ src: "./public/SalitaFinal.ksplat", dest: "./" });

		// Publish the flat DCC Norte project folder.
		staticFiles.push(...sceneAssets("DCC_Norte", /\.(json|ply|ksplat|spz)$/i));

		// Demo: Supermarket
		staticFiles.push(
			...sceneAssets("Supermarket", /\.(json|spz|png|jpg|jpeg|webp)$/i)
		);

		// Demo: Khachkars
		staticFiles.push(...sceneAssets("Khachkars", /\.ksplat$/i));
	} else {
		rollupOutputOptions.entryFileNames = `assets/[name].js`;
		rollupOutputOptions.chunkFileNames = `assets/[name].js`;
		rollupOutputOptions.assetFileNames = `assets/[name].[ext]`;
	}

	return {
		base: isViewer ? "./" : "/",
		publicDir: false,
		plugins: [
			react(),
			basicSsl(),
			{
				name: "splatour-export-template",
				configureServer(server) {
					// Serve built files before Vite's HTML fallback can substitute the editor.
					server.middlewares.use("/export", (req, res) => {
						const fileName = new URL(
							req.url ?? "/",
							"http://localhost"
						).pathname.slice(1);
						if (!Object.hasOwn(viewerTemplateFiles, fileName)) {
							res.statusCode = 404;
							res.end("Export viewer file not found");
							return;
						}
						void readFile(
							resolve(server.config.root, "docs/export", fileName)
						).then(
							(data) => {
								res.setHeader("Content-Type", viewerTemplateFiles[fileName]);
								res.end(data);
							},
							() => {
								res.statusCode = 404;
								res.end(
									"Export viewer template unavailable. Run npm run build:viewer."
								);
							}
						);
					});
				},
			},
			{
				name: "splatour-entry",
				transformIndexHtml: {
					order: "pre",
					handler: (html) =>
						html.replace(
							"<%- REACT_SCRIPT_SOURCE %>",
							isViewer ? "/src/export.tsx" : "/src/main.tsx"
						),
				},
			},
			visualizer({
				open: false,
				filename: "bundle-visualization.html",
				template: "network",
			}),
			viteStaticCopy({
				targets: staticFiles.map((target) => ({
					...target,
					rename: { stripBase: true },
				})),
			}),
		],
		build: {
			outDir: isViewer ? "docs/export" : "docs",
			emptyOutDir: true,
			rolldownOptions: {
				output: rollupOutputOptions,
			},
		},
		server: {
			port: 8080,
			headers: {
				"Cross-Origin-Embedder-Policy": "require-corp",
				"Cross-Origin-Opener-Policy": "same-origin",
			},
		},
		preview: {
			headers: {
				"Cross-Origin-Embedder-Policy": "require-corp",
				"Cross-Origin-Opener-Policy": "same-origin",
			},
		},
		resolve: {
			tsconfigPaths: true,
			alias: [
				{ find: "@assets", replacement: "/src/assets" },
				{ find: "@components", replacement: "/src/components" },
				{ find: "@pages", replacement: "/src/pages" },
				{ find: "@hooks", replacement: "/src/hooks" },
			],
		},
	};
});

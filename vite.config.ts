import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, type Rolldown } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

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

		// Demo: DCC Norte
		staticFiles.push({
			src: "./DCC_Norte/hallway.compressed.ply",
			dest: "./DCC_Norte",
		});
		staticFiles.push({
			src: "./DCC_Norte/ofisalita.compressed.ply",
			dest: "./DCC_Norte",
		});
		staticFiles.push({
			src: "./DCC_Norte/salita2x.compressed.ply",
			dest: "./DCC_Norte",
		});

		// Demo: Khachkars
		staticFiles.push({
			src: "./Khachkars/Khachkar_12_4.ksplat",
			dest: "./Khachkars",
		});
		staticFiles.push({
			src: "./Khachkars/Khachkar_12_5.ksplat",
			dest: "./Khachkars",
		});
	} else {
		rollupOutputOptions.entryFileNames = `assets/[name].js`;
		rollupOutputOptions.chunkFileNames = `assets/[name].js`;
		rollupOutputOptions.assetFileNames = `assets/[name].[ext]`;
	}

	return {
		publicDir: false,
		plugins: [
			react(),
			basicSsl(),
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

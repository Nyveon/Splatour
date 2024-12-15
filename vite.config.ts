import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, Rollup } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
	const isViewer = mode === "viewer";

	// coi-serviceworker
	const staticFiles = [{ src: "./public/coi.js", dest: "./" }];
	const rollupOutputOptions: Rollup.OutputOptions = {};

	if (!isViewer) {
		staticFiles.push({
			src: "./src/assets/images/feather-sprite.svg",
			dest: "./assets",
		});
		// staticFiles.push({ src: "./public/CNAME", dest: "./" });
		// mobile.json
		// staticFiles.push({ src: "./public/converted_file.ksplat", dest: "./" });
		// staticFiles.push({ src: "./public/test.ksplat", dest: "./" });
		// staticFiles.push({ src: "./public/SalitaFinal.ksplat", dest: "./" });
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
			tsconfigPaths(),
			createHtmlPlugin({
				inject: {
					data: {
						REACT_SCRIPT_SOURCE: isViewer ? "/src/export.tsx" : "/src/main.tsx",
					},
				},
			}),
			visualizer({
				open: false,
				filename: "bundle-visualization.html",
				template: "network",
			}),
			viteStaticCopy({
				targets: staticFiles,
			}),
		],
		build: {
			outDir: isViewer ? "docs/export" : "docs",
			emptyOutDir: true,
			rollupOptions: {
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
			alias: [
				{ find: "@assets", replacement: "/src/assets" },
				{ find: "@components", replacement: "/src/components" },
				{ find: "@pages", replacement: "/src/pages" },
				{ find: "@hooks", replacement: "/src/hooks" },
			],
		},
	};
});

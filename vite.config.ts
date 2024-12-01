import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
	const isViewer = mode === "viewer";

	return {
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
				open: true,
				filename: "bundle-visualization.html",
				template: "network",
			}),
		],
		build: {
			outDir: isViewer ? "docs/export" : "docs",
			emptyOutDir: true,
			rollupOptions: {
				treeshake: true,
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

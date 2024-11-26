import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), basicSsl(), tsconfigPaths()],
	build: {
		outDir: "docs",
		emptyOutDir: true,
	},
	server: {
		port: 8080,
		https: true,
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
});

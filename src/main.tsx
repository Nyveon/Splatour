import mapURL from "@/assets/maps/salita.json?url";
import { css, Global } from "@emotion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";
import Editor from "./pages/Editor";
import Index from "./pages/Index";
import Preview from "./pages/Preview";
import { color } from "./utils/theme";

const root = document.getElementById("root");

if (root === null) {
	throw new Error("Root element not found");
}

createRoot(root).render(
	<StrictMode>
		<Global
			styles={css`
				body {
					color: ${color.textDark};
					background-color: ${color.backgroundLight};
				}
			`}
		/>
		<HashRouter>
			<Routes>
				<Route path="/" element={<Index />} />
				<Route path="viewer" element={<Preview mapURL={mapURL} />} />
				<Route path="editor" element={<Editor />} />
			</Routes>
		</HashRouter>
	</StrictMode>
);

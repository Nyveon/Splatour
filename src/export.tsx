import { color } from "@/utils/theme";
import { css, Global } from "@emotion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Preview from "./pages/Preview";

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
		<Preview mapURL="./gsmap/gsmap.json" />
	</StrictMode>
);

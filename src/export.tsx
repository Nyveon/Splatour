import ExportedView from "@/components/viewer/ExportedView";
import { color } from "@/utils/theme";
import { css, Global } from "@emotion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { gsmCreateEmpty, gsmSerialize } from "./model/GSMap";

const root = document.getElementById("root");

if (root === null) {
	throw new Error("Root element not found");
}

const placeholder = gsmSerialize(gsmCreateEmpty());

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
		<ExportedView serialMap={placeholder} />
	</StrictMode>
);

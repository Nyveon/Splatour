import { css, Global } from "@emotion/react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Editor from "./pages/Editor";
import App from "./pages/Index";
import Viewer from "./pages/Preview";
import { color } from "./utils/theme";

const router = createHashRouter(
	[
		{
			path: "/",
			element: <App />,
		},
		{
			path: "viewer",
			element: <Viewer />,
		},
		{
			path: "editor",
			element: <Editor />,
		},
	],
	{
		future: {
			v7_fetcherPersist: true,
			v7_normalizeFormMethod: true,
			v7_partialHydration: true,
			v7_relativeSplatPath: true,
			v7_skipActionErrorRevalidation: true,
		},
	},
);

const root = document.getElementById("root");

if (root === null) {
	throw new Error("Root element not found");
}

createRoot(root).render(
	<StrictMode>
		<Global
			styles={css`
				*,
				*::before,
				*::after {
					box-sizing: border-box;
				}

				html {
					-moz-text-size-adjust: none;
					-webkit-text-size-adjust: none;
					text-size-adjust: none;
				}

				body {
					margin: 0;
					width: 100vw;
					max-width: 100%;
					height: 100vh;
					max-height: 100%;

					text-align: center;
					font-family: "Roboto", sans-serif;
					color: ${color.textDark};
					background-color: ${color.backgroundLight};
					line-height: 1.5;
				}

				body,
				h1,
				h2,
				h3,
				h4,
				p,
				figure,
				blockquote,
				dl,
				dd {
					margin-block-end: 0;
				}

				h1,
				h2,
				h3,
				h4,
				button,
				input,
				label {
					line-height: 1.1;
				}

				input,
				button,
				textarea,
				select {
					font-family: inherit;
					font-size: inherit;
				}

				#root {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					width: 100%;
					height: 100%;
				}
			`}
		/>
		<RouterProvider router={router} />,
	</StrictMode>,
);

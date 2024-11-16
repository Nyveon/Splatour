import { css, Global } from "@emotion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Editor from "./pages/Editor";
import App from "./pages/Index";
import Viewer from "./pages/Preview";

import { color } from "./utils/theme";

const router = createBrowserRouter(
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
	// {
	// 	basename: "/GaussianSplats3DMaps",
	// },
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

				body {
					margin: 0;
					width: 100vw;
					max-width: 100%;
					height: 100vh;
					max-height: 100%;

					text-align: center;
					font-family: Arial, sans-serif;
					color: ${color.textDark};
					background-color: ${color.backgroundLight};
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
		<RouterProvider router={router} />
	</StrictMode>,
);

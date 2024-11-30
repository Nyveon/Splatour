import { css, Global } from "@emotion/react";
import { HashRouter, Route, Routes } from "react-router";
import { color } from "./utils/theme";

import Editor from "./pages/Editor";
import Index from "./pages/Index";
import Preview from "./pages/Preview";

export default function App() {
	return (
		<>
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
						padding: 0;

						width: 100vw;
						max-width: 100%;
						height: 100dvh;
						max-height: 100%;

						text-align: center;
						font-family: "Roboto", sans-serif;
						color: ${color.textDark};
						background-color: ${color.backgroundLight};
						line-height: 1.5;
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

					ul {
						list-style-type: none;
						padding: 0;
					}
				`}
			/>
			<HashRouter>
				<Routes>
					<Route path="/" element={<Index />} />
					<Route path="viewer" element={<Preview />} />
					<Route path="editor" element={<Editor />} />
				</Routes>
			</HashRouter>
		</>
	);
}

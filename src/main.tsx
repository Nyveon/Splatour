import { css, Global } from "@emotion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SimpleBenchmark from "./pages/benchmarks/SimpleBenchmark";
import DCCNorte from "./pages/demos/DCCNorte";
import Khachkars from "./pages/demos/Khachkars";
import Editor from "./pages/Editor";
import Index from "./pages/Index";
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
		<ToastContainer
			style={{
				zIndex: 10000,
			}}
			position="bottom-right"
		/>
		<HashRouter>
			<Routes>
				<Route path="/" element={<Index />} />
				<Route path="editor" element={<Editor />} />
				<Route path="dcc" element={<DCCNorte />} />
				<Route path="khachkars" element={<Khachkars />} />
				<Route path="benchmark" element={<SimpleBenchmark />} />
			</Routes>
		</HashRouter>
	</StrictMode>
);

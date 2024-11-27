import MapName from "@/components/editor/inputs/MapName";
import Viewer from "@/components/viewer/Viewer";
import styled from "@emotion/styled";
import { useEffect } from "react";
import Sidebar from "../components/editor/Sidebar";
import Toolbar from "../components/editor/Toolbar";
import { useSettingsStore } from "../hooks/useSettingsStore";
import { color } from "../utils/theme";

const s = {
	header: styled.header`
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		padding-inline: 2rem;
		height: 4rem;
		width: 100%;

		background-color: ${color.backgroundDark};
		color: ${color.textLight};
	`,

	aside: styled.aside`
		display: flex;
		flex-direction: column;
		gap: 1rem;

		width: 16rem;
		height: 100%;

		border: 1px solid black;
		background-color: ${color.backgroundDark};
		color: ${color.textLight};

		text-align: left;
	`,

	main: styled.main`
		display: flex;
		width: 100%;
		height: 100%;
		max-width: 100%;
	`,

	preview: styled.section`
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		width: 100%;
		height: 100%;
	`,

	left: styled.div`
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
	`,
};

export default function Editor() {
	const initializeSettings = useSettingsStore(
		(state) => state.initializeSettings
	);

	useEffect(() => {
		initializeSettings({ debug: true, mobileDebug: false });
	}, [initializeSettings]);

	return (
		<>
			<s.header>
				<s.left>
					<MapName />
					<Toolbar />
				</s.left>
				<span>Placeholder</span>
			</s.header>

			<s.main>
				<s.aside>
					<Sidebar />
				</s.aside>
				<s.preview>
					<Viewer />
				</s.preview>
			</s.main>
		</>
	);
}

import styled from "@emotion/styled";
import Sidebar from "../components/editor/Sidebar";
import Toolbar from "../components/editor/Toolbar";
import Viewer from "../components/Viewer";
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
};

export default function Editor() {
	return (
		<>
			<s.header>
				<Toolbar />
			</s.header>
			<s.aside>
				<Sidebar />
			</s.aside>
			<Viewer debug={true} />
		</>
	);
}

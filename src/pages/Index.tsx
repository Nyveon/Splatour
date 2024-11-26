import styled from "@emotion/styled";
import { Link } from "react-router";
import { color } from "../utils/theme";

const s = {
	Link: styled(Link)`
		display: block;
		padding: 10px;
		text-align: center;
		background-color: ${color.primary};
		color: white;
		text-decoration: none;
		border-radius: 5px;
		cursor: pointer;

		&:hover {
			background-color: ${color.primaryDark};
		}
	`,

	ul: styled.ul`
		padding: 0;
		list-style: none;
	`,

	li: styled.li`
		margin-bottom: 10px;
	`,
};

export default function App() {
	return (
		<>
			<h1>Gaussian Splats 3D Maps</h1>

			<p>
				<i>Trabajo de título de Eric Kirchgesser, 2024</i>
			</p>

			<s.ul>
				<s.li>
					<s.Link to="viewer">Viewer</s.Link>
				</s.li>
				<s.li>
					<s.Link to="editor">Editor</s.Link>
				</s.li>
			</s.ul>
		</>
	);
}

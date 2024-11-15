import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { color } from "../utils/theme";

const PageLink = styled(Link)`
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
`;

const LinkList = styled.ul`
	padding: 0;
	list-style: none;
`;

const LinkListItem = styled.li`
	margin-bottom: 10px;
`;

export default function App() {
	return (
		<>
			<h1>Gaussian Splats 3D Maps</h1>

			<p>
				<i>Trabajo de título de Eric Kirchgesser, 2024</i>
			</p>

			<LinkList>
				<LinkListItem>
					<PageLink to="viewer">Viewer</PageLink>
				</LinkListItem>
				<LinkListItem>
					<PageLink to="editor">Editor</PageLink>
				</LinkListItem>
			</LinkList>
		</>
	);
}

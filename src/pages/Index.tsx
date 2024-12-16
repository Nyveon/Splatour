import styled from "@emotion/styled";
import { Link as BaseLink } from "react-router";
import { color } from "../utils/theme";

const Link = styled(BaseLink)`
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
					<Link to="dcc">Demo: DCC Norte</Link>
				</LinkListItem>
				<LinkListItem>
					<Link to="khachkars">Demo: Khachkars</Link>
				</LinkListItem>
				<LinkListItem>
					<Link to="viewer">Viewer</Link>
				</LinkListItem>
				<LinkListItem>
					<Link to="editor">Editor</Link>
				</LinkListItem>
			</LinkList>
		</>
	);
}

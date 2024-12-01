import Viewer from "@/components/viewer/Viewer";
import styled from "@emotion/styled";
import { renderToString } from "react-dom/server";
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
					<Link to="viewer">Viewer</Link>
				</LinkListItem>
				<LinkListItem>
					<Link to="editor">Editor</Link>
				</LinkListItem>
				<LinkListItem>
					<button
						onClick={() => {
							const html = renderToString(<Viewer />);
							alert(html);
						}}
					>
						test
					</button>
				</LinkListItem>
			</LinkList>
		</>
	);
}

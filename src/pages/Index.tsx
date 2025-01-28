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

const InfoParagraph = styled.p`
	max-width: 70ch;
`;

export default function App() {
	return (
		<>
			<h1>Splatour</h1>

			<InfoParagraph>
				Web-based viewer & editor for immersive multimedia scenes, maps and
				virtuals tours combining web components, traditional 3D models and 3D
				Gaussian Splatting.
			</InfoParagraph>

			<LinkList>
				<LinkListItem>
					<Link to="dcc">Demo: DCC Norte</Link>
				</LinkListItem>
				<LinkListItem>
					<Link to="khachkars">Demo: Khachkars</Link>
				</LinkListItem>
				<LinkListItem>
					<Link to="editor">Editor</Link>
				</LinkListItem>
				<LinkListItem>
					<Link to="benchmark">Simple Benchmark</Link>
				</LinkListItem>
				<LinkListItem>
					<a
						href="https://github.com/Nyveon/Splatour"
						target="_blank"
						rel="noreferrer"
					>
						Github Repository
					</a>
				</LinkListItem>
			</LinkList>

			<InfoParagraph>
				<i>
					<a href="https://github.com/Nyveon" target="_blank" rel="noreferrer">
						Eric K
					</a>
					&apos;s Bachelor of Science Thesis project @ Universidad de Chile,
					FCFM, 2024.
				</i>
			</InfoParagraph>
		</>
	);
}

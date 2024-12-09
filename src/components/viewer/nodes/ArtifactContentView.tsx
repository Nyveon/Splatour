import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { Html } from "@react-three/drei";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const InfoContainer = styled.div`
	color: ${color.textDark};
	background-color: ${color.backgroundLight};
	padding: 1rem;
	border-radius: 1rem;

	min-width: 200px;
	width: max-content;
	max-width: min(80ch, 33vw);

	cursor: pointer;
`;

//todo: make images work
// - in local need to load and turn into blob url
// - in viewer need to load from asset folder
// - when exporting need to include images

//todo: make all link target blank. rehype plugin?

export default function ArtifactContentView({
	active,
	sceneId,
	artifactId,
}: {
	active: boolean;
	sceneId: string;
	artifactId: string;
}) {
	const content = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[artifactId].content
	);

	const currentNodeId = useInteractions((state) => state.currentNodeId);

	if (!active && currentNodeId !== artifactId) return null;
	if (!content) return null;

	return (
		<Html center>
			<InfoContainer>
				<Markdown
					remarkPlugins={[remarkGfm]}
					components={{
						h1: "h2",
						h2: "h3",
						h3: "h4",
					}}
				>
					{content}
				</Markdown>
			</InfoContainer>
		</Html>
	);
}

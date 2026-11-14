import Icon from "@/components/Icon";
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

	box-sizing: border-box;
	min-width: min(200px, calc(100vw - 2rem));
	width: max-content;
	max-width: min(60ch, 33vw);
	max-height: 50dvh;
	overflow-y: auto;
	overscroll-behavior: contain;
	touch-action: pan-y;
	overflow-wrap: anywhere;
	img {
		max-width: 100%;
		height: auto;
	}
	.close-control {
		position: sticky;
		top: 0;
		height: 0;
		z-index: 1;
	}
	.close-control button {
		position: absolute;
		top: -0.75rem;
		right: -0.75rem;
		display: grid;
		place-items: center;
		min-width: 44px;
		min-height: 44px;
		border: 0;
		border-radius: 50%;
		background: ${color.backgroundLight};
		color: inherit;
		cursor: pointer;
	}
	@media (pointer: coarse), (max-width: 768px) {
		max-width: min(60ch, calc(100vw - 2rem));
	}
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
	onClose,
}: {
	active: boolean;
	sceneId: string;
	artifactId: string;
	onClose: () => void;
}) {
	const content = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[artifactId].content
	);
	const currentNodeId = useInteractions((state) => state.currentNodeId);

	if (!active && currentNodeId !== artifactId) return null;
	if (!content) return null;

	return (
		<Html center zIndexRange={[200, 101]}>
			<InfoContainer
				onPointerDown={(event) => event.stopPropagation()}
				onClick={(event) => event.stopPropagation()}
				onWheel={(event) => event.stopPropagation()}
			>
				{active && (
					<div className="close-control">
						<button
							type="button"
							aria-label="Close information"
							onClick={onClose}
						>
							<Icon icon="x" />
						</button>
					</div>
				)}
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

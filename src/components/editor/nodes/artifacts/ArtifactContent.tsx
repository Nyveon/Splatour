import { useGSStore } from "@/hooks/useGSStore";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { Textarea as BaseTextarea, TextareaProps } from "@headlessui/react";

const Textarea = styled(BaseTextarea)<TextareaProps>`
	color: ${color.textLight};
	background-color: ${color.backgroundMedium};
	border: 1px solid ${color.border};
	padding: 0.5rem;
	resize: none;
	height: 13rem;
`;

export default function ArtifactContent({
	nodeId,
	sceneId,
}: {
	nodeId: string;
	sceneId: string;
}) {
	const artifactContent = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[nodeId].content
	);
	const setArtifactTransform = useGSStore(
		(state) => state.setArtifactTransform
	);

	const handleChange = (value: string) => {
		setArtifactTransform(sceneId, nodeId, {
			content: value,
		});
	};

	return (
		<Textarea
			value={artifactContent}
			onChange={(e) => handleChange(e.target.value)}
		></Textarea>
	);
}

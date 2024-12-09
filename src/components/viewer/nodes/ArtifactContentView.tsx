import { useGSStore } from "@/hooks/useGSStore";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { Html } from "@react-three/drei";

const InfoContainer = styled.div`
	color: ${color.textDark};
	background-color: ${color.backgroundLight};
	padding: 1rem;
	border-radius: 1rem;
`;

export default function ArtifactContentView({
	sceneId,
	artifactId,
}: {
	sceneId: string;
	artifactId: string;
}) {
	const content = useGSStore(
		(state) => state.gsmap.scenes[sceneId].artifacts[artifactId].content
	);

	return (
		<Html center distanceFactor={5}>
			<InfoContainer>{content}</InfoContainer>
		</Html>
	);
}

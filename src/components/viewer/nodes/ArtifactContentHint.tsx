import Icon from "@/components/Icon";
import { AppIcons, color } from "@/utils/theme";
import styled from "@emotion/styled";
import { Html } from "@react-three/drei";
import { forwardRef } from "react";

const Hint = styled.div`
	color: ${color.textDark};
	background-color: ${color.backgroundLight};
	border-radius: 50%;
`;

const ArtifactContentHint = forwardRef<HTMLDivElement>(
	function ArtifactContentHint(_, ref) {
		return (
			<Html
				center
				distanceFactor={8}
				ref={ref}
				style={{ transition: "opacity 0.5s ease" }}
			>
				<Hint>
					<Icon icon={AppIcons.Artifact} />
				</Hint>
			</Html>
		);
	}
);

export default ArtifactContentHint;

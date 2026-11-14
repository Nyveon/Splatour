import Icon from "@/components/Icon";
import { AppIcons, color } from "@/utils/theme";
import styled from "@emotion/styled";
import { Html } from "@react-three/drei";
import { forwardRef } from "react";

const Hint = styled.button`
	position: relative;
	display: grid;
	place-items: center;
	width: 24px;
	height: 24px;
	padding: 0;
	border: 0;
	color: ${color.textDark};
	background-color: ${color.backgroundLight};
	border-radius: 50%;
	cursor: pointer;
	touch-action: manipulation;
	&::before {
		content: "";
		position: absolute;
		inset: -10px;
	}
`;

const ArtifactContentHint = forwardRef<HTMLDivElement, { onClick: () => void }>(
	function ArtifactContentHint({ onClick }, ref) {
		return (
			<Html
				center
				distanceFactor={8}
				ref={ref}
				style={{ transition: "opacity 0.5s ease" }}
				zIndexRange={[100, 0]}
			>
				<Hint
					type="button"
					aria-label="Show information"
					onPointerDown={(event) => event.stopPropagation()}
					onClick={(event) => {
						event.stopPropagation();
						onClick();
					}}
				>
					<Icon icon={AppIcons.Artifact} />
				</Hint>
			</Html>
		);
	}
);

export default ArtifactContentHint;

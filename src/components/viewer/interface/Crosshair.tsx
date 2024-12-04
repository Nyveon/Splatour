import useInteractions from "@/hooks/useInteractions";
import styled from "@emotion/styled";

const CrosshairContainer = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	mix-blend-mode: difference;

	pointer-events: none;
`;

const CrosshairElement = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	border-style: solid;
	border-color: white;

	transition: all 0.2s ease-in-out;
`;

const HairLine = styled(CrosshairElement)`
	--line-length: 32px;
	border-width: 1px;

	&[data-hidden="true"] {
		--line-length: 0px;
	}
`;

const HairLineHorizontal = styled(HairLine)`
	width: var(--line-length);
`;

const HairLineVertical = styled(HairLine)`
	height: var(--line-length);
`;

const InteractionCircle = styled(CrosshairElement)`
	width: 20px;
	height: 20px;

	border-radius: 50%;
	border-width: 2px;

	&[data-hidden="true"] {
		width: 0px;
		height: 0px;
	}
`;

export default function Crosshair() {
	const interactable = useInteractions((state) => state.interactable);

	return (
		<CrosshairContainer>
			<HairLineHorizontal data-hidden={interactable} />
			<HairLineVertical data-hidden={interactable} />
			<InteractionCircle data-hidden={!interactable} />
		</CrosshairContainer>
	);
}

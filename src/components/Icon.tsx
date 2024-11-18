import styled from "@emotion/styled";
import { FeatherIconNames } from "feather-icons";
import icons from "feather-icons/dist/feather-sprite.svg";

const s = {
	IconContainer: styled.div`
		display: flex;
		align-items: center;
		justify-content: center;
	`,

	Icon: styled.svg`
		width: 24px;
		height: 24px;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		fill: none;
	`,
};

export default function Icon({ icon }: { icon: FeatherIconNames }) {
	return (
		<s.IconContainer>
			<s.Icon>
				<use href={`${icons}#${icon}`}></use>
			</s.Icon>
		</s.IconContainer>
	);
}

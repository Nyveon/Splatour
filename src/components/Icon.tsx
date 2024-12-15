import icons from "@/assets/images/feather-sprite.svg";
import styled from "@emotion/styled";
import { FeatherIconNames } from "feather-icons";

const IconContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const IconSvg = styled.svg`
	width: 24px;
	height: 24px;
	stroke: currentColor;
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
	fill: none;
`;

export default function Icon({
	icon,
	className = "",
}: {
	icon: FeatherIconNames;
	className?: string;
}) {
	return (
		<IconContainer className={`icon-${icon} ${className}`}>
			<IconSvg className={`svg-${icon}`}>
				<use href={`${icons}#${icon}`}></use>
			</IconSvg>
		</IconContainer>
	);
}

export function IconSvgOnly({
	icon,
	className = "",
}: {
	icon: FeatherIconNames;
	className?: string;
}) {
	return (
		<IconSvg className={`svg-${icon} ${className}`}>
			<use href={`${icons}#${icon}`}></use>
		</IconSvg>
	);
}

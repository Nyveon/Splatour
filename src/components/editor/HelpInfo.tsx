import Icon, { IconSvgOnly } from "@/components/Icon";
import { useInteractions } from "@/hooks/useInteractions";
import { color, headerHeightREM, sidebarWidthREM } from "@/utils/theme";
import styled from "@emotion/styled";
import { FeatherIconNames } from "feather-icons";
import { useRef } from "react";
import Markdown from "react-markdown";
import Button from "../input/Button";

const HelpIcon = styled.div`
    align-self: center;

	position: relative;
	cursor: pointer;
	background-color: ${color.textDark};
	border-radius: 50%;

	.svg-help-circle {
		color: ${color.textLight};
	}

	&:hover {
		background-color: ${color.textLight};

		.svg-help-circle {
			color: ${color.textDark};
		}
	}

	&[data-showing="true"] {
		background-color: ${color.textLight};

		.svg-help-circle {
			color: ${color.textDark};
		}
	}
`;

const Tooltip = styled.div`
	display: none;

	&[data-showing="true"] {
		display: block;
	}

	position: fixed;
	z-index: 1;
	top: ${headerHeightREM}rem;
	left: ${sidebarWidthREM}rem;

	padding: 2rem;
	padding-top: 0.75rem;
	width: 40ch;

	text-align: left;
	hyphens: auto;

	background-color: ${color.backgroundDark};
	color: ${color.textLight};

	border-bottom-right-radius: 0.5rem;

	cursor: default;

	h4 {
		margin-top: 1.75rem;
	}
`;

const TopBar = styled.div`
	position: relative;
	display: flex;
	justify-content: flex-end;
	width: 100%;
	margin-bottom: -1rem;
`;

const InlineIcon = styled.span`
	display: inline-flex;
	align-items: center;
	vertical-align: -0.15em;

	svg {
		height: 1em;
		width: 1em;
	}
`;

export default function HoverInfo({ info }: { info: string }) {
	const activeHelp = useInteractions((state) => state.activeHelp);
	const setActiveHelp = useInteractions((state) => state.setActiveHelp);
	const helpRef = useRef<HTMLDivElement>(null);
	const isShowing = activeHelp === helpRef.current;

	return (
		<>
			<HelpIcon
				data-showing={isShowing}
				onClick={(e) => {
					setActiveHelp(helpRef.current);
					e.stopPropagation();
				}}
				title="Click to show relevant information panel"
				ref={helpRef}
			>
				<Icon icon="help-circle" />
			</HelpIcon>
			<Tooltip data-showing={isShowing} onClick={(e) => e.stopPropagation()}>
				<TopBar>
					<Button
						title="Close information panel"
						icon="x"
						variant="small"
						onClick={() => setActiveHelp(null)}
					/>
				</TopBar>

				<Markdown
					components={{
						h1: "h3",
						h2: "h4",
						em({ children, ...props }) {
							if (
								typeof children === "string" &&
								(children.startsWith("icon-") || children.startsWith(":icon-"))
							) {
								const iconName = children
									.split("-")
									.slice(1)
									.join("-") as FeatherIconNames;
								const isHighlight = children.startsWith(":icon-");

								console.log(isHighlight, children);

								return (
									<InlineIcon
										style={{
											color: isHighlight
												? color.primarySubtle
												: color.textLight,
										}}
									>
										<IconSvgOnly icon={iconName} />
									</InlineIcon>
								);
							}

							if (typeof children === "string" && children.startsWith(":")) {
								const text = children.slice(1);
								return (
									<span {...props} style={{ color: color.primarySubtle }}>
										{text}
									</span>
								);
							}

							return <em {...props}>{children}</em>;
						},
					}}
				>
					{info}
				</Markdown>
			</Tooltip>
		</>
	);
}

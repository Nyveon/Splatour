import { color } from "@/utils/theme";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Field, Input, Label } from "@headlessui/react";
import { ReactNode } from "react";

const ThumbHeightPX = 16;
const TrackHeightPX = 8;
const BubbleWidthCH = 4.5;

const SliderField = styled(Field)`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

const SliderLabel = styled(Label)`
	color: ${color.textLight};
	min-width: 2rem;
	text-align: center;
`;

const ValueBubble = styled.output<{ valuePercent: number }>`
	display: none;

	position: absolute;
	top: -1rem;

	/* ! very hacky :/ maybe fix some day */
	left: ${(props) =>
		`calc(${props.valuePercent}% * (0.84) - ${ThumbHeightPX / 2}px)`};

	width: ${BubbleWidthCH}ch;

	padding: 0;
	margin: 0;
	border-radius: 4px;

	background-color: ${color.textLight};
	color: black;

	text-align: center;
	font-size: 0.8rem;
	white-space: nowrap;
	font-family: "Courier New", Courier, monospace;
	font-size: 0.8rem;
	line-height: 1.25rem;

	pointer-events: none;
`;

const SliderContainer = styled.div`
	position: relative;
	width: 6rem;
	flex-grow: 0;

	&:focus-within {
		output {
			display: block;
		}
	}
`;

const SliderInputReset = styled(Input)<React.ComponentProps<"input">>`
	-webkit-appearance: none;
	appearance: none;

	width: 100%;
	margin: 0;
	padding: 0;

	background: transparent;

	cursor: pointer;

	&:focus {
		outline: none;
	}
`;

const cssThumb = css`
	height: ${ThumbHeightPX}px;
	width: ${ThumbHeightPX}px;

	box-sizing: content-box;

	outline: 2px solid ${color.border};
	border-radius: 2px;

	background: ${color.textLight};

	cursor: pointer;
`;

const cssThumbFocus = css`
	outline-offset: 2px;
`;

const cssTrack = css`
	max-width: 100%;
	height: ${TrackHeightPX}px;

	box-sizing: content-box;

	border: 1px solid ${color.borderHalf};
	border-radius: ${TrackHeightPX}px;

	background: ${color.primary};

	cursor: pointer;
`;

const cssTrackFocus = css`
	border: 1px solid ${color.border};
`;

const cssTrackHover = css`
	background: ${color.primaryLight};
`;

const cssSliderWebkit = css`
	// Thumb
	&::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		margin-top: ${TrackHeightPX / 2 - ThumbHeightPX / 2}px;

		${cssThumb}
	}

	// Thumb - Focused
	&[data-focus]::-webkit-slider-thumb {
		${cssThumbFocus}
	}

	// Track
	&::-webkit-slider-runnable-track {
		${cssTrack}
	}

	// Track - Focused
	&[data-focus]::-webkit-slider-runnable-track {
		${cssTrackFocus};
	}

	// Track - Hover
	&[data-hover]::-webkit-slider-runnable-track {
		${cssTrackHover};
	}
`;

const cssSliderFirefox = css`
	// Thumb
	&::-moz-range-thumb {
		border: none;
		margin-top: ${TrackHeightPX / 2 - ThumbHeightPX / 2}px;

		${cssThumb}
	}

	// Thumb - Focused
	&[data-focus]::-moz-range-thumb {
		${cssThumbFocus}
	}

	// Track
	&::-moz-range-track {
		${cssTrack}
	}

	// Track - Focused
	&[data-focus]::-moz-range-track {
		${cssTrackFocus};
	}

	// Track - Hover
	&[data-hover]::-moz-range-track {
		${cssTrackHover};
	}
`;

const SliderInput = styled(SliderInputReset)`
	${cssSliderWebkit}
	${cssSliderFirefox}
`;

interface SliderProps {
	min: number;
	max: number;
	step?: number;
	label?: ReactNode;
	value: number;
	valueHandler: (value: number) => void;
	className?: string;
}

export default function Slider({
	min,
	max,
	step = 1,
	label = "",
	value,
	valueHandler,
	className = "",
}: SliderProps) {
	const valuePercent = ((value - min) / (max - min)) * 100;

	return (
		<SliderField className={className}>
			{label && <SliderLabel>{label}</SliderLabel>}
			<SliderContainer>
				<ValueBubble valuePercent={valuePercent}>
					{value.toFixed(0)}
				</ValueBubble>
				<SliderInput
					type="range"
					min={min}
					max={max}
					step={step}
					value={value}
					onChange={(e) => valueHandler(parseFloat(e.target.value))}
				/>
			</SliderContainer>
		</SliderField>
	);
}

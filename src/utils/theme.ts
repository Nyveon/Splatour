import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button } from "@headlessui/react";

export const color = {
	backgroundLight: "#f8f9fa",
	backgroundMedium: "#484949",
	backgroundMediumDark: "#3f4245",
	backgroundDark: "#343a40",
	textDark: "#333",
	textDisabled: "#a2aeb8",
	textLight: "#fff",

	primary: "#0a69cf",
	primaryLight: "#329ff8",
	primaryDark: "#0056b3",

	danger: "#dc3545",
	dangerLight: "#ff505f",

	pending: "#d68e00",
	pendingLight: "#dba700",

	border: "#ced4da",
	borderHalf: "#ced4da80",
};

export const unstyledButtonCSS = css`
	padding: 0;
	margin: 0;

	border: none;

	font-family: inherit;
	font-size: inherit;
	font-style: inherit;
	font-weight: inherit;
	line-height: inherit;

	color: inherit;
	background-color: transparent;

	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;

	&[data-hover] {
		cursor: pointer;
	}

	&[data-focus] {
		outline: 2px solid ${color.primaryLight};
	}
`;

export const UnstyledButton = styled(Button)<{ onClick: () => void }>`
	padding: 0;
	margin: 0;

	border: none;

	font-family: inherit;
	font-size: inherit;
	font-style: inherit;
	font-weight: inherit;
	line-height: inherit;

	color: inherit;
	background-color: transparent;

	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;

	&[data-hover] {
		cursor: pointer;
	}

	&[data-focus] {
		outline: 2px solid ${color.primaryLight};
	}
`;

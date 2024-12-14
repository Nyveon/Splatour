import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button } from "@headlessui/react";
import { StylesConfig } from "react-select";

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
	borderQuarter: "#ced4da40",

	artifactNode: "#fa7fa9",
	barrierNode: "#ef952b",
	portalNode: "#be94ff",

	axisX: "#ff808c",
	axisY: "#93be47",
	axisZ: "#00c2ef",
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

export enum AppIcons {
	Placement = "move",
	Artifact = "info",

	Barrier = "shield",
	BarrierWall = "square",
	BarrierSolid = "circle",

	Portal = "target",
	PortalEdge = "log-in",
	PortalWarp = "crosshair",
}

export const headerHeightREM = 4;
export const sidebarWidthREM = 16;

export const createDropdownStyles = <
	T extends { value: string; label: string },
>(): StylesConfig<T, false> => ({
	singleValue: (styles) => ({
		...styles,
		color: "inherit",
	}),
	menu: (styles) => ({
		...styles,
		color: "inherit",
		backgroundColor: color.backgroundDark,
	}),
	control: (styles) => ({
		...styles,
		color: "inherit",
		backgroundColor: "transparent",
	}),
	option: (styles, { isSelected }) => ({
		...styles,
		color: "inherit",
		backgroundColor: isSelected ? color.primary : "transparent",
		":hover": {
			...styles[":hover"],
			backgroundColor: isSelected ? color.primaryLight : color.backgroundMedium,
		},
	}),
});

import Sidebar from "@/components/editor/Sidebar";
import Toolbar from "@/components/editor/Toolbar";
import Icon from "@/components/Icon";
import EditorViewer from "@/components/viewer/EditorView";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { color, headerHeightREM } from "@/utils/theme";
import styled from "@emotion/styled";
import { useEffect } from "react";
import { isFirefox } from "react-device-detect";

const EditorHeader = styled.header`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;

	padding-inline: 2rem;
	height: ${headerHeightREM}rem;
	width: 100%;

	background-color: ${color.backgroundDark};
	color: ${color.textLight};
`;

const EditorBody = styled.main`
	flex-grow: 1;
	display: flex;
	width: 100vw;
	padding: 0;
	margin: 0;
`;

const FirefoxWarning = styled.div`
	color: black;
	padding: 1rem;
	border-radius: 0.5rem;
	border: 1rem solid red;
`;

export default function Editor() {
	const initializeSettings = useSettingsStore(
		(state) => state.initializeSettings
	);

	useEffect(() => {
		initializeSettings({ debug: true, mobileDebug: false });
	}, [initializeSettings]);

	if (isFirefox) {
		return (
			<FirefoxWarning>
				<Icon icon="alert-triangle" />
				<h1>Editor is not supported on Firefox, sorry :(</h1>
				<a href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_API#browser_compatibility">
					https://developer.mozilla.org/en-US/docs/Web/API/File_System_API#browser_compatibility
				</a>
			</FirefoxWarning>
		);
	}

	return (
		<>
			<EditorHeader>
				<Toolbar />
			</EditorHeader>

			<EditorBody>
				<Sidebar />
				<EditorViewer />
			</EditorBody>
		</>
	);
}

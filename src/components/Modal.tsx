import styled from "@emotion/styled";
import {
	Description,
	Dialog,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { color } from "../utils/theme";

const s = {
	Dialog: styled(Dialog)`
		position: relative;
	`,

	FullScreen: styled.div`
		display: grid;
		place-items: center;

		min-height: 100vh;
		height: 100%;
		position: fixed;
		inset: 0;

		background-color: rgba(0, 0, 0, 0.1);
	`,

	DialogPanel: styled(DialogPanel)`
		background-color: ${color.backgroundLight};
		padding: 1rem;
		border-radius: 0.5rem;
	`,
};

interface ModalProps {
	open: boolean;
	handleClose: () => void;
	title: string;
	description: string;
	children?: React.ReactNode;
}

export default function Modal({
	open,
	handleClose,
	title,
	description,
	children,
}: ModalProps) {
	return (
		<s.Dialog open={open} onClose={handleClose}>
			<s.FullScreen>
				<s.DialogPanel>
					<DialogTitle>{title}</DialogTitle>
					<Description>{description}</Description>
					{children}
				</s.DialogPanel>
			</s.FullScreen>
		</s.Dialog>
	);
}

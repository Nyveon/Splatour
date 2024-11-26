import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import {
	Description,
	Dialog,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";

const ModalWrapper = styled(Dialog)`
	position: relative;
`;

const ModalOverlay = styled.div`
	display: grid;
	place-items: center;

	min-height: 100vh;
	height: 100%;
	position: fixed;
	inset: 0;

	background-color: rgba(0, 0, 0, 0.1);
`;

const ModalPanel = styled(DialogPanel)`
	background-color: ${color.backgroundLight};
	padding: 1rem;
	border-radius: 0.5rem;
`;

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
		<ModalWrapper open={open} onClose={handleClose}>
			<ModalOverlay>
				<ModalPanel>
					<DialogTitle>{title}</DialogTitle>
					<Description>{description}</Description>
					{children}
				</ModalPanel>
			</ModalOverlay>
		</ModalWrapper>
	);
}

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
	z-index: 1000;

	min-height: 100vh;
	height: 100%;
	position: fixed;
	inset: 0;

	background-color: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(2px);
`;

const ModalPanel = styled(DialogPanel)`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;

	background-color: ${color.backgroundLight};
	padding: 1rem;
	border-radius: 0.5rem;
`;

const ModalTitle = styled(DialogTitle)`
	padding: 0;
	margin: 0;
`;

const ModalDescription = styled(Description)`
	padding: 0;
	margin: 0;
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
					<ModalTitle>{title}</ModalTitle>
					<ModalDescription>{description}</ModalDescription>
					{children}
				</ModalPanel>
			</ModalOverlay>
		</ModalWrapper>
	);
}

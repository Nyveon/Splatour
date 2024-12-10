import Button from "@/components/input/Button";
import { useInteractions } from "@/hooks/useInteractions";
import { toastSuccess } from "@/utils/toasts";
import styled from "@emotion/styled";

const ButtonBar = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;

	padding-bottom: 0.75rem;
`;

export default function NodeUtils({
	handleDeletion,
}: {
	handleDeletion: () => void;
}) {
	const resetCurrentNode = useInteractions((state) => state.resetCurrentNode);

	return (
		<ButtonBar>
			<Button
				title="Delete Artifact"
				variant="danger"
				icon="trash"
				onClick={() => {
					resetCurrentNode();
					handleDeletion();
					toastSuccess("Node deleted");
				}}
			/>
			<Button
				title="Finish editing"
				variant="primary"
				icon="minimize-2"
				onClick={() => resetCurrentNode()}
			/>
			<Button title="Teleport to node" variant="disabled" icon="target" />
			<Button title="Toggle node visibility" variant="disabled" icon="eye" />
		</ButtonBar>
	);
}

import Button from "@/components/input/Button";

interface MinimizeCardProps {
	selected: boolean;
	handleSelected: (selected: string | null) => void;
}

export default function MinimizeCard({
	selected,
	handleSelected,
}: MinimizeCardProps) {
	if (!selected) {
		return null;
	}

	return (
		<Button
			title="Minimize scene details"
			icon="minimize-2"
			variant="primary"
			onClick={() => handleSelected(null)}
		/>
	);
}

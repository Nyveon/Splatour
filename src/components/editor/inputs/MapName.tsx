import Button from "@/components/input/Button";
import TextInput from "@/components/input/TextInput";
import { useGSStore } from "@/hooks/useGSStore";
import styled from "@emotion/styled";
import { useState } from "react";

const NamePlate = styled.div`
	display: flex;
	gap: 0.5rem;
	align-items: center;
`;

const NameHeader = styled.h1`
	padding: 0;
	margin: 0;

	font-size: 1.25rem;
	font-weight: normal;
`;

export default function MapName() {
	const gsmapName = useGSStore((state) => state.gsmap.name);
	const setGSMap = useGSStore((state) => state.setGSMap);
	const [editing, setEditing] = useState(false);

	return (
		<NamePlate>
			{editing ? (
				<TextInput
					value={gsmapName}
					valueHandler={(value: string) => setGSMap({ name: value })}
				/>
			) : (
				<NameHeader>{gsmapName}</NameHeader>
			)}
			<Button
				title="Edit map name"
				icon={editing ? "check" : "edit-3"}
				variant="small"
				onClick={() => setEditing(!editing)}
			/>
		</NamePlate>
	);
}

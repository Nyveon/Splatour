import styled from "@emotion/styled";
import Button from "../Button";
import Icon from "../Icon";

const s = {
	Toolbar: styled.div`
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	`,
};

export default function Toolbar() {
	return (
		<s.Toolbar role="toolbar">
			<Icon icon={"map"} />
			<Button text={"Save"} />
			<Button text={"Load"} />
			<Button text={"Export"} variant="danger" />
		</s.Toolbar>
	);
}

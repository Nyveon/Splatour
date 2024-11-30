import Icon from "@/components/Icon";

import styled from "@emotion/styled";

const List = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`;

const ListItem = styled.li`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

export default function ChildList() {
	return (
		<List>
			<ListItem>
				<Icon icon="box" />
				Placeholder solid
			</ListItem>
			<ListItem>
				<Icon icon="x-octagon" />
				Placeholder boundary
			</ListItem>
			<ListItem>
				<Icon icon="info" />
				Placeholder info
			</ListItem>
			<ListItem>
				<Icon icon="crosshair" />
				Placeholder portal
			</ListItem>
			<ListItem>
				<Icon icon="external-link" />
				Placeholder portal
			</ListItem>
			<ListItem>
				<Icon icon="log-in" />
				Placeholder portal
			</ListItem>
		</List>
	);
}

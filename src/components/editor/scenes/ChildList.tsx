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

//todo: sceneId Prop
export default function ChildList() {
	return (
		<List>
			<ListItem>
				<Icon icon="box" />
				Collision
			</ListItem>
			<ListItem>
				<Icon icon="x-octagon" />
				Boundary nodes
			</ListItem>
			<ListItem>
				<Icon icon="info" />
				Info nodes
			</ListItem>
			<ListItem>
				<Icon icon="log-in" />
				Portal nodes
			</ListItem>
		</List>
	);
}

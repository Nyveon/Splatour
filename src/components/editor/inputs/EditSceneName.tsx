import { useGSStore } from "@/hooks/useGSStore";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { Input as BaseInput } from "@headlessui/react";

const Input = styled(BaseInput)<React.ComponentProps<"input">>`
	background-color: ${color.backgroundMedium};
	color: inherit;
	font-size: inherit;
	line-height: inherit;
	border: 1px solid ${color.borderHalf};
	border-radius: 3px;
`;

export default function EditSceneName({ sceneId }: { sceneId: string }) {
	const sceneName = useGSStore((state) => state.gsmap.scenes[sceneId].name);
	const setSceneTransform = useGSStore((state) => state.setSceneTransform);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSceneTransform(sceneId, { name: event.target.value });
	};

	return (
		<Input
			type="text"
			value={sceneName}
			onChange={handleChange}
			onClick={(e) => e.stopPropagation()}
		/>
	);
}

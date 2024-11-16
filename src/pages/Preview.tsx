import Viewer from "../components/Viewer";

export default function Preview() {
	return (
		<>
			<Viewer debug={false} file="/test2.json" />
		</>
	);
}

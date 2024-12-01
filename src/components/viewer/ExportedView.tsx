import Viewer from "@/components/viewer/Viewer";
import useFetchGSMap from "@/hooks/useFetchGSMap";
import GSViewer from "./GS3DViewer";

export default function ExportedView({ mapURL }: { mapURL: string }) {
	const { gsmap, error, loading } = useFetchGSMap(mapURL);

	if (loading) return <h1>Loading...</h1>;

	if (error) return <h1>Error: {error.message}</h1>;

	if (!gsmap) return <h1>No data?</h1>;

	return (
		<>
			<Viewer>
				{Object.entries(gsmap.scenes).map(([sceneId, scene]) => {
					return (
						<GSViewer
							key={sceneId}
							sceneData={{ filePath: scene.filePath }}
							scenePosition={scene.position}
							sceneRotation={scene.rotation}
							sceneScale={scene.scale}
						/>
					);
				})}
			</Viewer>
		</>
	);
}

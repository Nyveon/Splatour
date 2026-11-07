import { useGSStore } from "@/hooks/useGSStore";
import type { GSProduct } from "@/model/GSNode";
import type { GSScene } from "@/model/GSScene";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";

const Photo = styled.div`
	position: relative;
	overflow: hidden;
	background: #f3f3f3;
	img {
		position: absolute;
		max-width: none;
		object-fit: fill;
	}
`;
export default function ProductPhoto({
	product,
	scene,
	name,
}: {
	product: GSProduct;
	scene: GSScene;
	name: string;
}) {
	const directory = useGSStore((state) => state.gsmap.directoryHandle);
	const [localUrl, setLocalUrl] = useState<string>();
	const [failed, setFailed] = useState(false);
	useEffect(() => {
		if (!directory) return;
		let cancelled = false,
			objectUrl: string | undefined;
		void directory
			.getFileHandle(product.image)
			.then((handle) => handle.getFile())
			.then((file) => {
				if (cancelled) return;
				objectUrl = URL.createObjectURL(file);
				setLocalUrl(objectUrl);
			})
			.catch(() => {
				if (!cancelled) setFailed(true);
			});
		return () => {
			cancelled = true;
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [directory, product.image]);
	const source = directory
		? localUrl
		: new URL(product.image, new URL(scene.filePath, document.baseURI)).href;
	const crop = product.imageCrop;
	return (
		<Photo style={{ aspectRatio: `${crop.width} / ${crop.height}` }}>
			{failed ? (
				<p>Photo unavailable</p>
			) : (
				source && (
					<img
						alt={name}
						src={source}
						onError={() => setFailed(true)}
						style={{
							width: `${(crop.sourceWidth / crop.width) * 100}%`,
							height: `${(crop.sourceHeight / crop.height) * 100}%`,
							left: `${(-crop.x / crop.width) * 100}%`,
							top: `${(-crop.y / crop.height) * 100}%`,
						}}
					/>
				)
			)}
		</Photo>
	);
}

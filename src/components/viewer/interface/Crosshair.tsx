import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { useProductStore } from "@/hooks/useProductStore";
import styled from "@emotion/styled";

const CrosshairContainer = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 1000;

	mix-blend-mode: difference;
	&[data-product="true"] {
		mix-blend-mode: normal;
	}

	pointer-events: none;
`;

const CrosshairElement = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	border-style: solid;
	border-color: white;

	transition: all 0.2s ease-in-out;
`;

const HairLine = styled(CrosshairElement)`
	--line-length: 32px;
	border-width: 1px;

	&[data-hidden="true"] {
		--line-length: 0px;
	}
`;

const HairLineHorizontal = styled(HairLine)`
	width: var(--line-length);
`;

const HairLineVertical = styled(HairLine)`
	height: var(--line-length);
`;

const InteractionCircle = styled(CrosshairElement)`
	width: 20px;
	height: 20px;

	border-radius: 50%;
	border-width: 2px;
	&[data-product="true"] {
		width: 26px;
		height: 26px;
		border-color: #06c167;
		background: #06c16733;
		box-shadow: 0 0 0 1px #0008;
	}

	&[data-hidden="true"] {
		width: 0px;
		height: 0px;
	}
`;

const ProductHint = styled.div`
	position: absolute;
	top: 26px;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	gap: 8px;
	width: max-content;
	max-width: calc(100vw - 32px);
	padding: 8px 14px;
	border-radius: 999px;
	background: #000;
	color: #fff;
	font:
		500 13px/1.4 Arial,
		sans-serif;
	white-space: nowrap;
	.name {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.price {
		flex-shrink: 0;
		color: #bdbdbd;
		font-weight: 400;
	}
`;

export default function Crosshair() {
	const interactable = useInteractions((state) => state.interactable);
	const locked = useInteractions((state) => state.isLocked);
	const aimed = useProductStore((state) => state.aimed);
	const active = useProductStore((state) => state.active);
	const currentSceneId = useInteractions((state) => state.currentSceneId);
	const artifact = useGSStore((state) =>
		aimed
			? state.gsmap.scenes[aimed.sceneId]?.artifacts[aimed.artifactId]
			: undefined
	);
	const product = artifact?.product;
	const productReady = Boolean(
		locked && aimed?.sceneId === currentSceneId && product && !active
	);
	const ready = interactable || productReady;

	return (
		<CrosshairContainer data-product={productReady}>
			<HairLineHorizontal data-hidden={ready} />
			<HairLineVertical data-hidden={ready} />
			<InteractionCircle data-hidden={!ready} data-product={productReady} />
			{productReady && artifact && product && (
				<ProductHint>
					<span className="name">{artifact.name}</span>
					<span className="price">
						{new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: product.currency,
						}).format(product.price)}{" "}
						{product.currency} / {product.unit}
					</span>
				</ProductHint>
			)}
		</CrosshairContainer>
	);
}

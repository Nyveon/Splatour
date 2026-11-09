import Icon from "@/components/Icon";
import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { productCartKey, useProductStore } from "@/hooks/useProductStore";
import {
	formatMoney,
	formatQuantity,
	productLineTotal,
	quantityStep,
} from "@/utils/productCommerce";
import styled from "@emotion/styled";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { useEffect, useRef } from "react";
import { CartButton } from "./Cart";
import ProductPhoto from "./ProductPhoto";

const Backdrop = styled(DialogBackdrop)`
	position: fixed;
	inset: 0;
	background: #00000066;
	z-index: 10010;
`;
const Position = styled.div`
	position: fixed;
	inset: 0;
	z-index: 10011;
	display: grid;
	place-items: center;
	padding: 1rem;
	overflow-y: auto;
	@media (max-width: 480px) {
		place-items: end center;
		padding: 0;
	}
`;
const Card = styled(DialogPanel)`
	position: relative;
	width: min(100%, 440px);
	max-height: calc(100dvh - 2rem);
	overflow-y: auto;
	border-radius: 20px;
	background: #fff;
	color: #000;
	box-shadow: 0 24px 80px #0003;
	font-family: Arial, Helvetica, sans-serif;
	text-align: left;
	span,
	button {
		font-family: inherit;
	}
	@media (max-width: 480px) {
		max-height: calc(100dvh - 1rem);
		border-radius: 20px 20px 0 0;
	}
`;
const Header = styled.div`
	position: absolute;
	top: 16px;
	left: 16px;
	right: 16px;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	span {
		padding: 8px 12px;
		border-radius: 24px;
		background: #fff;
		font-size: 0.8rem;
		font-weight: 600;
		color: #000;
	}
	button {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border: 0;
		border-radius: 50%;
		background: #fff;
		color: #000;
		cursor: pointer;
		&:hover {
			background: #eee;
		}
		&:focus-visible {
			outline: 3px solid #06c167;
			outline-offset: 3px;
		}
	}
	svg {
		width: 22px;
		height: 22px;
	}
`;
const ImageArea = styled.div`
	position: relative;
`;
const Details = styled.div`
	padding: 24px;
	h2 {
		margin: 0 0 0.5rem;
		font-size: 1.875rem;
		font-weight: 750;
		letter-spacing: -0.035em;
		line-height: 1.15;
	}
	.price {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 500;
	}
	.unit {
		font-size: 1rem;
		color: #5e5e5e;
		font-weight: 400;
	}
	.total {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		border-top: 1px solid #eee;
		margin-top: 20px;
		padding-top: 16px;
		font-size: 16px;
	}
	.total output {
		font-size: 22px;
		font-weight: 700;
		white-space: nowrap;
	}
	.cart-action {
		margin-top: 20px;
	}
	.cart-action:empty {
		display: none;
	}
	.cart-action button {
		width: 100%;
	}
	@media (max-width: 480px) {
		padding-bottom: max(24px, env(safe-area-inset-bottom));
	}
`;
const QuantityControl = styled.div<{ expanded: boolean }>`
	position: absolute;
	right: 16px;
	bottom: 16px;
	width: ${({ expanded }) => (expanded ? "200px" : "56px")};
	height: 56px;
	border-radius: 999px;
	overflow: hidden;
	background: white;
	color: #000;
	box-shadow: 0 2px 12px #0002;
	transition: width 180ms ease;
	button {
		position: absolute;
		top: 0;
		width: 56px;
		height: 56px;
		display: grid;
		place-items: center;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: inherit;
		cursor: pointer;
		&:hover {
			background: #eee;
		}
		&:focus-visible {
			outline: 3px solid #06c167;
			outline-offset: -3px;
		}
	}
	.decrement {
		left: 0;
	}
	.increment {
		right: 0;
	}
	svg {
		width: 26px;
		height: 26px;
	}
	output {
		white-space: nowrap;
		overflow: hidden;
		position: absolute;
		inset: 0 56px;
		display: grid;
		place-items: center;
		font-size: 1.125rem;
		font-weight: 600;
	}
	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

export default function ProductDialog({ onResume }: { onResume: () => void }) {
	const active = useProductStore((state) => state.active);
	const close = useProductStore((state) => state.close);
	const add = useProductStore((state) => state.add);
	const remove = useProductStore((state) => state.remove);
	const incrementButton = useRef<HTMLButtonElement>(null);
	const count = useProductStore((state) =>
		active
			? (state.quantities[productCartKey(active.sceneId, active.artifactId)] ??
				0)
			: 0
	);
	const scene = useGSStore((state) =>
		active ? state.gsmap.scenes[active.sceneId] : undefined
	);
	const currentSceneId = useInteractions((state) => state.currentSceneId);
	const artifact = active ? scene?.artifacts[active.artifactId] : undefined;
	const product = artifact?.product;
	useEffect(() => {
		if (active && (!product || currentSceneId !== active.sceneId)) close();
	}, [active, product, currentSceneId, close]);
	useEffect(() => () => close(), [close]);
	if (
		!active ||
		!scene ||
		!artifact ||
		!product ||
		active.sceneId !== currentSceneId
	)
		return null;
	const price = formatMoney(product.price, product.currency);
	const step = quantityStep(product);
	const quantityLabel = formatQuantity(count, product);
	return (
		<Dialog
			open
			onClose={close}
			style={{ position: "fixed", inset: 0, zIndex: 10010 }}
		>
			<Backdrop />
			<Position>
				<Card>
					<Header>
						<span>Fresh produce</span>
						<button
							type="button"
							aria-label="Close product"
							onClick={() => {
								close();
								onResume();
							}}
						>
							<Icon icon="x" />
						</button>
					</Header>
					<ImageArea>
						<ProductPhoto
							key={active.artifactId}
							product={product}
							scene={scene}
							name={artifact.name}
						/>
						<QuantityControl
							expanded={count > 0}
							role="group"
							aria-label={`${artifact.name} quantity`}
						>
							{count > 0 && (
								<>
									<button
										type="button"
										className="decrement"
										aria-label={
											count <= step ? "Remove from cart" : "Decrease quantity"
										}
										onClick={() => {
											if (count <= step) incrementButton.current?.focus();
											remove(active.sceneId, active.artifactId, step);
										}}
									>
										<Icon icon={count <= step ? "trash-2" : "minus"} />
									</button>
									<output aria-label="Quantity" aria-live="polite">
										{quantityLabel}
									</output>
								</>
							)}
							<button
								ref={incrementButton}
								type="button"
								className="increment"
								aria-label={count > 0 ? "Increase quantity" : "Add to cart"}
								onClick={() => add(active.sceneId, active.artifactId, step)}
							>
								<Icon icon="plus" />
							</button>
						</QuantityControl>
					</ImageArea>
					<Details>
						<DialogTitle>{artifact.name}</DialogTitle>
						<p className="price">
							{price}{" "}
							<span className="unit">
								{product.currency} / {product.unit}
							</span>
						</p>
						{count > 0 && (
							<div className="total">
								<span>Total · {quantityLabel}</span>
								<output aria-label="Product total" aria-live="polite">
									{formatMoney(
										productLineTotal(product, count),
										product.currency
									)}
								</output>
							</div>
						)}
						<div className="cart-action">
							<CartButton />
						</div>
					</Details>
				</Card>
			</Position>
		</Dialog>
	);
}

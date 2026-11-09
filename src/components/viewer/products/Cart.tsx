import Icon from "@/components/Icon";
import { useCart } from "@/hooks/useCart";
import { useInteractions } from "@/hooks/useInteractions";
import { useProductStore } from "@/hooks/useProductStore";
import {
	formatMoney,
	formatQuantity,
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
import ProductPhoto from "./ProductPhoto";

function showCart() {
	useInteractions.getState().unlock();
	useProductStore.getState().openCart();
	if (document.pointerLockElement) document.exitPointerLock();
}

const Pill = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	border: 0;
	border-radius: 999px;
	padding: 16px 22px;
	min-height: 56px;
	background: #000;
	color: #fff;
	font:
		600 16px/1.4 Arial,
		sans-serif;
	cursor: pointer;
	box-shadow: 0 4px 20px #0003;
	&:hover {
		background: #282828;
	}
	&:focus-visible {
		outline: 3px solid #06c167;
		outline-offset: 3px;
	}
	.price {
		font-weight: 400;
		color: #ddd;
	}
	kbd {
		font: inherit;
		font-size: 12px;
		border: 1px solid #666;
		border-radius: 5px;
		padding: 1px 6px;
		color: #ddd;
	}
`;
const Floating = styled.div`
	position: absolute;
	bottom: max(24px, env(safe-area-inset-bottom));
	left: 50%;
	transform: translateX(-50%);
	z-index: 1001;
	width: max-content;
	max-width: calc(100% - 32px);
	button {
		width: 100%;
	}
`;

export function CartButton({ shortcut = false }: { shortcut?: boolean }) {
	const { lines, totals } = useCart();
	if (!lines.length) return null;
	return (
		<Pill type="button" onClick={showCart}>
			<Icon icon="shopping-cart" />
			<span>View cart · {lines.length}</span>
			<span className="price">
				{totals
					.map((total) => formatMoney(total.amount, total.currency))
					.join(" + ")}
			</span>
			{shortcut && <kbd>C</kbd>}
		</Pill>
	);
}

const Backdrop = styled(DialogBackdrop)`
	position: fixed;
	inset: 0;
	z-index: 10010;
	background: #0006;
`;
const Position = styled.div`
	position: fixed;
	inset: 0;
	z-index: 10011;
	display: grid;
	place-items: center;
	padding: 16px;
	@media (max-width: 480px) {
		padding: 0;
		place-items: end center;
	}
`;
const Panel = styled(DialogPanel)`
	width: min(100%, 480px);
	max-height: calc(100dvh - 32px);
	display: flex;
	flex-direction: column;
	background: #fff;
	color: #000;
	border-radius: 20px;
	font:
		14px/1.5 Arial,
		sans-serif;
	text-align: left;
	box-shadow: 0 24px 80px #0003;
	button {
		font-family: inherit;
		color: inherit;
		cursor: pointer;
	}
	button:focus-visible {
		outline: 3px solid #06c167;
		outline-offset: 2px;
	}
	@media (max-width: 480px) {
		max-height: calc(100dvh - 16px);
		border-radius: 20px 20px 0 0;
	}
`;
const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20px 24px;
	border-bottom: 1px solid #eee;
	h2 {
		margin: 0;
		font-size: 26px;
		letter-spacing: -0.03em;
	}
	button {
		display: grid;
		place-items: center;
		border: 0;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		background: #f3f3f3;
	}
`;
const Items = styled.div`
	overflow-y: auto;
	padding: 0 24px;
`;
const Row = styled.div`
	display: grid;
	grid-template-columns: 72px minmax(0, 1fr);
	gap: 16px;
	padding: 20px 0;
	border-bottom: 1px solid #eee;
	&:last-child {
		border-bottom: 0;
	}
	h3 {
		margin: 0;
		font-size: 17px;
		line-height: 1.3;
	}
	.meta {
		margin: 4px 0 12px;
		color: #5e5e5e;
		font-size: 13px;
	}
	.line-heading {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 8px;
	}
	.line-total {
		white-space: nowrap;
		font-weight: 600;
		font-size: 15px;
	}
	.actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		flex-wrap: wrap;
	}
	.remove {
		border: 0;
		background: transparent;
		padding: 6px 0;
		text-decoration: underline;
		color: #5e5e5e;
	}
`;
const Thumbnail = styled.div`
	width: 72px;
	height: 72px;
	overflow: hidden;
	border-radius: 10px;
	background: #f3f3f3;
	display: grid;
	align-items: center;
`;
const Stepper = styled.div`
	display: flex;
	align-items: center;
	border-radius: 999px;
	background: #f3f3f3;
	button {
		width: 40px;
		height: 40px;
		border: 0;
		border-radius: 50%;
		background: transparent;
		display: grid;
		place-items: center;
	}
	button:hover {
		background: #e2e2e2;
	}
	svg {
		width: 19px;
		height: 19px;
	}
	output {
		min-width: 65px;
		text-align: center;
		font-weight: 600;
		white-space: nowrap;
	}
`;
const Footer = styled.div`
	border-top: 1px solid #eee;
	padding: 20px 24px max(24px, env(safe-area-inset-bottom));
	.subtotal {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16px;
		font-size: 20px;
		font-weight: 700;
	}
	button {
		width: 100%;
		padding: 16px;
		border: 0;
		border-radius: 8px;
		background: #000;
		color: #fff;
		font-size: 16px;
		font-weight: 600;
	}
`;
const Empty = styled.div`
	padding: 36px 24px;
	text-align: center;
	h3 {
		margin: 12px 0 4px;
		font-size: 20px;
	}
	p {
		color: #5e5e5e;
		margin: 0;
	}
`;

export default function Cart({ onResume }: { onResume: () => void }) {
	const { lines, totals } = useCart();
	const open = useProductStore((state) => state.cartOpen);
	const active = useProductStore((state) => state.active);
	const close = useProductStore((state) => state.closeCart);
	const add = useProductStore((state) => state.add);
	const remove = useProductStore((state) => state.remove);
	const deleteItem = useProductStore((state) => state.deleteItem);
	const closeButton = useRef<HTMLButtonElement>(null);
	const hasItems = lines.length > 0;
	useEffect(() => {
		const keydown = (event: KeyboardEvent) => {
			if (
				!hasItems ||
				useProductStore.getState().cartOpen ||
				event.repeat ||
				event.ctrlKey ||
				event.altKey ||
				event.metaKey ||
				event.key.toLowerCase() !== "c"
			)
				return;
			if (
				event.target instanceof HTMLElement &&
				event.target.closest(
					"input, textarea, select, [contenteditable='true']"
				)
			)
				return;
			event.preventDefault();
			event.stopImmediatePropagation();
			showCart();
		};
		document.addEventListener("keydown", keydown, true);
		return () => document.removeEventListener("keydown", keydown, true);
	}, [hasItems]);
	useEffect(() => () => close(), [close]);
	const resume = () => {
		close();
		onResume();
	};
	return (
		<>
			{!open && !active && hasItems && (
				<Floating>
					<CartButton shortcut />
				</Floating>
			)}
			<Dialog
				open={open}
				onClose={close}
				aria-label="Shopping cart"
				style={{ position: "fixed", inset: 0, zIndex: 10010 }}
			>
				<Backdrop />
				<Position>
					<Panel>
						<Header>
							<DialogTitle>Your cart</DialogTitle>
							<button
								ref={closeButton}
								type="button"
								aria-label="Close cart"
								onClick={resume}
							>
								<Icon icon="x" />
							</button>
						</Header>
						{hasItems ? (
							<Items>
								{lines.map((line) => {
									const step = quantityStep(line.product);
									return (
										<Row
											key={line.key}
											role="group"
											aria-label={line.artifact.name}
										>
											<Thumbnail>
												<ProductPhoto
													product={line.product}
													scene={line.scene}
													name={line.artifact.name}
												/>
											</Thumbnail>
											<div>
												<div className="line-heading">
													<h3>{line.artifact.name}</h3>
													<span className="line-total">
														{formatMoney(line.total, line.product.currency)}
													</span>
												</div>
												<p className="meta">
													{formatMoney(
														line.product.price,
														line.product.currency
													)}{" "}
													{line.product.currency} / {line.product.unit}
												</p>
												<div className="actions">
													<Stepper>
														<button
															type="button"
															aria-label={
																line.quantity <= step
																	? "Remove from cart"
																	: "Decrease quantity"
															}
															onClick={() => {
																if (line.quantity <= step)
																	closeButton.current?.focus();
																remove(line.scene.id, line.artifact.id, step);
															}}
														>
															<Icon
																icon={
																	line.quantity <= step ? "trash-2" : "minus"
																}
															/>
														</button>
														<output aria-label="Quantity" aria-live="polite">
															{formatQuantity(line.quantity, line.product)}
														</output>
														<button
															type="button"
															aria-label="Increase quantity"
															onClick={() =>
																add(line.scene.id, line.artifact.id, step)
															}
														>
															<Icon icon="plus" />
														</button>
													</Stepper>
													<button
														type="button"
														className="remove"
														onClick={() => {
															closeButton.current?.focus();
															deleteItem(line.scene.id, line.artifact.id);
														}}
													>
														Remove
													</button>
												</div>
											</div>
										</Row>
									);
								})}
							</Items>
						) : (
							<Empty>
								<Icon icon="shopping-cart" />
								<h3>Your cart is empty</h3>
								<p>Explore the produce island to find something fresh.</p>
							</Empty>
						)}
						<Footer>
							{totals.map((total) => (
								<div className="subtotal" key={total.currency}>
									<span>Subtotal</span>
									<span>
										{formatMoney(total.amount, total.currency)} {total.currency}
									</span>
								</div>
							))}
							<button type="button" onClick={resume}>
								Continue shopping
							</button>
						</Footer>
					</Panel>
				</Position>
			</Dialog>
		</>
	);
}

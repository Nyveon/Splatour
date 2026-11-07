import Button from "@/components/input/Button";
import ProductPhoto from "@/components/viewer/products/ProductPhoto";
import { useGSStore } from "@/hooks/useGSStore";
import { useInteractions } from "@/hooks/useInteractions";
import { useProductStore } from "@/hooks/useProductStore";
import type { GSProduct } from "@/model/GSNode";
import { color } from "@/utils/theme";
import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import NodePanel from "../shared/NodePanel";

const Fields = styled.div`
	display: grid;
	gap: 10px;
	label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		text-align: left;
	}
	input,
	select {
		width: 145px;
		min-width: 0;
		padding: 5px;
		border: 1px solid ${color.borderHalf};
		border-radius: 4px;
		background: ${color.backgroundMedium};
		color: white;
		font: inherit;
	}
	input[type="number"] {
		font-variant-numeric: tabular-nums;
	}
	select {
		width: 100%;
	}
	.note {
		margin: 0;
		font-size: 12px;
		color: ${color.textDisabled};
		text-align: left;
	}
	.error {
		margin: 0;
		color: #ff9c9c;
		text-align: left;
	}
	details {
		margin-top: 8px;
	}
	summary {
		cursor: pointer;
		margin-bottom: 10px;
	}
`;
const Preview = styled.div`
	max-width: 220px;
	width: 100%;
	margin: 4px auto;
	border-radius: 8px;
	overflow: hidden;
`;

function NumberField({
	label,
	value,
	onChange,
	min = -Infinity,
	max = Infinity,
	step = 0.01,
	integer = false,
}: {
	label: string;
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	integer?: boolean;
}) {
	const [draft, setDraft] = useState<string | null>(null);
	return (
		<label>
			<span>{label}</span>
			<input
				type="number"
				value={draft ?? value}
				min={Number.isFinite(min) ? min : undefined}
				max={Number.isFinite(max) ? max : undefined}
				step={step}
				onFocus={() => setDraft(String(value))}
				onBlur={() => setDraft(null)}
				onChange={(event) => {
					setDraft(event.target.value);
					const number = event.target.valueAsNumber;
					if (
						Number.isFinite(number) &&
						number >= min &&
						number <= max &&
						(!integer || Number.isInteger(number))
					)
						onChange(number);
				}}
			/>
		</label>
	);
}

export default function ProductProperties({
	sceneId,
	nodeId,
}: {
	sceneId: string;
	nodeId: string;
}) {
	const scene = useGSStore((state) => state.gsmap.scenes[sceneId]);
	const directory = useGSStore((state) => state.gsmap.directoryHandle);
	const artifact = scene.artifacts[nodeId];
	const product = artifact.product;
	const [photos, setPhotos] = useState<string[]>([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [currencyDraft, setCurrencyDraft] = useState<string | null>(null);
	const photoRequest = useRef({ sequence: 0 });
	useEffect(() => {
		let cancelled = false;
		const requests = photoRequest.current;
		if (directory)
			void (async () => {
				try {
					const names: string[] = [];
					for await (const entry of directory.values())
						if (
							entry.kind === "file" &&
							/\.(png|jpe?g|webp|avif)$/i.test(entry.name)
						)
							names.push(entry.name);
					if (!cancelled) setPhotos(names.sort());
				} catch {
					if (!cancelled)
						setError("Could not read photos from the project folder.");
				}
			})();
		return () => {
			cancelled = true;
			requests.sequence++;
		};
	}, [directory]);
	if (!product) return null;
	const update = (changes: Partial<GSProduct>) => {
		const current =
			useGSStore.getState().gsmap.scenes[sceneId]?.artifacts[nodeId]?.product;
		if (current) {
			if (changes.unit && changes.unit !== current.unit)
				useProductStore.getState().deleteItem(sceneId, nodeId);
			useGSStore.getState().setNodeTransform(sceneId, nodeId, {
				product: { ...current, ...changes },
			});
		}
	};
	const choosePhoto = async (name: string) => {
		if (!directory || !name) return;
		const request = ++photoRequest.current.sequence;
		setLoading(true);
		setError("");
		try {
			const file = await (await directory.getFileHandle(name)).getFile();
			const bitmap = await createImageBitmap(file);
			const { width, height } = bitmap;
			bitmap.close();
			if (request !== photoRequest.current.sequence) return;
			update({
				image: name,
				imageCrop: {
					x: 0,
					y: 0,
					width,
					height,
					sourceWidth: width,
					sourceHeight: height,
				},
			});
		} catch {
			if (request === photoRequest.current.sequence)
				setError(
					"Could not open that photo. Choose a valid image in the project folder."
				);
		} finally {
			if (request === photoRequest.current.sequence) setLoading(false);
		}
	};
	const crop = product.imageCrop;
	const photoOptions = Array.from(new Set([product.image, ...photos])).filter(
		Boolean
	);
	return (
		<>
			<NodePanel label="Position" icon="move" vertical>
				<Fields>
					{(["x", "y", "z"] as const).map((axis) => (
						<NumberField
							key={axis}
							label={`Position ${axis.toUpperCase()}`}
							value={artifact.position[axis]}
							onChange={(value) =>
								useGSStore.getState().setNodeTransform(sceneId, nodeId, {
									position: { ...artifact.position, [axis]: value },
								})
							}
							step={0.001}
						/>
					))}
					<p className="note">Coordinates are relative to the scene.</p>
				</Fields>
			</NodePanel>
			<NodePanel label="Pricing" icon="tag" vertical>
				<Fields>
					<NumberField
						label="Product price"
						value={product.price}
						min={0}
						onChange={(price) => update({ price })}
					/>
					<label>
						<span>Currency</span>
						<input
							type="text"
							aria-label="Product currency"
							maxLength={3}
							value={currencyDraft ?? product.currency}
							onFocus={() => setCurrencyDraft(product.currency)}
							onChange={(event) =>
								setCurrencyDraft(event.target.value.toUpperCase())
							}
							onBlur={() => {
								if (currencyDraft !== null) {
									if (/^[A-Z]{3}$/.test(currencyDraft)) {
										update({ currency: currencyDraft });
										setError("");
									} else
										setError(
											"Currency must be a three-letter code such as USD."
										);
								}
								setCurrencyDraft(null);
							}}
						/>
					</label>
					<label>
						<span>Unit</span>
						<select
							aria-label="Product unit"
							value={product.unit}
							onChange={(event) => update({ unit: event.target.value })}
							style={{ width: 145 }}
						>
							<option value="kg">Kilogram</option>
							<option value="item">Item</option>
							{!["kg", "item"].includes(product.unit) && (
								<option value={product.unit}>{product.unit}</option>
							)}
						</select>
					</label>
				</Fields>
			</NodePanel>
			<NodePanel label="Photo" icon="image" vertical>
				<Fields>
					<label>
						<select
							aria-label="Product photo"
							value={product.image}
							disabled={!directory || loading}
							onChange={(event) => void choosePhoto(event.target.value)}
						>
							<option value="" disabled>
								Choose a project photo
							</option>
							{photoOptions.map((name) => (
								<option key={name} value={name}>
									{name}
								</option>
							))}
						</select>
					</label>
					<p className="note">
						Photos must be in the project folder. Choosing a photo resets its
						crop.
					</p>
					{product.image && (
						<Preview>
							<ProductPhoto
								key={product.image}
								product={product}
								scene={scene}
								name={artifact.name}
							/>
						</Preview>
					)}
					{product.image && (
						<details>
							<summary>Crop photo (pixels)</summary>
							<Fields>
								<NumberField
									label="Crop X"
									value={crop.x}
									min={0}
									max={crop.sourceWidth - crop.width}
									integer
									step={1}
									onChange={(x) => update({ imageCrop: { ...crop, x } })}
								/>
								<NumberField
									label="Crop Y"
									value={crop.y}
									min={0}
									max={crop.sourceHeight - crop.height}
									integer
									step={1}
									onChange={(y) => update({ imageCrop: { ...crop, y } })}
								/>
								<NumberField
									label="Crop width"
									value={crop.width}
									min={1}
									max={crop.sourceWidth - crop.x}
									integer
									step={1}
									onChange={(width) =>
										update({ imageCrop: { ...crop, width } })
									}
								/>
								<NumberField
									label="Crop height"
									value={crop.height}
									min={1}
									max={crop.sourceHeight - crop.y}
									integer
									step={1}
									onChange={(height) =>
										update({ imageCrop: { ...crop, height } })
									}
								/>
								<p className="note">
									Source: {crop.sourceWidth} × {crop.sourceHeight}
								</p>
								<Button
									title="Reset photo crop"
									label="Use full photo"
									icon="maximize"
									onClick={() =>
										update({
											imageCrop: {
												...crop,
												x: 0,
												y: 0,
												width: crop.sourceWidth,
												height: crop.sourceHeight,
											},
										})
									}
								/>
							</Fields>
						</details>
					)}
					{error && (
						<p className="error" role="alert">
							{error}
						</p>
					)}
					<Button
						title="Preview product"
						label="Preview product"
						icon="eye"
						variant={product.image ? "primary" : "disabled"}
						onClick={() => {
							useInteractions.getState().unlock();
							useProductStore.getState().open(sceneId, nodeId);
							if (document.pointerLockElement) document.exitPointerLock();
						}}
					/>
				</Fields>
			</NodePanel>
			<NodePanel label="Click area" icon="box" vertical>
				<Fields>
					{(["x", "y", "z"] as const).map((axis) => (
						<NumberField
							key={axis}
							label={`Click area ${axis.toUpperCase()}`}
							value={product.hitbox[axis]}
							min={0.001}
							step={0.001}
							onChange={(value) =>
								update({ hitbox: { ...product.hitbox, [axis]: value } })
							}
						/>
					))}
					<p className="note">
						Full dimensions in scene-local units.
					</p>
				</Fields>
			</NodePanel>
		</>
	);
}

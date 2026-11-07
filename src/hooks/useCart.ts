import { productLineTotal } from "@/utils/productCommerce";
import { useMemo } from "react";
import { useGSStore } from "./useGSStore";
import { productCartKey, useProductStore } from "./useProductStore";

export function useCart() {
	const scenes = useGSStore((state) => state.gsmap.scenes);
	const quantities = useProductStore((state) => state.quantities);
	return useMemo(() => {
		const lines = Object.values(scenes).flatMap((scene) =>
			Object.values(scene.artifacts).flatMap((artifact) => {
				const key = productCartKey(scene.id, artifact.id);
				const quantity = quantities[key] ?? 0;
				if (!artifact.product || quantity <= 0) return [];
				return [
					{
						key,
						scene,
						artifact,
						product: artifact.product,
						quantity,
						total: productLineTotal(artifact.product, quantity),
					},
				];
			})
		);
		const grouped = new Map<string, number>();
		for (const line of lines)
			grouped.set(
				line.product.currency,
				(grouped.get(line.product.currency) ?? 0) + line.total
			);
		const totals = Array.from(grouped, ([currency, amount]) => ({
			currency,
			amount,
		}));
		return { lines, totals };
	}, [scenes, quantities]);
}

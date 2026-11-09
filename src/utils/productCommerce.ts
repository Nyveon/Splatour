import type { GSProduct } from "@/model/GSNode";

export const quantityStep = (product: GSProduct) =>
	product.unit === "kg" ? 0.25 : 1;

export const formatMoney = (amount: number, currency: string) =>
	new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
		amount
	);

export const formatQuantity = (quantity: number, product: GSProduct) =>
	`${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(quantity)}${product.unit === "kg" ? " kg" : ""}`;

/** Round each line to the currency's minor unit before summing the cart. */
export function productLineTotal(product: GSProduct, quantity: number) {
	const digits =
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: product.currency,
		}).resolvedOptions().maximumFractionDigits ?? 2;
	const precision = 10 ** digits;
	return (
		Math.round((product.price * quantity + Number.EPSILON) * precision) /
		precision
	);
}

import { toast } from "react-toastify";

export function toastError(message: string) {
	toast(message, {
		type: "error",
	});
}

export function toastUnknownError() {
	toastError("An unknown error occurred");
}

export function toastSuccess(message: string) {
	toast(message, {
		type: "success",
	});
}

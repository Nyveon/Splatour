import { SerialGSMap } from "@/model/GSMap";
import { useEffect, useState } from "react";

export default function useFetchGSMap(url: string) {
	const [serialMap, setSerialMap] = useState<SerialGSMap | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		console.log("Fetching data from:", url);
		fetch(url, { mode: "no-cors" })
			.then((response) => {
				if (response.status >= 400) {
					throw new Error("Server error");
				}
				return response.json();
			})
			.then((data: SerialGSMap) => {
				setSerialMap(data);
			})
			.catch((error: unknown) => {
				if (error instanceof Error) {
					setError(error);
				} else {
					console.error("Unexpected error");
				}
			})
			.finally(() => {
				setLoading(false);
			});
	}, [url]);

	return { serialMap, error, loading };
}

interface SpzParts {
	format: "splatour-spz-parts";
	version: 1;
	fileName: string;
	byteLength: number;
	sha256: string;
	parts: { fileName: string; byteLength: number }[];
}

export function isSplitSpz(path: string): boolean {
	return /\.spz\.parts$/i.test(path.split(/[?#]/, 1)[0]);
}

export function parseSpzParts(text: string): SpzParts {
	const data = JSON.parse(text) as SpzParts;
	if (
		!data ||
		data.format !== "splatour-spz-parts" ||
		data.version !== 1 ||
		typeof data.fileName !== "string" ||
		!/^[^/\\?#]+\.spz$/i.test(data.fileName) ||
		!Number.isSafeInteger(data.byteLength) ||
		data.byteLength <= 0 ||
		typeof data.sha256 !== "string" ||
		!/^[a-f0-9]{64}$/.test(data.sha256) ||
		!Array.isArray(data.parts) ||
		!data.parts.length ||
		data.parts.some(
			(part, index) =>
				!part ||
				part.fileName !==
					`${data.fileName}.part${String(index).padStart(3, "0")}` ||
				!Number.isSafeInteger(part.byteLength) ||
				part.byteLength <= 0
		) ||
		data.parts.reduce((sum, part) => sum + part.byteLength, 0) !==
			data.byteLength
	)
		throw new Error("Invalid split SPZ manifest.");
	return data;
}

async function combineParts(
	manifest: SpzParts,
	read: (name: string) => Promise<ArrayBuffer>
) {
	const bytes = new Uint8Array(manifest.byteLength);
	let offset = 0;
	await Promise.all(
		manifest.parts.map((part) => {
			const start = offset;
			offset += part.byteLength;
			return read(part.fileName).then((buffer) => {
				if (buffer.byteLength !== part.byteLength)
					throw new Error(`SPZ part has the wrong size: ${part.fileName}`);
				bytes.set(new Uint8Array(buffer), start);
			});
		})
	);
	const digest = await crypto.subtle.digest("SHA-256", bytes);
	const hash = Array.from(new Uint8Array(digest), (byte) =>
		byte.toString(16).padStart(2, "0")
	).join("");
	if (hash !== manifest.sha256) throw new Error("Split SPZ checksum mismatch.");
	return bytes.buffer;
}

export async function readLocalScene(file: File, files: File[]): Promise<File> {
	if (!isSplitSpz(file.name)) return file;
	const manifest = parseSpzParts(await file.text());
	const bytes = await combineParts(manifest, async (name) => {
		const part = files.find((file) => file.name === name);
		if (!part) throw new Error(`Missing SPZ part: ${name}`);
		return part.arrayBuffer();
	});
	return new File([bytes], manifest.fileName, {
		type: "application/octet-stream",
	});
}

export async function loadSceneSource(
	path: string,
	signal: AbortSignal
): Promise<{ fileName: string; fileBytes?: ArrayBuffer }> {
	if (!isSplitSpz(path)) return { fileName: path };
	const url = new URL(path, document.baseURI);
	const read = async (url: URL) => {
		const response = await fetch(url, { signal });
		if (!response.ok)
			throw new Error(
				`Could not load ${url.pathname}: HTTP ${response.status}`
			);
		return response;
	};
	const manifest = parseSpzParts(await (await read(url)).text());
	const fileBytes = await combineParts(manifest, async (name) =>
		(await read(new URL(encodeURIComponent(name), url))).arrayBuffer()
	);
	return { fileName: manifest.fileName, fileBytes };
}

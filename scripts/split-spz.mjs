import { createHash } from "node:crypto";
import {
	existsSync,
	readFileSync,
	readdirSync,
	renameSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

const maxBytes = 25_000_000;
const sources = process.argv.slice(2);
if (!sources.length) {
	console.error("Usage: npm run split:spz -- path/to/scene.spz [...more.spz]");
	process.exit(1);
}

for (const input of sources) {
	const source = resolve(input);
	if (!/\.spz$/i.test(source))
		throw new Error(`Expected an SPZ file: ${input}`);
	const bytes = readFileSync(source);
	const fileName = basename(source);
	const manifestName = `${fileName}.parts`;
	const manifestPath = join(dirname(source), manifestName);
	const parts = [];
	if (bytes.length > maxBytes) {
		for (let offset = 0; offset < bytes.length; offset += maxBytes) {
			const part = bytes.subarray(offset, offset + maxBytes);
			const name = `${fileName}.part${String(parts.length).padStart(3, "0")}`;
			writeFileSync(join(dirname(source), name), part);
			parts.push({ fileName: name, byteLength: part.length });
		}
		const manifest = {
			format: "splatour-spz-parts",
			version: 1,
			fileName,
			byteLength: bytes.length,
			sha256: createHash("sha256").update(bytes).digest("hex"),
			parts,
		};
		writeFileSync(
			`${manifestPath}.tmp`,
			JSON.stringify(manifest, null, 2) + "\n"
		);
		renameSync(`${manifestPath}.tmp`, manifestPath);
	} else {
		rmSync(manifestPath, { force: true });
	}
	const keep = new Set(parts.map((part) => part.fileName));
	for (const name of readdirSync(dirname(source))) {
		if (
			name.startsWith(`${fileName}.part`) &&
			/^\d+$/.test(name.slice(`${fileName}.part`.length)) &&
			!keep.has(name)
		)
			rmSync(join(dirname(source), name));
	}
	const mapPath = join(dirname(source), "map.json");
	if (existsSync(mapPath)) {
		const previous = readFileSync(mapPath, "utf8");
		const next = previous.replace(
			/("filePath"\s*:\s*)("(?:[^"\\]|\\.)*")/g,
			(match, key, value) => {
				const name = JSON.parse(value);
				return name === fileName || name === manifestName
					? key + JSON.stringify(parts.length ? manifestName : fileName)
					: match;
			}
		);
		if (next !== previous) writeFileSync(mapPath, next);
	}
	console.log(
		parts.length
			? `${input}: ${parts.length} parts; use ${manifestName}`
			: `${input}: within 25 MB, no split needed`
	);
}

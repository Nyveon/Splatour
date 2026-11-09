import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
	existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync,
	linkSync, copyFileSync, renameSync, rmSync, rmdirSync,
} from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const defaults = [
	"DCC_Norte/salita.spz", "DCC_Norte/hallway.spz", "DCC_Norte/ofisalita.spz",
	"Supermarket/supermarket.spz",
	"Khachkars/Khachkar_12_4.ksplat", "Khachkars/Khachkar_12_5.ksplat",
];
const args = process.argv.slice(2);
const force = args.includes("--force");
const sources = args.filter(arg => arg !== "--force");
const version = JSON.parse(readFileSync(join(root, "node_modules/@sparkjsdev/spark/package.json"))).version;
const cache = join(root, "node_modules/.cache");
const tool = join(cache, `spark-lod-v${version}`);
const binary = join(tool, "rust/target/release", process.platform === "win32" ? "build-lod.exe" : "build-lod");
const manifestPath = join(root, "scripts/lod-assets.json");
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath)) : {};
const hash = path => createHash("sha256").update(readFileSync(path)).digest("hex");

function ensureBuilder() {
	if (existsSync(binary)) return;
	mkdirSync(cache, { recursive: true });
	if (!existsSync(join(tool, ".git"))) {
		execFileSync("git", ["clone", "--depth", "1", "--branch", `v${version}`, "--filter=blob:none", "--sparse",
			"https://github.com/sparkjsdev/spark.git", tool], { stdio: "inherit" });
	}
	execFileSync("git", ["-c", `safe.directory=${tool.replaceAll("\\", "/")}`, "-C", tool, "sparse-checkout", "set", "rust"], { stdio: "inherit" });
	execFileSync("cargo", ["build", "--release", "--locked", "--no-default-features", "--manifest-path", join(tool, "rust/build-lod/Cargo.toml")], { stdio: "inherit" });
}

function readRad(path) {
	const bytes = readFileSync(path);
	if (bytes.length < 8 || bytes.readUInt32LE(0) !== 0x30444152) throw new Error(`Invalid RAD output: ${path}`);
	const length = bytes.readUInt32LE(4);
	if (length < 1 || length + 8 >= bytes.length) throw new Error(`Truncated RAD output: ${path}`);
	const meta = JSON.parse(bytes.toString("utf8", 8, length + 8));
	if (!meta.lodTree || !meta.count || !meta.chunks?.length) throw new Error(`Missing LOD hierarchy: ${path}`);
	return { meta, bytes: bytes.length };
}

function useRadInMap(source, output) {
	const map = join(dirname(source), "map.json");
	if (!existsSync(map)) return;
	const text = readFileSync(map, "utf8");
	const quoted = JSON.stringify(basename(source)).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const next = text.replace(new RegExp(`("filePath"\\s*:\\s*)${quoted}`, "g"), (_match, key) => key + JSON.stringify(basename(output)));
	if (next !== text) writeFileSync(map, next);
}

for (const relative of sources.length ? sources : defaults) {
	if (!/\.(spz|ksplat|ply)$/i.test(relative)) throw new Error(`Expected a source SPZ, KSPLAT, or PLY: ${relative}`);
	const source = resolve(root, relative);
	const output = source.slice(0, -extname(source).length) + "-lod.rad";
	const sourceHash = hash(source);
	const key = source.slice(root.length + 1).replaceAll("\\", "/");
	const previous = manifest[key];
	if (!force && previous?.sourceSha256 === sourceHash && previous.spark === version && previous.method === "tiny-lod-1.5" && existsSync(output) && previous.outputSha256 === hash(output)) {
		useRadInMap(source, output);
		console.log(`Unchanged: ${key}`);
		continue;
	}
	ensureBuilder();
	const staging = mkdtempSync(join(cache, "lod-stage-"));
	const stagedInput = join(staging, basename(source));
	const stagedOutput = join(staging, basename(output));
	try {
		try { linkSync(source, stagedInput); } catch { copyFileSync(source, stagedInput); }
		console.log(`Building: ${key}`);
		const log = execFileSync(binary, ["--quick", "--gsplat", "--rad", "--max-sh=3", stagedInput], { maxBuffer: 16 * 1024 * 1024 });
		if (!existsSync(stagedOutput)) throw new Error(`No RAD generated:\n${log}`);
		const { meta, bytes } = readRad(stagedOutput);
		renameSync(stagedOutput, output);
		manifest[key] = {
			spark: version, method: "tiny-lod-1.5", sourceSha256: sourceHash,
			output: output.slice(root.length + 1).replaceAll("\\", "/"),
			outputSha256: hash(output), bytes, storedSplats: meta.count, maxSh: meta.maxSh ?? 0,
		};
		useRadInMap(source, output);
		writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
		console.log(`Ready: ${basename(output)} (${(bytes / 1e6).toFixed(1)} MB, ${meta.count.toLocaleString()} hierarchy splats, SH ${meta.maxSh ?? 0})`);
	} finally {
		rmSync(stagedInput, { force: true });
		rmSync(stagedOutput, { force: true });
		rmdirSync(staging);
	}
}

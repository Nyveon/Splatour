import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { Quaternion, Vector3, Vector4 } from "three";

// Exercise the application loader against the real renderer, without a browser
// or an additional test runner. Its deferred parsing only needs window.setTimeout.
globalThis.window = { setTimeout };
const source = await readFile(new URL("../src/model/GSScene.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
	compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 },
}).outputText.replaceAll(
	'"@mkkellogg/gaussian-splats-3d"',
	JSON.stringify(new URL(
		"./gaussian-splats-3d.module.js",
		import.meta.resolve("@mkkellogg/gaussian-splats-3d")
	).href)
);
const { fileToSplatBuffer, isSupportedSceneFile, gssCreateBuffer, gssSerialize, gssDeserialize } =
	await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

function plyFile(name = "room.ply", truncate = false) {
	const properties = ["x", "y", "z", "f_dc_0", "f_dc_1", "f_dc_2", "opacity",
		"scale_0", "scale_1", "scale_2", "rot_0", "rot_1", "rot_2", "rot_3"];
	const header = ["ply", "format binary_little_endian 1.0", "element vertex 2",
		...properties.map((name) => `property float ${name}`), "end_header", ""].join("\n");
	const records = Buffer.alloc(properties.length * 4 * 2);
	// One visible Gaussian and one below the viewer's opacity threshold.
	const values = [[1, 2, 3, 0, 0, 0, 5, -2, -2, -2, 1, 0, 0, 0],
		[4, 5, 6, 0, 0, 0, -10, -2, -2, -2, 1, 0, 0, 0]];
	values.flat().forEach((value, index) => records.writeFloatLE(value, index * 4));
	return new File([header, truncate ? records.subarray(0, 4) : records], name);
}

test("imports Gaussian PLY geometry, color, scale, and opacity", async () => {
	const buffer = await fileToSplatBuffer(plyFile());
	assert.equal(buffer.getSplatCount(), 1);
	const center = new Vector3(), scale = new Vector3(), color = new Vector4();
	const rotation = new Quaternion();
	buffer.getSplatCenter(0, center);
	buffer.getSplatScaleAndRotation(0, scale, rotation);
	buffer.getSplatColor(0, color);
	assert.ok(center.distanceTo(new Vector3(1, 2, 3)) < 0.001);
	assert.ok(Math.abs(scale.x - Math.exp(-2)) < 0.001);
	assert.ok(rotation.angleTo(new Quaternion()) < 0.001);
	assert.ok(Math.abs(color.x - 128) <= 1);
	assert.ok(color.w > 250);
});

test("retains PLY file references when saving and reopening a scene", async () => {
	const file = plyFile("My room.PLY");
	const scene = gssCreateBuffer(file.name, await fileToSplatBuffer(file));
	const saved = JSON.parse(JSON.stringify(gssSerialize(scene)));
	const reopened = gssDeserialize(saved);
	assert.equal(reopened.filePath, file.name);
	assert.equal(reopened.id, scene.id);
	assert.equal((await fileToSplatBuffer(file)).getSplatCount(), 1);
});

test("continues to load KSPLAT buffers", async () => {
	const original = await fileToSplatBuffer(plyFile());
	const loaded = await fileToSplatBuffer(new File([original.bufferData], "room.ksplat"));
	assert.equal(loaded.getSplatCount(), original.getSplatCount());
	const center = new Vector3();
	loaded.getSplatCenter(0, center);
	assert.ok(center.distanceTo(new Vector3(1, 2, 3)) < 0.001);
});

test("rejects truncated PLY data instead of leaving the load pending", { timeout: 2000 }, async () => {
	await assert.rejects(fileToSplatBuffer(plyFile("broken.ply", true)));
});

test("file filtering matches the supported import formats", async () => {
	for (const name of ["room.ply", "room.PLY", "room.ksplat", "room.KSPLAT"])
		assert.equal(isSupportedSceneFile(name), true);
	for (const name of ["room.splat", "room.spz", "room.obj", "room.ply.txt"])
		assert.equal(isSupportedSceneFile(name), false);
	await assert.rejects(fileToSplatBuffer(new File([""], "room.obj")), /Unsupported scene format/);
});

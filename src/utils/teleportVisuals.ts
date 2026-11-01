import {
	CylinderGeometry,
	DoubleSide,
	Mesh,
	MeshBasicMaterial,
	type InterleavedBufferAttribute,
	type Vector3,
} from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

export function createTeleportVisuals(playerHeight: number) {
	const geometry = new LineGeometry();
	geometry.setPositions(new Float32Array(65 * 3));
	const line = new Line2(
		geometry,
		new LineMaterial({
			linewidth: 3,
			transparent: true,
			toneMapped: false,
			depthTest: false,
			depthWrite: false,
		})
	);
	line.frustumCulled = false;
	line.renderOrder = 1000;
	const marker = new Mesh(
		new CylinderGeometry(0.22, 0.22, playerHeight, 32, 1, true).translate(
			0,
			playerHeight / 2,
			0
		),
		new MeshBasicMaterial({
			side: DoubleSide,
			transparent: true,
			opacity: 0.2,
			toneMapped: false,
			depthTest: false,
			depthWrite: false,
		})
	);
	marker.renderOrder = 1000;
	line.visible = marker.visible = false;
	return { line, marker };
}

export function updateTeleportArc(line: Line2, points: readonly Vector3[]) {
	const starts = line.geometry.getAttribute(
		"instanceStart"
	) as InterleavedBufferAttribute;
	const ends = line.geometry.getAttribute(
		"instanceEnd"
	) as InterleavedBufferAttribute;
	const count = Math.min(points.length - 1, starts.count);
	for (let index = 0; index < count; index++) {
		const start = points[index],
			end = points[index + 1];
		starts.setXYZ(index, start.x, start.y, start.z);
		ends.setXYZ(index, end.x, end.y, end.z);
	}
	starts.data.needsUpdate = true;
	line.geometry.instanceCount = Math.max(0, count);
}

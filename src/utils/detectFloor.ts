import type { Vec3 } from "./data";
import { floorPlane } from "./floorAlignment";

export interface DetectedFloor {
	points: Vec3[];
	inliers: number;
	samples: number;
	rms: number;
	area: number;
}

/** Robustly fit y = ax + bz + c near an already approximately level floor. */
export function detectFloor(samples: readonly Vec3[]): DetectedFloor {
	if (samples.length < 80)
		throw new Error(
			"Not enough floor data near Y = 0. Move the approximate floor closer to ground level or widen the search height."
		);
	// Limit dense patches to one sample per small voxel before fitting.
	const voxels = new Map<string, Vec3>();
	for (const point of samples) {
		if (![point.x, point.y, point.z].every(Number.isFinite)) continue;
		const key = `${Math.floor(point.x / 0.12)},${Math.floor(point.y / 0.025)},${Math.floor(point.z / 0.12)}`;
		if (!voxels.has(key)) voxels.set(key, point);
	}
	const points = [...voxels.values()];
	if (points.length < 80)
		throw new Error(
			"Floor samples are too clustered. Use a larger clear floor area."
		);
	const threshold = 0.035;
	const maxSlope = Math.tan(Math.PI / 12);
	let seed = 1729;
	const random = () => {
		seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
		return seed / 4294967296;
	};
	let best: Vec3[] = [],
		bestScore = 0;
	for (let iteration = 0; iteration < 350; iteration++) {
		const p = points[Math.floor(random() * points.length)],
			q = points[Math.floor(random() * points.length)],
			r = points[Math.floor(random() * points.length)];
		const dx = q.x - p.x,
			dz = q.z - p.z,
			ex = r.x - p.x,
			ez = r.z - p.z;
		const determinant = dx * ez - ex * dz;
		if (Math.abs(determinant) < 0.15) continue;
		const a = ((q.y - p.y) * ez - (r.y - p.y) * dz) / determinant;
		const b = (dx * (r.y - p.y) - ex * (q.y - p.y)) / determinant;
		if (Math.hypot(a, b) > maxSlope) continue;
		const c = p.y - a * p.x - b * p.z;
		const normalization = Math.sqrt(1 + a * a + b * b);
		const inliers = points.filter(
			(point) =>
				Math.abs(point.y - a * point.x - b * point.z - c) / normalization <
				threshold
		);
		// Favor broad support, not a dense object such as a chair seat.
		const cells = new Set(
			inliers.map(
				(point) => `${Math.floor(point.x / 0.4)},${Math.floor(point.z / 0.4)}`
			)
		);
		const score = cells.size * 4 + inliers.length;
		if (score > bestScore) {
			bestScore = score;
			best = inliers;
		}
	}
	if (best.length < Math.max(60, points.length * 0.15))
		throw new Error(
			"No reliable horizontal floor found. Improve the approximate alignment or pick floor points manually."
		);
	let a = 0,
		b = 0,
		c = 0,
		center = { x: 0, y: 0, z: 0 };
	for (let iteration = 0; iteration < 3; iteration++) {
		center = best.reduce(
			(sum, point) => ({
				x: sum.x + point.x / best.length,
				y: sum.y + point.y / best.length,
				z: sum.z + point.z / best.length,
			}),
			{ x: 0, y: 0, z: 0 }
		);
		let xx = 0,
			zz = 0,
			xz = 0,
			xy = 0,
			zy = 0;
		for (const point of best) {
			const x = point.x - center.x,
				y = point.y - center.y,
				z = point.z - center.z;
			xx += x * x;
			zz += z * z;
			xz += x * z;
			xy += x * y;
			zy += z * y;
		}
		const determinant = xx * zz - xz * xz;
		if (determinant / best.length ** 2 < 0.01)
			throw new Error(
				"Detected surface is too narrow to determine floor tilt reliably."
			);
		a = (xy * zz - zy * xz) / determinant;
		b = (zy * xx - xy * xz) / determinant;
		c = center.y - a * center.x - b * center.z;
		best = points.filter(
			(point) =>
				Math.abs(point.y - a * point.x - b * point.z - c) /
					Math.sqrt(1 + a * a + b * b) <
				threshold
		);
		if (best.length < 60)
			throw new Error("Floor fit is unstable. Try manual floor points.");
	}
	const width =
		Math.max(...best.map((point) => point.x)) -
		Math.min(...best.map((point) => point.x));
	const depth =
		Math.max(...best.map((point) => point.z)) -
		Math.min(...best.map((point) => point.z));
	if (
		Math.min(width, depth) < 0.8 ||
		width * depth < 1 ||
		Math.hypot(a, b) > maxSlope
	)
		throw new Error(
			"No broad, approximately level floor found. Adjust the scene roughly first."
		);
	const planePoint = (x: number, z: number): Vec3 => ({
		x,
		y: a * x + b * z + c,
		z,
	});
	const fitted = [
		planePoint(center.x - width / 3, center.z - depth / 3),
		planePoint(center.x + width / 3, center.z - depth / 3),
		planePoint(center.x, center.z + depth / 3),
	];
	floorPlane(fitted);
	return {
		points: fitted,
		inliers: best.length,
		samples: points.length,
		area: width * depth,
		rms: Math.sqrt(
			best.reduce(
				(sum, point) =>
					sum +
					(point.y - a * point.x - b * point.z - c) ** 2 / (1 + a * a + b * b),
				0
			) / best.length
		),
	};
}

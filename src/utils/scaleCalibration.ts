import {
	nodeIsPortalEdge,
	nodeIsSegment,
	nodeIsSolid,
	nodeIsWall,
	type GSNodeBarrier,
	type GSNodePortal,
} from "@/model/GSNode";
import type { GSScene } from "@/model/GSScene";
import type { Vec3 } from "./data";

export type ScaleCalibrationTransform = Pick<
	GSScene,
	"scale" | "position" | "barriers" | "portals"
>;

export function calibrationDistance(points: readonly Vec3[]): number {
	if (points.length !== 2) throw new Error("Pick two reference points.");
	if (!points.every((p) => [p.x, p.y, p.z].every(Number.isFinite)))
		throw new Error("The reference points must have finite coordinates.");
	const [a, b] = points;
	const distance = Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
	if (distance < 0.00001)
		throw new Error("Pick two distinct reference points.");
	return distance;
}

export function calibrationMultiplier(
	points: readonly Vec3[],
	meters: number
): number {
	if (!Number.isFinite(meters) || meters <= 0)
		throw new Error("Enter a real distance greater than zero.");
	const multiplier = meters / calibrationDistance(points);
	if (!Number.isFinite(multiplier) || multiplier <= 0)
		throw new Error("The scale correction is invalid.");
	return multiplier;
}

export function scaleCalibrationSnapshot(
	scene: GSScene
): ScaleCalibrationTransform {
	return {
		scale: scene.scale,
		position: scene.position,
		barriers: scene.barriers,
		portals: scene.portals,
	};
}

/** Uniform correction around the scene's X/Z origin at ground level (Y=0).
 * Artifacts already inherit scene scale. Ground nodes live outside that group.
 */
export function calibrateSceneScale(
	scene: GSScene,
	points: readonly Vec3[],
	meters: number
): ScaleCalibrationTransform {
	const factor = calibrationMultiplier(points, meters);
	const multiply = (p: Vec3): Vec3 => ({
		x: p.x * factor,
		y: p.y * factor,
		z: p.z * factor,
	});
	const scale = multiply(scene.scale);
	if (![scale.x, scale.y, scale.z].every((v) => Number.isFinite(v) && v > 0))
		throw new Error(
			"This scene needs positive, finite scale values before calibration."
		);
	const groundNodes = <T extends GSNodeBarrier | GSNodePortal>(
		nodes: Record<string, T>
	): Record<string, T> =>
		Object.fromEntries(
			Object.entries(nodes).map(([id, node]) => {
				if (nodeIsSegment(node))
					return [
						id,
						{
							...node,
							startPosition: multiply(node.startPosition),
							endPosition: multiply(node.endPosition),
							...(nodeIsWall(node) || nodeIsPortalEdge(node)
								? { thickness: node.thickness * factor }
								: {}),
						},
					];
				if (nodeIsSolid(node))
					return [
						id,
						{
							...node,
							position: multiply(node.position),
							radius: node.radius * factor,
						},
					];
				return [id, node];
			})
		);
	return {
		scale,
		position: { ...scene.position, y: scene.position.y * factor },
		barriers: groundNodes(scene.barriers),
		portals: groundNodes(scene.portals),
	};
}

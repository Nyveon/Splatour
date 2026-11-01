import {
	nodeIsSegment,
	nodeIsSolid,
	type GSNodeBarrier,
	type GSNodePortal,
} from "@/model/GSNode";
import type { GSScene } from "@/model/GSScene";
import { Euler, MathUtils, Quaternion, Vector3 } from "three";
import type { Vec3 } from "./data";

const vector = (point: Vec3) => new Vector3(point.x, point.y, point.z);
const coordinates = (point: Vector3): Vec3 => ({
	x: point.x,
	y: point.y,
	z: point.z,
});

export function floorPlane(points: readonly Vec3[]) {
	if (points.length !== 3)
		throw new Error("Pick three points on the same floor.");
	const [a, b, c] = points.map(vector);
	const ab = b.clone().sub(a),
		ac = c.clone().sub(a);
	if (Math.min(ab.length(), ac.length(), b.distanceTo(c)) < 0.2)
		throw new Error("Pick points at least 20 cm apart.");
	const normal = ab.clone().cross(ac);
	if (normal.length() / (ab.length() * ac.length()) < 0.1)
		throw new Error("The points are almost in a line. Pick a wider triangle.");
	normal.normalize();
	if (normal.y < 0) normal.negate();
	if (normal.y < Math.SQRT1_2)
		throw new Error(
			"This plane is too steep for a floor. Pick three floor points."
		);
	const center = a
		.add(b)
		.add(c)
		.multiplyScalar(1 / 3);
	return {
		normal,
		center,
		tilt: MathUtils.radToDeg(Math.acos(MathUtils.clamp(normal.y, -1, 1))),
	};
}

export function sceneTransformSignature(scene: GSScene): string {
	return JSON.stringify([scene.position, scene.rotation, scene.scale]);
}

export type FloorAlignmentTransform = Pick<
	GSScene,
	"position" | "rotation" | "barriers" | "portals"
>;

export function floorAlignmentSnapshot(
	scene: GSScene
): FloorAlignmentTransform {
	return {
		position: scene.position,
		rotation: scene.rotation,
		barriers: scene.barriers,
		portals: scene.portals,
	};
}

/** Rotate in world space without introducing shear, even with nonuniform scale. */
export function alignSceneFloor(
	scene: GSScene,
	points: readonly Vec3[],
	placeAtZero: boolean
): FloorAlignmentTransform {
	const { normal, center } = floorPlane(points);
	const correction = new Quaternion().setFromUnitVectors(
		normal,
		new Vector3(0, 1, 0)
	);
	const heightOffset = placeAtZero ? center.y : 0;
	const transform = (point: Vector3) => {
		point.sub(center).applyQuaternion(correction).add(center);
		point.y -= heightOffset;
		return point;
	};
	const position = transform(vector(scene.position));
	const rotation = new Euler().setFromQuaternion(
		correction
			.clone()
			.multiply(
				new Quaternion().setFromEuler(
					new Euler(scene.rotation.x, scene.rotation.y, scene.rotation.z)
				)
			)
	);
	// These nodes are stored on an unrotated X/Z plane, separately from splats.
	const groundPoint = (point: Vec3): Vec3 => {
		const world = new Vector3(
			point.x + scene.position.x,
			0,
			point.z + scene.position.z
		);
		world.y =
			center.y -
			(normal.x * (world.x - center.x) + normal.z * (world.z - center.z)) /
				normal.y;
		transform(world);
		return { x: world.x - position.x, y: point.y, z: world.z - position.z };
	};
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
							startPosition: groundPoint(node.startPosition),
							endPosition: groundPoint(node.endPosition),
						},
					];
				if (nodeIsSolid(node))
					return [id, { ...node, position: groundPoint(node.position) }];
				return [id, node];
			})
		);
	return {
		position: coordinates(position),
		rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
		barriers: groundNodes(scene.barriers),
		portals: groundNodes(scene.portals),
	};
}

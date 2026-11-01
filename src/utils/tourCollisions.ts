import type { GSNodePortalEdge, GSNodeSolid, GSNodeWall } from "@/model/GSNode";
import type { GSScene } from "@/model/GSScene";
import type { Vec3 } from "./data";

export type GroundPoint = Pick<Vec3, "x" | "z">;
export interface CollisionMap {
	scenes: Record<string, Pick<GSScene, "position" | "barriers" | "portals">>;
}

// A 15 cm footprint fits narrow tour doorways without putting the camera in walls.
export const playerCollisionRadius = 0.15;
const skin = 0.005;
const epsilon = 1e-9;
const maxContacts = 12;
const portalGap = 1e-6;

interface Obstacle {
	a: GroundPoint;
	b: GroundPoint;
	radius: number;
}
interface Portal extends Obstacle {
	destination: string;
}
interface Hit {
	time: number;
	normal: GroundPoint;
}
interface SceneGeometry {
	obstacles: Obstacle[];
	portals: Portal[];
}
// Immer replaces a scene when its transforms or nodes change.
const geometryCache = new WeakMap<
	CollisionMap["scenes"][string],
	SceneGeometry
>();
const dot = (a: GroundPoint, b: GroundPoint) => a.x * b.x + a.z * b.z;
const cross = (a: GroundPoint, b: GroundPoint) => a.x * b.z - a.z * b.x;
const subtract = (a: GroundPoint, b: GroundPoint): GroundPoint => ({
	x: a.x - b.x,
	z: a.z - b.z,
});

function geometryFor(source: CollisionMap["scenes"][string]): SceneGeometry {
	const cached = geometryCache.get(source);
	if (cached) return cached;
	// Ground nodes inherit only scene X/Z translation, not scan rotation or scale.
	const world = (p: GroundPoint): GroundPoint => ({
		x: p.x + source.position.x,
		z: p.z + source.position.z,
	});
	const obstacles: Obstacle[] = [];
	for (const node of Object.values(source.barriers)) {
		if ("startPosition" in node && "endPosition" in node) {
			const wall = node as GSNodeWall;
			obstacles.push({
				a: world(wall.startPosition),
				b: world(wall.endPosition),
				radius: Math.max(0, wall.thickness / 2),
			});
		} else if ("position" in node && "radius" in node) {
			const solid = node as GSNodeSolid;
			const center = world(solid.position);
			obstacles.push({
				a: center,
				b: center,
				radius: Math.max(0, solid.radius),
			});
		}
	}
	const portals: Portal[] = [];
	for (const node of Object.values(source.portals)) {
		if (!(
			"startPosition" in node &&
			"endPosition" in node &&
			"destination" in node
		))
			continue;
		const portal = node as GSNodePortalEdge;
		portals.push({
			a: world(portal.startPosition),
			b: world(portal.endPosition),
			radius: Math.max(0, portal.thickness / 2),
			destination: portal.destination,
		});
	}
	const geometry = { obstacles, portals };
	geometryCache.set(source, geometry);
	return geometry;
}

function closestPoint(position: GroundPoint, obstacle: Obstacle): GroundPoint {
	const edge = subtract(obstacle.b, obstacle.a);
	const lengthSq = dot(edge, edge);
	const time =
		lengthSq > epsilon
			? Math.max(
					0,
					Math.min(1, dot(subtract(position, obstacle.a), edge) / lengthSq)
				)
			: 0;
	return { x: obstacle.a.x + edge.x * time, z: obstacle.a.z + edge.z * time };
}

function collisionObstacles(
	map: CollisionMap,
	sceneId: string,
	geometry: SceneGeometry
): Obstacle[] {
	const invalidPortals = geometry.portals.filter(
		(portal) =>
			portal.destination === sceneId || !map.scenes[portal.destination]
	);
	return invalidPortals.length
		? geometry.obstacles.concat(invalidPortals)
		: geometry.obstacles;
}

/** Resolve initial overlaps (teleports, edited barriers), independently of movement. */
function recover(
	position: GroundPoint,
	movement: GroundPoint,
	obstacles: Obstacle[],
	radius: number
): boolean {
	for (let iteration = 0; iteration < maxContacts; iteration++) {
		let overlapping = false;
		for (const obstacle of obstacles) {
			const offset = subtract(position, closestPoint(position, obstacle));
			const distance = Math.hypot(offset.x, offset.z);
			const clearance = radius + obstacle.radius;
			if (distance >= clearance - epsilon) continue;
			overlapping = true;
			let normal: GroundPoint;
			if (distance > epsilon)
				normal = { x: offset.x / distance, z: offset.z / distance };
			else {
				const edge = subtract(obstacle.b, obstacle.a);
				const length = Math.hypot(edge.x, edge.z);
				const speed = Math.hypot(movement.x, movement.z);
				normal =
					length > epsilon
						? { x: -edge.z / length, z: edge.x / length }
						: speed > epsilon
							? { x: -movement.x / speed, z: -movement.z / speed }
							: { x: 1, z: 0 };
				if (dot(normal, movement) > 0) normal = { x: -normal.x, z: -normal.z };
			}
			position.x += normal.x * (clearance - distance + epsilon);
			position.z += normal.z * (clearance - distance + epsilon);
		}
		if (!overlapping) return true;
	}
	// No valid footprint fits here. Discard further motion rather than tunnelling.
	return false;
}

function sweepCircle(
	position: GroundPoint,
	movement: GroundPoint,
	center: GroundPoint,
	radius: number
): Hit | undefined {
	const offset = subtract(position, center);
	const speedSq = dot(movement, movement);
	if (speedSq < epsilon * epsilon) return;
	const projection = dot(offset, movement);
	if (projection >= 0) return;
	const discriminant =
		projection * projection - speedSq * (dot(offset, offset) - radius * radius);
	if (discriminant < 0) return;
	const time = (-projection - Math.sqrt(discriminant)) / speedSq;
	if (time < -epsilon || time > 1) return;
	const hitTime = Math.max(0, time);
	const normal = {
		x: (offset.x + movement.x * hitTime) / radius,
		z: (offset.z + movement.z * hitTime) / radius,
	};
	if (dot(normal, movement) >= -epsilon) return;
	return { time: hitTime, normal };
}

/** A thick wall is a capsule: two straight sides and circular end caps. */
function sweepWall(
	position: GroundPoint,
	movement: GroundPoint,
	obstacle: Obstacle,
	playerRadius: number
): Hit | undefined {
	const radius = playerRadius + obstacle.radius;
	let nearest = sweepCircle(position, movement, obstacle.a, radius);
	const end = sweepCircle(position, movement, obstacle.b, radius);
	if (end && (!nearest || end.time < nearest.time)) nearest = end;
	const edge = subtract(obstacle.b, obstacle.a);
	const length = Math.hypot(edge.x, edge.z);
	if (length < epsilon) return nearest;
	const tangent = { x: edge.x / length, z: edge.z / length };
	const normal = { x: -tangent.z, z: tangent.x };
	const offset = subtract(position, obstacle.a);
	const distance = dot(offset, normal);
	const speed = dot(movement, normal);
	for (const side of [-1, 1]) {
		if (speed * side >= -epsilon) continue;
		const time = (side * radius - distance) / speed;
		if (time < -epsilon || time > 1) continue;
		const along =
			dot(offset, tangent) + dot(movement, tangent) * Math.max(0, time);
		if (along < 0 || along > length) continue;
		if (!nearest || time < nearest.time)
			nearest = {
				time: Math.max(0, time),
				normal: { x: normal.x * side, z: normal.z * side },
			};
	}
	return nearest;
}

/** Portals activate when the center crosses their segment, not on proximity. */
function crossingTime(
	position: GroundPoint,
	movement: GroundPoint,
	portal: Portal
): number | undefined {
	const edge = subtract(portal.b, portal.a);
	const denominator = cross(movement, edge);
	if (Math.abs(denominator) < epsilon) return;
	const offset = subtract(portal.a, position);
	const time = cross(offset, edge) / denominator;
	const along = cross(offset, movement) / denominator;
	// A rotated edge may produce t=1+roundoff or t=0 on the next frame.
	// Use spatial tolerances so crossing cannot fall between those two frames.
	const timeTolerance = epsilon / Math.hypot(movement.x, movement.z);
	const edgeTolerance = epsilon / Math.hypot(edge.x, edge.z);
	if (
		time >= -timeTolerance &&
		time <= 1 + timeTolerance &&
		along >= -edgeTolerance &&
		along <= 1 + edgeTolerance
	)
		return Math.max(0, Math.min(1, time));
}

/** Sweep the player's footprint through walls, solids, and portal crossings. */
export function moveTourPlayer(
	map: CollisionMap,
	sceneId: string,
	position: GroundPoint,
	movement: GroundPoint,
	radius = playerCollisionRadius
): { position: GroundPoint; sceneId: string } {
	const result = { position: { ...position }, sceneId };
	const remaining = { ...movement };
	const clearance = radius + skin;
	let recoverScene = true;
	for (let iteration = 0; iteration < maxContacts; iteration++) {
		const source = map.scenes[result.sceneId];
		if (!source) {
			result.position.x += remaining.x;
			result.position.z += remaining.z;
			break;
		}
		const geometry = geometryFor(source);
		// An unlinked portal must not let the player leave the tour geometry.
		const validPortal = (portal: Portal) =>
			portal.destination !== result.sceneId && !!map.scenes[portal.destination];
		const obstacles = collisionObstacles(map, result.sceneId, geometry);
		if (
			recoverScene &&
			!recover(result.position, remaining, obstacles, clearance)
		)
			break;
		recoverScene = false;
		if (dot(remaining, remaining) < epsilon * epsilon) break;
		let hit: Hit | undefined;
		for (const obstacle of obstacles) {
			const contact = sweepWall(
				result.position,
				remaining,
				obstacle,
				clearance
			);
			if (contact && (!hit || contact.time < hit.time)) hit = contact;
		}
		let portalHit:
			{ time: number; destination: string; portal: Portal } | undefined;
		for (const portal of geometry.portals) {
			if (!validPortal(portal)) continue;
			const time = crossingTime(result.position, remaining, portal);
			if (time !== undefined && (!portalHit || time < portalHit.time))
				portalHit = { time, destination: portal.destination, portal };
		}
		if (portalHit && (!hit || portalHit.time < hit.time - epsilon)) {
			const crossing = {
				x: result.position.x + remaining.x * portalHit.time,
				z: result.position.z + remaining.z * portalHit.time,
			};
			const destination = collisionObstacles(
				map,
				portalHit.destination,
				geometryFor(map.scenes[portalHit.destination])
			);
			const blockedBy = destination.filter((obstacle) => {
				const offset = subtract(crossing, closestPoint(crossing, obstacle));
				return (
					Math.hypot(offset.x, offset.z) < clearance + obstacle.radius - epsilon
				);
			});
			if (blockedBy.length) {
				// Check the destination jamb before switching. Recovering after the
				// switch can otherwise shove the player back across the portal.
				let guardHit: Hit | undefined;
				for (const obstacle of blockedBy) {
					const contact = sweepWall(
						result.position,
						remaining,
						obstacle,
						clearance
					);
					if (
						contact &&
						contact.time <= portalHit.time &&
						(!guardHit || contact.time < guardHit.time)
					)
						guardHit = contact;
				}
				if (!guardHit) {
					// Already overlapping a destination shape while still in the
					// source room: stop at the plane, without a lateral teleport.
					const edge = subtract(portalHit.portal.b, portalHit.portal.a);
					const length = Math.hypot(edge.x, edge.z);
					const normal = { x: -edge.z / length, z: edge.x / length };
					if (dot(normal, remaining) > 0) {
						normal.x *= -1;
						normal.z *= -1;
					}
					guardHit = {
						time: Math.max(
							0,
							portalHit.time - portalGap / Math.hypot(remaining.x, remaining.z)
						),
						normal,
					};
				}
				hit = guardHit;
				portalHit = undefined;
			}
		}
		if (portalHit && (!hit || portalHit.time < hit.time - epsilon)) {
			const length = Math.hypot(remaining.x, remaining.z);
			// Step a micrometer across the plane so coincident return portals cannot bounce.
			const advance = Math.min(1, portalHit.time + portalGap / length);
			result.position.x += remaining.x * advance;
			result.position.z += remaining.z * advance;
			if (advance === 1) {
				result.position.x += (remaining.x / length) * portalGap;
				result.position.z += (remaining.z / length) * portalGap;
			}
			remaining.x *= 1 - advance;
			remaining.z *= 1 - advance;
			result.sceneId = portalHit.destination;
			recoverScene = true;
			continue;
		}
		if (!hit) {
			result.position.x += remaining.x;
			result.position.z += remaining.z;
			break;
		}
		result.position.x += remaining.x * hit.time;
		result.position.z += remaining.z * hit.time;
		remaining.x *= 1 - hit.time;
		remaining.z *= 1 - hit.time;
		const intoWall = Math.min(0, dot(remaining, hit.normal));
		remaining.x -= hit.normal.x * intoWall;
		remaining.z -= hit.normal.z * intoWall;
	}
	return result;
}

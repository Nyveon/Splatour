import { Vector3, type Camera, type Group } from "three";
import {
	moveTourPlayer,
	type CollisionMap,
	type GroundPoint,
} from "./tourCollisions.ts";

const up = new Vector3(0, 1, 0);
export const teleportRange = 6;

export class SnapTurnInput {
	private armed = false;
	reset() {
		this.armed = false;
	}
	update(axis: number): number {
		if (!Number.isFinite(axis)) {
			this.reset();
			return 0;
		}
		if (Math.abs(axis) < 0.25) this.armed = true;
		if (!this.armed || Math.abs(axis) < 0.7) return 0;
		this.armed = false;
		return (-Math.sign(axis) * Math.PI) / 6;
	}
}

export function snapTurnRig(rig: Group, camera: Camera, radians: number) {
	const pivot = camera.getWorldPosition(new Vector3());
	rig.parent?.worldToLocal(pivot);
	rig.position.sub(pivot).applyAxisAngle(up, radians).add(pivot);
	rig.rotateY(radians);
	rig.updateMatrixWorld(true);
}

export function teleportRig(rig: Group, camera: Camera, target: Vector3) {
	const head = camera.getWorldPosition(new Vector3());
	rig.position.x += target.x - head.x;
	rig.position.z += target.z - head.z;
	rig.position.y = target.y;
	rig.updateMatrixWorld(true);
}

export function teleportArc(origin: Vector3, direction: Vector3) {
	const points = [origin.clone()];
	const velocity = direction.clone().normalize().multiplyScalar(6);
	for (let index = 1; index <= 64; index++) {
		const time = index * 0.04;
		const point = origin.clone().addScaledVector(velocity, time);
		point.y -= 0.5 * 9.81 * time * time;
		const previous = points[points.length - 1];
		if (previous.y >= 0 && point.y <= 0) {
			const target = previous
				.clone()
				.lerp(point, previous.y / (previous.y - point.y));
			target.y = 0;
			points.push(target);
			return { points, target };
		}
		points.push(point);
	}
	return { points, target: null };
}

export function teleportDestination(
	map: CollisionMap,
	sceneId: string,
	from: GroundPoint,
	target: GroundPoint
) {
	const distance = Math.hypot(target.x - from.x, target.z - from.z);
	if (
		!Number.isFinite(distance) ||
		distance < 0.25 ||
		distance > teleportRange ||
		!map.scenes[sceneId]
	)
		return null;
	const result = moveTourPlayer(map, sceneId, from, {
		x: target.x - from.x,
		z: target.z - from.z,
	});
	if (
		Math.hypot(result.position.x - target.x, result.position.z - target.z) >
		0.0001
	)
		return null;
	return result;
}

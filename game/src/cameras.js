// Shade Run — security cameras: wall-mounted sweeping cones, disable via panels.
import { CAMERA } from './config.js';
import { segmentHitsCover } from './world.js';
import { angleDiff } from './vision.js';

export function createCamera(spec) {
  return {
    x: spec.x,
    y: spec.y,
    baseFacing: spec.facing ?? 0,
    phase: spec.phase ?? 0,
    facing: spec.facing ?? 0,
    t: 0,
    disabled: false,
    alarm: false,       // true while this camera is actively seeing the player
    suspicion: 0,
  };
}

export function updateCamera(cam, player, step, emitAlarm) {
  if (cam.disabled) {
    cam.alarm = false;
    cam.suspicion = Math.max(0, cam.suspicion - CAMERA.suspicionDecay * step);
    return;
  }
  cam.t += step;
  // Fixed position, sweeping arc around its base facing.
  cam.facing = cam.baseFacing + Math.sin(cam.t * CAMERA.sweepSpeed + cam.phase) * 0.9;

  const dx = player.x - cam.x, dy = player.y - cam.y;
  const dist = Math.hypot(dx, dy);
  const inArc = dist <= CAMERA.coneRange
    && Math.abs(angleDiff(Math.atan2(dy, dx), cam.facing)) <= CAMERA.coneHalfAngle;
  const clear = inArc && !segmentHitsCover(cam.x, cam.y, player.x, player.y);

  if (clear) {
    const proximity = 1 - dist / CAMERA.coneRange;
    cam.suspicion += CAMERA.suspicionRate * (0.4 + 0.6 * proximity) * step;
    cam.alarm = true;
  } else {
    cam.suspicion = Math.max(0, cam.suspicion - CAMERA.suspicionDecay * step);
    cam.alarm = false;
  }
  cam.suspicion = Math.min(CAMERA.caughtThreshold, cam.suspicion);
  if (cam.suspicion >= CAMERA.caughtThreshold && emitAlarm) emitAlarm(cam);
}

export function cameraConePolygon(cam) {
  const pts = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const a = cam.facing - CAMERA.coneHalfAngle
      + (i / steps) * CAMERA.coneHalfAngle * 2;
    let range = CAMERA.coneRange;
    for (let t = 20; t <= CAMERA.coneRange; t += 12) {
      const x = cam.x + Math.cos(a) * t;
      const y = cam.y + Math.sin(a) * t;
      if (segmentHitsCover(cam.x, cam.y, x, y)) { range = t - 12; break; }
    }
    pts.push({ x: cam.x + Math.cos(a) * range, y: cam.y + Math.sin(a) * range });
  }
  return pts;
}

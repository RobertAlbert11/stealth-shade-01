// Shade Run — vision cones and line-of-sight detection math.
import { GUARD } from './config.js';
import { segmentHitsCover } from './world.js';

export function angleDiff(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

// Is the point within the guard's vision cone (angle + range, ignoring cover)?
export function inCone(guard, px, py) {
  const dx = px - guard.x, dy = py - guard.y;
  const dist = Math.hypot(dx, dy);
  if (dist > GUARD.coneRange) return false;
  const ang = Math.atan2(dy, dx);
  return Math.abs(angleDiff(ang, guard.facing)) <= GUARD.coneHalfAngle;
}

// True if the guard has an unobstructed line to the player.
export function hasLineOfSight(guard, px, py) {
  return !segmentHitsCover(guard.x, guard.y, px, py);
}

// 'close' (0..1): how centered + near the player is in the cone; 0 if unseen.
export function coneVisibility(guard, player) {
  const dx = player.x - guard.x, dy = player.y - guard.y;
  const dist = Math.hypot(dx, dy);
  if (!inCone(guard, player.x, player.y)) return 0;
  if (!hasLineOfSight(guard, player.x, player.y)) return 0;
  const center = 1 - Math.abs(angleDiff(Math.atan2(dy, dx), guard.facing)) / GUARD.coneHalfAngle;
  const proximity = 1 - dist / GUARD.coneRange;
  return Math.max(0.15, center * 0.6 + proximity * 0.4);
}

export function conePolygon(guard) {
  const pts = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const a = guard.facing - GUARD.coneHalfAngle
      + (i / steps) * GUARD.coneHalfAngle * 2;
    let range = GUARD.coneRange;
    // Trim the cone ray where it hits cover (simple marching).
    for (let t = 20; t <= GUARD.coneRange; t += 12) {
      const x = guard.x + Math.cos(a) * t;
      const y = guard.y + Math.sin(a) * t;
      if (segmentHitsCover(guard.x, guard.y, x, y)) { range = t - 12; break; }
    }
    pts.push({ x: guard.x + Math.cos(a) * range, y: guard.y + Math.sin(a) * range });
  }
  return pts;
}

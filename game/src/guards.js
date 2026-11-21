// Shade Run — guards: waypoint patrol, suspicion, investigate and alert states.
import { GUARD } from './config.js';
import { segmentHitsCover } from './world.js';
import { angleDiff, coneVisibility } from './vision.js';

export const STATE_PATROL = 'patrol';
export const STATE_INVESTIGATE = 'investigate';
export const STATE_ALERT = 'alert';

export function createGuard(x, y, waypoints) {
  return {
    x, y,
    facing: 0,
    state: STATE_PATROL,
    suspicion: 0,
    waypoints,          // [{x,y}, ...] looped
    wpIndex: 0,
    waitTimer: 0,
    investigateTarget: null,
    investigateTimer: 0,
    lastNoiseAt: null,
    caughtPlayer: false,
  };
}

function dist(ax, ay, bx, by) {
  return Math.hypot(bx - ax, by - ay);
}

function moveToward(guard, tx, ty, speed, step) {
  const d = dist(guard.x, guard.y, tx, ty);
  if (d < 2) return true;
  const vx = ((tx - guard.x) / d) * speed * step;
  const vy = ((ty - guard.y) / d) * speed * step;
  // Simple collision: slide along cover
  const nx = guard.x + vx, ny = guard.y + vy;
  if (!segmentHitsCover(guard.x, guard.y, nx, ny)) {
    guard.x = nx; guard.y = ny;
  } else if (!segmentHitsCover(guard.x, guard.y, nx, guard.y)) {
    guard.x = nx;
  } else if (!segmentHitsCover(guard.x, guard.y, guard.x, ny)) {
    guard.y = ny;
  }
  return d < 4;
}

function faceToward(guard, tx, ty, step, turnRate = GUARD.turnRate) {
  const target = Math.atan2(ty - guard.y, tx - guard.x);
  const d = angleDiff(target, guard.facing);
  const max = turnRate * step;
  guard.facing += Math.max(-max, Math.min(max, d));
}

// Hear noise: player movement inside noiseRadius with clear-ish path.
export function hearNoise(guard, player) {
  if (player.noiseRadius <= 0) return false;
  const d = dist(guard.x, guard.y, player.x, player.y);
  return d <= player.noiseRadius && d > 1;
}

export function updateGuard(guard, player, step, emitAlarm) {
  const visibility = coneVisibility(guard, player);

  // Very close range: guard senses the player even without cone contact.
  const near = dist(guard.x, guard.y, player.x, player.y) < GUARD.nearVisionRange
    && segmentHitsCover(guard.x, guard.y, player.x, player.y) === false;

  if (visibility > 0 || near) {
    const strength = near && visibility === 0 ? 0.4 : visibility;
    guard.suspicion += GUARD.suspicionRate * strength * 60 * step;
  } else {
    guard.suspicion -= GUARD.suspicionDecay * 60 * step;
  }
  guard.suspicion = Math.max(0, Math.min(GUARD.suspicionMax, guard.suspicion));

  if (guard.suspicion >= GUARD.caughtThreshold) {
    guard.caughtPlayer = true;
    guard.state = STATE_ALERT;
    emitAlarm(guard);
    return;
  }

  if (guard.suspicion > 35) {
    // Suspicious: look toward the player, stop moving.
    guard.state = STATE_INVESTIGATE;
    guard.investigateTarget = { x: player.x, y: player.y };
    faceToward(guard, player.x, player.y, step);
    return;
  }

  const heard = hearNoise(guard, player);
  if (heard && guard.state !== STATE_ALERT) {
    guard.state = STATE_INVESTIGATE;
    guard.investigateTarget = { x: player.x, y: player.y };
    guard.investigateTimer = GUARD.investigateTimeout;
  }

  if (guard.state === STATE_INVESTIGATE) {
    if (guard.investigateTimer > 0) {
      guard.investigateTimer -= step;
      if (guard.investigateTarget) {
        const arrived = moveToward(guard, guard.investigateTarget.x, guard.investigateTarget.y, GUARD.patrolSpeed * 1.2, step);
        faceToward(guard, guard.investigateTarget.x, guard.investigateTarget.y, step);
        if (arrived) guard.investigateTimer = Math.min(guard.investigateTimer, 1.5);
      }
      if (guard.investigateTimer <= 0) {
        guard.state = STATE_PATROL;
        guard.investigateTarget = null;
      }
      return;
    }
    guard.state = STATE_PATROL;
  }

  // Patrol between waypoints, pausing briefly at each.
  const wp = guard.waypoints[guard.wpIndex];
  const arrived = moveToward(guard, wp.x, wp.y, GUARD.patrolSpeed, step);
  faceToward(guard, wp.x, wp.y, step, GUARD.turnRate * 0.7);
  if (arrived) {
    guard.waitTimer += step;
    if (guard.waitTimer > 1.2) {
      guard.waitTimer = 0;
      guard.wpIndex = (guard.wpIndex + 1) % guard.waypoints.length;
    }
  }
}

export function guardColorState(guard) {
  if (guard.state === STATE_ALERT) return 'alert';
  if (guard.state === STATE_INVESTIGATE) return 'investigate';
  return 'patrol';
}

// Shade Run — player state: position, sneak/walk, footstep dust trail.
import { PLAYER } from './config.js';
import { moveWithCollision } from './world.js';

export function createPlayer(x, y) {
  return { x, y, facing: 0, moving: false, sneaking: false, noiseRadius: 0, dust: [] };
}

export function updatePlayer(player, axis, sneaking, step) {
  player.sneaking = sneaking;
  const speed = sneaking ? PLAYER.sneakSpeed : PLAYER.walkSpeed;
  player.moving = axis.x !== 0 || axis.y !== 0;
  if (player.moving) {
    moveWithCollision(player, axis.x * speed * step, axis.y * speed * step);
    player.facing = Math.atan2(axis.y, axis.x);
    player.noiseRadius = sneaking ? PLAYER.sneakNoiseRadius : PLAYER.walkNoiseRadius;
  } else {
    player.noiseRadius = 0;
  }
  // Fade dust puffs (spawned by the game loop while walking).
  for (const puff of player.dust) puff.life -= step;
  player.dust = player.dust.filter((p) => p.life > 0).slice(-40);
}

// Shade Run — player state: position, sneak/walk, collision with the warehouse.
import { PLAYER } from './config.js';
import { moveWithCollision } from './world.js';

export function createPlayer(x, y) {
  return { x, y, facing: 0, moving: false, sneaking: false, noiseRadius: 0 };
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
}

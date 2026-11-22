// Shade Run — flat 2D canvas renderer: warehouse, cones, entities, HUD, screens.
import { EXIT_ZONE, FIELD, GUARD, PALETTE, PLAYER } from './config.js';
import { getCrates, getWalls } from './world.js';
import { conePolygon } from './vision.js';
import { STATE_ALERT, STATE_INVESTIGATE } from './guards.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_OVER = 'over';
export const SCREEN_WIN = 'win';

function drawWarehouse(ctx, state) {
  const pal = state?.level?.palette ?? {};
  const walls = state?.level?.walls ?? getWalls();
  const crates = state?.level?.crates ?? getCrates();
  const exit = state?.level?.exitZone ?? EXIT_ZONE;
  ctx.fillStyle = pal.floor ?? PALETTE.floor;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  ctx.strokeStyle = pal.floorGrid ?? PALETTE.floorGrid;
  ctx.lineWidth = 1;
  for (let x = 0; x <= FIELD.width; x += 80) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, FIELD.height); ctx.stroke();
  }
  for (let y = 0; y <= FIELD.height; y += 80) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(FIELD.width, y); ctx.stroke();
  }
  // Exit zone
  ctx.fillStyle = PALETTE.exit;
  ctx.globalAlpha = 0.25;
  ctx.fillRect(exit.x, exit.y, exit.w, exit.h);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = PALETTE.exit;
  ctx.lineWidth = 2;
  ctx.strokeRect(exit.x, exit.y, exit.w, exit.h);
  ctx.fillStyle = PALETTE.exit;
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('EXIT', exit.x + exit.w / 2, exit.y + exit.h / 2 + 5);
  ctx.textAlign = 'left';

  for (const w of walls) {
    ctx.fillStyle = pal.wall ?? PALETTE.wall;
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeStyle = pal.wallEdge ?? PALETTE.wallEdge;
    ctx.strokeRect(w.x + 0.5, w.y + 0.5, w.w - 1, w.h - 1);
  }
  for (const c of crates) {
    ctx.fillStyle = pal.crate ?? PALETTE.crate;
    ctx.fillRect(c.x, c.y, c.w, c.h);
    ctx.strokeStyle = pal.crateEdge ?? PALETTE.crateEdge;
    ctx.lineWidth = 2;
    ctx.strokeRect(c.x + 1, c.y + 1, c.w - 2, c.h - 2);
    ctx.beginPath();
    ctx.moveTo(c.x + 4, c.y + 4); ctx.lineTo(c.x + c.w - 4, c.y + c.h - 4);
    ctx.moveTo(c.x + c.w - 4, c.y + 4); ctx.lineTo(c.x + 4, c.y + c.h - 4);
    ctx.strokeStyle = pal.crateEdge ?? PALETTE.crateEdge; ctx.lineWidth = 1; ctx.stroke();
  }
}

function drawCone(ctx, guard) {
  const pts = conePolygon(guard);
  ctx.beginPath();
  ctx.moveTo(guard.x, guard.y);
  for (const p of pts) ctx.lineTo(p.x, p.y);
  ctx.closePath();
  const alerting = guard.state === STATE_ALERT || guard.suspicion > 55;
  ctx.fillStyle = alerting ? PALETTE.coneAlert : PALETTE.cone;
  ctx.fill();
}

function drawGuard(ctx, guard) {
  drawCone(ctx, guard);
  ctx.beginPath();
  ctx.arc(guard.x, guard.y, GUARD.radius, 0, Math.PI * 2);
  ctx.fillStyle = guard.state === STATE_ALERT ? PALETTE.guardAlertMax
    : guard.state === STATE_INVESTIGATE ? PALETTE.guardAlert : PALETTE.guard;
  ctx.fill();
  ctx.strokeStyle = '#12161c';
  ctx.lineWidth = 2;
  ctx.stroke();
  // facing tick
  ctx.beginPath();
  ctx.moveTo(guard.x, guard.y);
  ctx.lineTo(guard.x + Math.cos(guard.facing) * 18, guard.y + Math.sin(guard.facing) * 18);
  ctx.strokeStyle = '#12161c';
  ctx.lineWidth = 3;
  ctx.stroke();
  // suspicion bar
  if (guard.suspicion > 2) {
    const w = 34, frac = guard.suspicion / GUARD.suspicionMax;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(guard.x - w / 2, guard.y - GUARD.radius - 12, w, 5);
    ctx.fillStyle = frac > 0.8 ? PALETTE.guardAlertMax : PALETTE.guardAlert;
    ctx.fillRect(guard.x - w / 2, guard.y - GUARD.radius - 12, w * frac, 5);
  }
}

function drawPlayer(ctx, player) {
  if (player.noiseRadius > 0) {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.noiseRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(player.x, player.y, PLAYER.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.sneaking ? PALETTE.playerSneak : PALETTE.player;
  ctx.fill();
  ctx.strokeStyle = '#0c2018';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(player.x + Math.cos(player.facing) * 15, player.y + Math.sin(player.facing) * 15);
  ctx.strokeStyle = '#0c2018';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawMinimap(ctx, guards, player) {
  const mw = 200, mh = 112, mx = FIELD.width - mw - 14, my = FIELD.height - mh - 14;
  const sx = mw / FIELD.width, sy = mh / FIELD.height;
  ctx.fillStyle = PALETTE.hudBg;
  ctx.fillRect(mx, my, mw, mh);
  ctx.strokeStyle = PALETTE.dim;
  ctx.lineWidth = 1;
  ctx.strokeRect(mx + 0.5, my + 0.5, mw - 1, mh - 1);
  ctx.fillStyle = PALETTE.wallEdge;
  for (const w of getWalls()) ctx.fillRect(mx + w.x * sx, my + w.y * sy, Math.max(1, w.w * sx), Math.max(1, w.h * sy));
  ctx.fillStyle = PALETTE.crateEdge;
  for (const c of getCrates()) ctx.fillRect(mx + c.x * sx, my + c.y * sy, Math.max(1, c.w * sx), Math.max(1, c.h * sy));
  ctx.fillStyle = PALETTE.exit;
  ctx.fillRect(mx + EXIT_ZONE.x * sx, my + EXIT_ZONE.y * sy, EXIT_ZONE.w * sx, EXIT_ZONE.h * sy);
  for (const g of guards) {
    ctx.beginPath();
    ctx.arc(mx + g.x * sx, my + g.y * sy, 3, 0, Math.PI * 2);
    ctx.fillStyle = g.state === STATE_ALERT ? PALETTE.guardAlertMax : PALETTE.guard;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(mx + player.x * sx, my + player.y * sy, 3, 0, Math.PI * 2);
  ctx.fillStyle = PALETTE.player;
  ctx.fill();
}

function drawHud(ctx, state) {
  const { player, guards, elapsed, maxSuspicion } = state;
  ctx.fillStyle = PALETTE.hudBg;
  ctx.fillRect(14, 14, 300, 66);
  ctx.fillStyle = PALETTE.dim;
  ctx.font = '12px monospace';
  ctx.fillText('SHADE RUN', 26, 34);
  ctx.fillStyle = PALETTE.text;
  ctx.font = '14px monospace';
  ctx.fillText(`TIME ${elapsed.toFixed(1)}s`, 26, 54);
  ctx.fillText(player.sneaking ? 'SNEAK' : 'WALK', 26, 72);
  // Global suspicion meter (max over guards)
  const frac = Math.max(0, Math.min(1, maxSuspicion / GUARD.suspicionMax));
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(140, 46, 150, 10);
  ctx.fillStyle = frac > 0.8 ? PALETTE.guardAlertMax : PALETTE.guardAlert;
  ctx.fillRect(140, 46, 150 * frac, 10);
  ctx.strokeStyle = PALETTE.dim;
  ctx.strokeRect(140.5, 46.5, 150, 10);
  ctx.fillStyle = PALETTE.dim;
  ctx.font = '10px monospace';
  ctx.fillText('DETECTION', 140, 42);
  // Guard states
  const labels = guards.map((g) => (g.state === STATE_ALERT ? '!' : g.state === STATE_INVESTIGATE ? '?' : '.')).join(' ');
  ctx.fillStyle = PALETTE.text;
  ctx.font = '14px monospace';
  ctx.fillText(`GUARDS [${labels}]`, 300, 72);
  drawMinimap(ctx, guards, player);
}

function centerPanel(ctx, lines) {
  ctx.fillStyle = 'rgba(6, 9, 14, 0.88)';
  ctx.fillRect(FIELD.width / 2 - 330, FIELD.height / 2 - 140, 660, 280);
  ctx.strokeStyle = PALETTE.accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(FIELD.width / 2 - 330, FIELD.height / 2 - 140, 660, 280);
  ctx.textAlign = 'center';
  let y = FIELD.height / 2 - 90;
  for (const [text, font, color] of lines) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, FIELD.width / 2, y);
    y += 38;
  }
  ctx.textAlign = 'left';
}

export function render(ctx, screen, state) {
  ctx.fillStyle = PALETTE.backdrop;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawWarehouse(ctx, state);

  if (screen === SCREEN_PLAY) {
    for (const g of state.guards) drawGuard(ctx, g);
    drawPlayer(ctx, state.player);
    drawHud(ctx, state);
  } else {
    for (const g of state.guards) drawGuard(ctx, g);
    drawPlayer(ctx, state.player);
    if (screen === SCREEN_TITLE) {
      centerPanel(ctx, [
        ['SHADE RUN', 'bold 42px monospace', PALETTE.accent],
        ['Slip through the warehouse unseen.', '16px monospace', PALETTE.text],
        ['WASD / Arrows: move   Shift: sneak   Walk noise alerts guards', '13px monospace', PALETTE.dim],
        ['Reach the EXIT without being caught.', '13px monospace', PALETTE.dim],
        ['Press ENTER or SPACE to start', 'bold 16px monospace', PALETTE.player],
      ]);
    } else if (screen === SCREEN_OVER) {
      centerPanel(ctx, [
        ['CAUGHT!', 'bold 42px monospace', PALETTE.guardAlertMax],
        [`You survived ${state.elapsed.toFixed(1)}s before the alarm.`, '16px monospace', PALETTE.text],
        ['Press ENTER or SPACE to try again', 'bold 16px monospace', PALETTE.player],
      ]);
    } else if (screen === SCREEN_WIN) {
      centerPanel(ctx, [
        ['CLEAN ESCAPE', 'bold 42px monospace', PALETTE.player],
        [`Reached the exit in ${state.elapsed.toFixed(1)}s, unseen.`, '16px monospace', PALETTE.text],
        ['Press ENTER or SPACE to play again', 'bold 16px monospace', PALETTE.player],
      ]);
    }
  }
}

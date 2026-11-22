// Shade Run — level world: builds walls, crates and collision from LEVELS.
import { FIELD, LEVELS, PLAYER } from './config.js';

// Active level geometry (defaults to level 1: warehouse).
let WALLS_ = LEVELS[0].walls;
let CRATES_ = LEVELS[0].crates;

// Build the world for a level index; returns the level definition.
export function createWorld(levelIndex) {
  const level = LEVELS[levelIndex] ?? LEVELS[0];
  WALLS_ = level.walls;
  CRATES_ = level.crates;
  return level;
}

// Live view of the active level's geometry (walls + cover crates).
export function getWalls() {
  return WALLS_;
}

export function getCrates() {
  return CRATES_;
}

export function rectOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function circleRectPush(px, py, r, rect) {
  const cx = Math.max(rect.x, Math.min(px, rect.x + rect.w));
  const cy = Math.max(rect.y, Math.min(py, rect.y + rect.h));
  const dx = px - cx, dy = py - cy;
  const d2 = dx * dx + dy * dy;
  if (d2 >= r * r) return null;
  const d = Math.sqrt(d2) || 0.001;
  const push = r - d;
  return { x: (dx / d) * push, y: (dy / d) * push };
}

export function isBlocked(px, py, r) {
  const point = { x: px - r, y: py - r, w: r * 2, h: r * 2 };
  for (const rect of WALLS_) if (rectOverlap(point, rect)) return true;
  for (const rect of CRATES_) if (rectOverlap(point, rect)) return true;
  return false;
}

export function moveWithCollision(entity, dx, dy) {
  const r = PLAYER.radius;
  const nx = entity.x + dx;
  if (!isBlocked(nx, entity.y, r)) entity.x = nx;
  const ny = entity.y + dy;
  if (!isBlocked(entity.x, ny, r)) entity.y = ny;
  entity.x = Math.max(r + 20, Math.min(FIELD.width - r - 20, entity.x));
  entity.y = Math.max(r + 20, Math.min(FIELD.height - r - 20, entity.y));
}

export function inExitZone(px, py, exit) {
  const zone = exit ?? (typeof EXIT_ZONE !== 'undefined' ? EXIT_ZONE : null);
  if (!zone) return false;
  return px > zone.x && px < zone.x + zone.w
    && py > zone.y && py < zone.y + zone.h;
}

// Segment vs rectangles: true if the segment (x1,y1)-(x2,y2) hits any wall/crate.
export function segmentHitsCover(x1, y1, x2, y2) {
  const rects = WALLS_.concat(CRATES_);
  for (const rect of rects) {
    if (segmentRectHit(x1, y1, x2, y2, rect)) return true;
  }
  return false;
}

function segmentRectHit(x1, y1, x2, y2, rect) {
  // Quick reject
  const minx = Math.min(x1, x2), maxx = Math.max(x1, x2);
  const miny = Math.min(y1, y2), maxy = Math.max(y1, y2);
  if (maxx < rect.x || minx > rect.x + rect.w || maxy < rect.y || miny > rect.y + rect.h) return false;
  // If either endpoint inside, hit
  if (pxIn(x1, y1, rect) || pxIn(x2, y2, rect)) return true;
  // Check 4 edges
  return segSeg(x1, y1, x2, y2, rect.x, rect.y, rect.x + rect.w, rect.y)
    || segSeg(x1, y1, x2, y2, rect.x + rect.w, rect.y, rect.x + rect.w, rect.y + rect.h)
    || segSeg(x1, y1, x2, y2, rect.x, rect.y + rect.h, rect.x + rect.w, rect.y + rect.h)
    || segSeg(x1, y1, x2, y2, rect.x, rect.y, rect.x, rect.y + rect.h);
}

function pxIn(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function segSeg(ax, ay, bx, by, cx, cy, dx, dy) {
  const d1 = cross(dx, dy, ax - cx, ay - cy);
  const d2 = cross(dx, dy, bx - cx, by - cy);
  const d3 = cross(bx - ax, by - ay, cx - ax, cy - ay);
  const d4 = cross(bx - ax, by - ay, dx - ax, dy - ay);
  return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
}

function cross(ux, uy, vx, vy) {
  return ux * vy - uy * vx;
}

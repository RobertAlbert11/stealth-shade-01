// Shade Run — the warehouse world: walls, crates, player collision, exit zone.
import { FIELD, EXIT_ZONE, PLAYER } from './config.js';

// Warehouse layout. Walls are rectangles; crates are cover that blocks line of sight.
export const WALLS = [
  // Border walls
  { x: 0, y: 0, w: 1280, h: 20 },
  { x: 0, y: 700, w: 1280, h: 20 },
  { x: 0, y: 0, w: 20, h: 720 },
  { x: 1260, y: 0, w: 20, h: 720 },
  // Interior structure
  { x: 180, y: 150, w: 260, h: 26 },
  { x: 420, y: 150, w: 26, h: 220 },
  { x: 620, y: 320, w: 300, h: 26 },
  { x: 900, y: 120, w: 26, h: 260 },
  { x: 926, y: 354, w: 240, h: 26 },
  { x: 300, y: 480, w: 26, h: 200 },
  { x: 300, y: 480, w: 280, h: 26 },
  { x: 720, y: 560, w: 320, h: 26 },
  { x: 560, y: 60, w: 26, h: 180 },
];

export const CRATES = [
  { x: 90, y: 320, w: 56, h: 56 },
  { x: 240, y: 60, w: 56, h: 56 },
  { x: 330, y: 300, w: 56, h: 56 },
  { x: 520, y: 420, w: 56, h: 56 },
  { x: 700, y: 80, w: 56, h: 56 },
  { x: 820, y: 460, w: 56, h: 56 },
  { x: 1000, y: 520, w: 56, h: 56 },
  { x: 480, y: 580, w: 56, h: 56 },
  { x: 1060, y: 300, w: 56, h: 56 },
  { x: 640, y: 620, w: 56, h: 56 },
  { x: 180, y: 620, w: 56, h: 56 },
  { x: 1150, y: 420, w: 56, h: 56 },
];

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
  for (const rect of WALLS) if (rectOverlap(point, rect)) return true;
  for (const rect of CRATES) if (rectOverlap(point, rect)) return true;
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

export function inExitZone(px, py) {
  return px > EXIT_ZONE.x && px < EXIT_ZONE.x + EXIT_ZONE.w
    && py > EXIT_ZONE.y && py < EXIT_ZONE.y + EXIT_ZONE.h;
}

// Segment vs rectangles: true if the segment (x1,y1)-(x2,y2) hits any wall/crate.
export function segmentHitsCover(x1, y1, x2, y2) {
  const rects = WALLS.concat(CRATES);
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

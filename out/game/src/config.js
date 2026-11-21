// Shade Run — global tuning constants and palette.
export const FIELD = { width: 1280, height: 720 };

export const STEP = 1 / 60;

export const PALETTE = {
  floor: '#1b2027',
  floorGrid: '#232b36',
  wall: '#3a4552',
  wallEdge: '#56657a',
  crate: '#4a3b2a',
  crateEdge: '#7a6446',
  player: '#6fe3a8',
  playerSneak: '#3fae76',
  guard: '#e05555',
  guardAlert: '#ffb03b',
  guardAlertMax: '#ff4d2e',
  cone: 'rgba(255, 220, 120, 0.16)',
  coneAlert: 'rgba(255, 90, 60, 0.22)',
  exit: '#4fc3f7',
  text: '#dfe8f2',
  dim: '#8b98a8',
  hudBg: 'rgba(10, 14, 20, 0.82)',
  accent: '#ffd45e',
  backdrop: '#0b0e13',
};

export const PLAYER = {
  radius: 11,
  walkSpeed: 175,
  sneakSpeed: 85,
  walkNoiseRadius: 160,
  sneakNoiseRadius: 0,
};

export const GUARD = {
  radius: 12,
  patrolSpeed: 90,
  alertSpeed: 160,
  coneHalfAngle: Math.PI / 5,
  coneRange: 260,
  nearVisionRange: 110,
  suspicionRate: 0.85,
  suspicionDecay: 0.4,
  suspicionMax: 100,
  caughtThreshold: 100,
  investigateTimeout: 5,
  turnRate: 3.4,
};

export const EXIT_ZONE = { x: 1150, y: 40, w: 100, h: 90 };

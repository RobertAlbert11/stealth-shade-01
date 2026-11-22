// Shade Run — global tuning constants and shared colors.
export const FIELD = { width: 1280, height: 720 };

export const STEP = 1 / 60;

// Shared HUD / entity colors (floor and structure colors live per level).
export const PALETTE = {
  player: '#6fe3a8',
  playerSneak: '#3fae76',
  guard: '#e05555',
  guardAlert: '#ffb03b',
  guardAlertMax: '#ff4d2e',
  cone: 'rgba(255, 220, 120, 0.16)',
  coneAlert: 'rgba(255, 90, 60, 0.22)',
  camCone: 'rgba(120, 200, 255, 0.14)',
  camConeAlert: 'rgba(255, 120, 220, 0.2)',
  exit: '#4fc3f7',
  text: '#dfe8f2',
  dim: '#8b98a8',
  hudBg: 'rgba(10, 14, 20, 0.82)',
  accent: '#ffd45e',
  backdrop: '#0b0e13',
  keycard: '#ffd45e',
  door: '#b06a2e',
  doorOpen: '#3f7a4d',
  panel: '#7ec8ff',
};

// Per-level layouts: walls, cover crates, guard patrols, exit zone and palette.
export const LEVELS = [
  {
    name: 'Warehouse',
    walls: [
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
    ],
    crates: [
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
    ],
    playerStart: { x: 70, y: 660 },
    guards: [
      {
        x: 250, y: 420,
        waypoints: [{ x: 250, y: 420 }, { x: 250, y: 250 }, { x: 520, y: 250 }, { x: 520, y: 420 }],
      },
      {
        x: 820, y: 240,
        waypoints: [{ x: 700, y: 180 }, { x: 1040, y: 180 }, { x: 1040, y: 440 }, { x: 700, y: 440 }],
      },
      {
        x: 480, y: 640,
        waypoints: [{ x: 200, y: 640 }, { x: 900, y: 640 }, { x: 1150, y: 560 }, { x: 480, y: 640 }],
      },
    ],
    exit: { x: 1120, y: 40, w: 120, h: 90 },
    palette: { floor: '#141a22', wall: '#3a4454', crate: '#4d3d28', backdrop: '#0b0e13' },
  },
  {
    name: 'Museum Wing',
    walls: [
      { x: 0, y: 0, w: 1280, h: 20 },
      { x: 0, y: 700, w: 1280, h: 20 },
      { x: 0, y: 0, w: 20, h: 720 },
      { x: 1260, y: 0, w: 20, h: 720 },
      // Exhibit plinths form the maze
      { x: 200, y: 120, w: 300, h: 24 },
      { x: 200, y: 120, w: 24, h: 200 },
      { x: 560, y: 240, w: 24, h: 260 },
      { x: 560, y: 476, w: 260, h: 24 },
      { x: 880, y: 100, w: 24, h: 300 },
      { x: 880, y: 100, w: 220, h: 24 },
      { x: 420, y: 600, w: 420, h: 24 },
      { x: 420, y: 420, w: 24, h: 204 },
      { x: 1100, y: 480, w: 24, h: 220 },
    ],
    crates: [
      { x: 120, y: 480, w: 56, h: 56 },
      { x: 340, y: 200, w: 56, h: 56 },
      { x: 340, y: 380, w: 56, h: 56 },
      { x: 700, y: 160, w: 56, h: 56 },
      { x: 760, y: 340, w: 56, h: 56 },
      { x: 980, y: 260, w: 56, h: 56 },
      { x: 1180, y: 200, w: 56, h: 56 },
      { x: 640, y: 560, w: 56, h: 56 },
      { x: 240, y: 640, w: 56, h: 56 },
      { x: 1020, y: 620, w: 56, h: 56 },
    ],
    playerStart: { x: 70, y: 80 },
    guards: [
      {
        x: 300, y: 300,
        waypoints: [{ x: 300, y: 300 }, { x: 480, y: 180 }, { x: 700, y: 180 }, { x: 480, y: 340 }],
      },
      {
        x: 950, y: 560,
        waypoints: [{ x: 950, y: 560 }, { x: 1180, y: 560 }, { x: 1180, y: 380 }, { x: 950, y: 380 }],
      },
      {
        x: 240, y: 560,
        waypoints: [{ x: 240, y: 560 }, { x: 240, y: 380 }, { x: 60, y: 300 }],
      },
    ],
    exit: { x: 40, y: 560, w: 120, h: 100 },
    palette: { floor: '#1a1720', wall: '#4a3f56', crate: '#6b5637', backdrop: '#0e0b12' },
  },
  {
    name: 'Server Vault',
    walls: [
      { x: 0, y: 0, w: 1280, h: 20 },
      { x: 0, y: 700, w: 1280, h: 20 },
      { x: 0, y: 0, w: 20, h: 720 },
      { x: 1260, y: 0, w: 20, h: 720 },
      // Server rack rows with narrow aisles
      { x: 160, y: 140, w: 220, h: 24 },
      { x: 160, y: 300, w: 220, h: 24 },
      { x: 160, y: 460, w: 220, h: 24 },
      { x: 540, y: 220, w: 24, h: 220 },
      { x: 700, y: 220, w: 24, h: 220 },
      { x: 860, y: 120, w: 240, h: 24 },
      { x: 1076, y: 120, w: 24, h: 240 },
      { x: 560, y: 560, w: 360, h: 24 },
      { x: 440, y: 400, w: 24, h: 184 },
    ],
    crates: [
      { x: 80, y: 220, w: 56, h: 56 },
      { x: 420, y: 140, w: 56, h: 56 },
      { x: 420, y: 480, w: 56, h: 56 },
      { x: 620, y: 60, w: 56, h: 56 },
      { x: 800, y: 320, w: 56, h: 56 },
      { x: 960, y: 420, w: 56, h: 56 },
      { x: 1180, y: 440, w: 56, h: 56 },
      { x: 240, y: 620, w: 56, h: 56 },
      { x: 720, y: 640, w: 56, h: 56 },
      { x: 1120, y: 620, w: 56, h: 56 },
      { x: 60, y: 560, w: 56, h: 56 },
    ],
    playerStart: { x: 70, y: 660 },
    guards: [
      {
        x: 260, y: 220,
        waypoints: [{ x: 260, y: 220 }, { x: 260, y: 400 }, { x: 60, y: 400 }, { x: 60, y: 220 }],
      },
      {
        x: 620, y: 180,
        waypoints: [{ x: 620, y: 180 }, { x: 820, y: 180 }, { x: 820, y: 480 }, { x: 620, y: 480 }],
      },
      {
        x: 1160, y: 300,
        waypoints: [{ x: 1160, y: 300 }, { x: 1000, y: 300 }, { x: 1000, y: 560 }],
      },
      {
        x: 500, y: 640,
        waypoints: [{ x: 500, y: 640 }, { x: 940, y: 640 }],
      },
    ],
    exit: { x: 1120, y: 40, w: 120, h: 90 },
    palette: { floor: '#101820', wall: '#2e4a58', crate: '#37505e', backdrop: '#080e14' },
  },
];

// Exit zone derived from the active level (level 1 until the world is switched).
export const EXIT_ZONE = LEVELS[0].exit;

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

// Security cameras: sweeping vision, faster detection than guards.
export const CAMERA = {
  radius: 9,
  coneHalfAngle: Math.PI / 6,
  coneRange: 300,
  sweepSpeed: 0.55,     // radians/sec of sweep phase
  suspicionRate: 55,    // per second while seen
  suspicionDecay: 30,
  caughtThreshold: 100,
};

// Panels: stand nearby and press E to disable every camera on the level.
export const PANEL = { w: 22, h: 22, useRadius: 60 };

export const KEYCARD = { pickupRadius: 22 };
export const DOOR = { openRadius: 46 };

// Score: per level — base + time bonus + keycards + stealth bonus.
export const SCORE = {
  base: 1000,
  timeBonusMax: 400,
  timeParSeconds: 60,     // bonus shrinks to 0 at this time
  perKeycard: 250,
  stealthBonus: 500,      // never exceeded 50 detection on the level
  stealthThreshold: 50,
};

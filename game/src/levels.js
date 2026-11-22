// Shade Run — level definitions: warehouse, museum wing, server vault.
// Each level carries its own walls, crates, exit zone, guard patrols, cameras,
// keycards, locked doors, panels, floor light pools, and a distinct palette.
import { FIELD } from './config.js';

const BORDER = [
  { x: 0, y: 0, w: 1280, h: 20 },
  { x: 0, y: 700, w: 1280, h: 20 },
  { x: 0, y: 0, w: 20, h: 720 },
  { x: 1260, y: 0, w: 20, h: 720 },
];

export const LEVELS = [
  // ---------------------------------------------------------------- LEVEL 1
  // The warehouse: cool steel floors, amber crates, three guards.
  {
    id: 'warehouse',
    name: 'THE WAREHOUSE',
    subtitle: 'Slip through the warehouse unseen.',
    playerStart: { x: 70, y: 660 },
    exitZone: { x: 1150, y: 40, w: 100, h: 90 },
    palette: {
      floor: '#1b2027',
      floorGrid: '#232b36',
      wall: '#3a4552',
      wallEdge: '#56657a',
      crate: '#4a3b2a',
      crateEdge: '#7a6446',
      lightPool: 'rgba(255, 214, 130, 0.05)',
    },
    walls: [
      ...BORDER,
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
    cameras: [],
    keycards: [],
    doors: [],
    panels: [],
    lightPools: [
      { x: 640, y: 180, r: 150 },
      { x: 250, y: 520, r: 130 },
      { x: 1000, y: 400, r: 140 },
      { x: 640, y: 640, r: 120 },
    ],
  },

  // ---------------------------------------------------------------- LEVEL 2
  // Museum wing: marble floors, velvet rope barriers, cameras + one locked door.
  {
    id: 'museum',
    name: 'MUSEUM WING',
    subtitle: 'The gallery is under electronic watch.',
    playerStart: { x: 90, y: 650 },
    exitZone: { x: 1140, y: 590, w: 110, h: 100 },
    palette: {
      floor: '#22202b',
      floorGrid: '#2c2938',
      wall: '#463f57',
      wallEdge: '#6a5d85',
      crate: '#3d3050',
      crateEdge: '#64508c',
      lightPool: 'rgba(190, 160, 255, 0.06)',
    },
    walls: [
      ...BORDER,
      // Exhibit halls: three gallery rooms with wide doorways
      { x: 240, y: 120, w: 26, h: 200 },
      { x: 240, y: 320, w: 200, h: 26 },
      { x: 520, y: 120, w: 26, h: 300 },
      { x: 700, y: 260, w: 26, h: 200 },
      { x: 700, y: 260, w: 220, h: 26 },
      { x: 980, y: 120, w: 26, h: 300 },
      { x: 380, y: 520, w: 26, h: 160 },
      { x: 380, y: 654, w: 260, h: 26 },
      { x: 620, y: 480, w: 300, h: 26 },
    ],
    crates: [
      // Display plinths
      { x: 320, y: 200, w: 48, h: 48 },
      { x: 600, y: 60, w: 48, h: 48 },
      { x: 800, y: 360, w: 48, h: 48 },
      { x: 1100, y: 200, w: 48, h: 48 },
      { x: 480, y: 600, w: 48, h: 48 },
      { x: 760, y: 600, w: 48, h: 48 },
      { x: 1000, y: 480, w: 48, h: 48 },
      { x: 100, y: 400, w: 48, h: 48 },
      { x: 900, y: 60, w: 48, h: 48 },
    ],
    guards: [
      {
        x: 420, y: 220,
        waypoints: [{ x: 420, y: 220 }, { x: 420, y: 440 }, { x: 620, y: 440 }, { x: 620, y: 220 }],
      },
      {
        x: 880, y: 480,
        waypoints: [{ x: 760, y: 400 }, { x: 1120, y: 400 }, { x: 1120, y: 620 }, { x: 760, y: 620 }],
      },
      {
        x: 120, y: 180,
        waypoints: [{ x: 120, y: 180 }, { x: 420, y: 80 }, { x: 120, y: 480 }, { x: 120, y: 620 }],
      },
    ],
    cameras: [
      { x: 560, y: 60, facing: Math.PI / 2, phase: 0 },
      { x: 980, y: 500, facing: 0, phase: Math.PI },
    ],
    keycards: [
      { x: 1080, y: 100 },
      { x: 300, y: 620 },
    ],
    doors: [
      // Locks the east exhibit corridor
      { x: 926, y: 354, w: 60, h: 22, requiresCard: true },
    ],
    panels: [
      { x: 700, y: 520 },
    ],
    lightPools: [
      { x: 420, y: 330, r: 150 },
      { x: 840, y: 200, r: 130 },
      { x: 640, y: 640, r: 140 },
      { x: 120, y: 320, r: 120 },
    ],
  },

  // ---------------------------------------------------------------- LEVEL 3
  // Server vault: dark datacenter, cyan racks, dense camera grid + two doors.
  {
    id: 'vault',
    name: 'SERVER VAULT',
    subtitle: 'Every rack is watched. Cut the feeds first.',
    playerStart: { x: 70, y: 360 },
    exitZone: { x: 1160, y: 320, w: 90, h: 110 },
    palette: {
      floor: '#101a24',
      floorGrid: '#16242f',
      wall: '#254453',
      wallEdge: '#3f7a94',
      crate: '#1f3d33',
      crateEdge: '#3f7a5d',
      lightPool: 'rgba(110, 227, 200, 0.05)',
    },
    walls: [
      ...BORDER,
      // Server rack rows: long bars with narrow aisles
      { x: 220, y: 140, w: 380, h: 26 },
      { x: 220, y: 280, w: 380, h: 26 },
      { x: 220, y: 420, w: 380, h: 26 },
      { x: 700, y: 140, w: 380, h: 26 },
      { x: 700, y: 420, w: 380, h: 26 },
      // Vault cage around the exit
      { x: 1060, y: 200, w: 26, h: 360 },
      { x: 1086, y: 200, w: 174, h: 26 },
      { x: 1086, y: 534, w: 174, h: 26 },
    ],
    crates: [
      { x: 120, y: 60, w: 52, h: 52 },
      { x: 640, y: 320, w: 52, h: 52 },
      { x: 120, y: 600, w: 52, h: 52 },
      { x: 480, y: 640, w: 52, h: 52 },
      { x: 820, y: 600, w: 52, h: 52 },
      { x: 960, y: 320, w: 52, h: 52 },
      { x: 640, y: 60, w: 52, h: 52 },
      { x: 960, y: 60, w: 52, h: 52 },
    ],
    guards: [
      {
        x: 320, y: 220,
        waypoints: [{ x: 320, y: 220 }, { x: 560, y: 220 }, { x: 560, y: 360 }, { x: 320, y: 360 }],
      },
      {
        x: 320, y: 540,
        waypoints: [{ x: 320, y: 540 }, { x: 560, y: 540 }, { x: 560, y: 360 }, { x: 320, y: 360 }],
      },
      {
        x: 900, y: 280,
        waypoints: [{ x: 760, y: 220 }, { x: 1020, y: 220 }, { x: 1020, y: 360 }, { x: 760, y: 360 }],
      },
      {
        x: 900, y: 600,
        waypoints: [{ x: 760, y: 620 }, { x: 1140, y: 620 }, { x: 1140, y: 460 }, { x: 760, y: 460 }],
      },
    ],
    cameras: [
      { x: 400, y: 60, facing: Math.PI / 2, phase: 0 },
      { x: 840, y: 60, facing: Math.PI / 2, phase: Math.PI * 0.6 },
      { x: 200, y: 360, facing: 0, phase: Math.PI * 1.2 },
      { x: 840, y: 360, facing: 0, phase: Math.PI * 1.8 },
      { x: 400, y: 660, facing: -Math.PI / 2, phase: Math.PI * 0.3 },
    ],
    keycards: [
      { x: 120, y: 240 },
      { x: 640, y: 560 },
      { x: 1140, y: 120 },
    ],
    doors: [
      { x: 700, y: 266, w: 60, h: 22, requiresCard: true },
      { x: 1086, y: 480, w: 22, h: 60, requiresCard: true },
    ],
    panels: [
      { x: 220, y: 560 },
      { x: 900, y: 140 },
    ],
    lightPools: [
      { x: 400, y: 220, r: 130 },
      { x: 400, y: 500, r: 130 },
      { x: 880, y: 360, r: 140 },
      { x: 1160, y: 640, r: 110 },
    ],
  },
];

export function getLevel(index) {
  return LEVELS[Math.max(0, Math.min(LEVELS.length - 1, index))];
}

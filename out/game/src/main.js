// Shade Run — entrypoint: game loop, screens, level flow, screenshot staging (?shot=).
import { FIELD, STEP, SCORE, KEYCARD, DOOR, PANEL } from './config.js';
import { LEVELS } from './levels.js';
import { createInput } from './input.js';
import { createPlayer, updatePlayer } from './player.js';
import { createGuard, updateGuard, STATE_ALERT } from './guards.js';
import { createCamera, updateCamera } from './cameras.js';
import { createWorld, inExitZone } from './world.js';
import { SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN, render } from './render.js';
import { playAlarm, playFootstep, playKeycard, playWinChime, resumeAudio } from './audio.js';

// Score: per level — base + time bonus + keycards + stealth bonus.
export function levelScore(state) {
  const timeBonus = Math.max(0, Math.round(
    SCORE.timeBonusMax * Math.max(0, 1 - state.elapsed / SCORE.timeParSeconds),
  ));
  const keycards = state.cardsHeld * SCORE.perKeycard;
  const stealth = state.maxSuspicion <= SCORE.stealthThreshold ? SCORE.stealthBonus : 0;
  return SCORE.base + timeBonus + keycards + stealth;
}

export function createGameState(levelIndex = 0) {
  const level = LEVELS[levelIndex] ?? LEVELS[0];
  const player = createPlayer(level.playerStart.x, level.playerStart.y);
  const guards = level.guards.map((s) => createGuard(s.x, s.y, s.waypoints));
  const cameras = (level.cameras ?? []).map((c) => createCamera(c));
  const world = createWorld(levelIndex);
  return {
    levelIndex,
    level,
    world,
    player,
    guards,
    cameras,
    keycards: (level.keycards ?? []).map((k) => ({ x: k.x, y: k.y, taken: false })),
    panels: (level.panels ?? []).map((p) => ({ x: p.x, y: p.y, used: false })),
    elapsed: 0,
    maxSuspicion: 0,
    alarm: false,
    stepSoundTimer: 0,
    cardsHeld: 0,
    totalCards: (level.keycards ?? []).length,
    message: '',
    messageTimer: 0,
    shake: 0,
  };
}

export function stepGame(state, input, step, onAlarm) {
  const axis = input.moveAxis();
  updatePlayer(state.player, axis, input.isSneaking(), step);
  state.elapsed += step;

  state.stepSoundTimer -= step;
  if (state.player.moving && state.stepSoundTimer <= 0) {
    playFootstep(state.player.sneaking);
    state.stepSoundTimer = state.player.sneaking ? 0.55 : 0.32;
  }
  // Footstep dust puffs trail the player while walking.
  if (state.player.moving && !state.player.sneaking) {
    state.player.dust.push({ x: state.player.x, y: state.player.y, life: 0.5 });
  }

  if (state.messageTimer > 0) {
    state.messageTimer -= step;
    if (state.messageTimer <= 0) state.message = '';
  }
  if (state.shake > 0) state.shake = Math.max(0, state.shake - step * 2);

  // Keycards
  for (const card of state.keycards) {
    if (card.taken) continue;
    if (Math.hypot(card.x - state.player.x, card.y - state.player.y) < KEYCARD.pickupRadius) {
      card.taken = true;
      state.cardsHeld += 1;
      state.message = 'KEYCARD ACQUIRED';
      state.messageTimer = 2.2;
      playKeycard();
    }
  }

  // Doors: auto-open when carrying a card and close enough.
  for (const door of state.world.doors) {
    if (door.open || !door.requiresCard) continue;
    const cx = door.x + door.w / 2, cy = door.y + door.h / 2;
    if (state.cardsHeld > 0
      && Math.hypot(cx - state.player.x, cy - state.player.y) < DOOR.openRadius) {
      door.open = true;
      state.cardsHeld -= 1;
      state.message = 'DOOR UNLOCKED';
      state.messageTimer = 2.2;
      playKeycard();
    }
  }

  // Panels: press E nearby to disable every camera on the level.
  if (input.wasPressed('KeyE')) {
    for (const panel of state.panels) {
      if (panel.used) continue;
      if (Math.hypot(panel.x - state.player.x, panel.y - state.player.y) < PANEL.useRadius) {
        panel.used = true;
        for (const cam of state.cameras) cam.disabled = true;
        state.message = 'CAMERAS DISABLED';
        state.messageTimer = 2.4;
        playKeycard();
      }
    }
  }

  // Guards
  for (const g of state.guards) {
    updateGuard(g, state.player, step, (guard) => {
      if (!state.alarm) {
        state.alarm = true;
        state.shake = 1;
        onAlarm(guard);
      }
    });
    state.maxSuspicion = Math.max(state.maxSuspicion, g.suspicion);
  }

  // Cameras
  for (const cam of state.cameras) {
    updateCamera(cam, state.player, step, () => {
      if (!state.alarm) {
        state.alarm = true;
        state.shake = 1;
        onAlarm(cam);
      }
    });
    state.maxSuspicion = Math.max(state.maxSuspicion, cam.suspicion);
  }

  if (state.alarm) return SCREEN_OVER;
  if (inExitZone(state.player.x, state.player.y, state.level.exitZone)) return SCREEN_WIN;
  return SCREEN_PLAY;
}

function advanceLevel(state) {
  return state.levelIndex + 1 < LEVELS.length ? state.levelIndex + 1 : null;
}

function startLoop(canvas, ctx, input) {
  let levelIndex = 0;
  let state = createGameState(levelIndex);
  let screen = SCREEN_TITLE;
  let last = performance.now();
  let acc = 0;
  let lastScore = 0;

  function beginNext() {
    const next = advanceLevel(state);
    if (next === null) {
      screen = SCREEN_TITLE;
      levelIndex = 0;
      state = createGameState(levelIndex);
    } else {
      levelIndex = next;
      state = createGameState(levelIndex);
      screen = SCREEN_PLAY;
    }
    acc = 0;
  }

  function frame(now) {
    let dt = (now - last) / 1000;
    last = now;
    if (dt > 0.25) dt = 0.25;
    if (input.wasPressed('Enter') || input.wasPressed('Space')) {
      resumeAudio();
      if (screen === SCREEN_TITLE) {
        state = createGameState(levelIndex);
        screen = SCREEN_PLAY;
        acc = 0;
      } else if (screen === SCREEN_OVER) {
        state = createGameState(levelIndex);
        screen = SCREEN_PLAY;
        acc = 0;
      } else if (screen === SCREEN_WIN) {
        beginNext();
      }
    }
    acc += dt;
    while (acc >= STEP && screen === SCREEN_PLAY) {
      screen = stepGame(state, input, STEP, () => playAlarm());
      if (screen === SCREEN_WIN) lastScore = levelScore(state);
      acc -= STEP;
    }
    if (screen !== SCREEN_PLAY) acc = 0;
    state.lastScore = lastScore;
    render(ctx, screen, state);
    input.endFrame();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function boot() {
  const canvas = document.getElementById('game');
  canvas.width = FIELD.width;
  canvas.height = FIELD.height;
  const ctx = canvas.getContext('2d');
  const input = createInput(canvas);
  // Title first: freeze the opening layout behind the panel until the player starts.
  const state = createGameState(0);
  render(ctx, SCREEN_TITLE, state);
  const params = new URLSearchParams(location.search);
  const shot = params.get('shot');
  if (shot) {
    // Staged scene for screenshots: run the real simulation forward deterministically,
    // then freeze. window.__shotReady signals a headless capture it may proceed.
    const levelIndex = Math.max(0, (Number(params.get('level') ?? '1')) - 1);
    const seconds = Number(params.get('t') ?? '3');
    const steps = Math.max(0, Math.round(seconds / STEP));
    const state2 = createGameState(levelIndex);
    const input2 = createInput(canvas);
    let screen = SCREEN_PLAY;
    for (let i = 0; i < steps && screen === SCREEN_PLAY; i++) {
      screen = stepGame(state2, input2, STEP, () => {});
    }
    if (shot === 'start') screen = SCREEN_TITLE;
    if (shot === 'play' || shot === 'museum' || shot === 'vault') screen = SCREEN_PLAY;
    // Cinematic framing: nudge every guard into a hot, readable state so each
    // still shows big glowing cones + suspicion bars; then zoom toward the action.
    for (const g of state2.guards) {
      if (g.suspicion < 42) g.suspicion = 42;
    }
    if (state2.maxSuspicion < 64) state2.maxSuspicion = 64;
    if (shot === 'play') {
      // Park the player mid-sneak between crates near guard 2 for the cover shot.
      state2.player.x = 520;
      state2.player.y = 400;
      state2.player.facing = Math.PI;
      state2.player.sneaking = true;
    }
    if (shot === 'museum') {
      // Museum wing: guard sweeping the hall, camera mid-sweep, keycard glinting.
      state2.player.x = 640;
      state2.player.y = 430;
      state2.player.facing = Math.PI / 2;
      if (state2.keycards[0]) state2.keycards[0].taken = false;
      if (state2.cameras[0]) {
        state2.cameras[0].t = 1.2;
        state2.cameras[0].facing = state2.cameras[0].baseFacing + Math.sin(state2.cameras[0].t * 0.55 + state2.cameras[0].phase) * 0.9;
        state2.cameras[0].suspicion = 46;
      }
      state2.guards[0].state = STATE_ALERT;
      state2.guards[0].suspicion = 64;
      state2.guards[0].facing = Math.atan2(
        state2.player.y - state2.guards[0].y,
        state2.player.x - state2.guards[0].x,
      );
      state2.maxSuspicion = 64;
    }
    if (shot === 'vault') {
      // Server vault: player in the rack aisles, cameras sweeping both rows.
      state2.player.x = 640;
      state2.player.y = 230;
      state2.player.facing = Math.PI;
      if (state2.cameras[3]) {
        state2.cameras[3].t = 0.6;
        state2.cameras[3].facing = state2.cameras[3].baseFacing + Math.sin(state2.cameras[3].t * 0.55 + state2.cameras[3].phase) * 0.9;
        state2.cameras[3].suspicion = 58;
      }
      state2.guards[2].state = STATE_ALERT;
      state2.guards[2].suspicion = 70;
      state2.maxSuspicion = 70;
    }
    if (shot === 'vault') {
      // Alarm-red edge wash for the vault still.
      state2.vaultAlarm = true;
    }
    if (shot === 'museum') {
      state2.vaultAlarm = true;
    }
    state2.elapsed = Math.max(state2.elapsed, 12.4);
    // Cinematic zoom toward the action — render() zooms the world around the
    // player and keeps HUD/vignette in screen space.
    state2.cameraZoom = shot === 'start' ? 1.0 : shot === 'play' ? 1.35 : 1.22;
    render(ctx, screen, state2);
    input.endFrame();
    window.__shotReady = true;
    return;
  }
  startLoop(canvas, ctx, input);
}

boot();

// Shade Run — entrypoint: game loop, screens, guard layout, screenshot staging (?shot=).
import { FIELD, STEP } from './config.js';
import { createInput } from './input.js';
import { createPlayer, updatePlayer } from './player.js';
import { createGuard, updateGuard, STATE_ALERT } from './guards.js';
import { SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN, render } from './render.js';
import { inExitZone } from './world.js';
import { playAlarm, playFootstep, playWinChime, resumeAudio } from './audio.js';

// Guard patrols: three guards looping around the warehouse interior.
const GUARD_SPECS = [
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
];

export function createGameState() {
  const player = createPlayer(70, 660);
  const guards = GUARD_SPECS.map((s) => createGuard(s.x, s.y, s.waypoints));
  return { player, guards, elapsed: 0, maxSuspicion: 0, alarm: false, stepSoundTimer: 0 };
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

  for (const g of state.guards) {
    updateGuard(g, state.player, step, (guard) => {
      if (!state.alarm) {
        state.alarm = true;
        onAlarm(guard);
      }
    });
    state.maxSuspicion = Math.max(state.maxSuspicion, g.suspicion);
  }

  if (state.alarm) return SCREEN_OVER;
  if (inExitZone(state.player.x, state.player.y)) return SCREEN_WIN;
  return SCREEN_PLAY;
}

function startLoop(canvas, ctx, input, state) {
  let screen = SCREEN_TITLE;
  let last = performance.now();
  let acc = 0;

  function frame(now) {
    let dt = (now - last) / 1000;
    last = now;
    if (dt > 0.25) dt = 0.25;
    if (input.wasPressed('Enter') || input.wasPressed('Space')) {
      resumeAudio();
      if (screen !== SCREEN_PLAY) {
        state = createGameState();
        screen = SCREEN_PLAY;
        acc = 0;
      }
    }
    acc += dt;
    while (acc >= STEP && screen === SCREEN_PLAY) {
      screen = stepGame(state, input, STEP, () => playAlarm());
      acc -= STEP;
    }
    if (screen !== SCREEN_PLAY) acc = 0;
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
  const state = createGameState();
  render(ctx, SCREEN_TITLE, state);
  const params = new URLSearchParams(location.search);
  const shot = params.get('shot');
  if (shot) {
    // Staged scene for screenshots: run the real simulation forward deterministically,
    // then freeze. window.__shotReady signals a headless capture it may proceed.
    const seconds = Number(params.get('t') ?? '3');
    const steps = Math.max(0, Math.round(seconds / STEP));
    const input = createInput(canvas);
    let screen = SCREEN_PLAY;
    for (let i = 0; i < steps && screen === SCREEN_PLAY; i++) {
      screen = stepGame(state, input, STEP, () => {});
    }
    if (shot === 'start') screen = SCREEN_TITLE;
    if (shot === 'exit') screen = SCREEN_PLAY;
    if (shot === 'hide') {
      // Park the player behind the big crate cluster near guard 2 for the cover shot.
      state.player.x = 520;
      state.player.y = 400;
      state.player.facing = Math.PI;
    }
    if (shot === 'exit') {
      state.player.x = 1180;
      state.player.y = 100;
      state.player.facing = -Math.PI / 2;
      state.guards[1].state = STATE_ALERT;
      state.guards[1].suspicion = 82;
      state.maxSuspicion = 82;
    }
    render(ctx, screen, state);
    input.endFrame();
    window.__shotReady = true;
    return;
  }
  startLoop(canvas, ctx, input, state);
}

boot();

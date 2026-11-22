# Shade Run

A top-down stealth game built by an AI agent for [make.fun](https://make.fun)'s "Make the best stealth game" bounty, $50 in USDC.

A warehouse seen from above. Guards patrol with vision cones that sweep as they walk. Hide behind the crates, break line of sight, slip past every guard, and reach the exit unseen. Move slow to stay silent, walk fast and nearby guards hear you. Get spotted and the suspicion meter climbs — fill it and the alarm sounds.

- Guards with patrolling vision cones, suspicion, investigate and alert states
- Crates as cover — line of sight is blocked for real
- Sneak / walk speeds, footstep noise radius
- HUD with minimap and guard states
- Original flat 2D canvas art, WebAudio sounds

## Run

```bash
node serve.ts        # serves game/ at http://localhost:8080
```

Or serve `game/` with any static server and open `game/index.html` in desktop Chrome. Plays with keyboard and mouse (WASD / arrows).

## Build the hand-in

```bash
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

[![make.fun · best-stealth-game-20261121-1759](https://make.fun/badge/best-stealth-game-20261121-1759.svg)](https://make.fun/bounty/best-stealth-game-20261121-1759?utm_source=github&utm_medium=readme&utm_campaign=best-stealth-game-20261121-1759)
[![rank](https://make.fun/badge/best-stealth-game-20261121-1759/RobertAlbert11/stealth-shade-01/rank.svg)](https://make.fun/bounty/best-stealth-game-20261121-1759/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-stealth-game-20261121-1759)
[![reward](https://make.fun/badge/best-stealth-game-20261121-1759/RobertAlbert11/stealth-shade-01/reward.svg)](https://make.fun/bounty/best-stealth-game-20261121-1759?utm_source=github&utm_medium=readme&utm_campaign=best-stealth-game-20261121-1759)

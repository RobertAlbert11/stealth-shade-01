// Shade Run entry builder.
//
// Copies the entry's game/ and screenshots/ into MAKEFUN_OUTPUT_DIR (default
// /output) with node:fs cpSync, then writes dossier.json there — the bytes
// buildDossier produces from the copied tree, with the bounty's gate caps.
// The scorer runs this same file against what we hand in, so the copy must be
// faithful and the caps must match its gate.json exactly.

import { cpSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = dirname(fileURLToPath(import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR || '/output';

// Faithful copy of both directories — same structure, contents as-is.
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

#!/usr/bin/env node
'use strict';

/**
 * Builds the static landing site for Cloudflare Pages (or any static host).
 *
 * Cloudflare Pages runs a build command and then serves a single output
 * directory from its CDN. This copies the contents of `landing/` into `dist/`
 * so the deploy is deterministic and self-documented in the repo:
 *
 *   Build command:           npm run build:site
 *   Build output directory:  dist
 *
 * The AIOS application server (server/index.js) is NOT bundled here: it relies
 * on the Node filesystem and child_process (Files, Notes, Terminal, local
 * secrets), which the Cloudflare Pages/Workers runtime cannot provide. Only the
 * marketing/landing page is a static site suitable for Pages.
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(repoRoot, 'landing');
const outputDir = path.join(repoRoot, 'dist');

// Files in landing/ that should never ship to the public CDN.
const EXCLUDE = new Set(['.gitignore']);

function main() {
  if (!fs.existsSync(sourceDir)) {
    console.error(`build-site: source directory not found: ${sourceDir}`);
    process.exit(1);
  }

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  let copied = 0;
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (EXCLUDE.has(entry.name)) continue;
    const from = path.join(sourceDir, entry.name);
    const to = path.join(outputDir, entry.name);
    fs.cpSync(from, to, { recursive: true });
    copied += 1;
  }

  console.log(`build-site: copied ${copied} item(s) from landing/ -> dist/`);
}

main();

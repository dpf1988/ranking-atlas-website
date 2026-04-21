#!/usr/bin/env node
// Content linter for Ranking Atlas
// Enforces voice rules from docs/writing-style.md and docs/positioning-core.md
// Scope: src/pages/resources/*.astro, body content only (ignores frontmatter fences)

import { readFileSync, existsSync } from "fs";
import { execSync } from "child_process";

let changed;
try {
  changed = execSync("git diff --cached --name-only --diff-filter=ACM", { encoding: "utf8" })
    .split("\n")
    .filter(f => f.startsWith("src/pages/resources/") && /\.astro$/.test(f) && existsSync(f));
} catch {
  process.exit(0);
}

let failed = false;
const warnings = [];

function stripFrontmatter(content) {
  // Astro frontmatter is between --- fences at the top of the file
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1] : content;
}

function stripJsonLdBlocks(content) {
  // Ignore content inside <script type="application/ld+json"> blocks (JSON may contain em dashes in titles)
  return content.replace(/<script type="application\/ld\+json"[\s\S]*?<\/script>/g, "");
}

for (const file of changed) {
  const raw = readFileSync(file, "utf8");
  const body = stripJsonLdBlocks(stripFrontmatter(raw));

  if (body.includes("—")) {
    console.error(`✗ ${file}: em dash detected in body`);
    failed = true;
  }

  const notXbutY = /(^|\n)\s*(It's |This is |It was |That's )?[Nn]ot [^,\n]{1,80}, but /;
  if (notXbutY.test(body)) {
    console.error(`✗ ${file}: "not X, but Y" construction detected`);
    failed = true;
  }

  const hedging = /\b(might help|could potentially|may help|perhaps)\b/;
  if (hedging.test(body)) {
    console.error(`✗ ${file}: hedging verb detected (see writing-style.md)`);
    failed = true;
  }

  // Warn on repeated anchor text to same URL within a file (anchor variation rule)
  const linkMap = new Map();
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  while ((m = linkRegex.exec(body)) !== null) {
    const [, anchor, url] = m;
    if (url.startsWith("http") && !url.includes("ranking-atlas.com")) continue;
    const key = `${url}|||${anchor.toLowerCase()}`;
    linkMap.set(key, (linkMap.get(key) || 0) + 1);
  }
  for (const [key, count] of linkMap) {
    if (count > 2) {
      const [url, anchor] = key.split("|||");
      warnings.push(`⚠ ${file}: anchor "${anchor}" used ${count}× for ${url} (vary anchor text per content-strategy.md)`);
    }
  }
}

if (warnings.length) {
  console.warn("\nWarnings (not blocking):");
  warnings.forEach(w => console.warn(w));
}

if (failed) {
  console.error("\nCommit blocked. Fix the issues above and try again.");
  process.exit(1);
}

#!/usr/bin/env node
// Fetch an Our World in Data (OWID) indicator from its GitHub-hosted CSV,
// strip non-country rows, compute per-year ranks and headline metrics, and
// write data.json + data.csv into the target dataset folder.
//
// Usage:
//   node datalibrary/scripts/fetch-owid.mjs <grapher-slug> <dataset-slug> [options]
// Example:
//   node datalibrary/scripts/fetch-owid.mjs life-expectancy life-expectancy-by-country --unit "years" --indicator-name "Life expectancy at birth"
//
// Options:
//   --unit <unit>              Unit label (default: inferred from column name)
//   --indicator-name <name>    Override the indicator display name
//   --indicator-code <code>    Override the indicator code (default: grapher slug)
//   --license <license>        License string (default: CC-BY-4.0)

import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDataset } from './lib/transform.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');

// ── Parse arguments ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flags = {};
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--') && i + 1 < args.length) {
    flags[args[i].slice(2)] = args[++i];
  } else {
    positional.push(args[i]);
  }
}
const [grapherSlug, slug] = positional;
if (!grapherSlug || !slug) {
  console.error('Usage: node fetch-owid.mjs <grapher-slug> <dataset-slug> [--unit <unit>] [--indicator-name <name>]');
  process.exit(1);
}

// ── ISO-3166 country filter ─────────────────────────────────────────────────
// OWID CSVs include aggregates like "World", "High-income countries", continents.
// We filter to rows whose Entity matches a known ISO alpha-3 code.
// OWID uses the "Code" column for ISO alpha-3; rows without a code are aggregates.

// ── 1. Fetch the OWID CSV ──────────────────────────────────────────────────
const csvUrl = `https://catalog.ourworldindata.org/garden/owid/latest/key_indicators/${grapherSlug}.csv`;
const backupUrl = `https://raw.githubusercontent.com/owid/etl/master/etl/steps/data/grapher/owid/latest/key_indicators/${grapherSlug}.csv`;

console.log(`Fetching OWID data for "${grapherSlug}"…`);

async function fetchCsv(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'ranking-atlas-datalibrary/1.0' } });
  if (!res.ok) return null;
  return res.text();
}

let csvText = await fetchCsv(csvUrl);
if (!csvText) {
  console.log('  Catalog URL failed, trying GitHub raw…');
  csvText = await fetchCsv(backupUrl);
}
if (!csvText) {
  console.error(`Could not fetch CSV for "${grapherSlug}" from either URL.`);
  process.exit(1);
}

// ── 2. Parse CSV ────────────────────────────────────────────────────────────
const lines = csvText.split('\n').filter(l => l.trim());
const header = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

// Find column indices. OWID CSVs typically have: Entity, Code, Year, <value column>
const entityIdx = header.findIndex(h => /^entity$/i.test(h));
const codeIdx = header.findIndex(h => /^code$/i.test(h));
const yearIdx = header.findIndex(h => /^year$/i.test(h));
// The value column is everything else (take the last non-standard column)
const standardCols = new Set([entityIdx, codeIdx, yearIdx]);
const valueIdx = header.findIndex((_, i) => !standardCols.has(i));
const valueColName = header[valueIdx] || grapherSlug;

if (entityIdx < 0 || yearIdx < 0 || valueIdx < 0) {
  console.error(`Cannot parse CSV header: ${header.join(', ')}`);
  console.error('Expected columns: Entity, Code (optional), Year, <value>');
  process.exit(1);
}

console.log(`  Columns: ${header.join(', ')}`);
console.log(`  Value column: "${valueColName}" (index ${valueIdx})`);

// Simple CSV line parser that handles quoted fields
function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

const observations = [];
const entityNames = new Map(); // iso3 -> entity name

for (let i = 1; i < lines.length; i++) {
  const fields = parseCsvLine(lines[i]);
  const entity = fields[entityIdx];
  const code = codeIdx >= 0 ? fields[codeIdx] : '';
  const year = parseInt(fields[yearIdx], 10);
  const rawValue = fields[valueIdx];

  // Skip rows without a valid 3-letter country code (these are aggregates)
  if (!code || code.length !== 3 || !/^[A-Z]{3}$/.test(code)) continue;
  if (!Number.isFinite(year)) continue;

  const value = rawValue === '' || rawValue === undefined ? null : Number(rawValue);
  if (value !== null && !Number.isFinite(value)) continue;

  if (!entityNames.has(code)) entityNames.set(code, entity);

  observations.push({
    iso3: code,
    iso2: '',
    name: entity,
    region: '',
    incomeLevel: null,
    year,
    value,
  });
}

console.log(`  ${observations.length} country-year observations from ${entityNames.size} entities`);

if (observations.length === 0) {
  console.error('No valid observations found. Check the grapher slug and CSV format.');
  process.exit(1);
}

// ── 3. Build dataset ────────────────────────────────────────────────────────
const indicatorName = flags['indicator-name'] || valueColName;
const indicatorCode = flags['indicator-code'] || grapherSlug;
const unit = flags.unit || valueColName;
const license = flags.license || 'CC-BY-4.0';

const { dataset, csv } = buildDataset({
  observations,
  indicator: { code: indicatorCode, name: indicatorName, unit },
  source: {
    name: 'Our World in Data',
    url: `https://ourworldindata.org/grapher/${grapherSlug}`,
  },
  license,
});

console.log(`  ${dataset.countries.length} countries in ${dataset.metrics.latestYear}`);

// ── 4. Write outputs ────────────────────────────────────────────────────────
const outDir = resolve(ROOT, 'datalibrary', 'datasets', slug);
if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });
await writeFile(resolve(outDir, 'data.json'), JSON.stringify(dataset, null, 2));
console.log(`Wrote ${resolve(outDir, 'data.json')}`);

await writeFile(resolve(outDir, 'data.csv'), csv);

const publicDir = resolve(ROOT, 'public', 'data');
if (!existsSync(publicDir)) await mkdir(publicDir, { recursive: true });
await writeFile(resolve(publicDir, `${slug}.csv`), csv);
console.log(`Wrote ${resolve(publicDir, `${slug}.csv`)}`);
console.log('Done.');

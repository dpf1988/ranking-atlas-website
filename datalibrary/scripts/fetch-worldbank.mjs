#!/usr/bin/env node
// Fetch a World Bank indicator, strip aggregate rows, compute per-year ranks
// and headline metrics, and write data.json + data.csv into the target dataset
// folder. Also copies the CSV to public/data/<slug>.csv for a stable URL.
//
// Usage:
//   node datalibrary/scripts/fetch-worldbank.mjs <indicator> <slug>
// Example:
//   node datalibrary/scripts/fetch-worldbank.mjs NY.GDP.PCAP.CD gdp-per-capita-by-country

import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDataset } from './lib/transform.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');

const [, , indicatorCode, slug] = process.argv;
if (!indicatorCode || !slug) {
  console.error('Usage: node fetch-worldbank.mjs <indicator> <slug>');
  process.exit(1);
}

const API = 'https://api.worldbank.org/v2';

async function getJson(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'ranking-atlas-datalibrary/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}

// ── 1. Country metadata (used to strip aggregates) ─────────────────────────
console.log('Fetching country metadata…');
const countryPages = [];
let page = 1;
while (true) {
  const [meta, data] = await getJson(`${API}/country?format=json&per_page=300&page=${page}`);
  countryPages.push(...data);
  if (page >= meta.pages) break;
  page++;
}
// region.id === "NA" marks aggregates (World, income groups, regional totals)
const realCountries = new Map();
for (const c of countryPages) {
  if (!c.region || c.region.id === 'NA') continue;
  realCountries.set(c.id, {
    iso3: c.id,
    iso2: (c.iso2Code || '').toLowerCase(),
    name: c.name,
    region: c.region.value,
    incomeLevel: c.incomeLevel ? c.incomeLevel.value : null,
  });
}
console.log(`  ${realCountries.size} sovereign / territory economies`);

// ── 2. Indicator data ──────────────────────────────────────────────────────
console.log(`Fetching indicator ${indicatorCode}…`);
const rawObs = [];
page = 1;
while (true) {
  const [meta, data] = await getJson(
    `${API}/country/all/indicator/${indicatorCode}?format=json&per_page=20000&page=${page}`
  );
  if (data) rawObs.push(...data);
  if (page >= meta.pages) break;
  page++;
}
console.log(`  ${rawObs.length} raw observations`);

const indicatorName = rawObs.find(o => o.indicator)?.indicator.value || indicatorCode;

// ── 3. Map to flat observations for shared transform ────────────────────────
const observations = [];
for (const o of rawObs) {
  const iso3 = o.countryiso3code;
  if (!iso3 || !realCountries.has(iso3)) continue;
  const year = parseInt(o.date, 10);
  if (!Number.isFinite(year)) continue;
  const v = o.value === null || o.value === undefined ? null : Number(o.value);
  const meta = realCountries.get(iso3);
  observations.push({
    iso3,
    iso2: meta.iso2,
    name: meta.name,
    region: meta.region,
    incomeLevel: meta.incomeLevel,
    year,
    value: v,
  });
}

// Extract unit from indicator name, e.g. "GDP per capita (current US$)" -> "current US$"
function extractUnit(name) {
  const m = name.match(/\(([^)]+)\)\s*$/);
  return m ? m[1] : name;
}

// ── 4. Build dataset using shared transform ─────────────────────────────────
const { dataset, csv } = buildDataset({
  observations,
  indicator: { code: indicatorCode, name: indicatorName, unit: extractUnit(indicatorName) },
  source: {
    name: 'World Bank World Development Indicators',
    url: `https://data.worldbank.org/indicator/${indicatorCode}`,
  },
  license: 'CC-BY-4.0',
});

console.log(`  ${dataset.countries.length} reporting economies in ${dataset.metrics.latestYear}`);

// ── 5. Write outputs ────────────────────────────────────────────────────────
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

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

// ── 2. Indicator panel ──────────────────────────────────────────────────────
console.log(`Fetching indicator ${indicatorCode}…`);
const observations = [];
page = 1;
while (true) {
  const [meta, data] = await getJson(
    `${API}/country/all/indicator/${indicatorCode}?format=json&per_page=20000&page=${page}`
  );
  if (data) observations.push(...data);
  if (page >= meta.pages) break;
  page++;
}
console.log(`  ${observations.length} raw observations`);

const indicatorName = observations.find(o => o.indicator)?.indicator.value || indicatorCode;

// ── 3. Reshape into per-country annual series ───────────────────────────────
const years = new Set();
const byCountry = new Map(); // iso3 -> { yearMap: Map<year, value> }
for (const o of observations) {
  const iso3 = o.countryiso3code;
  if (!iso3 || !realCountries.has(iso3)) continue;
  const year = parseInt(o.date, 10);
  if (!Number.isFinite(year)) continue;
  years.add(year);
  const v = o.value === null || o.value === undefined ? null : Number(o.value);
  if (!byCountry.has(iso3)) byCountry.set(iso3, new Map());
  byCountry.get(iso3).set(year, v);
}
const yearList = [...years].sort((a, b) => a - b);
const latestYear = yearList[yearList.length - 1];
const firstYear = yearList[0];

// ── 4. Per-year ranks — dense ranking within the panel of countries that
// have a non-null value in the latest year. Restricting to the panel keeps
// the top-10 threshold visually meaningful: a country classed as "top ten
// in both years" always has rank ≤ 10 on both axes of the slope chart.
// Dense ranking (1,2,3,3,4) means ties share a rank without leaving gaps,
// so ranks are contiguous 1..N for every year.
const panelIso3s = new Set();
for (const [iso3, series] of byCountry) {
  const v = series.get(latestYear);
  if (v !== null && v !== undefined && Number.isFinite(v)) panelIso3s.add(iso3);
}

const ranksByYear = new Map(); // year -> Map<iso3, rank>
for (const year of yearList) {
  const rows = [];
  for (const iso3 of panelIso3s) {
    const v = byCountry.get(iso3)?.get(year);
    if (v === null || v === undefined || !Number.isFinite(v)) continue;
    rows.push({ iso3, v });
  }
  rows.sort((a, b) => b.v - a.v);
  const m = new Map();
  let rank = 0;
  let prevVal = null;
  for (const r of rows) {
    if (prevVal === null || r.v !== prevVal) rank++;
    m.set(r.iso3, rank);
    prevVal = r.v;
  }
  ranksByYear.set(year, m);
}

// ── 5. Build country objects with values[] + ranks[] aligned to yearList ───
const countries = [];
for (const [iso3, series] of byCountry) {
  const meta = realCountries.get(iso3);
  const values = yearList.map(y => (series.get(y) ?? null));
  const ranks = yearList.map(y => (ranksByYear.get(y).get(iso3) ?? null));
  const latestValue = values[values.length - 1];
  const latestRank = ranks[ranks.length - 1];
  if (latestValue === null || latestValue === undefined) continue; // exclude economies with no latest value
  const prev10Idx = yearList.indexOf(latestYear - 10);
  const rankPrev10 = prev10Idx >= 0 ? ranks[prev10Idx] : null;
  const delta10y = rankPrev10 && latestRank ? rankPrev10 - latestRank : null; // + = climbed
  const rank1960 = yearList.indexOf(1960) >= 0 ? ranks[yearList.indexOf(1960)] : null;
  const delta1960 = rank1960 && latestRank ? rank1960 - latestRank : null;
  const rank2000 = yearList.indexOf(2000) >= 0 ? ranks[yearList.indexOf(2000)] : null;
  const delta2000 = rank2000 && latestRank ? rank2000 - latestRank : null;
  countries.push({
    iso3,
    iso2: meta.iso2,
    name: meta.name,
    region: meta.region,
    incomeLevel: meta.incomeLevel,
    latestValue,
    latestRank,
    rank1960,
    rank2000,
    rankPrev10,
    delta10y,
    delta1960,
    delta2000,
    values,
    ranks,
  });
}
countries.sort((a, b) => a.latestRank - b.latestRank);
console.log(`  ${countries.length} reporting economies in ${latestYear}`);

// ── 6. Headline metrics ─────────────────────────────────────────────────────
const median = (nums) => {
  const s = nums.filter(v => v !== null && Number.isFinite(v)).sort((a, b) => a - b);
  if (!s.length) return null;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const latestValues = countries.map(c => c.latestValue);
const values1960 = countries.map(c => c.values[yearList.indexOf(1960)]);
const reportingEconomies1960 = values1960.filter(v => v !== null).length;

// Top-10 overlap: strict rank ≤ 10 in both years, using the panel-dense ranks.
// Because ranks are computed inside the same panel with dense ranking, any
// country in this overlap sits at rank ≤ 10 on both axes of the slope chart.
const top10LatestIso3s = new Set(countries.filter(c => c.latestRank <= 10).map(c => c.iso3));
const top10_1960Iso3s = new Set(countries.filter(c => c.rank1960 !== null && c.rank1960 <= 10).map(c => c.iso3));
const top10Overlap = [...top10LatestIso3s].filter(iso => top10_1960Iso3s.has(iso));
const top10OverlapNames = top10Overlap.map(iso => countries.find(c => c.iso3 === iso).name);

// Largest climber into current top 10 vs 1960
const top10Current = countries.slice(0, 10);
const withRank1960 = top10Current.filter(c => c.rank1960 !== null);
const largestClimberInTop10 = withRank1960.reduce((best, c) => (
  best === null || (c.rank1960 - c.latestRank) > (best.rank1960 - best.latestRank) ? c : best
), null);

// Largest gain since 2000 inside current top 20
const top20 = countries.slice(0, 20).filter(c => c.rank2000 !== null);
const largestGainSince2000InTop20 = top20.reduce((best, c) => (
  best === null || (c.rank2000 - c.latestRank) > (best.rank2000 - best.latestRank) ? c : best
), null);

// Largest 10y faller inside top 40
const top40 = countries.slice(0, 40).filter(c => c.delta10y !== null);
const largestFaller10y = top40.reduce((best, c) => (
  best === null || c.delta10y < best.delta10y ? c : best
), null);

const metrics = {
  latestYear,
  firstYear,
  prevDecadeYear: latestYear - 10,
  reportingEconomiesLatest: countries.length,
  reportingEconomies1960,
  leader: { iso3: countries[0].iso3, name: countries[0].name, value: countries[0].latestValue },
  top3: countries.slice(0, 3).map(c => ({ iso3: c.iso3, name: c.name, value: c.latestValue })),
  top14: countries.slice(0, 14).map(c => ({
    iso3: c.iso3, iso2: c.iso2, name: c.name, latestValue: c.latestValue, latestRank: c.latestRank,
  })),
  median: {
    latest: Math.round(median(latestValues)),
    firstYear: Math.round(median(values1960)),
  },
  top10Overlap1960toLatest: top10Overlap.length,
  top10Overlap1960toLatestNames: top10OverlapNames,
  largestClimberInTop10VsFirstYear: largestClimberInTop10 ? {
    iso3: largestClimberInTop10.iso3, name: largestClimberInTop10.name,
    rank1960: largestClimberInTop10.rank1960, latestRank: largestClimberInTop10.latestRank,
  } : null,
  largestGainSince2000InTop20: largestGainSince2000InTop20 ? {
    iso3: largestGainSince2000InTop20.iso3, name: largestGainSince2000InTop20.name,
    rank2000: largestGainSince2000InTop20.rank2000, latestRank: largestGainSince2000InTop20.latestRank,
    latestValue: largestGainSince2000InTop20.latestValue,
    gain: largestGainSince2000InTop20.rank2000 - largestGainSince2000InTop20.latestRank,
  } : null,
  largestFaller10yInTop40: largestFaller10y ? {
    iso3: largestFaller10y.iso3, name: largestFaller10y.name,
    latestRank: largestFaller10y.latestRank, delta10y: largestFaller10y.delta10y,
  } : null,
};

// ── 7. Write outputs ────────────────────────────────────────────────────────
const dataset = {
  indicator: { code: indicatorCode, name: indicatorName, unit: 'current US$' },
  source: {
    name: 'World Bank World Development Indicators',
    url: `https://data.worldbank.org/indicator/${indicatorCode}`,
  },
  license: 'CC-BY-4.0',
  temporalCoverage: { startYear: firstYear, endYear: latestYear },
  retrievedAt: new Date().toISOString().slice(0, 10),
  years: yearList,
  metrics,
  countries,
};

const outDir = resolve(ROOT, 'datalibrary', 'datasets', slug);
if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });
await writeFile(resolve(outDir, 'data.json'), JSON.stringify(dataset, null, 2));
console.log(`Wrote ${resolve(outDir, 'data.json')}`);

// CSV: long format, one row per country-year
const csvHeader = 'iso3,iso2,name,region,income_level,year,value,rank\n';
const csvLines = [csvHeader];
for (const c of countries) {
  for (let i = 0; i < yearList.length; i++) {
    const v = c.values[i];
    const r = c.ranks[i];
    csvLines.push(
      `${c.iso3},${c.iso2},"${c.name.replace(/"/g, '""')}","${c.region || ''}","${c.incomeLevel || ''}",${yearList[i]},${v === null ? '' : v},${r === null ? '' : r}\n`
    );
  }
}
const csv = csvLines.join('');
await writeFile(resolve(outDir, 'data.csv'), csv);

const publicDir = resolve(ROOT, 'public', 'data');
if (!existsSync(publicDir)) await mkdir(publicDir, { recursive: true });
await writeFile(resolve(publicDir, `${slug}.csv`), csv);
console.log(`Wrote ${resolve(publicDir, `${slug}.csv`)}`);
console.log('Done.');

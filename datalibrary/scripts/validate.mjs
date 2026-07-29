#!/usr/bin/env node
// Sanity-check a dataset before it ships. Reads data.json + config.json for
// the given slug and asserts the invariants the templates rely on. Exits
// non-zero on any failure so it can gate a build.
//
// Usage:
//   node datalibrary/scripts/validate.mjs <slug>
// Example:
//   node datalibrary/scripts/validate.mjs gdp-per-capita-by-country

import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');

const [, , slug] = process.argv;
if (!slug) {
  console.error('Usage: node validate.mjs <slug>');
  process.exit(1);
}

const dsRoot = resolve(ROOT, 'datalibrary', 'datasets', slug);
const dataPath = resolve(dsRoot, 'data.json');
const cfgPath = resolve(dsRoot, 'config.json');
const csvPath = resolve(dsRoot, 'data.csv');
const publicCsvPath = resolve(ROOT, 'public', 'data', `${slug}.csv`);

let failed = 0;
const fail = (msg) => { console.error(`  FAIL  ${msg}`); failed++; };
const pass = (msg) => { console.log(`  ok    ${msg}`); };

function assertFileExists(p, label) {
  if (!existsSync(p)) fail(`${label} missing at ${p}`);
  else pass(`${label} exists (${statSync(p).size} bytes)`);
}

console.log(`\nValidating dataset: ${slug}\n`);

assertFileExists(dataPath, 'data.json');
assertFileExists(cfgPath, 'config.json');
assertFileExists(csvPath, 'data.csv');
assertFileExists(publicCsvPath, `public/data/${slug}.csv`);

if (failed > 0) { console.error('\nAborting: required files missing.'); process.exit(1); }

const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
const cfg = JSON.parse(readFileSync(cfgPath, 'utf-8'));

// 1. Shape checks on data.json
for (const k of ['indicator', 'source', 'temporalCoverage', 'years', 'countries', 'metrics']) {
  if (!(k in data)) fail(`data.json missing top-level key: ${k}`);
}
if (data.indicator?.unit) pass(`unit is: ${data.indicator.unit}`);
else fail('data.json.indicator.unit missing');

if (Array.isArray(data.years) && data.years.length > 1) {
  const y = data.years;
  const monotonic = y.every((v, i) => i === 0 || v === y[i - 1] + 1);
  monotonic ? pass(`years are contiguous 1-step (${y[0]}–${y[y.length - 1]})`)
            : fail('years array is not contiguous 1-step');
} else fail('years array missing or too short');

const countries = Array.isArray(data.countries) ? data.countries : [];
if (countries.length >= 50) pass(`${countries.length} countries in panel`);
else fail(`only ${countries.length} countries — expected ≥ 50`);

// 2. Aggregate-row leakage check
const aggregateNames = ['World', 'Euro area', 'European Union', 'Arab World', 'OECD members', 'High income', 'Low income', 'Middle income', 'Upper middle income', 'Lower middle income'];
const leaked = countries.filter(c => aggregateNames.includes(c.name));
if (leaked.length === 0) pass('no aggregate rows in countries panel');
else fail(`aggregate rows leaked: ${leaked.map(c => c.name).join(', ')}`);

// 3. Latest-year top-50 have no null values
const latestYear = data.metrics?.latestYear;
const latestIdx = data.years?.indexOf(latestYear);
if (latestIdx == null || latestIdx < 0) fail('cannot locate latestYear in years array');
else {
  const withLatest = countries
    .map(c => ({ name: c.name, v: c.values?.[latestIdx] }))
    .filter(x => x.v != null && Number.isFinite(x.v))
    .sort((a, b) => b.v - a.v)
    .slice(0, 50);
  const nulls = withLatest.filter(x => x.v == null);
  nulls.length === 0
    ? pass(`latest-year top 50 have no nulls`)
    : fail(`latest-year top 50 include nulls: ${nulls.map(n => n.name).join(', ')}`);
}

// 4. Metrics consistency
const m = data.metrics;
if (m?.leader?.name && m?.top3?.[0]?.name === m.leader.name)
  pass(`leader matches top3[0]: ${m.leader.name}`);
else fail('metrics.leader does not match metrics.top3[0]');

if (Array.isArray(m?.top3) && m.top3.length === 3 && m.top3.every(x => typeof x.value === 'number' && x.value > 0))
  pass(`top3 has 3 positive values (${m.top3.map(x => `${x.name} ${Math.round(x.value)}`).join(', ')})`);
else fail('metrics.top3 malformed');

// Rank order in top3
if (Array.isArray(m?.top3) && m.top3.length === 3) {
  const [a, b, c] = m.top3;
  if (a.value >= b.value && b.value >= c.value) pass('top3 values are descending');
  else fail(`top3 values not descending: ${a.value}, ${b.value}, ${c.value}`);
}

// 4a. Generic metric keys must exist (not the old 1960-anchored names)
const requiredMetrics = [
  'reportingEntitiesFirstYear',
  'top10OverlapFirstYearToLatest',
  'top10OverlapFirstYearToLatestNames',
];
for (const key of requiredMetrics) {
  if (key in m) pass(`metrics.${key} present`);
  else fail(`metrics.${key} missing (old key name?)`);
}

// 4b. Climber must use generic key
if (m.largestClimberInTop10VsFirstYear) {
  if ('rankFirstYear' in m.largestClimberInTop10VsFirstYear) pass('climber uses rankFirstYear');
  else fail('climber missing rankFirstYear (has rank1960?)');
}

// 4c. Country objects must use generic keys
if (countries.length > 0) {
  const sample = countries[0];
  if ('rankFirstYear' in sample) pass('countries use rankFirstYear');
  else fail('countries missing rankFirstYear (has rank1960?)');
  if ('deltaFirstYear' in sample) pass('countries use deltaFirstYear');
  else fail('countries missing deltaFirstYear (has delta1960?)');
}

// 4d. Reject old 1960-anchored metric keys in data.json
const deprecatedMetricKeys = ['reportingEconomies1960', 'top10Overlap1960toLatest', 'top10Overlap1960toLatestNames'];
for (const key of deprecatedMetricKeys) {
  if (key in m) fail(`metrics.${key} is deprecated; use the generic form`);
}
if (m.largestClimberInTop10VsFirstYear && 'rank1960' in m.largestClimberInTop10VsFirstYear) {
  fail('climber.rank1960 is deprecated; use rankFirstYear');
}
if (countries.length > 0 && 'rank1960' in countries[0]) {
  fail('countries[].rank1960 is deprecated; use rankFirstYear');
}
if (countries.length > 0 && 'delta1960' in countries[0]) {
  fail('countries[].delta1960 is deprecated; use deltaFirstYear');
}

// 4e. Category taxonomy
const CATEGORIES = ['economy', 'health', 'society', 'environment', 'technology', 'property'];
if (!cfg.category) fail('config.category missing (required)');
else if (!CATEGORIES.includes(cfg.category)) fail(`config.category "${cfg.category}" is not in taxonomy: ${CATEGORIES.join(', ')}`);
else pass(`category is: ${cfg.category}`);
if (CATEGORIES.includes(slug)) fail(`dataset slug "${slug}" collides with a category name (reserved)`);
else pass(`slug does not collide with a category name`);

// 4f. Required config fields for generic template
const requiredConfigFields = ['schemaDescription', 'itemListTemplate', 'entityType'];
for (const field of requiredConfigFields) {
  if (cfg[field]) pass(`config.${field} present`);
  else fail(`config.${field} missing (required for generic template)`);
}

// 5. Config tokens must all resolve against the generic token set
const cfgStr = JSON.stringify(cfg);
const usedTokens = [...cfgStr.matchAll(/\{\{(\w+)\}\}/g)].map(x => x[1]);
const uniqueTokens = [...new Set(usedTokens)];
const knownTokens = new Set([
  'firstYear', 'latestYear', 'prevDecadeYear', 'yearSpan',
  'reportingEconomiesLatest', 'reportingEntitiesFirstYear',
  'entityType', 'unit', 'sourceNameFull', 'sourceLink',
  'leaderName', 'leaderValueFmt',
  'rank2Name', 'rank2ValueFmt', 'rank3Name', 'rank3ValueFmt',
  'overlapCount', 'overlapList',
  'climberName', 'climberRankFirstYear', 'climberRankFirstYearOrd', 'climberLatestRank', 'climberLatestRankOrd',
  'gainerName', 'gainerRank2000Ord', 'gainerLatestRankOrd', 'gainerValueFmt', 'gainerGain',
  'medianLatestFmt', 'medianFirstYearFmt',
  'retrievedAtHuman',
  // Per-country tokens used in itemListTemplate (substituted at render time)
  'value', 'rank',
]);
const unknown = uniqueTokens.filter(t => !knownTokens.has(t));
unknown.length === 0
  ? pass(`all ${uniqueTokens.length} config tokens are known`)
  : fail(`unknown tokens in config: ${unknown.join(', ')}`);

// 5b. Reject deprecated token names in config
const deprecatedTokens = [
  'reportingEconomies1960', 'climberRank1960', 'climberRank1960Ord',
];
const usedDeprecated = deprecatedTokens.filter(t => cfgStr.includes(`{{${t}}}`));
if (usedDeprecated.length > 0) fail(`config uses deprecated tokens: ${usedDeprecated.join(', ')}`);
else pass('no deprecated tokens in config');

// 6. No em dashes anywhere in config visible copy
const emDashes = (cfgStr.match(/—/g) || []).length;
emDashes === 0 ? pass('no em dashes in config') : fail(`config contains ${emDashes} em dash(es)`);

// 6b. No dataset jargon in config visible copy
const jargon = ['panel', 'the panel', 'reporting panel', 'cohort', 'entities', 'observations',
                'rows', 'indicator', 'aggregates excluded'];
const jargonHits = jargon.filter(w => new RegExp(`\\b${w.replace(/ /g, '\\s+')}\\b`, 'i').test(cfg.card_summary || ''));
jargonHits.length === 0
  ? pass('no dataset jargon in card_summary')
  : fail(`card_summary contains dataset jargon: ${jargonHits.join(', ')}`);
const proseJargonHits = ['panel', 'the panel', 'reporting panel', 'cohort', 'entities', 'observations']
  .filter(w => new RegExp(`\\b${w}\\b`, 'i').test(cfgStr));
proseJargonHits.length === 0
  ? pass('no dataset jargon in config')
  : fail(`config contains dataset jargon: ${proseJargonHits.join(', ')}`);

// 6c. card_summary cap
const cs = cfg.card_summary;
if (!cs) fail('config.card_summary missing (required scope statement)');
else if (typeof cs !== 'string') fail('config.card_summary must be a string');
else if (cs.length > 160) fail(`card_summary is ${cs.length} chars; hard cap is 160`);
else if (/\.\.\.|…/.test(cs)) fail('card_summary contains an ellipsis; use complete sentences');
else pass(`card_summary is ${cs.length}/160 chars`);

// 7. CSV shape
const csvHead = readFileSync(csvPath, 'utf-8').split('\n').slice(0, 3);
if (csvHead[0]?.includes('iso3') && csvHead[0]?.includes('year') && csvHead[0]?.includes('value') && csvHead[0]?.includes('rank'))
  pass('data.csv header includes iso3, year, value, rank');
else fail(`data.csv header unexpected: ${csvHead[0]}`);

// 8. Public CSV must be a byte-for-byte copy
const a = readFileSync(csvPath);
const b = readFileSync(publicCsvPath);
a.equals(b) ? pass('public/data CSV matches dataset CSV') : fail('public/data CSV differs from dataset CSV');

console.log(failed === 0 ? '\nAll checks passed.\n' : `\n${failed} check(s) failed.\n`);
process.exit(failed === 0 ? 0 : 1);

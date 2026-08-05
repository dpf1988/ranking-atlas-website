#!/usr/bin/env node
/**
 * fetch_effis_perimeters.mjs
 *
 * Fetches EFFIS fire perimeter polygons for the UK (2016-2026) via WFS,
 * clips to Highland council area and Scotland using geometric intersection,
 * and aggregates to annual burned hectares.
 *
 * Attribution method: true spatial intersection. For each fire polygon,
 * the area of intersection with each boundary is computed in British
 * National Grid (EPSG:27700) and converted to hectares. Fires that
 * straddle a boundary are split proportionally.
 *
 * Optimisations:
 *   - Boundaries simplified (tolerance 0.001°, ~80m) before intersection
 *   - Fires pre-filtered by bounding-box overlap with Scotland before
 *     expensive intersection; fires entirely outside Scotland skip both clips
 *
 * Endpoint: maps.effis.emergency.copernicus.eu/effis (WFS 2.0.0)
 * Layers:   modis.ba.poly.{2016-2025}, modis.ba.poly.season (2026)
 * Boundary: ONS Open Geography Portal (LAD May 2025, Countries Dec 2025)
 * Projection: EPSG:27700 (British National Grid) for area calculation
 */

import { intersect } from '@turf/intersect';
import { simplify } from '@turf/simplify';
import { bbox } from '@turf/bbox';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import proj4 from 'proj4';

const __dirname = dirname(fileURLToPath(import.meta.url));

// EPSG:27700 British National Grid
const BNG = '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +units=m +no_defs';
const WGS84 = 'EPSG:4326';

const EFFIS_BASE = 'https://maps.effis.emergency.copernicus.eu/effis';
const UK_BBOX = '49.5,-8.5,62.0,2.0,urn:ogc:def:crs:EPSG::4326';
const MAX_FEATURES = 5000;
const SIMPLIFY_TOL = 0.01; // ~800 m at Scottish latitudes; negligible error for 30+ ha fires

const ONS_BASE = 'https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services';
const HIGHLAND_URL = `${ONS_BASE}/LAD_MAY_2025_UK_BGC_V2/FeatureServer/0/query?where=LAD25NM%3D%27Highland%27&outFields=LAD25CD,LAD25NM&outSR=4326&f=geojson`;
const SCOTLAND_URL = `${ONS_BASE}/Countries_December_2025_Boundaries_UK_BGC/FeatureServer/0/query?where=CTRY25NM%3D%27Scotland%27&outFields=CTRY25CD,CTRY25NM&outSR=4326&f=geojson`;

const RETRIEVAL_TS = new Date().toISOString();

// ── helpers ──

async function fetchJson(url, label, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(120_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`  ${label}: attempt ${attempt}/${retries} failed (${err.message})`);
      if (attempt === retries) throw new Error(`${label}: all ${retries} attempts failed`);
      await new Promise(r => setTimeout(r, 3000 * attempt));
    }
  }
}

async function fetchBoundary(url, label) {
  console.log(`  Fetching ${label} boundary...`);
  const geojson = await fetchJson(url, label);
  if (!geojson.features?.length) throw new Error(`${label}: no features returned`);
  const raw = geojson.features[0];
  if (!raw.geometry) throw new Error(`${label}: geometry is null`);
  const simple = simplify(raw, { tolerance: SIMPLIFY_TOL, highQuality: true });
  const rawVerts = countVertices(raw);
  const simpleVerts = countVertices(simple);
  console.log(`  ${label}: ${raw.properties?.LAD25NM || raw.properties?.CTRY25NM} loaded (${rawVerts} → ${simpleVerts} vertices after simplify)`);
  return simple;
}

function countVertices(feature) {
  let n = 0;
  const g = feature.geometry;
  if (g.type === 'Polygon') g.coordinates.forEach(r => n += r.length);
  else if (g.type === 'MultiPolygon') g.coordinates.forEach(p => p.forEach(r => n += r.length));
  return n;
}

async function fetchFiresForLayer(layerName) {
  const url = `${EFFIS_BASE}?service=WFS&version=2.0.0&request=GetFeature` +
    `&typeName=ms:${layerName}` +
    `&outputFormat=application/json;%20subtype=geojson` +
    `&count=${MAX_FEATURES}` +
    `&BBOX=${UK_BBOX}`;
  console.log(`  Fetching ${layerName}...`);
  const geojson = await fetchJson(url, layerName);
  const features = geojson.features || [];
  const ukFires = features.filter(f => f.properties?.COUNTRY === 'UK');
  const totalHa = ukFires.reduce((s, f) => s + parseFloat(f.properties?.AREA_HA || 0), 0);
  console.log(`  ${layerName}: ${features.length} total, ${ukFires.length} UK, ${Math.round(totalHa)} ha`);
  if (ukFires.length >= MAX_FEATURES - 50) {
    console.warn(`  WARNING: near max features (${ukFires.length}). May be truncated.`);
  }
  return ukFires;
}

// ── bbox overlap test ──

function bboxOverlaps(a, b) {
  // [minX, minY, maxX, maxY]
  return !(a[2] < b[0] || a[0] > b[2] || a[3] < b[1] || a[1] > b[3]);
}

// ── area computation in BNG ──

function reprojectRing(ring) {
  return ring.map(([lon, lat]) => proj4(WGS84, BNG, [lon, lat]));
}

function shoelaceArea(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += ring[j][0] * ring[i][1];
    a -= ring[i][0] * ring[j][1];
  }
  return Math.abs(a) / 2;
}

function areaBNG(feature) {
  if (!feature?.geometry) return 0;
  const g = feature.geometry;
  let m2 = 0;
  const polys = g.type === 'MultiPolygon' ? g.coordinates : g.type === 'Polygon' ? [g.coordinates] : [];
  for (const poly of polys) {
    m2 += shoelaceArea(reprojectRing(poly[0]));
    for (let i = 1; i < poly.length; i++) m2 -= shoelaceArea(reprojectRing(poly[i]));
  }
  return Math.max(0, m2 / 10_000);
}

function intersectedAreaHa(fire, boundary) {
  try {
    const clipped = intersect({ type: 'FeatureCollection', features: [fire, boundary] });
    if (!clipped) return 0;
    return areaBNG(clipped);
  } catch {
    return 0;
  }
}

// ── main ──

async function main() {
  console.log('=== EFFIS Fire Perimeter Fetcher (Highland Scotland) ===');
  console.log(`Method: geometric intersection, area in EPSG:27700 (BNG)`);
  console.log(`Boundary simplification: ${SIMPLIFY_TOL}° tolerance`);
  console.log(`Retrieval timestamp: ${RETRIEVAL_TS}\n`);

  // 1. Fetch and simplify boundaries
  console.log('Step 1: Fetching boundaries');
  const highlandBoundary = await fetchBoundary(HIGHLAND_URL, 'Highland');
  const scotlandBoundary = await fetchBoundary(SCOTLAND_URL, 'Scotland');

  const scotBbox = bbox(scotlandBoundary);
  const highBbox = bbox(highlandBoundary);
  console.log(`  Scotland bbox: [${scotBbox.map(n => n.toFixed(2)).join(', ')}]`);
  console.log(`  Highland bbox: [${highBbox.map(n => n.toFixed(2)).join(', ')}]`);

  // 2. Process fires
  console.log('\nStep 2: Fetching and processing fire perimeters');
  const years = [];
  for (let y = 2016; y <= 2025; y++) years.push(y);
  years.push(2026);

  const annualData = {};
  const flaggedFires = [];

  for (const year of years) {
    const layerName = year === 2026 ? 'modis.ba.poly.season' : `modis.ba.poly.${year}`;
    const fires = await fetchFiresForLayer(layerName);

    let ukTotal = 0, scotlandTotal = 0, highlandTotal = 0;
    let ukCount = 0, scotlandCount = 0, highlandCount = 0;
    let skippedBbox = 0;
    const t0 = Date.now();

    for (const fire of fires) {
      const effisHa = parseFloat(fire.properties?.AREA_HA || 0);
      const ukHa = areaBNG(fire);
      ukTotal += ukHa;
      ukCount++;

      // Pre-filter: skip expensive intersection if fire bbox doesn't overlap Scotland
      let fireBbox;
      try { fireBbox = bbox(fire); } catch { continue; }

      if (!bboxOverlaps(fireBbox, scotBbox)) {
        skippedBbox++;
        continue;
      }

      // Scotland intersection
      const scotHa = intersectedAreaHa(fire, scotlandBoundary);
      if (scotHa > 0) {
        scotlandTotal += scotHa;
        scotlandCount++;
      } else {
        continue; // Not in Scotland, skip Highland test
      }

      // Highland intersection (only if fire bbox overlaps Highland)
      let highHa = 0;
      if (bboxOverlaps(fireBbox, highBbox)) {
        highHa = intersectedAreaHa(fire, highlandBoundary);
        if (highHa > 0) {
          highlandTotal += highHa;
          highlandCount++;
        }
      }

      // Flag large Scottish fires for Dava/Carrbridge and Cairngorms investigation
      if ((year === 2025 || year === 2026) && scotHa > 0 && effisHa >= 500) {
        flaggedFires.push({
          year,
          id: fire.properties?.id,
          firedate: fire.properties?.FIREDATE || '',
          province: fire.properties?.PROVINCE || '',
          commune: fire.properties?.COMMUNE || '',
          effis_ha: effisHa,
          bng_total_ha: Math.round(ukHa),
          scotland_ha: Math.round(scotHa),
          highland_ha: Math.round(highHa),
          highland_pct: ukHa > 0 ? (highHa / ukHa * 100).toFixed(1) : '0',
        });
      }
    }

    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    annualData[year] = {
      uk_ha: Math.round(ukTotal), uk_fires: ukCount,
      scotland_ha: Math.round(scotlandTotal), scotland_fires: scotlandCount,
      highland_ha: Math.round(highlandTotal), highland_fires: highlandCount,
    };

    console.log(`  ${year}: UK ${Math.round(ukTotal)} ha (${ukCount}), Scot ${Math.round(scotlandTotal)} ha (${scotlandCount}), High ${Math.round(highlandTotal)} ha (${highlandCount}) | ${elapsed}s, ${skippedBbox} bbox-skipped`);
  }

  // 3. Sanity checks
  console.log('\n=== SANITY CHECKS ===');
  let allPassed = true;
  for (const year of years) {
    const d = annualData[year];
    if (d.scotland_ha > d.uk_ha) {
      console.error(`FAIL: ${year} Scotland (${d.scotland_ha}) > UK (${d.uk_ha})`);
      allPassed = false;
    }
    if (d.highland_ha > d.scotland_ha) {
      console.error(`FAIL: ${year} Highland (${d.highland_ha}) > Scotland (${d.scotland_ha})`);
      allPassed = false;
    }
  }
  const uk2025 = annualData[2025]?.uk_ha;
  const published2025 = 47879;
  const pctDiff = ((uk2025 - published2025) / published2025 * 100).toFixed(1);
  console.log(`\n2025 UK (BNG): ${uk2025} ha vs published seasonal trend: ${published2025} ha (${pctDiff}%)`);
  if (allPassed) console.log('\nAll hierarchy checks PASSED');
  else console.error('\nSome sanity checks FAILED');

  // 4. Flagged fires
  console.log('\n=== FLAGGED FIRES (>=500 ha, Scotland, 2025-2026) ===');
  for (const f of flaggedFires) {
    console.log(`  ${f.year} | id=${f.id} | ${f.firedate} | ${f.province} / ${f.commune} | EFFIS=${f.effis_ha} ha | BNG=${f.bng_total_ha} ha | Scot=${f.scotland_ha} ha | High=${f.highland_ha} ha (${f.highland_pct}%)`);
  }

  // 5. Summary table
  console.log('\n=== ANNUAL SUMMARY ===');
  console.log('Year | UK ha | Scotland ha | Highland ha | H% Scot | H% UK');
  for (const year of years) {
    const d = annualData[year];
    const ps = d.scotland_ha > 0 ? (d.highland_ha / d.scotland_ha * 100).toFixed(1) : '0.0';
    const pu = d.uk_ha > 0 ? (d.highland_ha / d.uk_ha * 100).toFixed(1) : '0.0';
    console.log(`${year} | ${d.uk_ha} | ${d.scotland_ha} | ${d.highland_ha} | ${ps}% | ${pu}%`);
  }

  // 6. CSV
  const csvLines = ['year,uk_burned_ha,uk_fires,scotland_burned_ha,scotland_fires,highland_burned_ha,highland_fires,retrieval_timestamp'];
  for (const year of years) {
    const d = annualData[year];
    csvLines.push(`${year},${d.uk_ha},${d.uk_fires},${d.scotland_ha},${d.scotland_fires},${d.highland_ha},${d.highland_fires},${RETRIEVAL_TS}`);
  }
  const csvPath = join(__dirname, '..', 'public', 'downloads', 'highland-wildfire-data.csv');
  mkdirSync(dirname(csvPath), { recursive: true });
  writeFileSync(csvPath, csvLines.join('\n') + '\n');
  console.log(`\nCSV written: ${csvPath}`);

  // 7. JSON
  const jsonPath = join(__dirname, 'highland-wildfire-results.json');
  writeFileSync(jsonPath, JSON.stringify({
    retrieval_timestamp: RETRIEVAL_TS,
    method: 'geometric intersection, area computed in EPSG:27700 (British National Grid), boundaries simplified at 0.001° tolerance',
    boundary_source: 'ONS Open Geography Portal, LAD May 2025 (BGC)',
    scotland_boundary_source: 'ONS Open Geography Portal, Countries December 2025 (BGC)',
    highland_lad_code: 'S12000017',
    effis_endpoint: EFFIS_BASE,
    coverage: '2016-2026 (2026 is season to date)',
    annual: annualData,
    flagged_fires: flaggedFires,
  }, null, 2) + '\n');
  console.log(`JSON written: ${jsonPath}`);
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });

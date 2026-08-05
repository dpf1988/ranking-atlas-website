#!/usr/bin/env node
/**
 * highland-seasonality.mjs
 *
 * Analyses Highland fire seasonality from EFFIS perimeter polygons.
 * Only intersects against Highland boundary (not Scotland) for speed.
 */

import { intersect } from '@turf/intersect';
import { simplify } from '@turf/simplify';
import { bbox } from '@turf/bbox';
import proj4 from 'proj4';

const BNG = '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +units=m +no_defs';
const WGS84 = 'EPSG:4326';
const EFFIS_BASE = 'https://maps.effis.emergency.copernicus.eu/effis';
const UK_BBOX = '49.5,-8.5,62.0,2.0,urn:ogc:def:crs:EPSG::4326';
const ONS_BASE = 'https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services';
const HIGHLAND_URL = `${ONS_BASE}/LAD_MAY_2025_UK_BGC_V2/FeatureServer/0/query?where=LAD25NM%3D%27Highland%27&outFields=LAD25CD,LAD25NM&outSR=4326&f=geojson`;

async function fetchJson(url, label, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(120_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw new Error(`${label}: all ${retries} attempts failed (${err.message})`);
      await new Promise(r => setTimeout(r, 3000 * attempt));
    }
  }
}

function reprojectRing(ring) { return ring.map(([lon, lat]) => proj4(WGS84, BNG, [lon, lat])); }
function shoelaceArea(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { a += ring[j][0] * ring[i][1]; a -= ring[i][0] * ring[j][1]; }
  return Math.abs(a) / 2;
}
function areaBNG(feature) {
  if (!feature?.geometry) return 0;
  const g = feature.geometry;
  let m2 = 0;
  const polys = g.type === 'MultiPolygon' ? g.coordinates : g.type === 'Polygon' ? [g.coordinates] : [];
  for (const poly of polys) { m2 += shoelaceArea(reprojectRing(poly[0])); for (let i = 1; i < poly.length; i++) m2 -= shoelaceArea(reprojectRing(poly[i])); }
  return Math.max(0, m2 / 10_000);
}
function intersectedAreaHa(fire, boundary) {
  try {
    const clipped = intersect({ type: 'FeatureCollection', features: [fire, boundary] });
    if (!clipped) return 0;
    return areaBNG(clipped);
  } catch { return 0; }
}
function bboxOverlaps(a, b) { return !(a[2] < b[0] || a[0] > b[2] || a[3] < b[1] || a[1] > b[3]); }

async function main() {
  console.log('Fetching Highland boundary...');
  const rawGeo = await fetchJson(HIGHLAND_URL, 'Highland');
  const highlandBoundary = simplify(rawGeo.features[0], { tolerance: 0.01, highQuality: true });
  const highBbox = bbox(highlandBoundary);
  console.log(`Highland bbox: [${highBbox.map(n => n.toFixed(2))}]\n`);

  const years = [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026];
  const allFires = []; // {year, month, day, firedate, highlandHa, effisHa, id, province, commune}

  for (const year of years) {
    const layer = year === 2026 ? 'modis.ba.poly.season' : `modis.ba.poly.${year}`;
    const url = `${EFFIS_BASE}?service=WFS&version=2.0.0&request=GetFeature&typeName=ms:${layer}&outputFormat=application/json;%20subtype=geojson&count=5000&BBOX=${UK_BBOX}`;
    console.log(`Fetching ${layer}...`);
    const geo = await fetchJson(url, layer);
    const ukFires = (geo.features || []).filter(f => f.properties?.COUNTRY === 'UK');
    let count = 0;
    const t0 = Date.now();

    for (const fire of ukFires) {
      let fireBbox;
      try { fireBbox = bbox(fire); } catch { continue; }
      if (!bboxOverlaps(fireBbox, highBbox)) continue;

      const highHa = intersectedAreaHa(fire, highlandBoundary);
      if (highHa <= 0) continue;

      const fd = fire.properties?.FIREDATE || '';
      const d = new Date(fd);
      const month = d.getMonth() + 1; // 1-12
      const day = d.getDate();

      allFires.push({
        year, month, day, firedate: fd,
        highlandHa: Math.round(highHa * 10) / 10,
        effisHa: parseFloat(fire.properties?.AREA_HA || 0),
        id: fire.properties?.id,
        province: fire.properties?.PROVINCE || '',
        commune: fire.properties?.COMMUNE || '',
      });
      count++;
    }
    console.log(`  ${year}: ${count} Highland fires (${((Date.now()-t0)/1000).toFixed(1)}s)`);
  }

  // ── 1. Year x Month matrix ──
  console.log('\n═══ 1. YEAR x MONTH MATRIX (Highland ha) ═══\n');
  const months = [1,2,3,4,5,6,7,8,9,10,11,12];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const matrix = {};
  for (const y of years) { matrix[y] = {}; for (const m of months) matrix[y][m] = 0; }
  for (const f of allFires) { matrix[f.year][f.month] += f.highlandHa; }

  // Header
  console.log('Year  | ' + monthNames.map(m => m.padStart(7)).join(' ') + ' |   Total');
  console.log('-'.repeat(120));

  const tenYearMonthly = {};
  for (const m of months) tenYearMonthly[m] = 0;

  for (const y of years) {
    const rowTotal = months.reduce((s, m) => s + matrix[y][m], 0);
    const row = months.map(m => Math.round(matrix[y][m]).toString().padStart(7)).join(' ');
    console.log(`${y}  | ${row} | ${Math.round(rowTotal).toString().padStart(7)}`);
    if (y <= 2025) { for (const m of months) tenYearMonthly[m] += matrix[y][m]; }
  }

  // Ten-year average
  console.log('-'.repeat(120));
  const avgRow = months.map(m => Math.round(tenYearMonthly[m] / 10).toString().padStart(7)).join(' ');
  const avgTotal = months.reduce((s, m) => s + tenYearMonthly[m] / 10, 0);
  console.log(`Avg   | ${avgRow} | ${Math.round(avgTotal).toString().padStart(7)}`);

  // Cumulative share
  console.log('\nCumulative % of annual total by end of month (10-year average):');
  let cumul = 0;
  const totalAvg = Object.values(tenYearMonthly).reduce((s, v) => s + v, 0) / 10;
  for (const m of months) {
    cumul += tenYearMonthly[m] / 10;
    console.log(`  End ${monthNames[m-1]}: ${(cumul / totalAvg * 100).toFixed(1)}%`);
  }

  // ── 2. YTD as of 5 August comparison ──
  console.log('\n═══ 2. YEAR-TO-DATE AS OF 5 AUGUST ═══\n');

  // For each year, sum Highland ha where firedate <= Aug 5 of that year
  const augCutoff = (year) => new Date(`${year}-08-05T23:59:59Z`);

  const ytdByYear = {};
  for (const y of years) {
    const cutoff = augCutoff(y);
    const ytd = allFires
      .filter(f => f.year === y && new Date(f.firedate) <= cutoff)
      .reduce((s, f) => s + f.highlandHa, 0);
    ytdByYear[y] = Math.round(ytd);
  }

  console.log('Year | YTD to 5 Aug (ha)');
  const sorted = Object.entries(ytdByYear).sort((a, b) => b[1] - a[1]);
  for (const [y, ha] of sorted) {
    const marker = +y === 2026 ? ' ◄ 2026' : '';
    console.log(`${y} | ${ha.toString().padStart(7)}${marker}`);
  }
  const rank2026 = sorted.findIndex(([y]) => +y === 2026) + 1;
  console.log(`\n2026 ranks #${rank2026} of ${sorted.length} on a YTD-to-5-August basis.`);

  // Share of typical year burned by 5 Aug
  const avgAnnual = totalAvg;
  const avgYtdAug5 = Object.entries(ytdByYear).filter(([y]) => +y <= 2025).reduce((s, [, v]) => s + v, 0) / 10;
  console.log(`Average YTD to 5 Aug (2016-2025): ${Math.round(avgYtdAug5)} ha`);
  console.log(`Average full year (2016-2025): ${Math.round(avgAnnual)} ha`);
  console.log(`Typical share burned by 5 Aug: ${(avgYtdAug5 / avgAnnual * 100).toFixed(1)}%`);

  // ── 3. Top 10 Highland fires ──
  console.log('\n═══ 3. TEN LARGEST HIGHLAND FIRE PERIMETERS 2016-2026 ═══\n');

  const top10 = [...allFires].sort((a, b) => b.highlandHa - a.highlandHa).slice(0, 10);
  console.log('Rank | Year | Date       | Highland ha | EFFIS ha | ID     | Location');
  for (let i = 0; i < top10.length; i++) {
    const f = top10[i];
    const dateStr = f.firedate.substring(0, 10);
    console.log(`  ${(i+1).toString().padStart(2)} | ${f.year} | ${dateStr} | ${Math.round(f.highlandHa).toString().padStart(7)}    | ${Math.round(f.effisHa).toString().padStart(7)} | ${f.id.padStart(6)} | ${f.province} / ${f.commune}`);
  }

  // ── 4. Rolling two-year totals ──
  console.log('\n═══ 4. ROLLING TWO-YEAR HIGHLAND TOTALS ═══\n');

  const annualTotals = {};
  for (const y of years) {
    annualTotals[y] = allFires.filter(f => f.year === y).reduce((s, f) => s + f.highlandHa, 0);
  }

  console.log('Period    | Total ha');
  for (let i = 0; i < years.length - 1; i++) {
    const y1 = years[i], y2 = years[i + 1];
    const label = y2 === 2026 ? `${y1}-${y2}*` : `${y1}-${y2}`;
    const total = Math.round(annualTotals[y1] + annualTotals[y2]);
    console.log(`${label.padEnd(10)}| ${total.toString().padStart(7)}`);
  }
  console.log('* 2026 is season to date (5 August)');
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });

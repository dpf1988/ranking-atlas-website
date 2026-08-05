#!/usr/bin/env node
/**
 * cairngorms-analysis.mjs
 *
 * Cairngorms National Park fire perimeter analysis.
 * Boundary: ScotGov ProtectedSites WFS, PS:CairngormsNationalPark (post-2010, ~4,528 km²)
 */

import { intersect } from '@turf/intersect';
import { simplify } from '@turf/simplify';
import { bbox } from '@turf/bbox';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import proj4 from 'proj4';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BNG = '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +units=m +no_defs';
const WGS84 = 'EPSG:4326';
const EFFIS_BASE = 'https://maps.effis.emergency.copernicus.eu/effis';
const UK_BBOX = '49.5,-8.5,62.0,2.0,urn:ogc:def:crs:EPSG::4326';
const PARK_AREA_KM2 = 4528; // official post-2010

async function fetchJson(url, label, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(120_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw new Error(`${label}: failed (${err.message})`);
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
  // 1. Load boundary
  console.log('Loading Cairngorms National Park boundary...');
  const parkGeo = JSON.parse(readFileSync(join(__dirname, 'cairngorms.geojson'), 'utf8'));
  // WFS 2.0.0 returns EPSG:4326 in [lat, lon] order — swap to [lon, lat] for GeoJSON
  function swapCoords(coords) {
    if (typeof coords[0] === 'number') return [coords[1], coords[0]];
    return coords.map(swapCoords);
  }
  const parkRaw = parkGeo.features[0];
  parkRaw.geometry.coordinates = swapCoords(parkRaw.geometry.coordinates);
  const park = simplify(parkRaw, { tolerance: 0.005, highQuality: true });

  // Verify area in BNG
  const parkAreaHa = areaBNG(park);
  const parkAreaKm2 = parkAreaHa / 100;
  console.log(`Park area (BNG): ${parkAreaKm2.toFixed(0)} km² (expected ~${PARK_AREA_KM2} km²)`);
  if (parkAreaKm2 < 4000 || parkAreaKm2 > 5000) {
    console.error('STOP: park area out of range. May have wrong boundary.');
    process.exit(1);
  }

  const parkBbox = bbox(park);
  console.log(`Park bbox: [${parkBbox.map(n => n.toFixed(2))}]\n`);

  // 2. Intersect every UK fire with park
  const years = [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026];
  const allFires = [];

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
      if (!bboxOverlaps(fireBbox, parkBbox)) continue;

      const parkHa = intersectedAreaHa(fire, park);
      if (parkHa <= 0) continue;

      allFires.push({
        year,
        firedate: fire.properties?.FIREDATE || '',
        parkHa: Math.round(parkHa * 10) / 10,
        effisHa: parseFloat(fire.properties?.AREA_HA || 0),
        id: fire.properties?.id,
        province: fire.properties?.PROVINCE || '',
        commune: fire.properties?.COMMUNE || '',
      });
      count++;
    }
    console.log(`  ${year}: ${count} park fires (${((Date.now()-t0)/1000).toFixed(1)}s)`);
  }

  // 3. Annual summary
  console.log('\n═══ ANNUAL BURNED AREA INSIDE CAIRNGORMS NATIONAL PARK ═══\n');
  console.log('Year | Park ha | Fires | % of park area | Cumul ha | Cumul % of park');
  let cumul = 0;
  const annualPark = {};
  for (const y of years) {
    const yFires = allFires.filter(f => f.year === y);
    const ha = yFires.reduce((s, f) => s + f.parkHa, 0);
    annualPark[y] = Math.round(ha);
    cumul += ha;
    const pctYear = (ha / (PARK_AREA_KM2 * 100) * 100).toFixed(3);
    const pctCumul = (cumul / (PARK_AREA_KM2 * 100) * 100).toFixed(3);
    console.log(`${y} | ${Math.round(ha).toString().padStart(7)} | ${yFires.length.toString().padStart(5)} | ${pctYear.padStart(8)}% | ${Math.round(cumul).toString().padStart(8)} | ${pctCumul}%`);
  }

  // 4. Every fire inside the park, sorted by park area
  console.log('\n═══ ALL FIRE PERIMETERS INTERSECTING THE PARK ═══\n');
  const sorted = [...allFires].sort((a, b) => b.parkHa - a.parkHa);
  console.log('Rank | Year | Date       | Park ha | EFFIS ha | ID     | Location');
  sorted.forEach((f, i) => {
    console.log(`  ${(i+1).toString().padStart(2)} | ${f.year} | ${f.firedate.substring(0,10)} | ${Math.round(f.parkHa).toString().padStart(7)} | ${Math.round(f.effisHa).toString().padStart(8)} | ${f.id.toString().padStart(6)} | ${f.province} / ${f.commune}`);
  });

  // 5. The 2026 Cairngorms fire specifically
  const cairn2026 = allFires.filter(f => f.year === 2026 && f.parkHa > 100);
  console.log('\n═══ 2026 CAIRNGORMS FIRE ═══');
  cairn2026.forEach(f => {
    console.log(`  id=${f.id} | ${f.firedate} | EFFIS=${f.effisHa} ha | Park=${Math.round(f.parkHa)} ha | ${f.commune}`);
  });

  // 6. Fires above 200 ha by year
  console.log('\n═══ FIRES >200 ha INSIDE PARK, BY YEAR ═══\n');
  for (const y of years) {
    const big = allFires.filter(f => f.year === y && f.parkHa >= 200);
    console.log(`${y}: ${big.length} fires above 200 ha${big.length > 0 ? ' — ' + big.map(f => Math.round(f.parkHa) + ' ha').join(', ') : ''}`);
  }

  // 7. Direct answer
  console.log('\n═══ ANSWER: LARGEST FIRE INSIDE THE PARK ═══');
  if (sorted.length > 0) {
    console.log(`#1: ${sorted[0].year} ${sorted[0].firedate.substring(0,10)} — ${Math.round(sorted[0].parkHa)} ha (EFFIS ${Math.round(sorted[0].effisHa)} ha) — ${sorted[0].commune}`);
    if (sorted.length > 1) console.log(`#2: ${sorted[1].year} ${sorted[1].firedate.substring(0,10)} — ${Math.round(sorted[1].parkHa)} ha`);
    if (sorted.length > 2) console.log(`#3: ${sorted[2].year} ${sorted[2].firedate.substring(0,10)} — ${Math.round(sorted[2].parkHa)} ha`);
  }
  console.log(`\nTotal fires inside park 2016-2026: ${allFires.length}`);
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });

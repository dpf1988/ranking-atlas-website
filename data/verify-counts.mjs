#!/usr/bin/env node
/**
 * verify-counts.mjs — Verify fire counts: distinct IDs vs geometry parts
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
const ONS_BASE = 'https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services';

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

function swapCoords(coords) {
  if (typeof coords[0] === 'number') return [coords[1], coords[0]];
  return coords.map(swapCoords);
}

function bboxOverlaps(a, b) { return !(a[2] < b[0] || a[0] > b[2] || a[3] < b[1] || a[1] > b[3]); }

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

function countGeomParts(geom) {
  if (!geom) return 0;
  if (geom.type === 'MultiPolygon') return geom.coordinates.length;
  if (geom.type === 'Polygon') return 1;
  return 1;
}

function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

async function main() {
  // Load boundaries
  console.log('Loading boundaries...');

  // Cairngorms
  const parkGeo = JSON.parse(readFileSync(join(__dirname, 'cairngorms.geojson'), 'utf8'));
  const parkRaw = parkGeo.features[0];
  parkRaw.geometry.coordinates = swapCoords(parkRaw.geometry.coordinates);
  const park = simplify(parkRaw, { tolerance: 0.005, highQuality: true });
  const parkBbox = bbox(park);

  // Highland
  const highGeo = await fetchJson(
    `${ONS_BASE}/LAD_MAY_2025_UK_BGC_V2/FeatureServer/0/query?where=LAD25NM%3D%27Highland%27&outFields=LAD25CD,LAD25NM&outSR=4326&f=geojson`,
    'Highland'
  );
  const highland = simplify(highGeo.features[0], { tolerance: 0.01, highQuality: true });
  const highBbox = bbox(highland);

  console.log('Boundaries loaded.\n');

  const years = [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026];

  // ═══ 1. CAIRNGORMS PARK: ID vs parts analysis for 2025 and 2026 ═══
  console.log('═══ 1. CAIRNGORMS PARK — DISTINCT IDs vs FEATURE COUNTS ═══\n');

  for (const year of [2025, 2026]) {
    const layer = year === 2026 ? 'modis.ba.poly.season' : `modis.ba.poly.${year}`;
    const url = `${EFFIS_BASE}?service=WFS&version=2.0.0&request=GetFeature&typeName=ms:${layer}&outputFormat=application/json;%20subtype=geojson&count=5000&BBOX=${UK_BBOX}`;
    console.log(`Fetching ${layer}...`);
    const geo = await fetchJson(url, layer);
    const ukFires = (geo.features || []).filter(f => f.properties?.COUNTRY === 'UK');

    // Find all that intersect park
    const parkHits = [];
    for (const fire of ukFires) {
      let fb; try { fb = bbox(fire); } catch { continue; }
      if (!bboxOverlaps(fb, parkBbox)) continue;
      const parkHa = intersectedAreaHa(fire, park);
      if (parkHa <= 0) continue;
      parkHits.push({
        id: fire.properties?.id,
        effisHa: parseFloat(fire.properties?.AREA_HA || 0),
        parkHa,
        parts: countGeomParts(fire.geometry),
        firedate: fire.properties?.FIREDATE,
      });
    }

    // Distinct IDs
    const idMap = new Map();
    for (const h of parkHits) {
      if (!idMap.has(h.id)) idMap.set(h.id, { effisHa: h.effisHa, parkHa: 0, parts: h.parts, firedate: h.firedate, featureCount: 0 });
      const rec = idMap.get(h.id);
      rec.parkHa += h.parkHa;
      rec.featureCount++;
    }

    const distinctIds = idMap.size;
    const featureCount = parkHits.length;
    const totalParts = parkHits.reduce((s, h) => s + h.parts, 0);
    const effisAreas = [...idMap.values()].map(r => r.effisHa);
    const under30 = effisAreas.filter(a => a < 30);

    console.log(`\n${year}:`);
    console.log(`  Feature records intersecting park: ${featureCount}`);
    console.log(`  Distinct EFFIS IDs: ${distinctIds}`);
    console.log(`  Duplicate IDs (same ID, multiple features): ${featureCount - distinctIds}`);
    console.log(`  Total geometry parts across features: ${totalParts}`);
    console.log(`  EFFIS AREA_HA distribution (full fire, not clipped):`);
    console.log(`    Min: ${Math.min(...effisAreas)} ha`);
    console.log(`    Median: ${median(effisAreas).toFixed(0)} ha`);
    console.log(`    Max: ${Math.max(...effisAreas)} ha`);
    console.log(`    Under 30 ha (full extent): ${under30.length} of ${distinctIds}`);

    if (under30.length > 0) {
      console.log(`  Records under 30 ha (full EFFIS area):`);
      for (const [id, rec] of idMap) {
        if (rec.effisHa < 30) {
          console.log(`    id=${id} | EFFIS=${rec.effisHa} ha | park=${Math.round(rec.parkHa)} ha | ${rec.firedate}`);
        }
      }
    }

    // Check for duplicate IDs
    const dupes = [...idMap.entries()].filter(([, v]) => v.featureCount > 1);
    if (dupes.length > 0) {
      console.log(`  Duplicate-ID records (counted >1 time):`);
      for (const [id, rec] of dupes) {
        console.log(`    id=${id} | counted ${rec.featureCount}x | EFFIS=${rec.effisHa} ha`);
      }
    }
  }

  // ═══ 2. Verify 2025-10-09 Aberdeenshire record ═══
  console.log('\n═══ 2. VERIFY 2025-10-09 RECORD (144 ha, Aberdeenshire) ═══\n');
  {
    const layer = 'modis.ba.poly.2025';
    const url = `${EFFIS_BASE}?service=WFS&version=2.0.0&request=GetFeature&typeName=ms:${layer}&outputFormat=application/json;%20subtype=geojson&count=5000&BBOX=${UK_BBOX}`;
    const geo = await fetchJson(url, layer);
    const target = geo.features.find(f => f.properties?.id === '283710');
    if (target) {
      const p = target.properties;
      console.log(`  ID: ${p.id}`);
      console.log(`  FIREDATE: ${p.FIREDATE}`);
      console.log(`  FINALDATE: ${p.FINALDATE}`);
      console.log(`  LASTUPDATE: ${p.LASTUPDATE}`);
      console.log(`  COUNTRY: ${p.COUNTRY}`);
      console.log(`  PROVINCE: ${p.PROVINCE}`);
      console.log(`  COMMUNE: ${p.COMMUNE}`);
      console.log(`  AREA_HA: ${p.AREA_HA}`);
      console.log(`  Layer: ${layer}`);
    } else {
      console.log('  Record 283710 NOT FOUND in modis.ba.poly.2025');
    }
  }

  // ═══ 3. HIGHLAND — DISTINCT IDs vs FEATURE COUNTS, ALL YEARS ═══
  console.log('\n═══ 3. HIGHLAND — DISTINCT IDs vs FEATURE COUNTS, ALL YEARS ═══\n');
  console.log('Year | Features | Distinct IDs | Duplicates | Under 30ha');

  for (const year of years) {
    const layer = year === 2026 ? 'modis.ba.poly.season' : `modis.ba.poly.${year}`;
    const url = `${EFFIS_BASE}?service=WFS&version=2.0.0&request=GetFeature&typeName=ms:${layer}&outputFormat=application/json;%20subtype=geojson&count=5000&BBOX=${UK_BBOX}`;
    const geo = await fetchJson(url, layer);
    const ukFires = (geo.features || []).filter(f => f.properties?.COUNTRY === 'UK');

    const highHits = [];
    for (const fire of ukFires) {
      let fb; try { fb = bbox(fire); } catch { continue; }
      if (!bboxOverlaps(fb, highBbox)) continue;
      const hHa = intersectedAreaHa(fire, highland);
      if (hHa <= 0) continue;
      highHits.push({ id: fire.properties?.id, effisHa: parseFloat(fire.properties?.AREA_HA || 0), highHa: hHa });
    }

    const idSet = new Map();
    for (const h of highHits) {
      if (!idSet.has(h.id)) idSet.set(h.id, { effisHa: h.effisHa, count: 0 });
      idSet.get(h.id).count++;
    }

    const distinctIds = idSet.size;
    const featureCount = highHits.length;
    const dupes = featureCount - distinctIds;
    const under30 = [...idSet.values()].filter(r => r.effisHa < 30).length;

    console.log(`${year} | ${featureCount.toString().padStart(8)} | ${distinctIds.toString().padStart(12)} | ${dupes.toString().padStart(10)} | ${under30.toString().padStart(10)}`);
  }
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });

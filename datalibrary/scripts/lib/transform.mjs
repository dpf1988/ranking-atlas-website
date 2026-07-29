// Shared transform logic for all Data Library fetchers.
// Takes a flat list of { iso3, iso2, name, region, incomeLevel, year, value }
// observations and produces the data.json + data.csv contract.

/**
 * Build the full dataset object from raw observations.
 *
 * @param {Object} opts
 * @param {Array<{iso3:string, iso2:string, name:string, region:string, incomeLevel:string|null, year:number, value:number|null}>} opts.observations
 * @param {{code:string, name:string, unit:string}} opts.indicator
 * @param {{name:string, url:string}} opts.source
 * @param {string} opts.license
 * @returns {{ dataset: Object, csv: string }}
 */
export function buildDataset({ observations, indicator, source, license }) {
  // ── 1. Reshape into per-country annual series ───────────────────────────
  const years = new Set();
  const countryMeta = new Map(); // iso3 -> { iso2, name, region, incomeLevel }
  const byCountry = new Map();  // iso3 -> Map<year, value>
  for (const o of observations) {
    if (!o.iso3) continue;
    if (o.value !== null && o.value !== undefined && Number.isFinite(o.value)) years.add(o.year);
    if (!countryMeta.has(o.iso3)) {
      countryMeta.set(o.iso3, {
        iso2: o.iso2 || '',
        name: o.name,
        region: o.region || '',
        incomeLevel: o.incomeLevel || null,
      });
    }
    if (!byCountry.has(o.iso3)) byCountry.set(o.iso3, new Map());
    byCountry.get(o.iso3).set(o.year, o.value);
  }
  const yearList = [...years].sort((a, b) => a - b);
  const latestYear = yearList[yearList.length - 1];
  const firstYear = yearList[0];

  // ── 2. Per-year dense ranks within countries that have a latest-year value
  const panelIso3s = new Set();
  for (const [iso3, series] of byCountry) {
    const v = series.get(latestYear);
    if (v !== null && v !== undefined && Number.isFinite(v)) panelIso3s.add(iso3);
  }

  const ranksByYear = new Map();
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

  // ── 3. Build country objects ────────────────────────────────────────────
  const countries = [];
  for (const [iso3, series] of byCountry) {
    const meta = countryMeta.get(iso3);
    const values = yearList.map(y => (series.get(y) ?? null));
    const ranks = yearList.map(y => (ranksByYear.get(y)?.get(iso3) ?? null));
    const latestValue = values[values.length - 1];
    const latestRank = ranks[ranks.length - 1];
    if (latestValue === null || latestValue === undefined) continue;
    const prev10Idx = yearList.indexOf(latestYear - 10);
    const rankPrev10 = prev10Idx >= 0 ? ranks[prev10Idx] : null;
    const delta10y = rankPrev10 && latestRank ? rankPrev10 - latestRank : null;
    const rankFirstYear = ranks[0] ?? null;
    const deltaFirstYear = rankFirstYear && latestRank ? rankFirstYear - latestRank : null;
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
      rankFirstYear,
      rank2000,
      rankPrev10,
      delta10y,
      deltaFirstYear,
      delta2000,
      values,
      ranks,
    });
  }
  countries.sort((a, b) => a.latestRank - b.latestRank);

  // ── 4. Headline metrics ─────────────────────────────────────────────────
  const medianFn = (nums) => {
    const s = nums.filter(v => v !== null && Number.isFinite(v)).sort((a, b) => a - b);
    if (!s.length) return null;
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  };
  const latestValues = countries.map(c => c.latestValue);
  const firstYearValues = countries.map(c => c.values[0]);
  const reportingEntitiesFirstYear = firstYearValues.filter(v => v !== null).length;

  const top10LatestIso3s = new Set(countries.filter(c => c.latestRank <= 10).map(c => c.iso3));
  const top10FirstYearIso3s = new Set(
    countries.filter(c => c.rankFirstYear !== null && c.rankFirstYear <= 10).map(c => c.iso3)
  );
  const top10Overlap = [...top10LatestIso3s].filter(iso => top10FirstYearIso3s.has(iso));
  const top10OverlapNames = top10Overlap.map(iso => countries.find(c => c.iso3 === iso).name);

  const top10Current = countries.slice(0, 10);
  const withRankFirstYear = top10Current.filter(c => c.rankFirstYear !== null);
  const largestClimber = withRankFirstYear.reduce((best, c) => (
    best === null || (c.rankFirstYear - c.latestRank) > (best.rankFirstYear - best.latestRank) ? c : best
  ), null);

  const top20 = countries.slice(0, 20).filter(c => c.rank2000 !== null);
  const largestGainer = top20.reduce((best, c) => (
    best === null || (c.rank2000 - c.latestRank) > (best.rank2000 - best.latestRank) ? c : best
  ), null);

  const top40 = countries.slice(0, 40).filter(c => c.delta10y !== null);
  const largestFaller = top40.reduce((best, c) => (
    best === null || c.delta10y < best.delta10y ? c : best
  ), null);

  const metrics = {
    latestYear,
    firstYear,
    prevDecadeYear: latestYear - 10,
    reportingEconomiesLatest: countries.length,
    reportingEntitiesFirstYear,
    leader: { iso3: countries[0].iso3, name: countries[0].name, value: countries[0].latestValue },
    top3: countries.slice(0, 3).map(c => ({ iso3: c.iso3, name: c.name, value: c.latestValue })),
    top14: countries.slice(0, 14).map(c => ({
      iso3: c.iso3, iso2: c.iso2, name: c.name, latestValue: c.latestValue, latestRank: c.latestRank,
    })),
    median: {
      latest: Math.round(medianFn(latestValues)),
      firstYear: Math.round(medianFn(firstYearValues)),
    },
    top10OverlapFirstYearToLatest: top10Overlap.length,
    top10OverlapFirstYearToLatestNames: top10OverlapNames,
    largestClimberInTop10VsFirstYear: largestClimber ? {
      iso3: largestClimber.iso3, name: largestClimber.name,
      rankFirstYear: largestClimber.rankFirstYear, latestRank: largestClimber.latestRank,
    } : null,
    largestGainSince2000InTop20: largestGainer ? {
      iso3: largestGainer.iso3, name: largestGainer.name,
      rank2000: largestGainer.rank2000, latestRank: largestGainer.latestRank,
      latestValue: largestGainer.latestValue,
      gain: largestGainer.rank2000 - largestGainer.latestRank,
    } : null,
    largestFaller10yInTop40: largestFaller ? {
      iso3: largestFaller.iso3, name: largestFaller.name,
      latestRank: largestFaller.latestRank, delta10y: largestFaller.delta10y,
    } : null,
  };

  // ── 5. Assemble dataset ─────────────────────────────────────────────────
  const dataset = {
    indicator,
    source,
    license,
    temporalCoverage: { startYear: firstYear, endYear: latestYear },
    retrievedAt: new Date().toISOString().slice(0, 10),
    years: yearList,
    metrics,
    countries,
  };

  // ── 6. CSV: long format, one row per country-year ───────────────────────
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

  return { dataset, csv };
}

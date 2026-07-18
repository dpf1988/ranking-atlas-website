// Local Netlify build plugin: submits all sitemap URLs to IndexNow after each successful deploy.
// Bing, Yandex, Seznam, Naver pick these up. Google ignores IndexNow.

const HOST = "ranking-atlas.com";
const KEY = "00001091a3964743b545462e5eb728ac";
const SITEMAP_INDEX = `https://${HOST}/sitemap-index.xml`;

async function getSitemapUrls(sitemapUrl) {
  const res = await fetch(sitemapUrl);
  if (!res.ok) throw new Error(`Failed to fetch ${sitemapUrl}: ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());

  // If this is a sitemap index, recurse into child sitemaps
  if (xml.includes("<sitemapindex")) {
    const nested = await Promise.all(locs.map(getSitemapUrls));
    return nested.flat();
  }
  return locs;
}

export const onSuccess = async ({ utils }) => {
  try {
    const urls = await getSitemapUrls(SITEMAP_INDEX);
    if (urls.length === 0) {
      console.log("IndexNow: no URLs found in sitemap, skipping.");
      return;
    }

    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `https://${HOST}/${KEY}.txt`,
        urlList: urls,
      }),
    });

    // 200 = accepted, 202 = accepted (key validation pending). Both fine.
    if (res.status === 200 || res.status === 202) {
      console.log(`IndexNow: submitted ${urls.length} URLs (HTTP ${res.status}).`);
    } else {
      console.warn(`IndexNow: unexpected response HTTP ${res.status}.`);
    }
  } catch (err) {
    // Never fail the deploy over an IndexNow ping
    console.warn(`IndexNow: submission skipped — ${err.message}`);
  }
};

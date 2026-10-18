import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { updateIndexHtml } from './build-html.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesPath = path.join(rootDir, 'data', 'articles.json');

const DEFAULT_PROFILE = 'mustaphaidrissuleiman';
const profile = process.env.LINKEDIN_PROFILE || DEFAULT_PROFILE;
const cookie = process.env.LINKEDIN_COOKIE || '';
const rssUrl = process.env.LINKEDIN_RSS_URL || '';

/**
 * Format a Date object or timestamp into "Mon YYYY" and "YYYY-MM-DD"
 */
function formatDate(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  const validDate = isNaN(d.getTime()) ? new Date() : d;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthStr = months[validDate.getMonth()];
  const yearStr = validDate.getFullYear();
  const dayStr = String(validDate.getDate()).padStart(2, '0');
  const monthNum = String(validDate.getMonth() + 1).padStart(2, '0');

  return {
    display: `${monthStr} ${yearStr}`,
    iso: `${yearStr}-${monthNum}-${dayStr}`
  };
}

/**
 * Slugify a title to generate a stable ID
 */
function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'article';
}

/**
 * Strategy 1: Fetch via authenticated LinkedIn Voyager API
 */
async function fetchViaVoyager(userProfile, sessionCookie) {
  console.log(`[Sync] Attempting authenticated Voyager API query for "${userProfile}"...`);
  const csrfToken = 'ajax:8473920194829104';
  const voyagerUrl = `https://www.linkedin.com/voyager/api/identity/profileUpdatesV2?accountVanity=${encodeURIComponent(userProfile)}&count=20&includeLongTermHistory=true&moduleKey=creator_articles%3Adesktop&q=memberShareFeed`;

  const headers = {
    'Cookie': `li_at=${sessionCookie}; JSESSIONID="${csrfToken}"`,
    'Csrf-Token': csrfToken,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/vnd.linkedin.normalized+json+2.1',
    'x-li-lang': 'en_US',
    'x-restli-protocol-version': '2.0.0'
  };

  const response = await fetch(voyagerUrl, { headers });

  if (!response.ok) {
    throw new Error(`Voyager API returned HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  const articles = [];

  const elements = data.elements || [];
  const included = data.included || [];

  for (const item of elements) {
    try {
      // Look for article component or navigation URLs
      const updateData = item['*updateMetadata'] || item;
      const commentary = item.commentary?.text?.text || '';
      
      // Check included entities for articles
      const articleComponent = included.find(inc => 
        inc.$type?.includes('ArticleComponent') || 
        inc.navigationUrl?.includes('/pulse/') ||
        inc.articleUrn
      );

      const title = articleComponent?.title?.text || commentary.slice(0, 80) || 'LinkedIn Monograph';
      const url = articleComponent?.navigationUrl || `https://www.linkedin.com/in/${userProfile}/`;
      const dateMeta = formatDate(item.firstPublishedAt || item.publishedAt || item.created?.time);
      const summary = articleComponent?.subtitle?.text || commentary.slice(0, 160) || '';

      articles.push({
        id: slugify(title),
        title,
        url,
        date: dateMeta.display,
        isoDate: dateMeta.iso,
        category: 'Article · LinkedIn',
        summary,
        source: 'linkedin'
      });
    } catch {
      // Skip malformed individual entries
    }
  }

  return articles;
}

/**
 * Strategy 2: Fetch via RSS / Atom feed bridge (if configured)
 */
async function fetchViaRss(feedUrl) {
  console.log(`[Sync] Fetching from RSS feed: ${feedUrl}...`);
  const response = await fetch(feedUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; MustaphaPortfolioBot/1.0)'
    }
  });

  if (!response.ok) {
    throw new Error(`RSS feed returned HTTP ${response.status}`);
  }

  const xmlText = await response.text();
  const articles = [];

  // Lightweight XML item parser for standard RSS 2.0 / Atom feeds
  const itemMatches = xmlText.match(/<item[\s\S]*?<\/item>/gi) || xmlText.match(/<entry[\s\S]*?<\/entry>/gi) || [];

  for (const itemXml of itemMatches) {
    const titleMatch = itemXml.match(/<title(?:[^>]*)>([\s\S]*?)<\/title>/i);
    const linkMatch = itemXml.match(/<link(?:[^>]*)>(?:<!\[CDATA\[)?(https?:\/\/[^\s<\]]+)/i) || 
                      itemXml.match(/<link[^>]+href="([^"]+)"/i);
    const pubDateMatch = itemXml.match(/<(?:pubDate|published|updated)>([\s\S]*?)<\//i);
    const descMatch = itemXml.match(/<(?:description|summary|content)(?:[^>]*)>([\s\S]*?)<\//i);

    if (titleMatch) {
      const cleanTitle = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
      const rawLink = linkMatch ? linkMatch[1].trim() : `https://www.linkedin.com/in/${profile}/`;
      const cleanDate = pubDateMatch ? formatDate(pubDateMatch[1].trim()) : formatDate(new Date());
      const rawDesc = descMatch ? descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '').trim() : '';
      const cleanDesc = rawDesc.slice(0, 200);

      articles.push({
        id: slugify(cleanTitle),
        title: cleanTitle,
        url: rawLink,
        date: cleanDate.display,
        isoDate: cleanDate.iso,
        category: 'Article · LinkedIn',
        summary: cleanDesc,
        source: 'linkedin-rss'
      });
    }
  }

  return articles;
}

/**
 * Strategy 3: Public profile page fetch with browser headers
 */
async function fetchViaPublicPage(userProfile) {
  console.log(`[Sync] Attempting public scrape for "https://www.linkedin.com/in/${userProfile}/recent-activity/articles/"...`);
  const targetUrl = `https://www.linkedin.com/in/${userProfile}/recent-activity/articles/`;

  const response = await fetch(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    },
    redirect: 'follow'
  });

  if (response.status === 999 || response.url.includes('/checkpoint/') || response.url.includes('/authwall')) {
    console.warn(`[Sync] LinkedIn returned HTTP ${response.status} or redirected to login/authwall.`);
    console.warn(`[Sync] Note: LinkedIn enforces bot protection on datacenter requests without a session cookie.`);
    console.warn(`[Sync] To enable automated background scraping, add your LINKEDIN_COOKIE (li_at) to GitHub Secrets.`);
    return [];
  }

  if (!response.ok) {
    console.warn(`[Sync] Public request returned HTTP ${response.status}`);
    return [];
  }

  const html = await response.text();
  const articles = [];

  // Search for Pulse article links or article cards in public page HTML
  const pulseLinkRegex = /href="(https:\/\/[a-z]{2,3}\.linkedin\.com\/pulse\/[^"?]+)"[^>]*>([^<]+)<\/a>/gi;
  let match;

  while ((match = pulseLinkRegex.exec(html)) !== null) {
    const rawUrl = match[1];
    const rawTitle = match[2].trim();
    if (rawTitle && !articles.some(a => a.url === rawUrl)) {
      const dateMeta = formatDate(new Date());
      articles.push({
        id: slugify(rawTitle),
        title: rawTitle,
        url: rawUrl,
        date: dateMeta.display,
        isoDate: dateMeta.iso,
        category: 'Article · LinkedIn',
        summary: 'Published on LinkedIn Pulse.',
        source: 'linkedin-public'
      });
    }
  }

  return articles;
}

/**
 * Main Sync Routine
 */
export async function syncArticles() {
  console.log('----------------------------------------------------');
  console.log(`[Sync] Starting LinkedIn articles sync for @${profile}`);
  console.log('----------------------------------------------------');

  let currentArticles = [];
  if (fs.existsSync(articlesPath)) {
    try {
      currentArticles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
    } catch (e) {
      console.warn('[Sync] Could not parse existing articles.json, initializing empty list.');
      currentArticles = [];
    }
  }

  let scrapedArticles = [];

  // Try Strategy 1: Authenticated Voyager API if LINKEDIN_COOKIE is set
  if (cookie) {
    try {
      scrapedArticles = await fetchViaVoyager(profile, cookie);
      console.log(`[Sync] Voyager API successfully retrieved ${scrapedArticles.length} items.`);
    } catch (err) {
      console.warn(`[Sync] Voyager query failed: ${err.message}`);
    }
  }

  // Try Strategy 2: RSS feed if provided and no articles found yet
  if (scrapedArticles.length === 0 && rssUrl) {
    try {
      scrapedArticles = await fetchViaRss(rssUrl);
      console.log(`[Sync] RSS feed successfully retrieved ${scrapedArticles.length} items.`);
    } catch (err) {
      console.warn(`[Sync] RSS fetch failed: ${err.message}`);
    }
  }

  // Try Strategy 3: Public page scraping
  if (scrapedArticles.length === 0) {
    try {
      scrapedArticles = await fetchViaPublicPage(profile);
      if (scrapedArticles.length > 0) {
        console.log(`[Sync] Public scrape found ${scrapedArticles.length} items.`);
      }
    } catch (err) {
      console.warn(`[Sync] Public scrape failed: ${err.message}`);
    }
  }

  // Merge & Deduplicate
  let addedCount = 0;
  let updatedCount = 0;

  for (const scraped of scrapedArticles) {
    const existingIndex = currentArticles.findIndex(
      (a) => a.url === scraped.url || slugify(a.title) === slugify(scraped.title)
    );

    if (existingIndex >= 0) {
      // Update article URL if previous was a generic profile link
      if (currentArticles[existingIndex].url.includes('/in/') && !scraped.url.includes('/in/')) {
        currentArticles[existingIndex].url = scraped.url;
        updatedCount++;
      }
    } else {
      currentArticles.unshift(scraped);
      addedCount++;
    }
  }

  // Sort chronologically (newest first)
  currentArticles.sort((a, b) => {
    if (a.isoDate && b.isoDate) {
      return b.isoDate.localeCompare(a.isoDate);
    }
    return 0;
  });

  // Save back to data/articles.json
  fs.mkdirSync(path.dirname(articlesPath), { recursive: true });
  fs.writeFileSync(articlesPath, JSON.stringify(currentArticles, null, 2) + '\n', 'utf8');

  console.log(`[Sync] Summary: ${addedCount} new article(s) added, ${updatedCount} updated. Total: ${currentArticles.length}`);

  // Re-build index.html
  updateIndexHtml();
  console.log('[Sync] Synchronization complete!');
}

if (process.argv[1] === __filename) {
  syncArticles().catch((err) => {
    console.error('[Sync] Fatal error:', err);
    process.exit(1);
  });
}

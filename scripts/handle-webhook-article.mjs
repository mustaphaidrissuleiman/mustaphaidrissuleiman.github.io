import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { updateIndexHtml } from './build-html.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesPath = path.join(rootDir, 'data', 'articles.json');

/**
 * Clean & slugify string for stable ID
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
 * Format date timestamp into "Mon YYYY" and "YYYY-MM-DD"
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
 * Main Webhook Handler
 */
export async function handleWebhook() {
  console.log('[Webhook] Processing incoming article dispatch...');

  let payload = {};

  if (process.env.CLIENT_PAYLOAD) {
    try {
      payload = typeof process.env.CLIENT_PAYLOAD === 'string'
        ? JSON.parse(process.env.CLIENT_PAYLOAD)
        : process.env.CLIENT_PAYLOAD;
    } catch (err) {
      console.warn('[Webhook] Failed to parse CLIENT_PAYLOAD JSON:', err.message);
    }
  }

  // Fallback to process.argv if called manually
  const rawTitle = payload.title || payload.articleTitle || payload.name || '';
  const rawUrl = payload.url || payload.articleUrl || payload.link || payload.postUrl || '';
  const rawText = payload.text || payload.summary || payload.commentary || payload.description || '';
  const rawDate = payload.date || payload.publishedAt || payload.createdAt || new Date();
  const rawCategory = payload.category || payload.topic || 'Article · LinkedIn';

  if (!rawTitle && !rawText && !rawUrl) {
    console.error('[Webhook] Empty payload received. Expected title/url/summary.');
    process.exit(1);
  }

  // Derive sensible title and summary if raw text was passed
  let title = rawTitle.trim();
  let summary = rawText.trim();

  if (!title && summary) {
    const firstLine = summary.split('\n')[0].trim();
    title = firstLine.length > 80 ? firstLine.slice(0, 77) + '...' : firstLine;
    summary = summary.slice(title.length).trim();
  }

  if (!title) {
    title = 'New LinkedIn Article';
  }

  // Trim summary to ~220 characters max for CV presentation
  if (summary.length > 220) {
    summary = summary.slice(0, 217).trim() + '...';
  }

  const url = rawUrl.trim() || 'https://www.linkedin.com/in/mustaphaidrissuleiman/recent-activity/articles/';
  const dateMeta = formatDate(rawDate);
  const articleId = slugify(title);

  const newArticle = {
    id: articleId,
    title,
    url,
    date: dateMeta.display,
    isoDate: dateMeta.iso,
    category: rawCategory,
    summary,
    source: 'webhook'
  };

  let articles = [];
  if (fs.existsSync(articlesPath)) {
    try {
      articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
    } catch {
      articles = [];
    }
  }

  // Deduplicate by URL or slug
  const existingIdx = articles.findIndex((a) => a.url === url || a.id === articleId || slugify(a.title) === articleId);

  if (existingIdx >= 0) {
    articles[existingIdx] = { ...articles[existingIdx], ...newArticle };
    console.log(`[Webhook] Updated existing article: "${title}"`);
  } else {
    articles.unshift(newArticle);
    console.log(`[Webhook] Added new article: "${title}"`);
  }

  // Sort descending by date
  articles.sort((a, b) => {
    if (a.isoDate && b.isoDate) return b.isoDate.localeCompare(a.isoDate);
    return 0;
  });

  fs.mkdirSync(path.dirname(articlesPath), { recursive: true });
  fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2) + '\n', 'utf8');

  // Re-build index.html
  updateIndexHtml();
  console.log(`[Webhook] Successfully synced "${title}" to articles.json and index.html!`);
}

if (process.argv[1] === __filename) {
  handleWebhook().catch((err) => {
    console.error('[Webhook] Error:', err);
    process.exit(1);
  });
}

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const articlesPath = path.join(rootDir, 'data', 'articles.json');
const htmlPath = path.join(rootDir, 'index.html');

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function generateArticlesHtml(articles) {
  // Sort by isoDate descending if available
  const sorted = [...articles].sort((a, b) => {
    if (a.isoDate && b.isoDate) {
      return b.isoDate.localeCompare(a.isoDate);
    }
    return 0;
  });

  return sorted.map((article) => {
    const date = escapeHtml(article.date || '');
    const title = escapeHtml(article.title || 'Untitled Article');
    const url = escapeHtml(article.url || '#');
    const category = escapeHtml(article.category || 'Article · LinkedIn');
    const summary = escapeHtml(article.summary || '');

    return `          <div class="cv-row">
            <div class="cv-date">${date}</div>
            <div class="cv-detail">
              <div class="cv-item-title">
                <a href="${url}" target="_blank" rel="noopener">${title} <span class="arrow">↗</span></a>
              </div>
              <div class="cv-item-place">${category}</div>
              <p class="cv-item-desc">${summary}</p>
            </div>
          </div>`;
  }).join('\n\n');
}

export function updateIndexHtml() {
  if (!fs.existsSync(articlesPath)) {
    throw new Error(`Articles file not found at ${articlesPath}`);
  }

  const rawArticles = fs.readFileSync(articlesPath, 'utf8');
  const articles = JSON.parse(rawArticles);

  if (!fs.existsSync(htmlPath)) {
    throw new Error(`index.html not found at ${htmlPath}`);
  }

  let html = fs.readFileSync(htmlPath, 'utf8');
  const articlesHtml = generateArticlesHtml(articles);

  const startMarker = '<!-- ARTICLES_START -->';
  const endMarker = '<!-- ARTICLES_END -->';

  if (html.includes(startMarker) && html.includes(endMarker)) {
    const startIndex = html.indexOf(startMarker) + startMarker.length;
    const endIndex = html.indexOf(endMarker);
    html = `${html.slice(0, startIndex)}\n${articlesHtml}\n          ${html.slice(endIndex)}`;
  } else {
    // If markers do not exist yet, inject them cleanly inside the articles cv-list
    const sectionRegex = /(<section class="cv-section" id="articles">[\s\S]*?<div class="cv-list">)([\s\S]*?)(<\/div>\s*<\/section>)/;
    if (!sectionRegex.test(html)) {
      throw new Error('Could not find articles section in index.html');
    }
    html = html.replace(sectionRegex, `$1\n          ${startMarker}\n${articlesHtml}\n          ${endMarker}\n        $3`);
  }

  // Update articles badge count if present
  html = html.replace(/(<span class="tab-badge" id="articlesBadge">)\d+(<\/span>)/, `$1${articles.length}$2`);

  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`Successfully updated index.html with ${articles.length} articles.`);
}

// Allow direct execution
if (process.argv[1] === __filename) {
  try {
    updateIndexHtml();
  } catch (err) {
    console.error('Failed to update index.html:', err);
    process.exit(1);
  }
}

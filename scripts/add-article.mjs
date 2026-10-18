import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import { updateIndexHtml } from './build-html.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const articlesPath = path.join(rootDir, 'data', 'articles.json');

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'article';
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const equalIndex = arg.indexOf('=');
      if (equalIndex > 2) {
        const key = arg.slice(2, equalIndex);
        const val = arg.slice(equalIndex + 1);
        parsed[key] = val;
      } else {
        const key = arg.slice(2);
        const nextVal = args[i + 1];
        if (nextVal && !nextVal.startsWith('--')) {
          parsed[key] = nextVal;
          i++;
        } else {
          parsed[key] = true;
        }
      }
    }
  }
  return parsed;
}

function ask(rl, questionText, defaultVal = '') {
  return new Promise((resolve) => {
    const prompt = defaultVal ? `${questionText} [${defaultVal}]: ` : `${questionText}: `;
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultVal);
    });
  });
}

async function main() {
  const args = parseArgs();

  let title = args.title;
  let url = args.url;
  let date = args.date;
  let category = args.category;
  let summary = args.summary;

  if (!title || !url) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('--- Add New LinkedIn Article ---');
    title = await ask(rl, 'Article Title');
    url = await ask(rl, 'Article URL (e.g. https://www.linkedin.com/pulse/...)');

    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const defaultDate = `${months[now.getMonth()]} ${now.getFullYear()}`;

    date = await ask(rl, 'Display Date', defaultDate);
    category = await ask(rl, 'Category / Subtitle', 'Article · LinkedIn');
    summary = await ask(rl, 'Short Summary / Abstract', '');

    rl.close();
  }

  if (!title || !url) {
    console.error('Error: Article Title and URL are required.');
    process.exit(1);
  }

  let articles = [];
  if (fs.existsSync(articlesPath)) {
    try {
      articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
    } catch {
      articles = [];
    }
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const newArticle = {
    id: slugify(title),
    title,
    url,
    date: date || `${month} ${year}`,
    isoDate: `${year}-${month}-${day}`,
    category: category || 'Article · LinkedIn',
    summary: summary || '',
    source: 'manual'
  };

  // Check if article already exists
  const existingIdx = articles.findIndex((a) => a.url === url || slugify(a.title) === newArticle.id);
  if (existingIdx >= 0) {
    articles[existingIdx] = { ...articles[existingIdx], ...newArticle };
    console.log(`Updated existing article: "${title}"`);
  } else {
    articles.unshift(newArticle);
    console.log(`Added new article: "${title}"`);
  }

  // Sort descending by isoDate
  articles.sort((a, b) => {
    if (a.isoDate && b.isoDate) return b.isoDate.localeCompare(a.isoDate);
    return 0;
  });

  fs.mkdirSync(path.dirname(articlesPath), { recursive: true });
  fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2) + '\n', 'utf8');

  updateIndexHtml();
  console.log('✓ Article saved to data/articles.json and index.html successfully!');
}

main().catch((err) => {
  console.error('Failed to add article:', err);
  process.exit(1);
});

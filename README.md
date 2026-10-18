# Mustapha Idris Suleiman — Personal CV Website

> **Founder & CEO [Herdbase Africa](https://herdbaseafrica.com) · Farmer · AI Researcher · Entrepreneur**

Single-page CV website built with clean typography, dark/light theme toggle, and an editorial Read.cv aesthetic.

## 🚀 Live Website
- **GitHub Pages**: `https://mustaphaidrissuleiman.github.io/`

## 🛠 Tech Stack
- Vanilla HTML5 (semantic structure, accessibility)
- CSS3 (custom CSS variables, dark/light theme, print-ready stylesheet)
- Vanilla JavaScript (theme switcher, clipboard copy utility, WAT real-time clock)

## 🏃 Running Locally
```bash
python3 -m http.server 3005
```
Open [http://localhost:3005](http://localhost:3005) in your browser.

## 📰 LinkedIn Article Synchronization

The site features an automated pipeline that syncs published LinkedIn articles and monographs into `data/articles.json` and updates `index.html`.

### 1. Automated GitHub Actions Workflow
A scheduled workflow runs daily (`.github/workflows/sync-linkedin.yml`):
- Runs every day at 06:00 UTC (and can be manually triggered via **Actions > Sync LinkedIn Articles > Run workflow**).
- Fetches newly published articles, deduplicates them against `data/articles.json`, and rebuilds `index.html`.
- Commits and pushes changes, which automatically deploys the updated site to GitHub Pages via `deploy.yml`.

#### Adding Your LinkedIn Cookie to GitHub Secrets (Recommended)
LinkedIn blocks anonymous datacenter IP requests. To enable fully automated background scraping without login walls:
1. Open LinkedIn in your browser and open **DevTools** (`F12` or `Cmd+Option+I`).
2. Go to **Application** (Chrome/Brave) or **Storage** (Firefox/Safari) > **Cookies** > `https://www.linkedin.com`.
3. Copy the value of the `li_at` cookie.
4. In your GitHub repository, go to **Settings > Secrets and variables > Actions > New repository secret**.
5. Name: `LINKEDIN_COOKIE`, Value: `<paste your li_at cookie>`.
6. *(Optional)* If you publish via a LinkedIn newsletter or RSS feed, you can also add `LINKEDIN_RSS_URL`.

### 2. Local CLI Commands
You can also sync or add articles directly from your local terminal:
```bash
# Sync from LinkedIn right now
npm run sync-articles

# Interactively add a new article or paste a link
npm run add-article

# Directly add via CLI arguments
node scripts/add-article.mjs --title="My New Article" --url="https://www.linkedin.com/pulse/..." --date="Oct 2026" --category="AI & Agriculture · LinkedIn" --summary="Summary of the article."

# Re-inject data/articles.json into index.html
npm run build-articles
```

## 📬 Contact
- **Email**: [mustaphaidrissuleiman@gmail.com](mailto:mustaphaidrissuleiman@gmail.com)
- **Phone**: +234 806 165 1401
- **LinkedIn**: [linkedin.com/in/mustaphaidrissuleiman](https://www.linkedin.com/in/mustaphaidrissuleiman/)
- **X (Twitter)**: [@_mustaphaidris](https://x.com/_mustaphaidris)
- **GitHub**: [@mustaphaidrissuleiman](https://github.com/mustaphaidrissuleiman)


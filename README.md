# Qualcomm News Monitor

Daily Qualcomm news monitoring aggregator from 20+ foreign media sources. Updated automatically at **07:00 CST (UTC+8)** every day.

## Monitoring Dimensions

- **A. Core Businesses** — Semiconductors, wireless, mobile chips, PC chips, automotive, IoT & XR
- **B. IP & Legal** — SEP, patents, litigation, FRAND, regulatory & antitrust
- **C. Growth Areas** — On-device AI, AI PC, robotics, infotainment, XR/spatial computing
- **D. Macro Environment** — Customers/partners, supply chain, geopolitics & export controls
- **E. Competitors** — Apple, MediaTek, Intel, NVIDIA, AMD, Samsung, Broadcom, Huawei
- **F. Key Stakeholders** — 3GPP, ETSI, IEEE, industry alliances, regulators, OEMs, foundries

## Tech Stack

- **Site**: Pure static HTML/CSS/JS (no framework)
- **Data Pipeline**: Node.js — fetches RSS feeds, filters, tags, deduplicates, summarizes
- **CI/CD**: GitHub Actions — daily cron at 23:00 UTC, deploys to GitHub Pages
- **Design**: News-editorial style (Source Serif 4 headlines + Inter body)

## Local Development

```bash
# Install dependencies
npm install

# Run the data pipeline (fetches RSS, generates site/data/*.json)
npm run build

# Serve the static site locally
npm run serve
# Then open http://localhost:3000
```

## Adding a New Source

Edit `scripts/config/feeds.js` and add a new entry:

```js
{
  id: 'source-id',
  name: 'Source Name',
  group: 'tech',  // finance | tech | semiconductor | ip | telecom
  strategy: 'rss',  // 'rss' for native RSS, 'google-news' for Google News fallback
  url: 'https://example.com/feed/'  // only needed for 'rss' strategy
}
```

## Enabling LLM-Enhanced Briefings

1. Add `OPENAI_API_KEY` as a repository secret in GitHub Settings
2. The build script will automatically use GPT-4o-mini to generate richer daily briefings
3. Falls back to rule-based generation if the key is not set or unavailable

## Architecture

```
qualcomm-news-monitor/
├── scripts/          # Node.js data pipeline
│   ├── config/       # Feed definitions, keywords, sections
│   ├── lib/          # Fetch, filter, tag, dedupe, summarize, IO
│   └── build.js      # Orchestrator
├── site/             # Static site (GitHub Pages root)
│   ├── assets/       # CSS, JS, fonts
│   ├── data/         # Generated JSON (auto-committed daily)
│   └── *.html        # 8 pages (home + 6 sections + about)
└── .github/workflows/ # CI: daily cron + deploy
```

## License

This project is for personal/news-monitoring use. All aggregated content links to original publishers.

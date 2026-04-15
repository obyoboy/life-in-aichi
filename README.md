# Life in Aichi — 在日外国人向け生活制度ナビ

Benefits & Support Guide for Foreign Residents in Aichi, Japan.

Multilingual (English / Tiếng Việt / Filipino / 日本語)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Hosting**: Vercel
- **Styling**: CSS (globals.css with CSS custom properties)

## Project Structure

```
src/
├── app/
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout (metadata, viewport, icons)
│   ├── page.tsx                 # Root → redirects to /en
│   ├── not-found.tsx            # Custom 404 page (multilingual)
│   ├── robots.ts                # robots.txt generation
│   ├── sitemap.ts               # sitemap.xml with hreflang
│   └── [lang]/
│       ├── layout.tsx           # Per-language layout (header, footer, validation)
│       ├── page.tsx             # Home page
│       └── articles/
│           ├── page.tsx         # Article list with search & filter
│           └── [id]/
│               └── page.tsx     # Article detail (10-section template + JSON-LD)
├── components/
│   ├── Header.tsx               # Site header with language switcher
│   ├── Footer.tsx               # Site footer with disclaimer
│   ├── ArticleCard.tsx          # Article list card
│   ├── ArticleListClient.tsx    # Client-side search, filter & URL sync
│   └── LineCTA.tsx              # LINE call-to-action banner
├── data/
│   └── articles.ts              # Article content & localized overrides
└── lib/
    ├── i18n.ts                  # Language config & types
    ├── translations.ts          # UI translation strings (4 languages)
    ├── seo.ts                   # Site URL resolution & hreflang builder
    ├── jsonld.ts                # Article & Breadcrumb JSON-LD generators
    └── articleDataValidation.ts # Build-time data integrity checks
public/
├── favicon.svg                  # SVG favicon
└── manifest.json                # PWA manifest
```

## URL Structure

```
/                           → redirect to /en
/en                         → English home
/vi                         → Vietnamese home
/tl                         → Filipino home
/ja                         → Japanese home
/en/articles                → Article list (English)
/en/articles?cat=medical    → Filtered by category
/en/articles?q=child        → Filtered by search
/en/articles/jidou-teate    → Article detail
/sitemap.xml                → Sitemap with hreflang
/robots.txt                 → Robots directives
```

## SEO Features

- **sitemap.xml**: Auto-generated with all pages × all languages, hreflang alternates, lastModified from article verification dates
- **robots.txt**: Allow all, disallow /_next/ and /api/, sitemap reference
- **hreflang tags**: On every page (HTML head + sitemap) including x-default
- **canonical URLs**: On every page
- **JSON-LD**: Article schema + BreadcrumbList on article detail pages
- **Open Graph**: Per-page title, description, type (website/article)
- **Title template**: `%s — Life in Aichi` pattern via Next.js metadata
- **Viewport & theme-color**: Proper mobile rendering
- **PWA manifest**: Add-to-homescreen ready

## Data Integrity

`articleDataValidation.ts` runs at build time and verifies:
- `s8` (official URL) is a valid http(s) URL
- `s9` (last verified date) is valid YYYY-MM-DD format

Build fails if any article data is malformed.

## Getting Started

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # Production build
npm start         # Start production server
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Connect the repo in Vercel dashboard
3. Vercel auto-detects Next.js — no config needed
4. Deploy

### Environment Variables (optional)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production URL for sitemap/OG. Falls back to Vercel auto-detected URL |

## Adding New Articles

Add to `BASE_ARTICLES` in `src/data/articles.ts`. Each article uses the 10-section template:

| # | Field | Content |
|---|---|---|
| s1 | What is this system? | Description |
| s2 | Can foreign nationals use it? | Eligibility |
| s2note | Caveat | Optional warning |
| s3 | Who is eligible? | Criteria |
| s4 | How much? | Amounts |
| s5 | Where to apply? | Location |
| s6 | Required documents | List |
| s7 | Common mistakes | Pitfalls |
| s8 | Official page | Valid URL (validated at build) |
| s9 | Last verified | YYYY-MM-DD (validated at build) |
| s10 | Help contacts | Phone/offices |

Add localized overrides in the `LOCALIZED` object. Sitemap, hreflang, routes update automatically.

## License

Private — All rights reserved.

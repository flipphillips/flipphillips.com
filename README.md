# flipphillips.com

Personal academic website and portfolio of **Flip Phillips**, Professor of Psychology & Neuroscience and Motion Picture Science at Rochester Institute of Technology (RIT).

Built with [Astro](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com), [KaTeX](https://katex.org), [Mermaid](https://mermaid.js.org), and [Three.js](https://threejs.org), hosted on [Cloudflare Pages](https://pages.cloudflare.com/).

---

## Quickstart

```bash
# Install dependencies
npm install

# Start local dev server (default: http://localhost:4321)
npm run dev

# Build production static bundle (outputs to ./dist)
npm run build

# Preview production build locally
npm run preview
```

### Content Authoring Helpers

```bash
# Create a new Folklore story or Dispatch
npm run new:post "Your Story Title"
# or run interactively:
npm run new:post

# Add an academic publication via DOI (auto-fetches metadata from Crossref)
npm run new:pub 10.1145/3799829.3812522
# or run interactively for manual entry:
npm run new:pub

# Check image sizes and potential savings without modifying files (Dry Run)
npm run images:check

# Optimize and compress oversized images in public/images in-place
npm run images:optimize
```

---

## Project Structure: Where Things Live

```text
flipphillips.com/
├── public/                     # Static files copied as-is to root URL
│   ├── _redirects              # Cloudflare Pages 301 edge redirect rules
│   ├── favicon.ico / .png      # Browser favicons
│   ├── images/                 # Uploaded images, media, figures
│   ├── models/                 # 3D models (feelie1.glb, feelie1.obj)
│   └── pubs/                   # PDFs (CV, papers) and publication figures
├── src/
│   ├── components/             # Reusable Astro UI components
│   │   ├── Header.astro        # Nav header & mobile menu
│   │   ├── Footer.astro        # Site footer
│   │   ├── PublicationCard.astro # Academic paper card with DOI, PDF, thumb
│   │   ├── FolkloreCard.astro  # Story card for folklore archive & home
│   │   ├── RandomBanner.astro  # Dynamic archival hero image rotator
│   │   └── ModelViewer3D.astro # WebGL 3D viewer for Gibson Feelies (Three.js)
│   ├── content/                # Markdown content collections
│   │   ├── posts/              # 140+ essays, folklore stories, and notes
│   │   └── pages/              # Static page content (about, feelies, etc.)
│   ├── data/
│   │   └── publications.ts     # TypeScript database of 55+ publications
│   ├── layouts/
│   │   └── BaseLayout.astro    # Global HTML shell, fonts, dark mode, scripts
│   ├── pages/                  # File-based routing (pages & endpoints)
│   │   ├── index.astro         # Homepage (featured stories & selected pubs)
│   │   ├── about/index.astro   # About page
│   │   ├── folklore/           # Unified Folklore & Dispatches
│   │   │   ├── index.astro     # Chronological archive + topic filters
│   │   │   └── [slug].astro    # Dynamic reader for individual stories
│   │   ├── publications/
│   │   │   └── index.astro     # Chronological publications archive + filters
│   │   ├── software/index.astro# Software, tools, and code repositories
│   │   └── math-and-mermaid-demo.mdx # Showcase for KaTeX math and Mermaid
│   ├── styles/
│   │   └── global.css          # Tailwind CSS v4 directives and typography
│   └── content.config.ts       # Astro Content Layer schemas (Zod validation)
├── astro.config.mjs            # Astro configuration, plugins, and route redirects
├── wrangler.jsonc              # Cloudflare Pages deployment configuration
└── package.json                # Dependencies and npm scripts
```


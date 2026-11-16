# flipphillips.com

The personal academic website, portfolio, and digital archive of **Flip Phillips**, Professor of Psychology & Neuroscience and Motion Picture Science at Rochester Institute of Technology (RIT).

Built with [Astro v7](https://astro.build), [Tailwind CSS v4](https://tailwindcss.com), [KaTeX](https://katex.org), [Mermaid](https://mermaid.js.org), [Three.js](https://threejs.org), and [Wolfram Notebook Embedder](https://github.com/WolframResearch/wolfram-notebook-embedder), hosted on [Cloudflare Pages](https://pages.cloudflare.com/).

---

## ✨ Features & Architecture

- **Interactive Wolfram Computations & Cloud Notebooks**: Native interactive notebook and `Manipulate` cell embedding via `wolfram-notebook-embedder`, plus an AST Rehype plugin (`src/plugins/rehype-wolfram.js`) that automatically unfurls Wolfram Community links into responsive "★ Staff Pick" cards with cloud notebook, GitHub repository, and `.nb` download links.
- **Academic Publications Single Source of Truth**: 79 peer-reviewed papers, book chapters, conference proceedings, and technical reports (1986–2026) managed in standard BibTeX (`src/data/publications.bib`). Live BibTeX export endpoint at [`/publications.bib`](https://flipphillips.com/publications.bib).
- **Bidirectional Paper CV Sync**: Automated two-way merge between the website's bibliography and Flip's LaTeX CV repository (`~/GitHub/fpcv`). Preserves website-specific metadata (thumbnails, PDF links, companion dispatches) while synchronizing citation field edits and checking representation against `cv.tex`.
- **Companion Story & Paper Linking**: Zero-boilerplate bidirectional connection between academic papers and companion narrative essays in Folklore & Dispatches (`post = {/folklore/slug}` in BibTeX or `publication: "citekey"` in markdown frontmatter).
- **Fast Static Search (Zero Server)**: Offline full-text search powered by [Pagefind](https://pagefind.app/), indexing all posts, essays, and publications during static build time.
- **LaTeX Math & Dynamic Diagrams**: Client-side and server-rendered KaTeX math equations (`$E = mc^2$`, `$$\int ...$$`) alongside Mermaid flowchart and sequence diagram rendering.
- **3D WebGL Model Viewer**: Interactive Three.js viewer for Gibson *Feelies* and psychophysical shape stimuli (`.glb`, `.obj`).
- **Asset Ingest & Conformer Pipeline**: High-performance image conformer powered by Sharp (`scripts/new-post.js`, `scripts/new-pub.js`, `scripts/optimize-images.js`). Automatically corrects camera EXIF orientation, converts Apple `.heic`/`.heif` to progressive `.jpg`, constrains retina masters to 2,048px, and compresses via MozJPEG.
- **Edge Performance & SEO**: Deployed on Cloudflare Pages with edge 301 redirects (`public/_redirects`), dynamic XML sitemaps (`/sitemap.xml`), and IndexNow search engine notification scripts.

---

## 🚀 Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Start local development server with hot-reloading (http://localhost:4321)
npm run dev

# 3. Build production bundle and generate Pagefind search index (outputs to ./dist)
npm run build

# 4. Preview static production build locally
npm run preview
```

> **Tip:** You don't need to memorize or type terminal commands! All site tools are integrated into VS Code Tasks. In VS Code, open the top menu and select **Terminal &rarr; Run Task...** (or press `Cmd+Shift+P` &rarr; `Tasks: Run Task`) to launch any workflow from an interactive picker. See [HOWTO.md](file:///Users/fxpppr/GitHub/flipphillips.com/HOWTO.md) for detailed tutorials.

---

## 🛠️ CLI & Authoring Tooling

### Content Creation
```bash
# Create a new Folklore story or Dispatch (supports Finder drag-and-drop image ingest)
npm run new:post "Your Story Title"
# or run interactively:
npm run new:post

# Fetch publication metadata by DOI and insert into publications.bib
npm run new:pub 10.1145/3799829.3812522
# or run interactively for manual entry:
npm run new:pub
```

### Academic CV & BibTeX Synchronization
```bash
# Bidirectional sync: merges new/edited entries between website and ~/GitHub/fpcv
npm run cv:sync

# Pull citation updates from fpcv into the website (preserves website metadata)
npm run cv:pull

# Push website publications.bib out to ~/GitHub/fpcv
npm run cv:push

# Compare website publications.bib against fpcv/publications.bib and fpcv/cv.tex
npm run cv:diff

# Generate ready-to-paste LaTeX entries formatted in the exact cv.tex macro style
npm run cv:latex
# or generate for a specific year:
npm run cv:latex 2026
```

### Media, Thumbnails & Image Optimization
```bash
# Check image dimensions & calculate potential savings without modifying files (Dry Run)
npm run images:check

# Optimize and compress oversized backlog images in public/images in-place
npm run images:optimize

# Audit images and report unreferenced files / legacy artifacts
npm run images:audit

# Move unreferenced images to _unused_images_review/ with a restoration manifest
npm run images:clean

# Restore moved images back to public/images/
npm run images:restore
```

### Search & Search Engine Nudge
```bash
# Rebuild the Pagefind static search index
npm run pagefind

# Ping IndexNow (Bing, DuckDuckGo, Yandex, Seznam) with all sitemap URLs after deployment
npm run seo:nudge
```

---

## 📝 Content Authoring & Syntax Reference

### 1. Interactive Wolfram Notebooks
Embed an interactive Wolfram Cloud notebook or `Manipulate` cell in any Markdown/MDX post using a fenced `wolfram` code block:

````markdown
```wolfram https://www.wolframcloud.com/obj/c19ba5bf-c364-46f4-b009-f06a27c122e0
```
````

For read-only code display without embedding, specify `read-only`:

````markdown
```wolfram read-only
RayMarch[origin_, dir_, steps_] := ...
```
````

### 2. Wolfram Community Post Cards
Paste any Wolfram Community article URL on its own line:

```markdown
https://community.wolfram.com/t/training-a-neural-radiance-field-nerf-from-scratch-in-wolfram-language-the-classic-lego-bulldozer/28600
```

The `rehype-wolfram` plugin automatically transforms it into a responsive **★ Staff Pick** preview card featuring:
- Hero banner thumbnail
- Article title and description
- Direct action buttons: **Read on Community &rarr;**, **GitHub Repository &nearr;**, **☁️ Open in Cloud &nearr;**, and **💾 Download .nb**.

### 3. LaTeX Math & Mermaid Diagrams
- **Inline Math**: `$f(x) = \sigma(W x + b)$`
- **Display Math**:
  ```latex
  $$\mathcal{L} = \sum_{r \in \mathcal{R}} \left\| \hat{C}(r) - C(r) \right\|_2^2$$
  ```
- **Mermaid Diagrams**:
  ````markdown
  ```mermaid
  flowchart LR
    A[Camera Rays] --> B[Positional Encoding]
    B --> C[MLP Network]
    C --> D[Volume Rendering]
    D --> E[Synthesized Image]
  ```
  ````

### 4. Linking Papers and Companion Essays
Link an academic paper to an essay without editing HTML:
- **From BibTeX (`src/data/publications.bib`)**: Add `post = {/folklore/my-story-slug}`
- **From Post Frontmatter (`src/content/posts/*.md`)**: Add `publication: "my-bibtex-citekey"`

The website automatically renders:
1. A **`📝 Backstory →`** badge on the publication card.
2. A **`📄 Companion Academic Publication`** callout box above the essay with PDF and DOI buttons.

---

## 📁 Project Structure

```text
flipphillips.com/
├── public/                     # Static files served at the root URL
│   ├── _redirects              # Cloudflare Pages 301 edge redirect rules
│   ├── favicon.ico / .png      # Favicons
│   ├── images/                 # Optimized photos, figures, and folklore media
│   ├── models/                 # 3D models for WebGL viewer (feelie1.glb, .obj)
│   ├── pagefind/               # Static search bundle (generated at build time)
│   └── pubs/                   # PDFs (CV, papers) and publication figures
├── src/
│   ├── components/             # Reusable Astro UI components
│   │   ├── FolkloreCard.astro  # Story card for archive & homepage
│   │   ├── Footer.astro        # Site footer with colophon and navigation
│   │   ├── Header.astro        # Header navigation, search, and mobile menu
│   │   ├── ModelViewer3D.astro # Three.js WebGL viewer for 3D Feelies
│   │   ├── PublicationCard.astro # Academic paper card (DOI, PDF, bib metadata)
│   │   └── RandomBanner.astro  # Archival hero banner rotator
│   ├── content/                # Content collections (Zod-validated markdown)
│   │   ├── pages/              # Static page content (about, feelies)
│   │   └── posts/              # 140+ essays, folklore stories, and notes
│   ├── data/
│   │   ├── bibtex.ts           # Zero-dependency BibTeX parser & serializer
│   │   ├── publications.bib    # Canonical bibliography (79 entries, 1986–2026)
│   │   └── publications.ts     # Type-safe Astro publication loader & filters
│   ├── layouts/
│   │   └── BaseLayout.astro    # Global HTML shell, dark mode, typography
│   ├── pages/                  # File-based routing and static endpoints
│   │   ├── about/index.astro   # About page
│   │   ├── folklore/           # Unified Folklore archive & reader ([slug].astro)
│   │   ├── index.astro         # Homepage (featured stories & selected pubs)
│   │   ├── publications/       # Chronological publications archive + filters
│   │   ├── publications.bib.ts # Dynamic endpoint serving live publications.bib
│   │   ├── search.astro        # Full-text Pagefind search page
│   │   ├── sitemap.xml.ts      # Dynamic XML sitemap generator
│   │   └── software/index.astro# Software & hardware project catalogue
│   ├── plugins/                # Custom unified / Rehype plugins
│   │   ├── rehype-video.js     # Responsive video embeds (YouTube, Vimeo, MP4)
│   │   └── rehype-wolfram.js   # Wolfram Cloud notebook embedder & card unfurler
│   ├── styles/
│   │   └── global.css          # Tailwind CSS v4 directives & typography rules
│   └── content.config.ts       # Astro Content Layer schema definitions
├── scripts/                    # Automation and maintenance tools
│   ├── download-images.js      # Media downloader from WordPress exports
│   ├── export-wp.js            # WordPress XML to Markdown conversion tool
│   ├── find-unused-images.js   # Audit, quarantine, and restore unreferenced assets
│   ├── new-post.js             # Interactive post scaffolder with image conformer
│   ├── new-pub.js              # Interactive publication creator via DOI lookup
│   ├── nudge-search.js         # IndexNow search engine ping notification
│   ├── optimize-images.js      # Sharp-based batch retina image optimizer
│   └── sync-cv.js              # Bidirectional CV sync tool (website <-> ~/GitHub/fpcv)
├── astro.config.mjs            # Astro configuration, Vite plugins, and redirects
├── package.json                # Project dependencies and npm scripts
├── wrangler.jsonc              # Cloudflare Pages deployment configuration
└── HOWTO.md                    # In-depth guide and authoring manual
```

---

## 🌐 Deployment

The site is continuously deployed to **Cloudflare Pages** from the `main` branch.

- **Build Command:** `npm run build`
- **Build Output Directory:** `dist`
- **Node.js Version:** `20+` or `22+`
- **Environment:** Managed via [wrangler.jsonc](file:///Users/fxpppr/GitHub/flipphillips.com/wrangler.jsonc)

---

## 📄 License

Content & Essays &copy; Flip Phillips. All rights reserved. Source code is licensed under the MIT License.

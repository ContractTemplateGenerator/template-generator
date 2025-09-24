# Terms.law Attorney-Led Incorporation

A pnpm-powered monorepo delivering the Terms.law attorney-led incorporation experience. It includes the embeddable React intake, clause-driven templates, 50-state filing data, and a serverless-friendly API for watermarked previews and deliverables.

## Monorepo structure

```
termslaw-incorporation/
├─ packages/
│  ├─ incorp-ui/     # Vite + React + Tailwind intake app
│  ├─ state-data/    # 50-state fee/timeline schema, data, and validator
│  ├─ templates/     # Handlebars clause templates for OA/Bylaws
│  └─ api/           # Express/Vercel-ready functions for previews & delivery
├─ .github/workflows/ci.yml
├─ README.md
└─ pnpm-workspace.yaml
```

## Quick start (pick the path that fits you)

### A. Copy the project onto your Mac with GitHub Desktop

1. **Create a place for the repo.**
   ```bash
   mkdir -p "/Users/Mac/Documents/GitHub/template-generator"
   ```
2. **Download the project from this workspace.**
   Run the commands below **inside the Codex terminal** (not on your Mac):
   ```bash
   cd /workspace/template-generator
   tar -czf termslaw-incorporation.tar.gz termslaw-incorporation
   python -m http.server 8000
   ```
   Leave that terminal window running. In the Ports panel click port **8000**, then download `termslaw-incorporation.tar.gz` to your Mac. Press `Ctrl+C` in the terminal when you’re done downloading.
3. **Unpack on macOS.**
   ```bash
   cd "/Users/Mac/Documents/GitHub/template-generator"
   tar -xzf ~/Downloads/termslaw-incorporation.tar.gz
   ```
   You should now have `/Users/Mac/Documents/GitHub/template-generator/termslaw-incorporation`.
4. **Add it to GitHub Desktop.** Open GitHub Desktop → *File → Add Local Repository…* → select the folder from step 3. Commit and push to your GitHub account when you’re ready.
5. **Install dependencies and run it locally.** Open Terminal on your Mac:
   ```bash
   cd /Users/Mac/Documents/GitHub/template-generator/termslaw-incorporation
   pnpm install
   pnpm dev
   ```
   `pnpm dev` launches both the React intake (`http://localhost:5173`) and the API (`http://localhost:4000`).

### B. Run everything in the cloud (no local install)

1. Push the repo to GitHub (steps A1–A4) or fork it.
2. In Safari/Chrome, open the repo on GitHub → press the green **Code** button → **Open with Codespaces** → **New codespace**.
3. Inside the browser-based VS Code, open a terminal and run:
   ```bash
   pnpm install
   pnpm dev
   ```
4. Codespaces forwards ports automatically; accept the toast to open the intake UI. Visit `/embed` to preview the iframe layout. This works from iPhone/iPad as well.

### C. Deploy to Vercel for a production URL

1. Push the repo to GitHub.
2. In Vercel → **Add New… → Project** → select the repo.
3. Set:
   - **Root Directory:** `packages/incorp-ui`
   - **Build Command:** `pnpm --filter @termslaw/incorp-ui build`
   - **Output Directory:** `packages/incorp-ui/dist`
4. Deploy. Your live URL (e.g., `https://incorp.terms.law`) will serve both `/` and `/embed`.

### D. Produce a GitHub Pages-ready build (no hosting setup required)

Run the export script inside this workspace:

```bash
pnpm export:github-pages
```

This command builds `@termslaw/incorp-ui`, copies the output to `../Attorney-Led-Incorporation-Intake`, and adds both `404.html`
and an `embed/index.html` shim so deep links work on static hosts. Commit that folder to your `template-generator` repo and
GitHub Pages will serve it at `https://template.terms.law/Attorney-Led-Incorporation-Intake/` automatically once pushed.

## Local development commands

1. Install dependencies with pnpm:

   ```bash
   pnpm install
   ```

2. Run the full workspace in development mode:

   ```bash
   pnpm dev
   ```

   - `incorp-ui` serves on Vite’s default port (http://localhost:5173).
   - `api` boots an Express server on http://localhost:4000.

3. Lint, type-check, test, and build everything:

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   ```

CI replicates the same commands via GitHub Actions.

## Package highlights

### `packages/incorp-ui`

- React + Vite + Tailwind front-end embeddable via `/embed`.
- Intake enforces Delaware/LLC defaults, registered agent pre-selection, entity-specific sections, business-day ETA, tiered packages, and investment summary.
- Client-side preview modal shows a living excerpt; the paid preview is provided by the API as watermarked PNGs.
- Tests cover rendering, package switching, ownership totals, and ETA calculation.

### `packages/state-data`

- Zod schema describing `{ filingFeeLLC, filingFeeCorp, expediteAvailable, rushAvailable, standardDays, expediteDeltaDays, rushDeltaDays, notes, sources[] }`.
- Seed data for all 50 states with realistic Delaware/Wyoming/California timelines and placeholder fees elsewhere.
- `pnpm validate:states` ensures 50-state coverage and schema compliance.

### `packages/templates`

- Handlebars templates with clause-based partials for LLC operating agreements and corporate bylaws.
- `render-demo.ts` shows HTML rendering for sample payloads.
- Unit tests exercise member-managed vs. manager-managed branches and director/officer output.
- Build copies the `.hbs` partials into `dist` for runtime use.

### `packages/api`

- Express app that can deploy as serverless handlers.
- `/api/fees` surfaces state data.
- `/api/preview` renders templates, produces PDFs with `puppeteer-core` + `@sparticuz/chromium`, rasterizes with `sharp`, and overlays a diagonal “Preview — Terms.law” watermark before returning base64 PNGs.
- `/api/generate` validates input and returns a queued job stub (Stripe integration TODO).
- Includes a WordPress REST helper using Application Passwords (`createOrUpdateWordPressPage`).
- Preview route tests mock heavy rendering to keep CI fast.

## WordPress publishing scaffold

The API exposes `createOrUpdateWordPressPage(credentials, payload)` which authenticates via the WordPress REST API using Application Passwords. Provide the following environment variables when wiring it into automation:

- `WP_URL` – WordPress site URL
- `WP_USER` – Username with API access
- `WP_APP_PASS` – Application password generated within WordPress

## State & template updates

- Update fee/timeline data in `packages/state-data/src/data/states.json` and rerun `pnpm -r run build && pnpm -r run validate`.
- Clause tweaks belong in `packages/templates/src/templates/**`. Re-run `pnpm -r run build` to copy partials into `dist`.

## Embedding the intake

1. Deploy `packages/incorp-ui` to a static host (Vercel, Netlify, GitHub Pages, or any CDN). The generated site exposes `/` for the full app and `/embed` for a compact iframe-friendly layout.
2. If you ran `pnpm export:github-pages` the static files already live in `Attorney-Led-Incorporation-Intake/`; once pushed to GitHub, they will be available at `https://template.terms.law/Attorney-Led-Incorporation-Intake/`.
3. Load the helper script published with the build at `/embed-resizer.js`. It listens for the `termslaw-embed:resize` message emitted by the intake and keeps the iframe height synced automatically.
4. In WordPress/Elementor, open the tab that currently shows the pricing HTML and swap that markup for the snippet below. (Drag an **HTML** widget into place if you do not have one yet.)
5. Save the page. Elementor will display the live intake inside the iframe, automatically resizing as the form grows.
6. Update the `allowedOrigins`/`src` values once you have your live deployment URL (e.g., replace the placeholder with `https://incorp.terms.law` or the GitHub Pages path mentioned above).

   ```html
   <script>
     window.TermsLawEmbed = {
     // Replace with the host where incorp-ui is deployed.
       allowedOrigins: ['https://template.terms.law/Attorney-Led-Incorporation-Intake']
     };
   </script>
   <iframe
     data-termslaw-embed
     src="https://template.terms.law/Attorney-Led-Incorporation-Intake/embed"
     title="Terms.law Incorporation Intake"
     loading="lazy"
     style="width: 100%; border: 1px solid #e2e8f0; border-radius: 18px; min-height: 860px;"
     data-min-height="860"
   ></iframe>
   <script defer src="https://template.terms.law/Attorney-Led-Incorporation-Intake/embed-resizer.js"></script>
   ```

   Elementor users can also copy `integrations/wordpress/elementor-tab.html`, which mirrors the layout shown in the screenshot shared in the brief and includes the same iframe wiring.

## Outstanding TODOs

- Stripe integration for `/api/generate` job fulfillment.
- Populate real filing fees and expedite/rush availability across all 50 states.
- Connect the WordPress publishing utility to push previews/live pages once authentication is configured.

## Troubleshooting & FAQ

- **`pnpm: command not found`** – install pnpm globally on macOS with `npm install -g pnpm`, then rerun the commands.
- **The Codespace dev server says it’s running but I don’t see the UI.** Click the “Ports” tab, ensure port `5173` is set to “Public”, then click its URL. You can also append `/embed` manually once the default route loads.
- **Iframe is short / cuts off content.** Double-check that `embed-resizer.js` is being loaded and that the iframe has the `data-termslaw-embed` attribute. Without the helper script Elementor cannot resize the frame.
- **Need to tweak pricing copy for the Elementor tab.** Edit `integrations/wordpress/elementor-tab.html` locally, then paste the updated markup back into the Elementor HTML widget after deployment.

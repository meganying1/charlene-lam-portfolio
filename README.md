# Charlene Lam — independent portfolio

This static website runs without Wix, a database, a framework, or a package installation. Node.js 20 or newer is the only build/preview requirement. All portfolio media, documents, original font files, and image variants are stored locally. Images display without expansion controls or click-to-expand behavior. Individual project pages omit the bottom category and CHARLENE links.

The current Wix website and its DNS have not been changed. The separate private preview is for review. Do not change the domain or cancel Wix until the owner approves the replacement.

## Run

From this directory:

```sh
npm run dev
```

Open http://localhost:4173. Use `PORT=8080 npm run dev` to choose a different port. Stop the process with Ctrl+C. The preview server supports video byte-range requests. To review on a phone on the same Wi-Fi, open `http://YOUR-COMPUTER-LAN-IP:4173`; a firewall may require allowing Node to receive local connections.

```sh
npm run build
npm run check
```

`build` creates `dist/`. `check` verifies original asset hashes, text against the audit, local links, and section targets. There are no runtime npm dependencies.

## Source structure and editing

- `src/content.json`: one original content source for all widths, preserving text, captions, metadata, image order and project paths.
- `scripts/engineering-layout.mjs` and `src/engineering-layouts.json`: main’s engineering section/grid compositions, using the same editable text and media source.
- `scripts/media-layout.mjs`: proportional image rows and project-specific mixed-media compositions.
- `scripts/components.mjs`: shared semantic header, cards, introductions, figures, evaluation rows, downloads and gallery.
- `src/styles.css`: shared tokens, component styles and responsive reflow; no whole-page scaling.
- `src/app.js`: compact navigation and keyboard menu handling.
- `src/image-descriptions.json`: reviewed descriptions of artwork, travel and live-music photographs.
- `src/panel-transcripts.json`: reviewed printed text alternatives for29 intact original panels.
- `src/layouts/` and `src/desktop-overrides.css`: archived original desktop layouts, excluded from generated pages.
- `public/`: unchanged original media, variants, fonts, PDFs and Arduino embed.
- `audit/`: captured original content, hashes and validation evidence. Contact stays archived in `src/contact-popup.json`.

See `DESIGN-SYSTEM.md` for shared rules and intentional differences, and `audit/ENGINEERING-SHARED-STYLE-QA.md` for checks and limitations. Update content once in `src/content.json`; change shared presentation in components/styles. Engineering case studies retain main’s section structure and image groupings while using the shared palette, typography and media treatment. Text flows naturally with the shared body scale; groups stack below 1280px. The optional `python3 scripts/extract-engineering-layouts.py` authoring tool regenerates grid metadata from the archived layouts and requires Beautiful Soup; normal builds still require only Node. Panel text disclosures follow the engineering presentation graphics so the original panels stay contiguous.

The audit compares original wording with whitespace normalization, checks the original desktop capture, image sequence, PDF links, IDs, anchors and asset hashes.

On a disk with limited free space, run `node scripts/build.mjs --link-assets`, then `node scripts/serve.mjs`. The local-only flag avoids duplicating media. Normal `npm run build` still creates a self-contained static deployment.

## Deploy independently

Run `npm run build`, then upload the **contents of `dist/`** to any static host. The `_redirects` file supports Netlify/Cloudflare-style routing. No secrets or environment variables are required for the published portfolio. A Git-based host can use build command `npm run build` and output directory `dist`.

For Nginx, serve `dist/` and use:

```nginx
location = /home { return 301 /; }
location / { try_files $uri $uri/index.html =404; }
```

For Apache or another static host, enable directory index files. All previous project paths and all `/_files/ugd/...pdf` paths are retained. A host that canonicalizes directory paths may add a trailing slash; there is no project-slug migration. `/home` redirects to `/`. No other path redirects are required. Preserve the existing domain only after approval, then point its DNS to the chosen host and enable HTTPS. Keep the old Wix service during verification so rollback remains available.

The `.openai/hosting.json` file configures the separate private Sites review deployment. It is optional for hosting elsewhere and contains no source credential.

## Functionality and services

The published site uses local native video controls, original animated GIFs, project links, preserved section hash targets, local PDFs, and a mobile menu. Email uses the original `mailto:` link and opens the visitor's mail application. LinkedIn and Generate remain their original external destinations.

The dormant Contact popup contains pre-existing template text (`info@mysite.com`, `Tel: 123-456-7890`, `San Francisco, California`) and a Wix submission form. It is archived exactly, not introduced into navigation. Activating it independently requires choosing and configuring a form submission service/backend, along with spam protection and delivery details. No submission service is falsely simulated and no success message is shown without delivery.

## Verification and limits

See `audit/QA.md` and `audit/build-verification.json`. All 25 sitemap pages plus the blank `/fullscreen-page` route were recovered. The contact popup was also inventoried separately. The text check covers the single rendering shared by desktop and mobile. Original media and PDFs are SHA-256 verified. Published pages have no Wix-hosted media dependency.

Browser tests cover phone, tablet, full desktop, smaller desktop, navigation, native media, local downloads, section anchors and image/content preservation. Physical iPhone/Android hardware was not available; safe-area behavior, browser bars, real touch feel and real-device performance still need an owner device check. This limitation does not affect the preserved content audit.

### Private preview file-size adaptation

Sites has a 25 MiB per-file asset limit. Two original PDFs exceed it. `npm run build:preview` creates a separate `build/` directory for that host: the oversized PDFs are stored in byte-exact chunks and reconstructed in the visitor's browser before opening the native PDF viewer. Their combined SHA-256 hashes are verified during preparation. Original files remain untouched in `public/` and in the normal `dist/` output. The private preview may briefly load before opening these two PDFs, and its PDF viewer uses a temporary blob URL. For independent hosting, use `npm run build` and deploy `dist/` to a host that accepts the original 33 MB files; no adapter is required. The largest original file is 32,660,251 bytes.

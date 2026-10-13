# Charlene Lam — independent portfolio

This static website runs without Wix, a database, a framework, or a package installation. Node.js 20 or newer is the only build/preview requirement. All portfolio media, documents, original font files, and image variants are stored locally.

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

- `src/layouts/PAGE.html` and `src/layouts/PAGE.css`: independently hosted desktop markup and layout styles recovered from each original page. The component names are retained so image placement, original masks, annotations, hover captions and spacing survive. No Wix JavaScript, SDK, API, authentication or hosting is required.
- `src/desktop-overrides.css`: consistent desktop type roles, readable subtitle contrast, keyboard focus and laptop fitting. Edit colors and font choices here rather than modifying every page's layout CSS.
- `src/content.json`: the same exact content in ordered semantic blocks for phone and tablet layouts. Each record has the original path, text HTML, images and captions, downloads, and section targets. Keep an image's caption and link attached to its project.
- `src/styles.css`: phone/tablet spacing, navigation, project grids and the image viewer. Applied only up to 900px.
- `src/app.js`: navigation disclosure, keyboard controls, image enlargement, native media controls and desktop fitting.
- `public/assets/`: original image/video/HTML files plus local WebP derivatives. Original filenames are retained. Originals have not been edited.
- `public/_files/ugd/`: original PDFs at their previous public paths.
- `public/fonts/`: original locally hosted fonts.
- `public/embeds/gripper-code.html`: responsive rendering of the exact original Arduino code. The original HTML is also retained in assets.
- `audit/`: inventory, baseline content, file hashes and verification reports.
- `src/contact-popup.json`: exact dormant Wix Contact popup configuration, kept separately because the current site's navigation does not open it and its direct path returns a 404.

For a text edit, find the project in `src/layouts/PAGE.html` and the matching block in `src/content.json`; update both so desktop and mobile stay identical. For an asset change, add the original to `public/assets/`, update the desktop image and its mobile record, and preserve related captions. Then rebuild and review both widths. The exact-content audit intentionally flags future text changes against the original baseline; update audit expectations only after the owner approves those changes.

Desktop layout follows the original site above 900px. On desktops narrower than 1440px, the same composition scales proportionally to fit rather than clipping its left/right edges. Phone/tablet layouts use a separate semantic rendering of the same content, hidden from the accessibility tree when inactive. Photos keep their natural aspect ratios in mobile project views. Text-containing image panels can be enlarged to their original resolution.

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

The published site uses local native video controls, original animated GIFs, project links, section links, local PDFs, a mobile menu and keyboard-accessible image enlargement. Email uses the original `mailto:` link and opens the visitor's mail application. LinkedIn and Generate remain their original external destinations.

The dormant Contact popup contains pre-existing template text (`info@mysite.com`, `Tel: 123-456-7890`, `San Francisco, California`) and a Wix submission form. It is archived exactly, not introduced into navigation. Activating it independently requires choosing and configuring a form submission service/backend, along with spam protection and delivery details. No submission service is falsely simulated and no success message is shown without delivery.

## Verification and limits

See `audit/QA.md` and `audit/build-verification.json`. All 25 sitemap pages plus the blank `/fullscreen-page` route were recovered. The contact popup was also inventoried separately. The exact-text check includes both desktop and mobile output. Original media and PDFs are SHA-256 verified. Published pages have no Wix-hosted media dependency.

Browser tests cover phone, tablet, full desktop, smaller desktop, navigation, native media, local downloads, section anchors and image-dialog focus. Physical iPhone/Android hardware was not available; safe-area behavior, browser bars, real touch feel and real-device performance still need an owner device check. This limitation does not affect the preserved content audit.

### Private preview file-size adaptation

Sites has a 25 MiB per-file asset limit. Two original PDFs exceed it. `npm run build:preview` creates a separate `build/` directory for that host: the oversized PDFs are stored in byte-exact chunks and reconstructed in the visitor's browser before opening the native PDF viewer. Their combined SHA-256 hashes are verified during preparation. Original files remain untouched in `public/` and in the normal `dist/` output. The private preview may briefly load before opening these two PDFs, and its PDF viewer uses a temporary blob URL. For independent hosting, use `npm run build` and deploy `dist/` to a host that accepts the original 33 MB files; no adapter is required. The largest original file is 32,660,251 bytes.

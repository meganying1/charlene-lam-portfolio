import fs from "node:fs";
import path from "node:path";
import { engineeringLayoutStyles } from "./engineering-layout.mjs";
import {
  SiteHeader,
  renderPage,
  esc,
  category,
  indexes,
  panels,
} from "./components.mjs";
const pages = JSON.parse(fs.readFileSync("src/content.json", "utf8"));
const engineeringLayouts = JSON.parse(fs.readFileSync("src/engineering-layouts.json", "utf8"));
const responsive = JSON.parse(fs.readFileSync("src/responsive.json", "utf8"));
const originals = JSON.parse(
  fs.readFileSync("audit/original-pages.json", "utf8"),
);
const transcripts = JSON.parse(
  fs.readFileSync("src/panel-transcripts.json", "utf8"),
);
const descriptions = JSON.parse(
  fs.readFileSync("src/image-descriptions.json", "utf8"),
);
fs.mkdirSync("dist", { recursive: true });
// Link original assets only for local reviews on disks with limited free space.
for (const entry of fs.readdirSync("public")) {
  const dest = path.join("dist", entry);
  if (fs.existsSync(dest) && fs.lstatSync(dest).isSymbolicLink())
    fs.unlinkSync(dest);
  if (process.argv.includes("--link-assets")) {
    if (!fs.existsSync(dest))
      fs.symlinkSync(path.resolve("public", entry), dest);
  } else fs.cpSync(path.join("public", entry), dest, { recursive: true });
}
for (const file of ["app.js", "styles.css"])
  fs.copyFileSync("src/" + file, "dist/" + file);
for (const p of pages) {
  const blank = p.slug === "fullscreen-page";
  const layout = engineeringLayouts[p.slug];
  if (layout) {
    fs.mkdirSync("dist/layouts", { recursive: true });
    fs.writeFileSync(`dist/layouts/engineering-${p.slug}.css`, engineeringLayoutStyles(layout));
  }
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#FFFFFF"><title>${esc(p.title)}</title><link rel="preload" href="/fonts/00915920e370-helvetica-w01-roman.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/styles.css">${layout ? `<link rel="stylesheet" href="/layouts/engineering-${p.slug}.css">` : ""}<script src="/app.js" defer></script></head><body class="page-${p.slug} category-${category(p.slug)} ${indexes.has(p.slug) ? "index-page" : ""} ${panels.has(p.slug) ? "panel-page" : ""} ${p.nav.length ? "case-study" : ""} ${layout ? "engineering-layout-page" : ""}">${
    blank
      ? '<main id="main" aria-label="Fullscreen Page"></main>'
      : SiteHeader(p) +
        renderPage(
          p,
          responsive,
          transcripts,
          originals.find((x) => x.slug === p.slug),
          descriptions,
          layout,
        )
  }</body></html>`;
  const dest =
    p.slug === "home" ? "dist/index.html" : `dist/${p.slug}/index.html`;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
}
fs.writeFileSync(
  "dist/_redirects",
  "/home / 301\n" +
    pages
      .filter((p) => p.slug !== "home")
      .map((p) => `${p.path} ${p.path}/index.html 200`)
      .join("\n") +
    "\n",
);
fs.writeFileSync(
  "dist/404.html",
  '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>404</title><link rel="stylesheet" href="/styles.css"><main><h1>404</h1><a href="/">CHARLENE</a></main></html>',
);
console.log(`Built ${pages.length} shared responsive pages in dist/`);

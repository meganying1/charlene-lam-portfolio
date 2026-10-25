import fs from "node:fs";
import crypto from "node:crypto";
const pages = JSON.parse(fs.readFileSync("src/content.json", "utf8"));
const assets = JSON.parse(fs.readFileSync("audit/assets.json", "utf8"));
const originals = JSON.parse(
  fs.readFileSync("audit/original-pages.json", "utf8"),
);
const errors = [];
let references = 0,
  textBlocks = 0,
  imageCount = 0;
const plain = (s) =>
  s
    .replace(/<[^>]*>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&nbsp;", " ")
    .replace(/[\u200b-\u200d]/g, "")
    .replace(/\s+/g, "")
    .trim();
const blocks = (nodes) =>
  nodes.flatMap((n) =>
    n.type === "text"
      ? [n]
      : n.type === "cards"
        ? n.items.map((c) => c.caption)
        : [],
  );
const images = (nodes) =>
  nodes.flatMap((n) =>
    n.type === "image"
      ? [n.src]
      : n.type === "cards"
        ? n.items.map((c) => c.image.src)
        : [],
  );
for (const p of pages) {
  const html = fs.readFileSync(
    "dist/" + (p.slug === "home" ? "index.html" : p.slug + "/index.html"),
    "utf8",
  );
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]),
    seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) errors.push(`${p.path}: duplicate id ${id}`);
    seen.add(id);
  }
  const titleCount = (html.match(/<h1[ >]/g) || []).length;
  if (titleCount !== (p.slug === "fullscreen-page" ? 0 : 1))
    errors.push(`${p.path}: expected one content h1, found ${titleCount}`);
  for (const n of blocks(p.nodes)) {
    const match = html.match(
      new RegExp('<div[^>]*\\sid="' + n.id + '"[^>]*>([\\s\\S]*?)<\\/div>'),
    );
    if (!match || plain(match[1]) !== plain(n.html))
      errors.push(`${p.path}: content text changed: ${n.id}`);
    else textBlocks++;
  }
  // Check original desktop content independently of the rendering data.
  const original = originals.find((x) => x.slug === p.slug),
    sourceBlocks = blocks(p.nodes);
  const chrome = new Set([
    "ENGINEERING",
    "DESIGN",
    "ART",
    "PHOTOGRAPHY",
    "ABOUT",
    "CHARLENE",
    "designer|mechanicalengineer|creative",
    "RESUME",
    "LINKEDIN",
    "EMAIL",
  ]);
  for (const rich of original.richtext) {
    const value = plain(rich);
    if (
      !chrome.has(value) &&
      !sourceBlocks.some((n) => plain(n.html) === value)
    )
      errors.push(
        `${p.path}: original desktop text absent from shared content: ${value.slice(0, 60)}`,
      );
  }
  const rendered = [...html.matchAll(/data-original="([^"]+)"/g)].map(
    (m) => m[1],
  );
  if (JSON.stringify(rendered) !== JSON.stringify(images(p.nodes)))
    errors.push(`${p.path}: original image sequence changed`);
  imageCount += rendered.length;
  const videos = [...html.matchAll(/<video[^>]*\ssrc="([^"]+)"/g)].map(m => m[1]);
  if (JSON.stringify(videos) !== JSON.stringify(p.nodes.filter(n => n.type === "video").map(n => n.src)))
    errors.push(`${p.path}: original video sequence changed`);
  if (/<dialog[\s>]|\bdata-image=|class="[^"]*(?:expand-icon|photo-expand|expand-image)/.test(html))
    errors.push(`${p.path}: image enlargement controls must stay removed`);
  for (const match of html.matchAll(
    /\b(?:href|src|poster|data-original|data-image)="([^"]*)"/g,
  )) {
    const url = match[1];
    references++;
    if (url.startsWith("#") && !seen.has(url.slice(1)))
      errors.push(`${p.path}: missing anchor ${url}`);
    if (url.startsWith("/") && !url.startsWith("//")) {
      const local = "dist" + url.split(/[?#]/)[0];
      if (!fs.existsSync(local) && !fs.existsSync(local + "/index.html"))
        errors.push(`${p.path}: missing file ${url}`);
    }
  }
  for (const a of p.nav)
    if (!seen.has(a.target))
      errors.push(`${p.path}: missing section target ${a.target}`);
  for (const link of original.links.filter(
    (x) => p.slug !== "fullscreen-page" && x.href.includes(".pdf"),
  )) {
    const href = link.href.replace("https://www.charlene-lam.com", "");
    if (!html.includes(href))
      errors.push(`${p.path}: missing original PDF ${href}`);
  }
  // Original section links were captured as page URLs without their Wix targets.
  // Their recovered targets are checked above; all other destinations must remain.
  for (const link of original.links) {
    if (p.slug === "fullscreen-page") continue;
    const href = link.href.replace("https://www.charlene-lam.com", "") || "/";
    if (href === p.path && p.nav.some((item) => item.text === link.text))
      continue;
    if (!html.includes(href))
      errors.push(`${p.path}: missing original link ${href}`);
  }
  if (
    /(?:src|href)="https:\/\/(?:static\.wixstatic|video\.wixstatic)/.test(html)
  )
    errors.push(`${p.path}: Wix runtime asset dependency`);
}
for (const a of assets) {
  const file = "public" + a.local;
  if (!fs.existsSync(file)) {
    errors.push(`Missing asset ${a.local}`);
    continue;
  }
  if (
    crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex") !==
    a.sha256
  )
    errors.push(`Original asset changed: ${a.local}`);
}
const report = {
  pages: pages.length,
  originalAssets: assets.length,
  renderedImages: imageCount,
  localReferencesChecked: references,
  exactTextBlocks: textBlocks,
  errors,
};
fs.writeFileSync(
  "audit/build-verification.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);

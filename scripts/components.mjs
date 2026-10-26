import { imageRatio, renderMediaGroup } from "./media-layout.mjs";
import { renderEngineeringLayout } from "./engineering-layout.mjs";

// All templates use the same content, typography and interactive components.
export const esc = (s) =>
  String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
export const plain = (s) =>
  String(s)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
export const indexes = new Set(["home", "engineering", "design", "art"]);
export const panels = new Set([
  "sageware",
  "copy-of-sageware",
  "endless-garden",
]);
export const category = (s) =>
  panels.has(s)
    ? s === "copy-of-sageware" ? "design" : "engineering"
    : [
          "home",
          "engineering",
          "design",
          "art",
          "photography",
          "about",
          "updating",
          "fullscreen-page",
        ].includes(s)
      ? s
      : /portrait-|strawberry|bird-painting/.test(s)
        ? "art"
        : /design-with|homage-|air-jordan|shoe-design|endless-garden/.test(s)
          ? "design"
          : "engineering";
const contact =
  '<a href="/_files/ugd/55147f_6ee3d566cf67449d8fc84a0aa4309a5c.pdf">RESUME</a><a href="https://www.linkedin.com/in/charlene-lam/">LINKEDIN</a><a href="mailto:charlenelam138@gmail.com">EMAIL</a>';
export function SiteHeader(p) {
  return `<div class="masthead"><a class="skip-link" href="#main">Skip to Main Content</a><header class="site-header" id="top"><a class="wordmark" href="/">CHARLENE</a><a class="identity-description" href="/">designer | mechanical engineer | creative</a><button class="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="primary-navigation"><span></span><span></span></button><nav id="primary-navigation" aria-label="Main navigation">${["engineering", "design", "art", "photography", "about"].map((c) => `<a href="/${c}" ${category(p.slug) === c ? 'aria-current="' + (p.slug === c ? "page" : "true") + '"' : ""}>${c.toUpperCase()}</a>`).join("")}<div class="mobile-contact">${contact}</div></nav><nav class="contact-links" aria-label="Contact and resume">${contact}</nav></header></div>`;
}
function semantic(html, title = false, about = false) {
  let s = html
    .replace(
      /<(h[1-5]|p)(?:\s[^>]*)?>((?:\s|&nbsp;|\u200b|\u200c|\u200d|<\/?strong>|<br\s*\/?>)*)<\/\1>/gi,
      "",
    )
    .replace(/<h[45](\s[^>]*)?>/g, "<p>")
    .replace(/<\/h[45]>/g, "</p>");
  if (about) {
    s = s.replace(/<h3>/g, "<h2>").replace(/<\/h3>/g, "</h2>");
    s = s.replace(
      /<h2>((?:(?!<\/h2>)[\s\S])*designer(?:(?!<\/h2>)[\s\S])*creative(?:(?!<\/h2>)[\s\S])*)<\/h2>/,
      (m) =>
        m
          .replace("<h2>", '<p class="about-subtitle">')
          .replace("</h2>", "</p>"),
    );
  }
  if (title) {
    const m = s.match(/<h[123][^>]*>[\s\S]*?<\/h[123]>/);
    if (m)
      s = s.replace(
        m[0],
        m[0].replace(/^<h[123][^>]*>/, "<h1>").replace(/<\/h[123]>$/, "</h1>"),
      );
  }
  if (about)
    s = s.replace(
      /<\/p>\s*<p>(Apple as a product design engineer|and branding\.)/g,
      " $1",
    );
  return s;
}
const Rich = (n, o = {}) =>
  `<div class="rich ${o.className || ""}" id="${esc(n.id)}">${semantic(n.html, o.title, o.about)}</div>`;
function EvaluationList(n, icons) {
  let index = 0;
  const html = semantic(n.html).replace(/<p>([\s\S]*?)<\/p>/g, (match, text) => {
    if (!plain(text).startsWith("•")) return match;
    const icon = icons[index++];
    if (!icon) throw Error("Missing evaluation icon");
    return `<p class="evaluation-row"><img src="${esc(icon.src)}" data-original="${esc(icon.src)}" data-source-id="${esc(icon.id)}" alt="${icon.src.includes("258e84") ? "Not met" : "Met"}" width="22" height="22"><span>${text}</span></p>`;
  });
  if (index !== icons.length) throw Error("Unpaired evaluation icon");
  return `<div class="rich evaluation" id="${esc(n.id)}">${html}</div>`;
}
export function renderPage(
  p,
  responsive,
  transcripts,
  original,
  descriptions = {},
  engineeringLayout,
) {
  let titleSeen = false;
  let imageIndex = 0;
  const label = p.title.split(" | ")[0].trim();
  const image = (n, card = false, alt) => {
    const r = responsive[n.src];
    const attrs = r
      ? `src="${esc(r.default)}" srcset="${r.sources.map((x) => `${esc(x.src)} ${x.width}w`).join(", ")}" sizes="${card ? "(max-width:640px) calc(100vw - 40px), 50vw" : "(max-width:900px) calc(100vw - 40px), 1040px"}"`
      : `src="${esc(n.src)}"`;
    return `<img ${attrs} alt="${esc(alt ?? n.alt)}" width="${r?.width || n.width}" height="${r?.height || n.height}" loading="${imageIndex++ < 2 ? "eager" : "lazy"}" decoding="async" data-original="${esc(n.src)}" data-source-id="${esc(n.id)}">`;
  };
  const figure = (n, caption) => {
    const generic =
      !n.alt ||
      /^(?:image|asset|img_|[\dA-F]{8}-)|\.(jpg|jpeg|png|gif)$/i.test(n.alt);
    const sourceIndex = p.nodes.findIndex((x) => x.id === n.id);
    const context = p.nodes
      .slice(0, sourceIndex)
      .filter((x) => x.type === "text" && /<h[123]/.test(x.html))
      .at(-1);
    const alt =
      descriptions[n.src] ||
      (transcripts[n.src]
        ? `${transcripts[n.src][0]} — panel ${p.nodes.filter((x) => x.type === "image").findIndex((x) => x.id === n.id) + 1}`
        : generic
          ? `${label} — ${p.slug === "photography" ? "live music photograph" : context ? plain(context.html) : "project image"} ${p.nodes.filter((x) => x.type === "image").findIndex((x) => x.id === n.id) + 1}`
          : n.alt);
    const picture = image(n, false, alt);
    const visual = `<div class="figure-visual">${picture}</div>`;
    const ratio = imageRatio(n, responsive);
    return `<figure class="media ${n.width <= 100 && n.height <= 100 ? "small-figure" : ""} ${n.src.endsWith('.png') ? 'media--diagram' : ''}" style="--ratio:${ratio};--media-width:${Math.min(1040,ratio*760)}px" id="${esc(n.id)}-figure">${n.href ? `<a href="${esc(n.href)}">${picture}</a>` : visual}${caption ? `<figcaption>${text(caption)}</figcaption>` : ''}${transcripts[n.src] ? `<details class="panel-transcript"><summary>Read panel text</summary><div class="transcript-content">${transcripts[n.src].map((t) => `<p>${esc(t)}</p>`).join("")}</div></details>` : ""}</figure>`;
  };
  const download = (n, html) =>
    `<a class="download" href="${esc(n.href)}">${html || esc(n.text || (p.slug === "endless-garden" ? "Download Report" : "Open linked document"))}<span aria-hidden="true">↗</span></a>`;
  const nodes = structuredClone(p.nodes),
    intro = [];
  const ti = nodes.findIndex(
    (n) => n.type === "text" && /<h[123]/.test(n.html),
  );
  if (ti >= 0 && !["about", "photography"].includes(p.slug)) {
    intro.push(nodes.splice(ti, 1)[0]);
    if (!indexes.has(p.slug) && !panels.has(p.slug) && p.slug !== "updating") {
      const description = nodes.findIndex((n) => n.type === "text");
      if (description >= 0) intro.push(nodes.splice(description, 1)[0]);
      if (p.slug === "autopasser") {
        const i = nodes.findIndex((n) => n.id === "comp-ll0v00s4");
        intro.push(nodes.splice(i, 1)[0]);
      }
    }
  }
  const text = (n) => {
    const title = !titleSeen && /<h[123]/.test(n.html);
    if (title) titleSeen = true;
    let html = Rich(n, {
      title,
      about: p.slug === "about",
      className: n.id === "comp-ll0v00s4" ? "metadata" :
        !/<h[123]|<ul|<ol/.test(n.html) && plain(n.html).length < 150 &&
        ["image", "video"].includes(p.nodes[p.nodes.findIndex(x => x.id === n.id) - 1]?.type)
          ? "media-caption" : "",
    });
    if (n.id === "comp-ll0v00s4")
      html = html.replace(/<\/?h3>/g, (m) =>
        m.includes("/") ? "</p>" : "<p>",
      );
    if (p.slug === "updating" && !title)
      html = html.replace(/<\/?h2>/g, (m) =>
        m.includes("/") ? "</p>" : "<p>",
      );
    if (intro.includes(n))
      html = html.replace(/(?:<br\s*\/?>\s*)+(\([^<]*\d{4}\))/g,
        '<span class="project-year">$1</span>');
    return html;
  };
  const video = (n, caption) => `<figure class="media video-media"><video id="${esc(n.id)}" src="${esc(n.src)}" ${n.poster ? `poster="${esc(n.poster)}"` : ""} controls playsinline preload="metadata" ${n.loop ? "loop" : ""} ${n.muted ? "muted" : ""} aria-label="${esc(label)} video"></video>${caption ? `<figcaption>${text(caption)}</figcaption>` : ''}</figure>`;
  if (engineeringLayout)
    return renderEngineeringLayout(p, engineeringLayout, { esc, figure, video, evaluation: EvaluationList });
  const captionIds = new Set(['comp-ll3d20dn', 'comp-ll3d4zs8', 'comp-lkzur2ah', 'comp-lkzus9qv', 'comp-lkzx2rdh']);
  const leadingAnchors = [];
  while (nodes[0]?.type === "anchor") leadingAnchors.push(nodes.shift());
  const lead = p.nav.length && ["image", "video"].includes(nodes[0]?.type) ? nodes.shift() : null;
  let body = intro.length
    ? `<header class="project-header ${indexes.has(p.slug) ? "index-heading" : ""}">${intro.map(text).join("")}</header>`
    : "";
  if (panels.has(p.slug)) {
    body += `<header class="project-header"><h1>${esc(label)}</h1></header>`;
    titleSeen = true;
  }
  if (lead) body = `<div class="project-intro">${body}${lead.type === "video" ? video(lead) : figure(lead)}</div>`;
  body = leadingAnchors.map(n => `<span class="anchor" id="${esc(n.id)}"></span>`).join("") + body;
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n.type === "anchor") {
      body += `<span class="anchor" id="${esc(n.id)}"></span>`;
      continue;
    }
    if (n.type === "text") {
      if (p.slug === 'automated-gripper' && n.id === 'comp-lkzwolg8') {
        const firstImage = nodes[++i], secondHeading = nodes[++i], secondImage = nodes[++i];
        body += `<div class="media-comparison"><section>${text(n)}${figure(firstImage)}</section><section>${text(secondHeading)}${figure(secondImage)}</section></div>`;
        continue;
      }
      let html = text(n);
      if (p.slug === "photography")
        html = html.replace(/<\/?h3>/g, (m) =>
          m.includes("/") ? "</h2>" : "<h2>",
        );
      body += html;
      continue;
    }
    if (n.type === "cards") {
      body += `<div class="project-grid">${n.items.map((c) => `<a class="project" href="${esc(c.href)}" aria-labelledby="${esc(c.caption.id)}"><div class="project-image">${image(c.image, true, "")}</div>${Rich(c.caption)}</a>`).join("")}</div>`;
      continue;
    }
    if (n.type === "image" && p.slug === "photography") {
      const photos = [n];
      while (nodes[i + 1]?.type === "image") photos.push(nodes[++i]);
      let row = [],
        sum = 0;
      const flush = () => {
        if (row.length)
          body += `<div class="photography-row">${row.map(x => figure(x)).join("")}</div>`;
        row = [];
        sum = 0;
      };
      for (const photo of photos) {
        const r = responsive[photo.src];
        const ratio = r ? r.width / r.height : photo.width / photo.height;
        if (sum + ratio > 5 && row.length >= 3) flush();
        row.push(photo);
        sum += ratio;
      }
      flush();
      continue;
    }
    if (n.type === "image") {
      if (p.slug === "automated-gripper" && n.width <= 22 && n.height === 22) {
        const icons = [n];
        while (
          nodes[i + 1]?.type === "image" &&
          nodes[i + 1].width <= 22 &&
          nodes[i + 1].height === 22
        )
          icons.push(nodes[++i]);
        const evaluation = nodes[++i];
        body += EvaluationList(evaluation, icons);
        continue;
      }
      const annotations = [];
      if (
        p.slug === "copy-of-automated-gripper" &&
        nodes[i + 1]?.id === "comp-lkzxvhy3"
      ) {
        for (let j = 0; j < 4; j++) annotations.push(nodes[++i]);
      }
      if (
        p.slug === "automated-gripper" &&
        nodes[i + 1]?.id === "comp-lkzw463u"
      ) {
        for (let j = 0; j < 3; j++) annotations.push(nodes[++i]);
      }
      if (annotations.length) {
        body += `<div class="annotated-figure">${figure(n).replace("<figure ", '<figure aria-describedby="' + esc(n.id) + '-legend" ')}<div class="figure-legend" id="${esc(n.id)}-legend">${annotations.map((x) => Rich(x)).join("")}</div></div>`;
        continue;
      }
      if (p.slug === "about" && nodes[i + 1]?.type === "text") {
        body += `<figure class="about-photo" id="${esc(n.id)}-figure">${figure(
          n,
        )
          .replace(/^<figure[^>]*>/, "")
          .replace(
            /<\/figure>$/,
            "",
          )}<figcaption>${Rich(nodes[++i])}</figcaption></figure>`;
        continue;
      }
      if (
        !indexes.has(p.slug) &&
        !panels.has(p.slug) &&
        !["about", "photography"].includes(p.slug) &&
        nodes[i + 1]?.type === "image"
      ) {
        const images = [n];
        while (
          nodes[i + 1]?.type === "image" &&
          !(p.slug === "automated-gripper" && nodes[i + 1].width <= 22)
        )
          images.push(nodes[++i]);
        const caption = captionIds.has(nodes[i+1]?.id) ? nodes[++i] : null;
        const group = renderMediaGroup(images, image => figure(image), responsive);
        body += caption ? `<figure class="captioned-group">${group}<figcaption>${text(caption)}</figcaption></figure>` : group;
      } else {
        const caption = captionIds.has(nodes[i+1]?.id) ? nodes[++i] : null;
        body += figure(n, caption);
      }
      continue;
    }
    if (n.type === "video") {
      const caption = captionIds.has(nodes[i+1]?.id) ? nodes[++i] : null;
      body += video(n, caption);
      continue;
    }
    if (n.type === "embed") {
      body +=
        '<details class="code-details"><summary>Arduino Code</summary><iframe class="code-embed" title="Gripper Code" src="/embeds/gripper-code.html" sandbox="" loading="lazy"></iframe></details>';
      continue;
    }
    if (n.type === "link") {
      if (
        !n.text &&
        nodes[i + 1]?.type === "text" &&
        nodes[i + 1].html.includes("download full book")
      )
        body += download(
          n,
          Rich(nodes[++i]).replace(/<\/?h2>/g, (m) =>
            m.includes("/") ? "</span>" : "<span>",
          ),
        );
      else body += download(n);
    }
  }
  for (const link of original.links) {
    if (!link.href.includes(".pdf") || link.text === "RESUME") continue;
    const href = link.href.replace("https://www.charlene-lam.com", "");
    if (!body.includes(esc(href)))
      body += download({ href, text: link.text || "Open linked document" });
  }
  const artwork = category(p.slug) === "art" && !indexes.has(p.slug)
    ? p.nodes.find(n => n.type === "image") : null;
  const projectWidth = artwork ? ` style="--project-width:${Math.min(760,imageRatio(artwork,responsive)*760)}px"` : "";
  return `<main${projectWidth} id="main" tabindex="-1" class="${indexes.has(p.slug) ? "index-content" : panels.has(p.slug) ? "panels" : "project-content"}" aria-label="${esc(label)}">${body}</main>`;
}

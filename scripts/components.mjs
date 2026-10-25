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
    ? "home"
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
export function renderPage(
  p,
  responsive,
  transcripts,
  original,
  descriptions = {},
) {
  let titleSeen = false;
  const label = p.title.split(" | ")[0].trim();
  const image = (n, card = false, alt) => {
    const r = responsive[n.src];
    const attrs = r
      ? `src="${esc(r.default)}" srcset="${r.sources.map((x) => `${esc(x.src)} ${x.width}w`).join(", ")}" sizes="${card ? "(max-width:640px) calc(100vw - 40px), 50vw" : "(max-width:900px) calc(100vw - 40px), 1040px"}"`
      : `src="${esc(n.src)}"`;
    return `<img ${attrs} alt="${esc(alt ?? n.alt)}" width="${r?.width || n.width}" height="${r?.height || n.height}" loading="lazy" decoding="async" data-original="${esc(n.src)}" data-source-id="${esc(n.id)}">`;
  };
  const figure = (n) => {
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
    const visual = `<div class="figure-visual">${image(n, false, alt)}</div>`;
    return `<figure class="media ${n.width <= 100 && n.height <= 100 ? "small-figure" : ""}" id="${esc(n.id)}-figure">${n.href ? `<a href="${esc(n.href)}">${image(n, false, alt)}</a>` : visual}${transcripts[n.src] ? `<details class="panel-transcript"><summary>Read panel text</summary><div class="transcript-content">${transcripts[n.src].map((t) => `<p>${esc(t)}</p>`).join("")}</div></details>` : ""}</figure>`;
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
      if (!p.nav.length) {
        const i = nodes.findIndex((n) => n.type === "text");
        if (i >= 0) intro.push(nodes.splice(i, 1)[0]);
      }
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
      className: n.id === "comp-ll0v00s4" ? "metadata" : "",
    });
    if (n.id === "comp-ll0v00s4")
      html = html.replace(/<\/?h3>/g, (m) =>
        m.includes("/") ? "</p>" : "<p>",
      );
    if (p.slug === "updating" && !title)
      html = html.replace(/<\/?h2>/g, (m) =>
        m.includes("/") ? "</p>" : "<p>",
      );
    return html;
  };
  let body = intro.length
    ? `<header class="project-header ${indexes.has(p.slug) ? "index-heading" : ""}">${intro.map(text).join("")}</header>`
    : "";
  if (panels.has(p.slug)) {
    body += `<header class="project-header"><h1>${esc(label)}</h1></header>`;
    titleSeen = true;
  }
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n.type === "anchor") {
      body += `<span class="anchor" id="${esc(n.id)}"></span>`;
      continue;
    }
    if (n.type === "text") {
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
          body += `<div class="photography-row">${row.map((x) => figure(x).replace('class="media ', `style="--ratio:${responsive[x.src] ? responsive[x.src].width / responsive[x.src].height : x.width / x.height}" class="media `)).join("")}</div>`;
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
        let k = 0;
        const html = semantic(evaluation.html).replace(
          /<p>([\s\S]*?)<\/p>/g,
          (m, t) => {
            if (!plain(t).startsWith("•")) return m;
            const icon = icons[k++];
            if (!icon) throw Error("Missing evaluation icon");
            return `<p class="evaluation-row"><img src="${esc(icon.src)}" data-original="${esc(icon.src)}" data-source-id="${esc(icon.id)}" alt="${icon.src.includes("258e84") ? "Not met" : "Met"}" width="22" height="22"><span>${t}</span></p>`;
          },
        );
        if (k !== icons.length) throw Error("Unpaired evaluation icon");
        body += `<div class="rich evaluation" id="${esc(evaluation.id)}">${html}</div>`;
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
        body += `<div class="media-grid">${images.map(figure).join("")}</div>`;
      } else body += figure(n);
      continue;
    }
    if (n.type === "video") {
      body += `<figure class="media video-media"><video id="${esc(n.id)}" src="${esc(n.src)}" ${n.poster ? `poster="${esc(n.poster)}"` : ""} controls playsinline preload="metadata" ${n.loop ? "loop" : ""} ${n.muted ? "muted" : ""} aria-label="${esc(label)} video"></video></figure>`;
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
  return `${p.nav.length ? SectionContents(p) : ""}<main id="main" tabindex="-1" class="${indexes.has(p.slug) ? "index-content" : panels.has(p.slug) ? "panels" : "project-content"}" aria-label="${esc(label)}">${body}</main>`;
}
export function SectionContents(p) {
  return `<details class="section-contents"><summary>On this page</summary><nav aria-label="Page sections">${p.nav
    .map((a) => {
      const i = p.nodes.findIndex((n) => n.id === a.target);
      let heading = "";
      if (i >= 0) {
        for (let j = i; j < p.nodes.length; j++) {
          const n = p.nodes[j];
          if (n.type === "text" && /<h[12]/.test(n.html)) {
            heading = plain(
              n.html.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/)?.[1] || "",
            );
            break;
          }
        }
      }
      return `<a href="#${esc(a.target)}"><span>${esc(a.text)}</span>${heading && heading !== a.text ? `<span class="section-target">${heading}</span>` : ""}</a>`;
    })
    .join("")}</nav></details>`;
}

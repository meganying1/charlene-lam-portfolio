// Layout-only blueprints retain main's section/grid composition. Every leaf
// resolves back to the shared source content, with one rendering at all widths.
const units = value => value.replace(/(-?\d*\.?\d+)px\b/g, "calc($1 * var(--engineering-unit))");
export function engineeringLayoutStyles(tree) {
  const rules = [];
  const visit = (node) => {
    rules.push(`.engineering-original [data-engineering="${node.key}"]{${Object.entries(node.style).map(([k, v]) => `${k}:${units(v)}`).join(";")}}`);
    (node.children || []).forEach(visit);
  };
  tree.forEach(visit);
  return `@media(min-width:1280px){${rules.join("\n")}}`;
}

export function renderEngineeringLayout(p, tree, { esc, figure, video, evaluation }) {
  let titleSeen = false;
  const used = new Set();
  const ids = new Set();
  const sourceKey = n => n.id || "link:" + n.href;
  const sources = new Map(p.nodes.map(n => [sourceKey(n), n]));
  const titleId = p.nodes.find(n => n.type === "text" && /<h[123]/.test(n.html))?.id;
  const panelText = [];
  const evaluationIcons = p.slug === "automated-gripper"
    ? p.nodes.filter(n => n.type === "image" && n.width <= 22 && n.height === 22) : [];
  const evaluationKeys = new Set(evaluationIcons.map(sourceKey));
  const evaluationId = evaluationIcons.length
    ? p.nodes[p.nodes.findIndex(n => n === evaluationIcons.at(-1)) + 1]?.id : null;
  const captions = new Map();
  const captionIds = new Set(["comp-ll3d20dn", "comp-ll3d4zs8", "comp-lkzur2ah", "comp-lkzus9qv", "comp-lkzx2rdh"]);
  p.nodes.forEach((n, i) => {
    if (!captionIds.has(n.id)) return;
    while (i > 0 && ["image", "video"].includes(p.nodes[i - 1].type))
      captions.set(p.nodes[--i].id, n.id);
  });
  for (const [first, count] of [["comp-lkzxvhy3", 4], ["comp-lkzw463u", 3]]) {
    const index = p.nodes.findIndex(n => n.id === first);
    if (index > 0)
      captions.set(p.nodes[index - 1].id, p.nodes.slice(index, index + count).map(n => n.id).join(" "));
  }
  const secondaryIds = new Set([...captionIds, ...Array.from(captions.values()).flatMap(ids => ids.split(" "))]);
  const rich = (n, presentations) => {
    // Keep main's alignments, with shared typography and canonical wording.
    const styles = new Map();
    for (const presentation of presentations) {
      const list = styles.get(presentation.tag) || [];
      list.push(presentation.style);
      styles.set(presentation.tag, list);
    }
    let html = n.html.replace(/<(h[1-5]|p|ul|ol|li)\b([^>]*)>/g, (tag, name, attrs) => {
      const presentation = styles.get(name)?.shift() || {};
      const style = Object.entries(presentation).filter(([key]) => ["text-align", "text-decoration"].includes(key))
        .map(([key, value]) => `${key}:${value}`).join(";");
      const secondary = ["p", "h4", "h5"].includes(name) && parseFloat(presentation["font-size"]) < 16;
      return `<${name}${attrs}${secondary ? ' class="engineering-secondary"' : ""}${style ? ` style="${esc(style)}"` : ""}>`;
    })
      .replace(/<(\/?)h[45](\s[^>]*)?>/g, "<$1p$2>");
    if (!titleSeen && /<h[123]\b/.test(html)) {
      html = html.replace(/<h[123](\b[^>]*)>([\s\S]*?)<\/h[123]>/,
        '<h1$1>$2</h1>');
      titleSeen = true;
    }
    return `<div class="rich engineering-copy" id="${esc(n.id)}">${html}</div>`;
  };
  const render = (node, sectionDepth = 0) => {
    const source = sources.get(node.source);
    const classes = ["engineering-cell"];
    if (node.grid) classes.push("engineering-grid");
    if (titleId && node.grid && node.children?.some(child => sources.get(child.source)?.id === titleId))
      classes.push("engineering-intro-grid");
    if (node.panel) classes.push("engineering-panel");
    if (node.spacer) classes.push("engineering-spacer");
    if (node.rule) classes.push("engineering-rule");
    if (node.svg) classes.push("engineering-connector");
    if (node.section && sectionDepth === 0) classes.push("engineering-section");
    let visual = "";
    if (node.background && !node.panel) visual += "background:var(--paper);";
    if (node.rule) visual += "border-top:1px solid var(--line);";
    let id = node.id;
    let content;
    if (source) {
      if (used.has(node.source)) throw Error(`${p.slug}: repeated layout source ${node.source}`);
      used.add(node.source);
      if (evaluationKeys.has(node.source)) return "";
      classes.push("engineering-" + source.type);
      if (source.id === titleId) classes.push("engineering-title");
      if (source.id === "comp-ll0v00s4") classes.push("engineering-date");
      if (secondaryIds.has(source.id)) classes.push("engineering-caption");
      if (source.type === "image" && ["sageware", "endless-garden"].includes(p.slug))
        classes.push("engineering-presentation");
      if (source.type === "text") {
        id = null; // The shared rich-text block owns its original ID.
        content = source.id === evaluationId ? evaluation(source, evaluationIcons) : rich(source, node.textStyles);
      } else if (source.type === "image") {
        content = figure(source).replace(/<details class="panel-transcript">[\s\S]*?<\/details>/g, disclosure => {
          const number = panelText.length + 1;
          panelText.push(disclosure.replace("<summary>", `<summary aria-label="Read panel ${number} text">`));
          return "";
        });
        if (captions.has(source.id))
          content = content.replace("<figure ", `<figure aria-describedby="${esc(captions.get(source.id))}" `);
      }
      else if (source.type === "video") {
        id = null;
        content = video(source);
        if (captions.has(source.id))
          content = content.replace("<figure ", `<figure aria-describedby="${esc(captions.get(source.id))}" `);
      } else if (source.type === "embed") {
        if (node.style.height) visual += `--engineering-embed-height:${units(node.style.height)};`;
        content = '<details class="code-details" open><summary>Arduino Code</summary><iframe class="code-embed" title="Gripper Code" src="/embeds/gripper-code.html" sandbox="" loading="lazy"></iframe></details>';
      } else if (source.type === "link") {
        content = `<a class="download${source.text ? "" : " engineering-document"}" href="${esc(source.href)}"${source.text ? "" : ' aria-label="Open linked document"'}>${source.text ? esc(source.text) : '<span aria-hidden="true">↓</span>'}</a>`;
      }
      if (source.type === "text") ids.add(source.id);
      if (source.type === "video") ids.add(source.id);
    } else if (node.svg) {
      content = node.svg;
    } else {
      content = (node.children || []).map(child => render(child, sectionDepth + Number(!!node.section))).join("");
    }
    if (id) ids.add(id);
    const tag = node.section ? "section" : "div";
    return `<${tag}${id ? ` id="${esc(id)}"` : ""} class="${classes.join(" ")}" data-engineering="${node.key}"${visual ? ` style="${esc(visual)}"` : ""}>${content || ""}</${tag}>`;
  };
  const body = tree.map(node => render(node)).join("");
  for (const n of p.nodes)
    if (n.type !== "anchor" && !used.has(sourceKey(n)))
      throw Error(`${p.slug}: layout omits source node ${n.id}`);
  const anchors = p.nodes.filter(n => n.type === "anchor" && !ids.has(n.id))
    .map(n => `<span class="anchor" id="${esc(n.id)}"></span>`).join("");
  const label = esc(p.title.split(" | ")[0]);
  return `<main class="engineering-original" id="main" tabindex="-1" aria-label="${label}">${titleSeen ? "" : `<h1 class="sr-only">${label}</h1>`}${anchors}${body}${panelText.length ? `<div class="engineering-panel-text">${panelText.join("")}</div>` : ""}</main>`;
}

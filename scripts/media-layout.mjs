// Keep each source sequence intact. Rows share a height through proportional
// columns; a few mixed-format groups use a stack beside their portrait images.
export const imageRatio = (image, responsive) => {
  const size = responsive[image.src] || image;
  return size.width / size.height;
};
const number = value => Number(value.toFixed(6));
const compositions = {
  'img_comp-ll3c44li': { leading: 2 }, // Remote sketches: two portraits and two studies.
  'img_comp-ll09x2cm': { leading: 1, compact: true }, // Palette with its two references.
  'img_comp-lme9x32g2': { leading: 1, compact: true }, // Blade assembly and detail views.
};
export function renderMediaGroup(images, figure, responsive) {
  const ratios = images.map(image => imageRatio(image, responsive));
  const plan = compositions[images[0].id];
  if (plan) {
    const lead = ratios.slice(0, plan.leading);
    const stack = ratios.slice(plan.leading);
    const inverse = stack.reduce((sum, ratio) => sum + 1 / ratio, 0);
    // Solve column widths including the stack's internal gaps so every image
    // keeps its natural ratio and the stack aligns with the portrait bottoms.
    const unit = `calc((100% - var(--media-gap) * ${lead.length} + var(--media-gap) * ${stack.length - 1} / ${number(inverse)}) / ${number(lead.reduce((a,b) => a+b,0) + 1/inverse)})`;
    const columns = lead.map(ratio => `calc(var(--mosaic-unit) * ${number(ratio)})`).join(' ') + ' minmax(0,1fr)';
    return `<div class="media-group${plan.compact ? ' media-group--compact' : ''}"><div class="media-mosaic" style="--mosaic-unit:${unit};--media-columns:${columns}">${images.slice(0,plan.leading).map(figure).join('')}<div class="media-stack">${images.slice(plan.leading).map(figure).join('')}</div></div></div>`;
  }
  const row = (items, compact = false, inset = false) => `<div class="media-row${compact ? ' media-row--compact' : ''}${inset ? ' media-row--inset' : ''}" style="--media-columns:${items.map(image => number(imageRatio(image,responsive))+'fr').join(' ')}">${items.map(figure).join('')}</div>`;
  const rows = [];
  let remaining = images.slice();
  if (images[0].id === 'img_comp-ll09uw6q') {
    rows.push(row(remaining.splice(0,2),true));
  }
  if (images[0].id === 'img_comp-m3xatqlt' || ratios[0] > 2.4) {
    rows.push(row(remaining.splice(0,1)));
  }
  // Five square works use three plus two at the same visual scale.
  const squares = remaining.length === 5 && remaining.every(image => Math.abs(imageRatio(image,responsive)-1)<.05);
  if (squares) {
    rows.push(row(remaining.splice(0,3)));
    rows.push(row(remaining,true,true));
  } else {
    while (remaining.length) {
      const count = remaining.length === 4 ? 2 : Math.min(3,remaining.length);
      const items = remaining.splice(0,count);
      const compact = items.every(image => image.width <= 220 && image.height <= 220);
      rows.push(row(items,compact));
    }
  }
  return `<div class="media-group">${rows.join('')}</div>`;
}

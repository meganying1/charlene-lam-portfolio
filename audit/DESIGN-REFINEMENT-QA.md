# Shared responsive design refinement

The two desktop/mobile renderers are replaced by shared components in `scripts/components.mjs`. Archived desktop layouts are unchanged and no longer loaded. All 26 routes remain; fullscreen is blank and Contact stays archived.

## Preservation

- All 168 original assets retain their recorded SHA-256 hashes.
- All 150 content text blocks retain original wording. Only whitespace, empty spacer markup, semantic heading tags and paragraph presentation change. Original desktop rich text is independently compared against the shared content.
- All 161 image instances retain their sequence. Video/poster destinations and original PDF links remain local; desktop-only PDF links are restored in the shared rendering.
- Every legacy section-menu label remains; existing target headings clarify ambiguous labels.
- All original panels remain intact. Their 29 expandable text alternatives cover printed presentation text. Handwritten sketch notes, signatures and incidental photo text are not fully transcribed; originals can be enlarged by keyboard.
- Callout labels stay grouped with their original figures. New marker locations were not invented when the existing photograph does not establish them clearly.

## Validation

- Shared page build: `node scripts/build.mjs --link-assets` passed. This local-only flag links unchanged media into dist. The normal `npm run build` media-copy step encountered ENOSPC on this machine; it is not claimed as passed. Its page-rendering path is identical to the verified linked-assets build.
- `npm run check` passed: 26 pages, 168 asset hashes, 150 text blocks, original image sequence, original PDFs, 985 local-reference instances, unique IDs and section targets.
- Browser structural checks covered every route at widths320,390,768,900,901,1024,1101,1440: no horizontal document overflow or broken loaded images in checked states.
- Visual checks covered desktop/phone cards and header, tablet hero, About spacing/captions, artwork introductions, panel text/viewer controls, case-study evaluation rows/contents and photography proportions.
- Keyboard image viewing: open, zoom150%, Escape, trigger focus restoration and scroll unlock passed. Compact navigation opens by keyboard and exposes all existing links.

Physical iOS/Android, real touch, OS screen readers and actual browser zoom at200% require device-level checks. Viewport tests are not represented as these tests. No production deployment, domain change or merge is included.

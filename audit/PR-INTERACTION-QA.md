# Image and engineering interaction refinement

- Removed expansion arrows, image click handlers, viewer markup, viewer styles and zoom code from every generated route, including Photography.
- Static figures use the default cursor and have no image-hover interaction. Existing project and document navigation links remain functional.
- Removed category/FEATURED WORKS and CHARLENE footer links from individual projects. Header links remain.
- Engineering case studies share the portfolio white canvas, media framing, content widths and type/spacing rules. Section navigation remains available as a compact inline disclosure at every viewport; selecting a section closes it.
- `npm run build`, `npm run check`, JavaScript syntax checks and `git diff --check` pass. Preservation checks cover 26 routes, 168 original asset hashes, 161 image instances, 150 original text blocks and 816 local-reference instances.
- Compared each generated image attribute and sequence with the preceding PR snapshot: unchanged. All 26 generated pages have zero image-expansion controls/dialogs and zero project footers.

Browser automation was unavailable for this pass. The local comparison preview is refreshed for visual review; prior branch browser checks are recorded separately in DESIGN-REFINEMENT-QA.md. No merge or production-domain changes are included.

The 2026-10-25 refinement retains this global no-expansion behavior, including Photography. Updated browser-based responsive and interaction verification is recorded in `UI-UX-REFINEMENT-QA.md`.

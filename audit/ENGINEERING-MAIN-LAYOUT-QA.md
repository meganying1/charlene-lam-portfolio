# Engineering layouts matched to main — 2026-10-26

The owner identified that the proposed engineering projects still differed from main. This update restores main’s composition instead of using the generic project column and new image groupings. It supersedes the engineering layout choices in IMAGE-LAYOUT-QA.md and earlier reports.

## Change

Seven projects use recovered original grid metadata: AutoPasser, Automated Gripper, General Fixture Designs, Modular Cutting Stand Fixtures, Apple, Sageware, and Endless Garden. Main’s section backgrounds, centered headings, panel radii, introduction/date placement, image widths, image groupings, captions, dividers and diagram connectors are retained. Canonical wording and media still resolve from src/content.json, once per page for all viewports. Only layout and typography metadata are recovered from the archive; the published site needs no Wix runtime or Python dependency.

Original dimensions apply at 1440px and wider. Responsive CSS length units fit the compositions to 1280–1439px; narrower views stack sections and images, keep captions/labels near their media, and place AutoPasser’s date directly below its title. Decorative diagram connectors are hidden when the connected layout stacks; the original descriptive labels remain. Source SVG connectors remain on desktop. Panel transcripts follow the contiguous engineering graphics; Arduino code starts open while preserving its disclosure control.

Image expansion stays absent everywhere, including Photography. “On this page” and the removed individual-project footer links stay absent. Original section IDs and document links remain.

## Evidence

- npm run build, npm run check, JavaScript syntax checks and git diff --check pass.
- 26 routes, 150 exact text blocks, 161 image placements in source sequence, original video sequences, 168 unchanged original asset hashes, and 794 local references: zero preservation errors.
- 202 text/media frame positions were compared with main at both 1440px and 1280px (404 geometry comparisons). Horizontal alignment and dimensions match closely; subpixel text rounding and a small Gripper list-metric difference account for the remaining few-pixel vertical shifts. See ENGINEERING-MAIN-GEOMETRY.json for exact values.
- Sitewide responsive review covers all 26 routes at 320, 390, 768, 1024, 1280 and 1440px, plus all seven engineering projects at 1200px (163 unique viewport checks). After the final typography adjustments, all 49 engineering cases were checked again. No horizontal overflow, zero-sized image boxes, image-expansion controls, section contents, or clickable cursors on static images.
- Mobile navigation opens and Escape closes it. Arduino code can close/reopen, and the first Sageware panel-text disclosure opens; all 21 Sageware images remain present. Native video and static-image behavior were checked in the final preview.
- src/content.json, original assets, original downloads, main, Wix, DNS and production hosting are unchanged. PR #1 and its local main/PR comparison receive this update.

Browser testing uses viewport overrides. Physical phone testing remains an owner hardware check. Representative screenshots and ENGINEERING-MAIN-RESPONSIVE.json accompany this report. Earlier reports remain historical evidence.

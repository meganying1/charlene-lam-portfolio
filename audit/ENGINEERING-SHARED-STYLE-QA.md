# Engineering shared formatting — 2026-10-26

The owner requested the other pages’ formatting and color scheme while retaining the restored engineering composition. This report supersedes the legacy palette/typography and exact vertical positions in ENGINEERING-MAIN-LAYOUT-QA.md.

| Before | After | Why |
| --- | --- | --- |
| Gray section bands with contrasting white cards | White canvas and shared subtle dividers | Matches the rest of the portfolio without adding section decoration |
| Original engineering type scale and leading | Shared bold headings, 18/17/16px body, 1.65 leading and muted 15px secondary text | Consistent hierarchy and readability |
| Square photo treatment | Shared 24px/20px corners; diagrams and presentation graphics stay square | Consistent photos while preserving technical graphics |
| Independently positioned evaluation icons | Shared evaluation rows, with each original icon beside its criterion | Keeps associations intact when text wraps |

Original engineering grid metadata, section order, photo groupings and desktop column widths are unchanged. Centered section headings and other original alignments remain. Vertical layout adapts to the shared type scale. Narrow layouts use the same outer guides without invisible panel padding narrowing the text column. Native image colors and all source media files remain untouched.

## Verification

- Build, preservation checks, JavaScript syntax checks and git diff --check pass.
- 26 routes, 150 exact text blocks, 161 image placements in original sequence, original video sequences, 168 original asset hashes and 794 local references pass with zero preservation errors.
- At 1440px, AutoPasser and Homage to Norman Ives have identical computed title styling (48px, 700 weight, 55.2px line height, #242323) and body styling (18px, 29.7px line height, #242323). See ENGINEERING-SHARED-STYLE-REFERENCE.json.
- All seven engineering projects at 320, 390, 768, 1024, 1280 and 1440px: 42 checks, no horizontal overflow, missing image boxes, image-expansion/section-contents controls or clickable cursors on static images. Section/panel CSS backgrounds use white. See ENGINEERING-SHARED-STYLE-RESPONSIVE.json.
- AutoPasser’s three chassis photographs retain their original 247/384/246px widths and 254/534/938px left positions at 1440px; only styling and natural vertical text flow change.
- All nine Gripper evaluation icons remain present and in original order, one per criterion on desktop and phone. Their original images and text are unchanged.
- The Gripper code disclosure opens/closes correctly. Its desktop iframe fills the original embed cell below the summary instead of falling back to the browser’s 150px default height.
- Diagram/presentation corners remain square, photographs use shared corners, captions retain their original associations, and image expansion stays absent everywhere. Earlier footer and “On this page” removals remain intact.
- Representative desktop/phone screenshots accompany this report. Browser viewport overrides were used; physical phone testing remains an owner hardware check.

Main, Wix, DNS and production hosting are unchanged. This is a PR #1 and local comparison update.

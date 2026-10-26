# Engineering section boxes — 2026-10-26

The owner requested retaining boxes where relevant after the shared formatting update.

| Before | After | Why |
| --- | --- | --- |
| Original boxed groups blended into the white page | Original 27 panel groups use the shared #f2f3f8 surface, #dedee4 inset outline and 24px/20px corners | Restores grouping for requirements, brainstorms, diagrams, testing and evaluation without boxing every section |
| Narrow panels had no horizontal inner padding | Responsive 16–24px inner padding | Keeps text and media comfortably inside the visible boxes |

Only the existing panel flags receive boxes: AutoPasser 9, Automated Gripper 12, General Fixture Designs 2 and Modular Cutting Stand Fixtures 4. Apple, Sageware and Endless Garden receive none. Surrounding sections stay white. Desktop grid metadata, positions and widths are unchanged; an inset outline avoids changing box dimensions. Shared typography, colors and photo styling remain.

Verification:

- Build, preservation checks, JavaScript syntax and git diff --check pass.
- 26 routes, 150 exact text blocks, 161 original image placements in sequence, original video sequences, 168 original asset hashes and 794 local references pass with zero errors.
- All seven engineering projects checked at 320, 390, 768, 1280 and 1440px: 35 cases with no page/panel horizontal overflow or missing image boxes. All original panels use the expected surface, outline and radius.
- Static images retain non-clickable cursors. The Gripper’s original PDF-linked image retains its pointer and original download destination; this is a document link, not image expansion.
- Desktop and 390px phone screenshots accompany this report. Physical phone testing remains an owner hardware check.
- No changes to src/content.json, src/engineering-layouts.json, src/app.js or public assets. Image expansion stays removed everywhere. Previous contents-navigation and project-footer removals remain.

This report supersedes only the all-white panel treatment in ENGINEERING-SHARED-STYLE-QA.md. Its typography and content checks still apply. Main, Wix and production hosting are unchanged.

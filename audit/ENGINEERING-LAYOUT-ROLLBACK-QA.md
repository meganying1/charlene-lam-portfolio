# Engineering layout rollback — 2026-10-26

The owner requested undoing the engineering page layout changes. The engineering renderer, engineering CSS and related shared-component refactor are restored to commit 6e28140, the earlier main-layout restoration. This supersedes the shared engineering styling and section-box follow-ups in fb7c967 and 84d9d69.

| Before | After | Why |
| --- | --- | --- |
| Shared typography and white sections with newly styled panel surfaces | Earlier main-style engineering typography, section backgrounds, white panels, image treatment and original placements | Undo the recent engineering presentation changes |

The Engineering overview and all 18 other non-project pages remain unchanged. Image expansion stays removed everywhere. The requested “On this page” and individual-project footer links stay removed. Original section targets, content, documents and media remain intact. Narrow-screen reflow from the earlier restoration is retained.

Verification:

- Build, preservation checks, JavaScript syntax checks and git diff --check pass.
- 26 routes, 150 exact text blocks, 161 original image placements in sequence, original video sequences, 168 unchanged asset hashes and 794 local references; zero errors.
- All 19 pages outside the seven engineering projects render byte-identical HTML compared with the previous PR version.
- Renderer, shared components and CSS match commit 6e28140 exactly. Content, original grid metadata, application interactions and public assets are unchanged.
- Seven engineering projects at 320, 390, 768 and 1440px: 28 browser checks, no horizontal overflow, missing image boxes, static-image zoom cursors, expansion controls or “On this page” navigation.
- The restored Gripper scope section uses its original gray background and white rounded panel. A desktop screenshot accompanies this report.

See ENGINEERING-MAIN-LAYOUT-QA.md for the earlier original-main geometry comparisons. Browser viewport testing was used; physical phone testing remains an owner hardware check. Main, Wix, DNS and production hosting are unchanged.

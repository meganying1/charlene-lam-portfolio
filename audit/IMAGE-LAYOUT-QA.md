# Image layout and interaction review — 2026-10-25

This review supersedes the section-navigation behavior in the earlier UI/UX reports. The owner requested removing “On this page” from engineering projects and clarified that image expansion must remain disabled on Photography as well as every other page.

## Presentation

- Used the homepage’s 24px image gaps, alignment guides and 24px desktop / 20px phone photo corners as the reference. Home and discipline project-link frames retain their established layout.
- Replaced the same two-column grid for every image run with proportional rows, full-width banners and selected portrait/detail compositions. Source image order is unchanged.
- Balanced the AutoPasser sketches and branding groups, Modular Cutting Stand assembly/details, Automated Gripper CAD/Machine pair and testing images, Air Jordan studies, and Norman Ives square works.
- Attached the existing chassis, rendering, wiring, video and poster-session captions to their associated figures/groups. About’s original caption associations remain intact.
- Kept artwork, diagrams and panel graphics uncropped with square edges; single illustrations use the reading guide, and artwork has a centered container fitted to its proportions. Detailed panels remain full width.
- Removed the engineering project section-contents markup, styling and tracking code. Original section IDs remain so existing hash URLs still resolve.
- All 21 Photography images and all other content images remain static. No enlargement arrows, viewer dialogs, click handlers, zoom cursors or enlargement hover effects. Actual project and document links remain functional.

## Checks

- `npm run build`, `npm run check`, JavaScript syntax checks and `git diff --check` pass.
- Original content/asset audit: 26 routes, 150 exact original text blocks, 161 image placements in sequence, original video sequences, 168 unchanged original asset hashes and 787 local references checked; zero errors.
- Browser viewport review: all 26 routes at 320, 390, 768, 1024 and 1440 CSS pixels (130 checks). No horizontal overflow, missing image boxes, removed section navigation or image-expansion controls; static images have no pointer/zoom cursor. Project and document image links retain their normal link cursor.
- Proportional engineering mosaics align to their adjacent stack within subpixel rounding. All media groups become one column below 640px, following source order. Art and panel images retain their original proportions.
- Visually inspected the homepage reference, desktop mixed-media groups, CAD/Machine comparison, Photography, and phone artwork/project layouts. Representative screenshots accompany this report.
- Clicking the first Photography image leaves the route unchanged and opens no viewer. All 21 images remain present.
- Phone menu opens, closes with Escape and returns focus to its button. Native AutoPasser video plays and pauses through the keyboard. Arduino code and panel text disclosures open normally.
- Targeted HTTP checks confirm the resume and Gripper pneumatic PDF return 200, the original Gripper video returns 200, and byte-range playback returns 206 with the expected 1024 bytes.
- `src/content.json`, original assets and downloadable files have no changes. The requested section-contents removal is the only navigation-content exception.

Evidence: `IMAGE-LAYOUT-RESPONSIVE.json`, `IMAGE-LAYOUT-HTTP.json`, `build-verification.json`, and `image-layout-screenshots/`.

Testing used browser viewport overrides. Physical iPhone/Android touch, safe-area and browser-bar behavior remain an owner hardware check. Main, Wix, DNS and production hosting have not been changed; this update is for PR #1 and the local comparison preview.

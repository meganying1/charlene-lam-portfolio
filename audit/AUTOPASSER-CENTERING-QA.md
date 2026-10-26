# AutoPasser Background centering — 2026-10-26

| Before | After | Why |
| --- | --- | --- |
| Fixed horizontal offsets place the two-panel group 46px right of the section center and its heading 28px right at 1440px | Centered two-column grid with heading spanning both columns | Aligns the heading and related panels to one centerline |
| AutoPasser logo, title and description boxes sit about 15px right of the panel center | Content boxes center within each panel; descriptions retain left-aligned text | Balances the panel’s inner margins |

The existing 388px/666px panel widths, 25px gap, vertical spacing, backgrounds, fonts, images, text and links are preserved. Only AutoPasser’s Background layout metadata changes. Other engineering layouts, shared components/styles, application interactions and canonical content match main.

Build and preservation checks pass: 26 routes, 150 exact text blocks, 161 original image placements in sequence, 168 unchanged asset hashes and 794 local references; zero errors. At 1280, 1440 and 1920px, heading/panel centers match the section center within 0.01px; desktop content boxes also center within 0.01px. At 320, 390, 768 and 1024px, the existing stacked layout remains intact. No horizontal overflow at any of the seven widths. Representative screenshots accompany this report.

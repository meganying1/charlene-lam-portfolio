# Shared portfolio design rules

Edit shared tokens in `src/styles.css`, components in `scripts/components.mjs`, and interactions in `src/app.js`. `src/content.json` supplies the original content at every viewport. Original Wix layouts remain archived; content and asset files are unchanged by the UI refinement.

| Rule | Value | Applies to |
|---|---|---|
| Fonts | Local Helvetica roman/bold; original DIN condensed | Content and centered wordmark; navigation and tagline |
| Project title | Fluid 32–48px | Shared project headers, engineering and About |
| Category title | Fluid 32–64px | Engineering, Design, Art, Photography |
| Section/subsection | Fluid 26–32px / 21–24px | Shared h2/h3 hierarchy |
| Body/secondary | 18px desktop; 17px tablet; 16px phone / 15px | Prose / metadata, captions and legends |
| Leading | Body 1.65; headings 1.15 | Shared typography |
| Colors | White #fff; ink #242323; muted #616166; surface #f2f3f8; line #dedee4; action #6661a2 | Shared canvas, text and controls |
| Disciplines | Engineering #40678f; Design #c82f25; Art #6661a2; Photography #596b26 | Category headings and active navigation |
| Containers | Wide 1328px; project 1040px; reading 720px; artwork 760px | Centered containers with left-aligned contents |
| Gutters | 56px desktop; 32px tablet; 20px phone | Shared outer guides |
| Spacing | 4, 8, 12, 16, 24, 32, 48, 64, 96px | Text, media, sections and page endings |
| Project links | Original 658:366 frame; radius 24px/20px; persistent caption; contained image | Home and discipline indexes |
| Media | Natural proportions, no crops, no decorative frames | Diagrams, artwork, videos and panels |
| Controls | 44–48px standalone targets; 3px visible focus; 160ms color/opacity feedback | Navigation, downloads and disclosures |

Shared components include the masthead, project introduction, project grid, rich text, figures and legends, evaluation rows, document links and proportional Photography rows. Pages with an introductory demonstration place it beside the description on desktop and stack it on narrower screens. Long project descriptions and sections share the main container's left guide. Original date wording receives compact secondary styling without changing its text.

The existing masthead, category colors, rounded project thumbnails, white canvas and media-led compositions preserve the portfolio's personality. Panel graphics and their embedded typography/colors are untouched. Photography retains its mixed proportions; About retains its text/photo composition and associated captions.

All content images, including Photography, are static: no image-expansion arrows, viewers, image click handlers, zoom cursors or enlargement hover effects. Actual project/document links retain normal link feedback. Individual projects have no bottom category/CHARLENE footer links. Header navigation retains the original overview links and indicates the current discipline; the requested “On this page” navigation is removed, while original section IDs remain available for existing hash URLs.

Hover feedback is gated to fine pointers, reduced-motion preferences disable transitions, and phone layouts preserve browser zoom and document scrolling. Real phone testing remains a separate hardware check. See `audit/ENGINEERING-SHARED-STYLE-QA.md` for the completed browser and preservation checks.

Image groups use `scripts/media-layout.mjs`: proportional columns create rows of matching height, mixed portrait/detail groups align through an adjacent stack, banners get their own row, and five square works use three-plus-two at the same scale. All groups stack in source order below 640px. Shared 24px gaps and 24px/20px photo corners follow the homepage; artwork, diagrams and panel graphics keep square edges. Single images align with the 720px reading guide; artwork uses a centered container sized to its proportions, with a 760px height/width ceiling. Captions are attached to their original figures or image groups without changing their text. Detailed panel graphics remain full width.

Engineering projects retain main’s section structure, alignments, introduction/date placement, diagram connectors and image groupings while sharing the portfolio’s white canvas, ink/muted colors, heading scale, body leading and photo corners. Original boxed content groups use the shared light surface, subtle inset outline and media radius; surrounding sections stay white. On narrower screens, boxes receive responsive inner padding. Dividers use the shared line color. Original diagram and presentation graphics remain square and unchanged. The evaluation checklist uses the shared row component so each original icon follows its criterion as text reflows.

`src/engineering-layouts.json` holds original grid data keyed to stable source IDs; `scripts/engineering-layout.mjs` renders it with canonical text/media and shared formatting. Grid dimensions use responsive CSS length units on smaller desktops; text heights flow with the shared 18/17/16px body scale. Narrower views stack the original groups with text and media on common guides. No whole-page zoom, Wix runtime, second viewport-specific content copy or image expansion is introduced. Engineering panel transcripts follow the intact presentation graphics; Arduino code starts open and remains collapsible. The earlier main-geometry report is historical: original composition is preserved, while vertical positions now adapt to the unified typography.

# Shared portfolio design rules

Edit shared tokens in `src/styles.css`, components in `scripts/components.mjs`, and interactions in `src/app.js`. `src/content.json` supplies the same original content at every viewport. Original desktop layouts remain archived.

| Rule | Value | Applies to |
|---|---|---|
| Content/navigation fonts | Local Helvetica roman/bold / DIN condensed | Content and wordmark / header, tagline, footer |
| Project/category title | 48/64px desktop;32px phone | Projects, About, panels / category indexes |
| Section/subsection | 32/24px desktop;24/20px phone | Logical h2/h3 hierarchy |
| Body/secondary | 18px desktop,16px narrow /14px | Prose /metadata and captions |
| Leading/tracking | Body1.6 and0; headings1.15 and−.02em | Shared type |
| Colors | White#fff; ink#242323; muted#616166; surface#f2f3f8; border#dedee4; action#6661a2 | All components |
| Disciplines | Engineering#40678f; Design#d62e23; Art#6661a2; Photography#596b26 | Titles and navigation at all widths |
| Containers | Wide1328px; detail1040px; reading680px | Index/gallery; projects; prose |
| Gutters | 56px desktop;32px tablet;20px phone | Header and content |
| Spacing | 4,8,12,16,24,32,48,64,96px | Metadata8; media24; sections64/40; endings48 |
| Cards | Ratio658:366; radius24/20px; persistent caption | Home and discipline indexes |
| Other images | Natural proportions; original panels intact | Artwork, diagrams, Photography and panels |
| Controls/states | Standalone targets44px; downloads radius8px; focus3px purple offset3px;160ms color/opacity feedback | Menu, figures, downloads, navigation |

Shared components: SiteHeader, ProjectHeader, ProjectCard, rich text, Figure/AnnotatedFigure, EvaluationRow, SectionContents, DownloadLink, PhotographyGallery, ProjectFooter and FigureViewer. The static renderer composes them by content type without duplicate desktop/mobile markup.

Intentional differences: Home's featured label stays20px; category heroes retain asymmetric title/media layouts; engineering keeps pale surfaces and rounded panels; artwork retains intrinsic framing; Photography uses proportional desktop rows and one column on phones. Typography/colors embedded in original images are unchanged. Featured-only projects return to Home’s existing FEATURED WORKS section rather than implying they appear in a discipline index.

Before shipping, compare all indexes, six artwork pages, engineering case studies and panel/design pages side by side. Check320–1440px and both sides of each breakpoint; keyboard, real touch, text zoom, contrast, viewing, section targets, navigation states and downloads. Run preservation checks after changes. Completed checks and limits are recorded in `audit/DESIGN-REFINEMENT-QA.md`.

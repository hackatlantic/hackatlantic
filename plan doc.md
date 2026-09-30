# Hack Atlantic landing page replacement plan

**Status:** Approved and implemented. Validation results are recorded below.

## Goal and source of truth

Replace the entire `/` landing page with a faithful implementation of `/Users/daxmanuel/Downloads/index.html`. Match its desktop and mobile designs, including all visible copy, images, order, spacing, typography, colors, crops, and link destinations.

The supplied HTML is the design specification. Its existing artwork and font files will be reused directly. This is a reproduction of that design, with no new visual direction or rewritten content.

Reference inspected:

- File size: 22,528,585 bytes.
- SHA-256: `c1dd684b90d6b709d1f46ec6a6ae9bb496f65a300f55c2cbf2f7f1c8c165ea71`.
- Separate 1440px desktop and 390px mobile compositions.
- 23 embedded images: coastal sunset, logo, 12 event photos, six judge portraits, and three sponsor sheets.
- Four embedded League Spartan font weights: 400, 500, 700, and 800, with their supplied license.
- All image references and internal anchor targets resolve in the source.

This plan is based on inspection of the reference HTML, CSS, assets, and scripts, plus the current application source. Rendered visual comparison has not yet been performed; the available browser blocks local `file://` previews. Visual acceptance will require an approved way to view the reference alongside the implementation.

## Current application and scope

The active application is React, TypeScript, and Vite. `src/main.tsx` mounts `src/app/App.tsx` at `/` and also defines `/join` and `/apply`.

The current landing page contains an applications-open hero, About section, sponsors, a judges placeholder, landscape illustrations, FAQ, and a social/legal footer. These will be replaced by the complete recap design described below.

The implementation will target the active application, not the older nested project in `src/Hack Atlantic Landing Page/`. Existing `/join`, `/apply`, application redirects, and Supabase form behavior will remain functional. Landing page styles will be scoped so that the recap typography and layout do not restyle those routes.

## Page to implement, in reference order

| Section | Required result |
| --- | --- |
| Navigation and hero | Exact coastal sunset image and crop; circular logo; Hack Atlantic wordmark; desktop links for Recap, Winners, Judges, and Sponsors; mobile Recap link; large Hack Atlantic heading; “Atlantic Canada’s largest student-run hackathon.”; underlined “Weekend Recap ↓” link to statistics. |
| Statistics | Mint section headed “Last year we had…” with 200+ Applications, 110+ Hackers, 43 Projects, 23,000+ mg of caffeine, 13 Sponsors, and 6k+ in prizes. Match the three-column desktop and two-column mobile arrangements. |
| Recap | Cream section with four photo-and-response groups, 12 event photos, eight participant Q&A responses, and the two supplied Google Drive album links. Preserve every response, attribution, and its position. |
| Meet the winners | Mint section containing Track winners, Our finalists, and The top three, in that order. Preserve all project names, award labels, participant names, and Devpost destinations. |
| Thank you, judges | Seven judge entries in the supplied order: Jessica Venoitte, Promise Abel, Yousef Khirallah, Mantas Groza, Mike Waugh, Robert Foley, and Nick McCullum. Match circular portraits, purple borders, individual crop positions, roles, and Nick’s NM placeholder. |
| Thank you, sponsors | Warm white section with Gold sponsors, Silver sponsors, and Partners. Match the exact logo artwork, crop, size, grouping, and order. |
| Closing and footer | Mint “See you next year” section with Hack Atlantic beneath it, followed by the simple Hack Atlantic link and “Back to top ↑” footer. |

### Winners and sponsors to preserve

| Winners group | Entries, in order |
| --- | --- |
| Track winners | Sim4Food; PackFlow; Smoke or Fire? / Fumée ou feu ? |
| Our finalists | CloakFile; Eazz Mechanic; Dylamo; Thorpe Watch |
| The top three | SkyLattice; ActivateMio; Recall |

| Sponsor group | Entries, in order |
| --- | --- |
| Gold sponsors | Gray Wolf; UNB; NBIF; SnapTrade |
| Silver sponsors | Uride; introhive; Bluebird Consulting; Elaras Consulting; SmartSkin Technologies; NordVPN |
| Partners | MLH; snowflake; Red Bull |

The source copy remains authoritative, including “Last year we had…”, capitalization, participant spellings, and quoted wording. Sponsor membership follows this reference rather than the current page’s larger sponsor list.

## Visual matching requirements

### Typography and palette

Use the exact embedded League Spartan font files for the landing page, replacing its current Fredoka styling. Match the source weights, line heights, widths, and explicit line breaks.

| Property | Desktop | Mobile |
| --- | --- | --- |
| Design width | 1440px | 390px |
| Hero height | 920px | 780px |
| Navigation padding | 24px vertically, 80px horizontally | 20px vertically, 24px horizontally |
| Hero content inset | 120px horizontally, 144px padding above content after navigation | 24px horizontally, 120px padding above content after navigation |
| Hero title | 112px / 124px, weight 800 | 48px / 58px, weight 800 |
| Hero description | 34px / 44px, weight 500 | 24px / 32px, weight 500 |
| Typical section padding | 72px vertically, 80px horizontally | 48px vertically, 24px horizontally |
| Typical main section heading | 56px / 60px, weight 800 | 36px / 40px, weight 800 |

Section-specific exceptions in the supplied CSS take precedence over the typical values above.

| Color role | Exact value |
| --- | --- |
| Main text | `#193c43` |
| Q&A body text | `#344f55` |
| Cream page and recap backgrounds | `#f7f5eb` |
| Mint sections | `#b8e9da` |
| Polaroid and sponsor-section background | `#fffdf4` |
| Sponsor tile background | `#ffffff` |
| Q&A labels | `#18b9b0` |
| Judge borders and focus outline | `#6b4c8c` |
| Initials portrait background | `#cad7d1` |

### Images and composition

- Preserve the hero’s different desktop and mobile image positioning. The desktop image extends above the hero and is clipped; the mobile version has its own horizontal offset. A generic centered background would not match.
- Reproduce each three-photo stack, its left/right staggering, overlap, cream frames, and shadows. Desktop polaroids are 400 × 348px; mobile polaroids are 270 × 234.9px.
- Alternate the photo and response columns exactly as shown on desktop. Use the mobile source’s photo-first arrangement for each group.
- Preserve Q&A rotations of +2° and −2°, their alternating horizontal alignment, and the exact text block widths.
- Preserve each judge portrait’s crop and the desktop/mobile sizing differences.
- Use the three embedded sponsor sheets with the supplied crop offsets. Existing standalone sponsor cards are not interchangeable with these exact visuals.
- Remove the current landing page’s parallax, reveal effects, hand-drawn date accent, sticky/hide-on-scroll navigation, FAQ, and other visible elements absent from the reference.

### Responsive behavior

The reference scales fixed compositions rather than using conventional fluid reflow. Match that behavior as part of the request for an exact reproduction:

1. At widths of 768px and above, show the desktop composition with scale `availablePageWidth / 1440`. Per the user’s follow-up, scale above 1 on wider screens so the page fills the width.
2. At widths below 768px, show the mobile composition with scale `availablePageWidth / 390`. The available width excludes the vertical scrollbar.
3. Keep both compositions flush with the left and right page edges. The user explicitly requested removing the reference’s centered width cap and side gutters.
4. Keep only the active composition visible and keyboard-accessible. Internal navigation and the skip link must target that composition.
5. Match the mobile reference’s single Recap navigation link; do not retain the current hamburger menu.

## Implementation sequence after approval

### 1. Extract the exact assets

- Decode the 23 images into a dedicated `public/recap/` directory, with descriptive names and a source-key mapping.
- Determine image extensions from the actual file signatures. The export labels all images as PNG, but 13 are JPEGs and 10 are PNGs.
- Preserve original image bytes and quality for the initial match. Share the extracted files between desktop and mobile layouts.
- Extract the four font files into `public/fonts/league-spartan/` and include the supplied font license.
- Replace the export’s large inline base64 payload and runtime Blob conversion with ordinary local asset URLs.

### 2. Create the recap content and components

- Store statistics, photo groups, Q&A responses, award groups, judges, sponsor crop definitions, and external URLs in typed content data.
- Build reusable navigation, hero, statistics, photo story, Q&A, project, judge, sponsor, and footer components.
- Render desktop and mobile variants from the same content, preserving the source’s differences in order and dimensions.
- Use semantic headings, sections, and ordinary anchors without changing the visual appearance. Avoid the source export’s redundant nested `role="link"` tab stops inside project links.

### 3. Replace the homepage composition and styling

- Update `App.tsx` to render the full recap page.
- Introduce scoped recap CSS that reproduces the source’s dimensions and resets. Prevent global Tailwind/theme rules from changing font metrics, margins, borders, or layout.
- Implement the reference’s breakpoint and scaling behavior, including resize handling and cleanup.
- Keep the page static except for the reference’s anchor scrolling and hover/focus behavior. Respect reduced-motion preferences.
- Remove obsolete homepage imports. Delete old components or assets only when confirmed unused by the remaining application.

### 4. Connect navigation and metadata

- Wire Recap, Winners, Judges, Sponsors, Weekend Recap, skip navigation, and Back to top to the correct visible sections.
- Preserve the supplied two album URLs, ten Devpost URLs, footer URL, new-tab behavior, and safe external-link attributes.
- Update homepage title and description to the reference’s recap wording, including corresponding social metadata. Preserve the canonical domain, favicon setup, crawler files, and valid organization/site structured data.
- Give meaningful photos and portraits appropriate alternative text; keep decorative hero imagery out of the reading order.

### 5. Verify and refine the match

- Compare reference and implementation at identical viewport sizes and browser settings, with fonts and images fully loaded.
- Start with native 1440px desktop and 390px mobile captures. Compare every section, using overlays or image differences where supported.
- Correct font metrics and wrapping first, then section geometry, image crops, rotation, shadows, and small spacing differences.
- Check 375px, 430px, 767px, 768px, 1024px, and 1920px widths for scaling, composition switching, centering, overflow, and anchor navigation.
- Verify keyboard navigation, visible focus, reduced motion, external URLs, and complete image loading.
- Smoke-check `/join` and `/apply` without submitting form data.

## Expected file changes

| File or area | Planned change |
| --- | --- |
| `src/app/App.tsx` | Replace the existing landing page with the recap composition. |
| `src/app/components/recap/` | Add shared content and reusable components for both reference compositions. |
| `src/styles/recap.css` | Add scoped, reference-matched typography, layout, image cropping, and responsive scaling. |
| `src/styles/landing.css` and old landing components | Retire homepage usage; remove only verified unused code. |
| `public/recap/` | Add the exact extracted images and asset mapping. |
| `public/fonts/league-spartan/` | Add the four reference font files and their license. |
| Root `index.html` | Update recap metadata while preserving deployment and search configuration. |
| `tests/landing.test.tsx` | Update behavior checks that depend on the replaced navigation/content; retain relevant coverage for remaining code. |
| `tests/seo.test.mjs` | Update expected recap metadata and retain structural SEO checks. |

No new runtime dependency is expected. `APPLICATION_URL`, currently imported by `ApplyPage.tsx` from the existing landing content module, must remain available if that module is reorganized.

## Validation and completion criteria

Dependencies are not currently installed in this checkout. After approval, install from the existing lockfile, then run the applicable existing checks:

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run test:seo
```

The SEO check reads built output, so it must run after the build. Record baseline failures before attributing them to this change: source inspection already shows the current sponsor test expects a row structure and sponsor count that differ from the existing content.

Completion requires:

- All reference sections, text, photos, judges, winners, and sponsors are present in the correct order.
- Native desktop and mobile screenshots match the reference’s composition, text wrapping, spacing, colors, and image crops, with any unavoidable browser rasterization differences identified.
- Intermediate widths follow the supplied scaling rules, with working links and no unintended horizontal overflow.
- All local assets load successfully and the original application routes still work.
- Applicable type, behavior, build, and SEO checks pass, or any pre-existing issue is explicitly documented.

## Approval and implementation results

The user approved this plan before implementation. The homepage now uses shared React components, the original 23 images, and all four original League Spartan fonts. The supplied content and fixed-composition scaling are preserved. Only one composition is mounted at a time so that hidden duplicate headings and links cannot enter the accessibility tree.

Validation completed:

- `npm run typecheck`, `npm test` (31 tests), `npm run build`, and `npm run test:seo` (8 checks) pass.
- Before the follow-up width adjustment and subsequent copy edits, independent comparison against the original HTML found no differences in element structure, visible leaf text, link destinations, image assignments, or the source's explicit CSS declarations: 382 desktop elements / 2,946 declarations and 388 mobile elements / 3,062 declarations.
- Browser checks covered 375, 390, 430, 767, 768, 1024, 1440, and 1920px widths. Each displays one composition, working section targets, and no horizontal overflow.
- The original image bytes were verified with SHA-256 hashes. All 33 rendered image instances loaded successfully during the full-page desktop check.
- Desktop and mobile hero, photos, winners, judges, and sponsors were reviewed in the browser. Fresh page load produced no console warnings or errors.
- `/join` renders its existing form without recap document styles. `/apply` redirects successfully to `https://apply.hackatlantic.ca/`. No applications were submitted.
- The legacy sponsor assertion already failed before its replacement; it expected an outdated count and row arrangement. The new recap test verifies the approved 13 sponsors and their order.

Small functional improvements that preserve the design: semantic headings, descriptive photo text alternatives, one tab stop per project, deep-link adaptation when switching layouts, and full-width scaling without side gutters or scrollbar-induced horizontal overflow (requested in the user’s follow-up).

Local verification artifacts (ignored by Git) are in `.preview/`: `reference-conformance.json`, `recap-desktop.png`, `recap-desktop-full.png`, and `recap-mobile-full.png`.

Limitation: the browser's local-file restriction prevented rendering the original HTML for a screenshot pixel diff. Source structure/style comparisons and live implementation screenshots were used for verification instead. No deployment was performed.

### Follow-up: remove side gutters

The user reported cream gaps beside the page at widths above 1440px. Removed the desktop scale cap and centered margins. Both compositions now scale to the document’s available width, excluding the scrollbar, while preserving the reference’s internal geometry. Added a regression check for a 1920px viewport with a 15px scrollbar. Browser measurements confirm both page edges match the available width at all eight tested sizes, including 1920px. The updated screenshot is `.preview/recap-no-gutters.png`.

### Follow-up: navigation layout

At the user’s request, the navbar now overrides the reference: Recap, Winners, Judges, and Sponsors appear on the left; email, Instagram, and LinkedIn icon links appear on the right. The navbar logo/wordmark has been removed. The existing social destinations are restored. On mobile, the four section links use two rows on the left while the social icons remain on the right.

The desktop navigation now occupies a centered 720px area within the 1440px composition, bringing both groups inward to match the user’s latest placement screenshot. The mobile layout retains its existing spacing.

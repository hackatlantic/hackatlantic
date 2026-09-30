# Photo gallery implementation plan

Status: approved by the user and implemented. Validation results are recorded below.

## Result

Create `hackatlantic.ca/photo-gallery` with every photo from the two supplied Drive folders. Use the landing page’s existing polaroid appearance in a spacious, five-column desktop grid. The page will use the same cream background, dark teal text, and League Spartan typeface.

## Verified source inventory

Checked on September 29, 2026 through the Google Drive connector:

| Source | Photos | Original size |
| --- | ---: | ---: |
| [HACKATHON - saturday](https://drive.google.com/drive/folders/1fYRXdQMh9KY_jxa79B7JT-Tw_QLHkSjN) | 20 | 123.0 MB |
| [HACKATHON - sunday](https://drive.google.com/drive/folders/1r5UDM-d9z9piEjGYZE1WUTBm19z_1f9s) | 29 | 185.3 MB |
| **Total** | **49** | **308.3 MB** |

All returned files are JPEGs with distinct Drive IDs. Image searches and unfiltered folder listings returned the same IDs. The searches returned no further page tokens, and neither folder contains nested folders. The complete filename/ID inventory is saved in [docs/photo-gallery-source-inventory.json](docs/photo-gallery-source-inventory.json).

At planning time the originals had not yet been downloaded or decoded. Both folders were rechecked during implementation and still contained 49 photos; the import workflow treats this as a verified snapshot, not a permanent hard limit.

## Page layout

- A compact header with “Back to recap” and the existing email, Instagram, and LinkedIn links.
- One `Photo Gallery` heading and a short subtitle: “Saturday and Sunday · 49 photos,” with the count generated from the gallery data.
- One continuous grid containing Saturday’s photos followed by Sunday’s photos, each in ascending natural filename order. Every photo is present from the start; loading image bytes lazily will not limit the collection.
- A centered content area with a maximum width of 1600px and 48px desktop side padding. The cream page background fills the entire viewport.
- Desktop spacing starts at 40px between columns and 56px between rows. Frames remain separate, with room for their shadows and slight, deterministic tilts of no more than two degrees.
- A small footer provides the two original Drive album links and a back-to-top link.

| Viewport width | Columns | Horizontal spacing |
| --- | ---: | ---: |
| 1280px and wider | 5 | 40px |
| 1024–1279px | 4 | 32px |
| 768–1023px | 3 | 28px |
| 480–767px | 2 | 24px |
| Below 480px | 1 | Centered card, maximum 360px wide |

Use normal responsive CSS grid rather than the homepage’s fixed-canvas zoom. Mobile side padding is 24px, with at least 32px between rows. Verify the breakpoint boundaries and adjust only if the real images expose cramped spacing or clipping.

## Polaroid treatment and photo viewing

Reuse the current frame’s `#fffdf4` paper color, square corners, soft shadow, narrow top/side borders, and larger bottom border. The existing desktop frame is 400 × 348px with 16px top/side borders and a 40px bottom border; scale these proportions to the gallery cards. Keep frame styling scoped so the existing recap photo stacks retain their appearance.

Preserve image orientation and show the full photograph inside each frame using `object-fit: contain`. This avoids losing people or details at the edges of portrait and landscape photos. Keep the larger bottom border visually clean.

Clicking a frame opens a larger, uncropped version in an accessible lightbox. Include close, previous/next controls, and a “Photo 12 of 49” counter. Support Escape, arrow keys, trapped dialog focus, and focus return to the selected frame. Provide an “Open original” Drive link in the viewer. Write concise, factual image descriptions after reviewing the actual photos.

## Include every photo and keep loading efficient

1. Re-inventory both folders, following every pagination token and recursively inspecting any new subfolders or image shortcuts. Record non-photo files separately if any appear.
2. Download every photo to an ignored local staging directory. Use Drive IDs in filenames so repeated camera filenames cannot overwrite each other. Preserve separate source files even if they look similar.
3. Verify each download decodes successfully, record its dimensions and checksum, and normalize EXIF orientation when preparing display images.
4. Generate optimized local WebP variants at approximately 400px and 800px wide for grid images, plus a larger preview capped at a 2000px long edge. Do not upscale small sources. Keep the original image composition and colors.
5. Serve the optimized files from `public/gallery/`. Keep the roughly 308 MB of originals out of the deployed site. Visitors will not need Google authentication to see the gallery; the original Drive links remain available for accessing originals.
6. Generate a gallery manifest with each source ID, album, filename, source link, dimensions, alt text, and local image paths. Explicit dimensions, responsive image sources, and lazy loading below the first row will reduce layout shifts and unnecessary downloads. Load the larger preview when requested.
7. Compare the source ID set with the generated manifest and displayed card ID set. Missing, duplicate, undecodable, or failed image conversions must fail verification rather than silently remove a photo.

The gallery is a checked-in snapshot. Adding photos to Drive later requires rerunning the import/preparation workflow and deploying the refreshed assets; no live Drive API or credentials are added to the browser.

## Website integration and expected files

| Area | Planned change |
| --- | --- |
| `src/main.tsx` | Register `/photo-gallery` in the existing router. |
| `src/app/PhotoGalleryPage.tsx` | Page header, heading, gallery, and footer. |
| `src/app/components/gallery/` | Polaroid card, accessible viewer, and manifest types/data. |
| `src/styles/gallery.css` | Scoped frame styling and responsive grid. Reuse existing font assets. |
| `public/gallery/` | Optimized grid images and larger previews for every source photo. |
| `scripts/` | Repeatable image preparation and source/manifest completeness verification. |
| `src/app/components/recap/RecapPage.tsx` and `content.ts` | Replace the two outgoing album calls to action with one internal “View all photos →” link. Original album links remain on the gallery page. |
| `public/sitemap.xml`, metadata/build support, `docs/SEO.md` | Add the gallery URL and page-specific title, description, and canonical metadata using the repository’s existing `www.hackatlantic.ca` convention. Ensure initial gallery HTML carries gallery metadata. |
| `tests/`, `README.md` | Cover collection completeness, route/viewer behavior, updated entry link, and the refresh workflow. |

Confirm the host serves a direct visit and refresh at `/photo-gallery`, including the apex-to-www path behavior. Add only the route fallback or generated gallery HTML entry needed by the existing deployment. Implementation review will use a local preview; publishing is a separate step.

## Completion checks

- The imported and rendered ID sets exactly match both complete source folders: currently 20 Saturday photos plus 29 Sunday photos.
- Scroll through the entire page and confirm all 49 image instances load, including the final row. Open representative portrait and landscape photos and the last photo in the viewer.
- At 1440px and 1920px, the page displays exactly five columns with clear spacing and no overlapping frames. Check 375, 390, 480, 768, 1024, and 1280px widths for responsive behavior and horizontal overflow.
- Verify keyboard access, dialog controls, alt descriptions, reduced-motion behavior, and that full-size previews are not downloaded for every card on page load.
- Verify direct route loading, refresh, the homepage gallery link, back navigation, and metadata. Recheck the existing homepage and `/join` and `/apply` routes.
- Run type checking, the existing test suite plus targeted gallery tests, the production build, and SEO checks. Save desktop/mobile screenshots for review.

## Implementation results

The source folders were rechecked before importing: 20 Saturday JPEGs and 29 Sunday JPEGs, with no additional pages, nested folders, or non-photo files. All 49 originals were downloaded, visually reviewed, decoded, and given individual factual descriptions. Source hashes and dimensions are recorded in the generated gallery manifest.

The gallery has 147 optimized WebP variants totaling 15,565,870 bytes (about 15.6 MB), compared with 308,288,461 bytes of original JPEGs. Original photos and temporary authenticated download references remain in the ignored local staging directory. The page, lightbox, homepage entry link, production HTML entry, sitemap entry, and repeatable preparation/verification scripts are implemented.

Type checking, all 37 behavior tests, all 10 SEO checks, and the production build passed. The build verifies exact source/manifest ID equality and decodes every generated image.

Browser review confirmed all 49 grid images loaded successfully, no larger previews were present before opening the viewer, and the final photo is reachable. The gallery displays 1, 1, 2, 3, 4, 5, 5, and 5 columns at 375, 390, 480, 768, 1024, 1280, 1440, and 1920px respectively, with no horizontal overflow. Portrait and landscape viewing, keyboard wrapping, Escape, focus restoration, homepage entry, and direct gallery refresh were verified. Desktop/mobile screenshots are saved in `.preview/photo-gallery-desktop.png` and `.preview/photo-gallery-mobile.png`.

The existing `/join` form still renders, and `/apply` still redirects to the application portal. The join page emits existing React ref warnings from its unchanged Input/Textarea components; the gallery did not produce those warnings. No forms were submitted.

The local development server is available on port 5173. Production HTML and the direct route rewrite are included in the build; live apex-to-www path verification awaits deployment. No production deployment was performed.

Follow-up: the user’s browser URL contained a trailing period (`/photo-gallery.`), which did not match a route and rendered blank. Added a client redirect and a matching production redirect to `/photo-gallery` so that this URL also opens the gallery.

Publication follow-up: the user requested restoring the homepage button and pushing to `master`. The recap now includes a prominent dark teal “Photo gallery” button linking to the complete local gallery. Browser verification confirmed the button works and the trailing-period URL redirects successfully. Type checking, all 37 behavior tests, the image verification/build, and all 10 SEO checks passed before committing.

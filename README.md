# Hack Atlantic recap

React, TypeScript, and Vite implementation of the approved desktop and mobile recap reference. See [the implementation plan](<plan doc.md>) for scope and validation results.

## Development

```sh
npm ci
npm run dev
```

The homepage uses the original 1440px desktop and 390px mobile compositions, switching at 768px and scaling them to fill the available page width without side gutters, including screens wider than 1440px. The `/join` organizing-team form and `/apply` redirect remain available.

Recap content and image crops are in `src/app/components/recap/content.ts`; components are in `RecapPage.tsx`; styling is scoped in `src/styles/recap.css`. Original images and their source hashes are in `public/recap/`. League Spartan fonts and their license are in `public/fonts/league-spartan/`.

## Validation

```sh
npm run typecheck
npm test
npm run build
npm run test:seo
```

The SEO checks inspect both source and built output, so run the build first. Canonical URLs and crawler configuration are documented in [docs/SEO.md](docs/SEO.md).

## Photo gallery

Open `http://localhost:5173/photo-gallery` after starting Vite. The gallery contains all 49 photos from the Saturday and Sunday Drive albums, with five desktop columns, responsive layouts, and a keyboard-accessible photo viewer. The recap’s “Photo gallery” button opens this page.

All 147 optimized image variants are checked in under `public/gallery/` (about 15.6 MB total). Original JPEGs remain in ignored `.preview/gallery-originals/`; they are not required to run or build the site. The grid loads smaller variants as needed, and the viewer requests a larger image only when opened. Drive is not contacted to render photos.

The production build verifies the complete collection and generates `dist/photo-gallery/index.html` with gallery-specific metadata. `vercel.json` maps direct requests to this entry. Use Node 20.9 or newer for the Sharp image tooling.

To refresh the collection:

1. Re-inventory both folders linked in `docs/photo-gallery-source-inventory.json`, following every page and any new nested folders. Update the inventory and total counts. Retain every distinct source ID, including similar-looking photos.
2. Fetch each original through the Drive connector with `download_raw_file: true` and `include_base64: false`. Save the returned authenticated file-reference download URLs as an ignored `.preview/gallery-downloads.json` array of `{ "id": "drive-file-id", "url": "authenticated-download-url" }`. Do not commit these temporary URLs.
3. Run `node scripts/download-gallery.mjs .preview/gallery-downloads.json`. It resumes already downloaded files and verifies every source byte count. Refresh expired connector references if necessary.
4. Review new photos and add factual alt descriptions keyed by Drive ID in `docs/photo-gallery-descriptions.json`.
5. Run `npm run gallery:prepare`, then `npm run gallery:verify`. These commands require no Drive access after downloading. Preparation normalizes orientation, generates WebP variants, and records source SHA-256 hashes and dimensions in the gallery manifest.
6. Update count expectations if the source collection changes, run the validation commands above, and review desktop/mobile screenshots before deploying the refreshed snapshot.

The preparation and verification scripts fail on missing descriptions, incomplete originals, duplicate IDs, missing variants, or corrupt images. If source files were intentionally removed from the inventory, remove their obsolete generated variants explicitly; verification rejects leftover assets.

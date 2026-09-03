# Landing-page search setup

The canonical public homepage is **https://www.hackatlantic.ca/**. The apex
`https://hackatlantic.ca/` already redirects there (verified 2026-09-03). This is
the marketing site, not the application portal at `apply.hackatlantic.ca`.

## Included

- Descriptive title, description and canonical link in the initial HTML.
- Matching Open Graph/Twitter metadata using the existing sunset artwork.
- `WebSite` and `Organization` JSON-LD identifying **Hack Atlantic** and
  **HackAtlantic**, with social links already shown on the homepage.
- Public `robots.txt` and `sitemap.xml`. The sitemap lists the homepage, not
  application forms, previews or fragment links.

No paid service, extra dependency, DNS migration or redesign is needed. No
keywords tag, invented ratings, unconfirmed event venue or fabricated `lastmod`
date is included. The body remains client-rendered; this is not full prerendering.

## Validate

```sh
npm run build
npm run test:seo
```

Tests check source HTML and built output, valid JSON-LD, public image availability,
consistent canonical URLs and crawler files. Deploy `dist` with the existing Vite
build, not the archived duplicate under `src/Hack Atlantic Landing Page`.

## After the approved production deployment

1. Verify the homepage returns HTTP 200 with the new HTML metadata and the apex
   still redirects to `www`. Check that no production `noindex` header or tag is
   present. Check preview deployments separately for a hosting-level `noindex`;
   do not add one to the shared production HTML.
2. Open `https://www.hackatlantic.ca/robots.txt` and
   `https://www.hackatlantic.ca/sitemap.xml`. They must return text/XML with HTTP
   200, not an HTML fallback or 404.
3. Open Google Search Console using the account with access to the verified
   `hackatlantic.ca` domain property. OAuth branding review and search indexing
   are separate processes. If access is missing, ask the verified owner to grant
   it; do not replace existing DNS verification records.
4. Under **Sitemaps**, submit `https://www.hackatlantic.ca/sitemap.xml`.
5. Under **URL inspection**, inspect `https://www.hackatlantic.ca/`, test the live
   URL and request indexing. Review Google's selected canonical and exclusions.
6. Track both `HackAtlantic` and `Hack Atlantic` in the Performance report:
   impressions, clicks and average position. Manual results vary by location and
   personalization, so one search is not a definitive ranking measurement.

Keep university, MLH, sponsor and official social links pointing to the same
homepage. Request genuine listing updates where appropriate, not spam links.
Keep public copy and metadata consistent when event details change.

These changes improve discovery and presentation; they cannot guarantee
indexing, a particular snippet or first place. Crawling changes takes time.

## References

- [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Site-name structured data](https://developers.google.com/search/docs/appearance/site-names)
- [Supported meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags)
- [Sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

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

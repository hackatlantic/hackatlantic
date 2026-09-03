# Landing experience

Design review branch: `codex/landing-experience`, based on `origin/master` in
`DaxManuel27/hackatlantic`. No production deployment is part of this change.

## Preserved

- Fredoka typeface and existing Hopewell Rocks, Gros Morne, and Confederation Bridge illustrations.
- Existing event details, supporter assets, and social/contact destinations.
- The `/join` flow and its data storage; no backend or infrastructure changes.

## Changes

- Responsive flowing layout, fixed navigation, and a mobile menu with focus trapping,
  Escape dismissal, and section focus after navigation.
- Cream/ink reading sections and directional hero contrast overlays instead of text shadows.
- Apply links point to `https://apply.hackatlantic.ca/`; legacy `/apply` redirects there.
  The obsolete application-opening notification form is removed from the homepage.
- Accessible FAQ controls, visible keyboard focus, and a skip link.
- Small CTA press/hover feedback, one-time hand-drawn underlines, word-level scroll
  motion, and 8 px scenic parallax. Content is never hidden waiting for animation.
- An optional pixel postcard using the site's own coastline illustration. Original
  remains the default. Animation only starts on request, ends after five seconds,
  and stops offscreen or when the tab is hidden. Reduced-motion mode disables playback.

## References and scope

The user supplied 21st.dev handwriting/scroll references and the
[Ink Garden ASCII preset](https://21st.dev/community/ascii). These inform the
interaction direction, not a wholesale component import. The drawn accent uses
SVG strokes beneath live Fredoka text, without a remote font parser or another
handwriting font. Scroll effects use the already-installed Motion package and
native scrolling, without Lenis or scroll interception.

The postcard is a focused Canvas2D dither interpretation: 9 px averaged cells,
158% contrast, Bayer ordered color quantization, full coverage, no tint or enabled
post-effects, and a subtle pulse. It is **not** the complete multi-mode ASCII
editor or a pixel-exact recreation. The reference photo was not available;
the original Hack Atlantic illustration is used instead. Canvas resolution is
capped at 720×480, source sampling is cached, and playback is capped at 18 fps.

Reduced-motion handling follows [Motion's accessibility guidance](https://motion.dev/docs/react-accessibility).
Existing asset attributions remain in `ATTRIBUTIONS.md`.

## Verification — 2026-09-02

Run locally:

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run dev -- --host 127.0.0.1 --port 4180
```

- 15 component/unit tests: Apply destinations, modal controls and focus, section
  navigation, FAQ keyboard behavior, reduced-motion heading, readable drawn text,
  retained supporters, original/pixel toggles, and dither sampling/color bounds.
- Type checking covers the changed landing components and application redirect;
  it is not a claim of type safety for the unused exported Figma component library.
- Browser review at 320, 390, 768, and 1280 px frame widths: no document overflow
  or measured heading/navigation/card overflow. On this browser, the scrollbar
  consumes 12 px, so content viewports are correspondingly narrower.
- Browser checks: mobile menu open/section navigation, FAQ expansion, original/pixel
  rendering, manual animation start, timed stop, and return to original.
- OS reduced-motion behavior has component coverage, not a separate real-device
  accessibility audit. No Lighthouse score or mobile performance claim is made.

The ignored `.preview/responsive.html` is a local-only viewport review harness,
not shipped application code. Review the visuals and confirm the inherited event
details before publishing. Build success does not constitute deployment approval.

## Separate follow-up

Installing test tooling surfaced eight npm audit advisories (one low, six high,
one critical). Existing lockfile versions include Vite 6.3.5, react-router 7.13.0,
tar 7.5.13, and ws 8.20.0. This design change does not claim to resolve dependency
security. Review those updates in a focused maintenance change before release;
do not run a forced broad dependency upgrade as part of visual review.

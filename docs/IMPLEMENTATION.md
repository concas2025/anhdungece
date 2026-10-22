# Liquid chrome refresh

Implemented 22 October 2026 for the existing GitHub Pages site. Public contact links, bank recipient and QR image contents are preserved.

## Effects and provenance

- `src/components/effects/apple-hello-effect.tsx`: supplied Apple Hello SVG paths, with shorter timing and reduced-motion support. Fullscreen sequence is controlled separately by `welcome-intro.tsx`: English, Vietnamese, exit; 4.7 seconds total. Runs once per session, with Skip, Escape and a replay control. Session storage failure does not block the site.
- `handwritten-name.tsx`: original monoline SVG lettering for Phạm Anh Dũng, including the dot under ạ and tilde over ũ. The heading draws after the welcome; footer draws once when visible. Accessible plain text accompanies decorative SVG paths.
- `holo-chrome-flow.tsx`: the owner's supplied background, adapted for ascending GLSL smoothstep edges, safe scale, normalized short hex colors, independent ripple time, visibility handling, cleanup, and a 30 Hz drawing cap. Smaller screens use lower resolution and no pointer interaction. A CSS fallback stays available without WebGL2.
- `liquid-metal-renderer.js`: the supplied WebGL2 button renderer retained as an instance-owned lifecycle. All textures, framebuffers, buffers, shaders and programs are disposed, including partial initialization failure. Hidden/offscreen work pauses. Reduced motion freezes the time and skips ripples. It is used on the main CTA; other controls share lighter CSS metal treatments.
- `text-reveal.tsx`: adapted from the MIT TextEffectTwo implementation in https://github.com/mwaqar29/react-text-animate at `68e0add9a58d3f0ff7cec0ef9ddec121087fdcfc`. Uses the application's Motion dependency instead of retaining the library's React-18-era runtime; words are exposed to assistive technology once and animation does not change line layout.
- `src/lib/threeui/topDockController.js`: recovered original spring controller from `@designcodeio/threeui` 1.2.0, MIT. Semantic section links, current-section detection and responsive glass styling are owned by this site. The demo's separate Three.js bead scene is intentionally omitted so the supplied HoloChromeFlow remains the sole page background. Copyright notices are in `licenses/`.

## Content and behavior

- Desktop has a left navigation rail and two information columns. Below 1180px the rail becomes a bottom dock with safe-area spacing.
- Native links replace clickable nested button containers. Copy controls are separate buttons.
- QR codes always have solid white backgrounds; both bank selectors remain available.
- Avatar and both QR assets are copied without alteration into `public/images/` to avoid external image-host dependency.
- The prior contact form simulated sending with a timeout. It now composes a mailto draft, and accurately tells visitors that final sending happens in their email application. No backend or fake success message.
- Zalo's existing `https://zalo.me` destination remains unchanged because no account-specific URL was provided.
- Light and dark palettes use Tailwind v4 semantic theme mapping. The first-visit default is dark, and the existing theme preference persists.

## Verification

Production static export and TypeScript checks are run with `npm run build`. Browser QA covers desktop at 1440px and phone at 375px, theme switching, bank/QR selection, contact dialog focus and dismissal, copy feedback, navigation, welcome replay/skip, and absence of horizontal overflow. Production browser QA and deployment outcomes are recorded by the implementing chat. Reduced-motion and WebGL fallback branches were reviewed in source; the in-app browser does not expose a media-emulation capability, so those preferences were not force-emulated in it.

## Development and publication

```sh
npm ci
npm run dev
npm run build
```

Default URLs include `/bio-link/`. `GITHUB_PAGES=false` builds without that prefix for another host. Static output is `out/`; deploy its contents to `gh-pages` and include `.nojekyll`. `next start` is not the way to serve an exported site. GitHub Pages currently publishes from `gh-pages`; updating `main` alone does not publish the UI.

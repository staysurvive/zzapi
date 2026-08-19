# Current Palette Audit

## Evidence

Captured 2026-08-18 from the current local runtime in default theme preset state (`data-theme-preset` absent):

- `../zzapi-product-redesign/research/evidence/dark-palette-audit/01-home-light-full-current.png`
- `../zzapi-product-redesign/research/evidence/dark-palette-audit/03-home-dark-full-current.png`
- `../zzapi-product-redesign/research/evidence/dark-palette-audit/05-console-overview-dark-1440x900-current.png`
- `../zzapi-product-redesign/research/evidence/dark-palette-audit/07-console-channels-dark-1440x900-current.png`
- `../zzapi-product-redesign/research/evidence/dark-palette-audit/08-console-usage-logs-dark-1440x900-current.png`
- `../zzapi-product-redesign/research/evidence/dark-palette-audit/09-console-settings-dark-1440x900-current.png`

Viewport: 1440x900. Locale: zh. Console role: authenticated administrator. Browser console errors: none.

## Findings

- P1: The authenticated main canvas is `ProductShell #0e1116`, while header/sidebar/card/input surfaces consume separate neutral-charcoal tokens. The three color temperatures make the workspace feel fragmented and darker than any single token implies.
- P1: Homepage below-fold has no brand palette boundary and falls from the scoped hero into generic theme tokens. In dark mode the result is one broad gray-black field with weak section separation.
- P2: Dashboard overlay layers and card gradients compound the dark canvas; settings inputs and content panels are readable but too close in luminance to the main surface.
- P2: Footer and several lower-page supporting text tiers use reduced opacity on already-muted text, producing weak hierarchy.
- P2: Canvas chart builders retain hard-coded black hover strokes and dark label colors that cannot be solved by CSS variables alone.

## Decision

Use scoped semantic token correction first, with premium black and silver as the dominant material. Keep ice blue limited to active states and focus, then fix remaining page-specific evidence. Do not repaint individual cards before the shared surface conflict is removed.

## Final Wave 1 Evidence

- Homepage default dark lower-fold desktop: `evidence/wave1/home-dark-premium-black-lower-1440x900-wave1.png`, `home-dark-premium-black-workflow-1440x900-wave1.png`, `home-dark-premium-black-cta-footer-1440x900-wave1.png`.
- Homepage default dark lower-fold mobile: `evidence/wave1/home-mobile-dark-premium-black-cta-footer-380x822.png` and `home-mobile-dark-premium-black-full-390.png` (the repeated sticky header in the full capture is a capture artifact; the viewport capture is the accepted evidence).
- Console default dark desktop: `evidence/wave1/console-overview-premium-black-1440x900-final.png` and `console-settings-premium-black-1440x900-final.png`.
- Console dense surfaces: `evidence/wave1/console-channels-premium-black-1440x900-final.png` and `console-usage-logs-premium-black-1440x900-final.png`.
- Console charts: `evidence/wave1/console-models-charts-premium-black-1440x900-final.png`.
- Console default dark mobile: `evidence/wave1/console-mobile-premium-black-390x844-final.png`.
- Tablet: `evidence/wave1/console-overview-premium-black-834x1194-final.png` and `home-dark-premium-black-lower-834x1194-final.png`.
- First-viewport comparisons: `evidence/first-viewport/home-{desktop,mobile}-{light,dark}-first-viewport-comparison.png`; desktop MAE is below `0.33`, mobile settled captures are below `0.62`. Differences are limited to the authorized lower-section reveal and normal theme-control focus state.

## Resolved Findings

- [P1 resolved] Blue-gray large surfaces were rejected by the user. Replaced with premium black, neutral graphite, silver borders, and restrained ice-blue accents.
- [P1 resolved] Workspace Canvas/VChart/Sankey dark styles now receive the default premium-black chart style; light and explicit custom presets retain legacy chart colors.
- [P1 resolved] Supporting dashboard text that was hidden by `/40` and `/60` opacity receives a scoped default-dark contrast lift.
- [P2 resolved] Mobile overview metrics now use a 2+1 layout and two-line title reserve; labels no longer truncate at 390px.
- [P2 resolved] Homepage footer secondary text was lifted to a measured contrast ratio above 4.5:1.

## Evidence Limits

- The authenticated theme drawer's visible DOM and computed surface were verified during the browser run; the extension screenshot surface did not consistently include the portal layer, so the final overlay evidence is represented by the workspace inheritance contract and DOM state rather than a standalone raster crop.

## Final Wave 2 Evidence

Captured 2026-08-19 from the local Rsbuild runtime at `http://localhost:3100`:

- `evidence/wave2/home-dark-first-1280x720-wave2-settled.png`
- `evidence/wave2/home-dark-lower-1280x720-wave2.png`
- `evidence/wave2/pricing-dark-premium-black-1280x720-wave2-settled.png`
- `evidence/wave2/pricing-light-1280x720-wave2-settled.png`
- `evidence/wave2/pricing-dark-mobile-390x844-wave2.png` (layout metrics and overflow verified; screenshot capture timed out in the browser transport)

Wave 2 confirms that the dark public model plaza now uses a neutral black material poster with the geometric form confined to the lower-right, while the hero/search and card surfaces remain readable. The light route still resolves to the original light poster and light product tokens. Mobile DOM metrics report `scrollWidth === clientWidth` with no horizontal overflow; the poster and layout fit the 390px responsive viewport.

Wave 2 changes:

- Default dark public product tokens now use graphite and silver instead of the previous navy brand-soft surface.
- Default authenticated workspace primary, focus, sidebar, chart and overview accents were desaturated to silver/neutral tones; explicit presets remain untouched.
- Dashboard premium-dark chart palette begins with silver and uses neutral low-saturation materials; flow fallback and uptime status 3 no longer fall back to cobalt blue.
- Dark model-plaza poster was regenerated as a text-free black/graphite editorial material with no blue illumination and copied to `web/public/product-brand/model-plaza-poster-background-dark.png`.

## Final Wave 3 Evidence

Captured 2026-08-19 from the explicit frontend development runtime at `http://localhost:3001`. Port `3000` evidence is not used for acceptance.

- Default workspace: `evidence/wave3/console-default-dark-1440x900.png` and `console-default-dark-390x844-final.png`.
- Dense operational surfaces: `console-channels-1440x900-final.png`, `console-usage-logs-1440x900-final.png`, and `console-system-settings-1440x900-final.png`.
- Tablet workspace: `console-overview-834x1194.png`; viewport and main content both report no horizontal overflow.
- Portal inheritance: `console-theme-drawer-1440x900.png`; the live dialog surface resolves to `rgb(17, 19, 21)` with the workspace marker present and no preset. The extension screenshot transport does not paint the drawer layer, so the computed surface and visible DOM are the authoritative portal evidence.
- Homepage: `home-dark-first-1280x720-settled.png`, `home-dark-lower-1280x720.png`, and `home-dark-lower-390x844.png`.
- Theme boundaries: default dark workspace resolves to `#111315` canvas / `#1a1c1f` card, Anthropic retains its own semantic tokens, and default restoration removes `data-theme-preset`. The homepage lower fold now opts in only when no explicit preset exists; Anthropic inherits its own body tokens and defines no local `--home-*` surfaces.

The dark model-plaza poster and public ProductShell dark tokens are owned by `08-18-zzapi-public-discovery`. They are retained here only as cross-phase theme-boundary evidence and are not part of this task's workspace/home acceptance scope.

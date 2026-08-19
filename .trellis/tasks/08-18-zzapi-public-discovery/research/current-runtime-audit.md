# Phase 2 Current Runtime Audit

Date: 2026-08-18

Capture tool: Codex in-app browser against `http://localhost:3001`.

The captures below are the accepted screenshots from the current runtime. Desktop captures use the browser default viewport (approximately 1268x1008); mobile captures use an explicit 390x844 viewport. Most captures use the default dark theme and the deterministic seeded data visible in the running app; the light-theme comparison is called out separately.

## Accepted Evidence

| Surface        | State                      | Desktop evidence                                                                                       | Mobile evidence                                                 | Notes                                                                                                                                     |
| -------------- | -------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Model plaza    | populated                  | `evidence/current-audit/01-pricing-desktop.png`                                                        | `evidence/current-audit/10-pricing-mobile-390x844.png`          | Search, filter entry, sorting, view switch and three seeded model results visible                                                         |
| Model detail   | found / overview           | `evidence/current-audit/02-model-detail-desktop.png`                                                   | `evidence/current-audit/11-model-detail-mobile-390x844.png`     | Price table and performance metrics visible                                                                                               |
| Model detail   | API tab                    | `evidence/current-audit/03-model-detail-api-desktop.png` plus `04-model-detail-api-params-desktop.png` | `evidence/current-audit/12-model-detail-api-mobile-390x844.png` | API example and parameter table captured in viewport-sized segments; full-page stitching was rejected because fixed navigation duplicated |
| Rankings       | populated / week           | `evidence/current-audit/05-rankings-desktop.png` plus `06-rankings-list-desktop.png`                   | `evidence/current-audit/13-rankings-mobile-390x844.png`         | Chart, model ranking and market-share entry states visible                                                                                |
| About          | missing configured content | `evidence/current-audit/07-about-desktop.png`                                                          | `evidence/current-audit/14-about-mobile-390x844.png`            | Attribution and protected repository links preserved in fallback                                                                          |
| Privacy policy | missing configured content | `evidence/current-audit/08-privacy-policy-desktop.png`                                                 | `evidence/current-audit/15-privacy-policy-mobile-390x844.png`   | Empty state card visible                                                                                                                  |
| User agreement | missing configured content | `evidence/current-audit/09-user-agreement-desktop.png`                                                 | `evidence/current-audit/16-user-agreement-mobile-390x844.png`   | Empty state card visible                                                                                                                  |
| Model plaza    | populated / light theme    | `evidence/current-audit/17-pricing-desktop-light.png`                                                  | —                                                               | Light theme exposes model-name truncation and the same legacy sidebar/card hierarchy                                                      |

## Findings

### Model plaza

- The current page remains a legacy `PublicLayout` surface with a centered hero, large decorative gradient field, a filter/sidebar split and a traditional card grid.
- Desktop leaves a large unstructured lower canvas after three cards; the result area does not communicate provider or capability comparison as a primary task.
- Mobile reorganizes the sidebar into a filter button and the cards into one column, but the toolbar still compresses filtering, sorting and view controls into one dense block. The last visible card is close to the viewport edge and the persistent devtools affordance obscures its lower edge in the capture.

### Model detail

- The route has a strong data contract (identity, metrics, pricing, group table and API tab) but no product public shell hierarchy beyond the legacy header.
- On mobile, the five-column group price table is too compressed for comfortable comparison, and the API code block exposes long-line clipping rather than a deliberate scroll or wrap treatment.
- The API tab is functionally present and copyable; this audit does not claim clipboard success without a direct clipboard assertion.

### Rankings

- The chart is visually dominant and pushes the actual model/provider comparison below the first desktop viewport and toward the bottom of the mobile viewport.
- Trend meaning has text (`↑100%`) but the current visual system still relies heavily on color and chart geometry to communicate change.
- Model and vendor lists are present and linkable, but the comparison context and period definition are separated from the rows.

### About and legal

- About correctly preserves `new-api`, `QuantumNous`, One API and license attribution, but the missing-content fallback is a generic construction/empty state with no useful zzapi product narrative.
- Privacy and user-agreement missing-content states are safe and readable on mobile, but provide no section navigation or long-form reading affordance when configured content exists; those states still need deterministic configured-content fixtures before implementation sign-off.

## Evidence Limits

- This run covers the populated or missing-content states available from the seeded local runtime. It does not prove loading, error, gated, not-found, configured legal, or configured About behavior.
- Light-theme comparison is captured for the model plaza; tablet coverage and light-theme captures for the other routes remain required implementation and Design QA gates.
- Full-page screenshots of fixed-header long pages were rejected as audit evidence because stitching duplicated the fixed navigation; viewport segments are used instead.
- Browser screenshots cannot establish complete keyboard, screen-reader, clipboard, or reduced-motion compliance; those require automated or direct interaction checks in the implementation wave.

## Implementation Wave Evidence

The first implementation wave keeps the accepted page structures and opts the public routes into the scoped Product Shell. It adds detail polish and responsive safety without changing data sources or route semantics.

| Surface      | Implementation evidence                                                                                                                                                                                  | Verified behavior                                                                                                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model plaza  | `evidence/detail-pass/pricing-poster-dark-1269x1008-final.png`, `pricing-poster-light-1440x900-final.png`, `pricing-poster-dark-390x844-final.png`, `pricing-poster-light-390x844-final.png`             | Original public navigation restored; theme-specific poster background, search, facets, price mode, M/K unit, card/table view, pagination, details drawer, and model copy path checked |
| Model detail | `evidence/detail-pass/model-detail-product-dark-1269x954.png`, `model-detail-product-dark-390x844.png`, `model-detail-api-product-dark-390x844.png`, `model-detail-performance-product-dark-390x844.png` | Back route, Overview/Performance/API tabs, copy action, mobile group-table overflow, code horizontal scroll and empty performance state checked                                       |
| Rankings     | `evidence/detail-pass/rankings-product-dark-1280x720-asset-final.png`, `rankings-product-dark-390x844.png`                                                                                               | Period tab navigation updates `?period=month`; chart, leaderboard and market-share hierarchy remain intact at mobile width                                                            |
| About        | `evidence/detail-pass/about-product-dark-1280x720-final.png`, `about-product-dark-390x844.png`                                                                                                           | Default product narrative, configuration notice, route accessory and protected attribution remain visible and readable                                                                |
| Legal        | `evidence/detail-pass/privacy-policy-product-dark-final.png`, `privacy-product-dark-390x844.png`                                                                                                         | Missing-content state uses a semantic document heading and remains readable on mobile; configured-content structure remains source-controlled                                         |

Implementation QA comparison inputs are stored in `evidence/detail-pass/*-full-comparison*.png` and `design-qa.md`.

## Final Review And Fix Pass

Date: 2026-08-19. Runtime: frontend Rsbuild server at `http://localhost:3001`.

### Browser matrix

`evidence/final-pass/` contains the final seeded runtime states:

- Dark desktop `1280x720`, tablet `834x1194`, and mobile `390x844`: pricing, model detail, rankings, About fallback, and Privacy fallback.
- Light desktop `1280x720`: the same five route families.
- Final optimized pricing poster: `pricing-dark-1280x720-webp-final.png` plus `pricing-dark-390x844-final.webp-pass.png`; the live DOM reports one mounted poster, the active dark WebP source, and no horizontal overflow.

The final browser pass reports exactly one `main` per route, `scrollWidth === clientWidth` on all checked mobile/tablet route roots, and no page console errors. The mobile legacy menu was exercised for focus entry, Escape, exact body-overflow restoration, route close, and its `640px` breakpoint lifecycle.

### Deterministic state evidence

- Pricing and detail distinguish loading, successful empty/not-found, fatal request error, cached background-refresh error, retry-in-progress, and recovered content. Cached data remains usable after a background failure.
- Pricing table rows open with Enter/Space; icon-only view buttons have translated accessible names. Exactly one theme-selected `2048x1152` WebP poster is mounted (`77 KB` light / `82 KB` dark) instead of preloading both ~`2.6 MB` PNG files.
- Rankings uses recoverable error and single empty states; period tabs implement roving focus with Left/Right/Home/End and associate one tabpanel with the active period.
- About fixtures cover configured Markdown, sandboxed URL, default product narrative, protected attribution, and retry.
- Legal fixtures cover configured Markdown and sanitized isolated HTML, route-owned h1, duplicate/stable heading anchors, initial hash, same-page anchors, Back/Forward focus, real table overflow wrappers, no-heading content, missing content, and retry.
- Pricing/rankings route guards are called directly in tests for enabled, disabled, guest auth-gated, and authenticated states. Missing/invalid Docs configuration produces a disabled item without inventing `/docs` in ProductPublicHeader and TopNav.
- The seven-locale sync report is `0` missing, `0` extras, and `0` untranslated for every locale; a full literal `t()` scan reports no missing key.

### Final audit result

Two independent review rounds found and resolved cached-data loss, retry lifecycle, pointer-only table detail actions, unnamed icon buttons, legacy mobile-menu focus/scroll leaks, Legal h1/table/hash defects, stale docs fallback, and dual-poster preloading. No actionable P0/P1/P2 finding remains in the final source and rendered-state review.

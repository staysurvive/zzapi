# Product Design QA — Public Pricing Detail Pass

## Source And Implementation

- Source visual truth: `D:/new-api/.trellis/tasks/08-18-zzapi-public-discovery/research/evidence/current-audit/01-pricing-desktop.png`
- Brand reference: `C:/Users/npp_c/.codex/attachments/6044b8c8-9679-440c-bbe4-f58908c72e82/image-1.png`
- Implementation screenshot: `D:/new-api/.trellis/tasks/08-18-zzapi-public-discovery/research/evidence/detail-pass/pricing-poster-dark-1269x1008-final.png`
- Full comparison input: `D:/new-api/.trellis/tasks/08-18-zzapi-public-discovery/research/evidence/detail-pass/pricing-poster-full-comparison-final.png`
- Focused comparison input: `D:/new-api/.trellis/tasks/08-18-zzapi-public-discovery/research/evidence/detail-pass/pricing-poster-focused-comparison-final.png`
- Route: `/pricing`
- State: populated seeded catalog, guest, card view, standard pricing, `/1M`, dark theme, no active filters, no focus-required interaction.
- Source pixels: `1269 x 1008`.
- Implementation capture pixels: `1269 x 1008`.
- CSS viewport: `1269 x 1008`; device scale factor: `1`.
- Density normalization: none; source and implementation are equal-size native captures.

## Comparison Evidence

The full comparison places the accepted source UI on the left and the implementation on the right at the same content viewport. The focused comparison covers the original public header, hero, search, toolbar, and the first row of model cards. The implementation keeps the source information architecture: the original navigation/header, centered model-plaza heading, search, toolbar, three-card result grid, details action, and copy action. The former decorative radial gradients are replaced by separate light and dark premium material poster backgrounds.

## Required Fidelity Surfaces

### Typography

The heading hierarchy and body scale remain aligned with the source. The model name uses a compact monospace treatment and now wraps at word boundaries with a stable two-line box, avoiding the single-character break found in the first implementation capture. Letter spacing is explicitly neutral in the product heading scope.

### Spacing And Layout Rhythm

The source desktop composition remains centered and card-based. The first pass shortened excess top padding and tightened the sidebar/result gap without changing the content order. Tablet changes to a two-column card grid and a single-row toolbar at `834px`; mobile uses one column and stacked display controls. No overlap or persistent-control clipping was observed at `1440x900`, `1269x1011`, `834x1194`, or `390x844`.

### Colors And Tokens

Pricing surfaces use the scoped product tokens: cool canvas, graphite text, hairline borders, and restrained brand blue. Active filter and segmented states use the scoped brand-soft surface rather than saturated solid fills. Light and dark screenshots were captured and remain readable. No global token or homepage stylesheet was changed.

### Image Quality And Asset Fidelity

The other public routes reuse the supplied `landing-brand-core.png` for their product header mark. The pricing background and supporting accessories are generated raster PNGs and were dimension/edge inspected before use:

- `web/public/product-brand/model-plaza-poster-background.png`
- `web/public/product-brand/model-plaza-poster-background-dark.png`
- `web/public/product-brand/model-empty-route-accent.png`
- `web/public/product-brand/rankings-pulse-accent.png`
- `web/public/product-brand/about-route-accent.png`

The model plaza uses independent native `2048 x 1152` light and dark editorial material posters selected by theme. The empty-state asset is reserved for no-result states; the pulse asset marks the rankings trend context; and the About route fragment supports the default product narrative. Standard controls continue to use the existing Hugeicons/Lucide-compatible project icon usage. No inline SVG or CSS-drawn image replaced a target asset.

### Copy And Content

All visible pricing copy continues to use existing i18n keys. Search, filter, pricing-unit, billing-mode, detail, copy, pagination, and attribution text were not removed or renamed. The mobile filter sheet close label now uses the translated `Close` key.

## Interaction And Responsive Checks

- Search debounce: entering `gpt-5.6-sol` reduced the result set to one model; clear search restored the catalog.
- Mobile price controls: `/1K` remained reachable and changed the displayed prices and unit label.
- Mobile filter sheet: selecting OpenAI showed two models and exposed all existing facet sections; the sheet has product scope and a translated close label.
- Card/table view: table view remained available; at `390px` the table uses deliberate horizontal scrolling (`clientWidth: 365`, `scrollWidth: 1130`) instead of clipping columns.
- Details drawer: clicking the first model opened the canonical details content, tabs, metrics, pricing, group pricing, and a mobile-safe horizontal group table.
- Mobile navigation: the product menu exposes navigation plus language, theme, and notification tools; it retains the existing auth CTA.
- Error recovery: pricing, About, and Legal query failures now render the shared retry state; regression tests cover the retry affordance and error message.
- Console errors: none reported by the browser for the final checked tab.
- Reduced motion and focus styles remain covered by the existing scoped product-shell contract.

## Comparison History

### Iteration 1 — blocked by P1

- Finding: at `1440x900`, the model name `deepseek-v4-flash` was split into an awkward final-character line because the card header combined a long monospace title with actions and `break-all`.
- Fix: changed the title to a smaller two-line, word-boundary wrap with a stable minimum height and stretched card grid items.
- Evidence after fix: `D:/new-api/.trellis/tasks/08-18-zzapi-public-discovery/research/evidence/detail-pass/pricing-detail-pass2-1440x900.png`.

### Iteration 2 — blocked by P1

- Finding: the original mobile toolbar hid Standard/Recharge and `/1M`/`/1K`, and the product mobile header hid language/theme/notification controls.
- Fix: grouped display controls into a mobile-safe toolbar row and added the existing tools to the product navigation sheet without changing their behavior.
- Evidence after fix: `D:/new-api/.trellis/tasks/08-18-zzapi-public-discovery/research/evidence/detail-pass/pricing-detail-pass3-light-390x844.png` and `D:/new-api/.trellis/tasks/08-18-zzapi-public-discovery/research/evidence/detail-pass/pricing-product-menu-390x844.png`.

### Final pass

No actionable P0, P1, or P2 findings remain for this pricing detail pass. Remaining differences from the legacy source are the intentional theme-specific material posters, container-aware card columns, and scoped content tokens; the original public navigation has been restored.

### User-directed poster iteration — resolved

- [P1 resolved] The first generated whole-page background still read as a technical line/network diagram and was rejected by the user.
- Fix: removed the line background and its unused asset, restored the model plaza's original `PublicHeader`, and generated separate light and dark full-bleed 3D editorial posters based on frosted blue glass, silver metal, and abstract Z-like physical forms.
- Post-fix evidence: `pricing-poster-light-1440x900-final.png`, `pricing-poster-dark-1440x900-final.png`, `pricing-poster-light-390x844-final.png`, `pricing-poster-dark-390x844-final.png`, and the equal-size final comparison inputs listed above.

## Implementation Checklist

- [x] Preserve current pricing information architecture and data contracts.
- [x] Preserve search, facets, sort, pricing mode/unit, view mode, pagination, details, copy, and mobile menu behavior.
- [x] Add scoped product appearance without touching the frozen homepage files.
- [x] Add purposeful transparent brand accessories and inspect their alpha edges.
- [x] Validate desktop, tablet, mobile, light, dark, card, table, filter, and detail states.
- [x] Run changed-file format, lint, typecheck, related tests, and production build.

## Follow-up Polish

- P3: The active theme control retains its normal selected-state ring in the dark comparison capture; this is a valid control state, not a layout defect.
- P3: The route accessory can be tuned per future public route after the corresponding page hierarchy is implemented.

## Public Route Extension QA

The same comparison process was repeated for the public route consumers at a normalized `1280 x 720` desktop viewport (device scale factor `1`). The left side of each comparison is the accepted current runtime capture; the right side is the product-shell implementation.

- Rankings source: `D:/new-api/.trellis/tasks/08-18-zzapi-public-discovery/research/evidence/current-audit/05-rankings-desktop.png`
- Rankings implementation/comparison: `D:/new-api/.trellis/tasks/08-18-zzapi-public-discovery/research/evidence/detail-pass/rankings-product-dark-1280x720-asset-final.png`, `rankings-full-comparison-final.png`.
- About source/implementation/comparison: `07-about-desktop.png`, `about-product-dark-1280x720-final.png`, `about-full-comparison-final.png` in `D:/new-api/.trellis/tasks/08-18-zzapi-public-discovery/research/evidence/{current-audit,detail-pass}/`.
- Privacy source/implementation/comparison: `08-privacy-policy-desktop.png`, `privacy-policy-product-dark-final.png`, `privacy-policy-full-comparison-final.png` in the same evidence directories.
- User agreement source/implementation/comparison: `09-user-agreement-desktop.png`, `user-agreement-product-dark-final.png`, `user-agreement-full-comparison-final.png` in the same evidence directories.
- Model detail source/comparison: `02-model-detail-desktop.png`, `model-detail-product-dark-1269x954.png`, `model-detail-full-comparison.png`. The source contains populated performance metrics while the current runtime fixture returns no performance rows, so those values are intentionally not judged as visual drift.

### Extension findings and fixes

- [P1 resolved] Rankings and About had diverged to the product-header branch while the accepted model plaza uses the original public navigation. Both routes now use the same legacy `PublicLayout` / `PublicHeader` path as `/pricing`; desktop, mobile, light, and dark checks confirmed identical navigation content, one `main#main-content`, and no console errors. Final evidence: `rankings-legacy-nav-light-1440x900-final.png`, `rankings-legacy-nav-light-390x844-final.png`, `rankings-legacy-nav-dark-1440x900-final.png`, `about-legacy-nav-light-1440x900-final.png`, `about-legacy-nav-light-390x844-final.png`, and `about-legacy-nav-dark-1440x900-final.png`.
- [P2 resolved] Rankings content began too far below the product header after the first shell migration. The top spacing was reduced to match the existing route rhythm; final comparison is `rankings-full-comparison-final.png`.
- [P2 resolved] About fallback used a construction-only state and forced the brand label to uppercase. It now presents existing translated zzapi product context, keeps the configuration notice and all protected attribution, and uses lowercase `zzapi`.
- [P2 resolved] Legal fallback titles were generic card-title divs. They now render semantic `h1` headings while preserving the configured/missing state and legal copy semantics.
- [P2 resolved] Model detail tables and API/performance surfaces could compress on narrow screens. Group, parameter, rate-limit, performance, and code surfaces now use deliberate horizontal overflow with stable minimum widths; the mobile detail, API, and performance captures are in `detail-pass/`.

### Extension fidelity surfaces

- Typography remains the existing Public Sans/body plus monospace model/data treatment; no negative tracking was added.
- Layout preserves each route's original hierarchy: rankings chart then leaderboard/share/pulse, About narrative or configured content, Legal reading/fallback, and model detail tabs/pricing/API.
- Product tokens are scoped under `[data-zzapi-product]`; the frozen homepage files remain untouched.
- Existing logos are reused from `landing-brand-core.png`; the only generated accessories are the two purposeful pricing route/empty-state PNGs.
- Browser checks covered rankings period navigation, About fallback attribution, Legal fallback headings, model detail tabs, mobile code/table overflow, and console error checks on the pricing route.

## Dark Palette Comfort QA — Wave 1

### Source and implementation

- Source/problem evidence: `.trellis/tasks/08-18-zzapi-product-redesign/research/evidence/dark-palette-audit/03-home-dark-full-current.png` and `05-console-overview-dark-1440x900-current.png`.
- Brand source: `C:/Users/npp_c/.codex/attachments/6044b8c8-9679-440c-bbe4-f58908c72e82/image-1.png`.
- Implementation evidence: `.trellis/tasks/08-18-zzapi-dark-palette-comfort/research/evidence/wave1/console-overview-premium-black-1440x900-final.png`, `console-settings-premium-black-1440x900-final.png`, `console-channels-premium-black-1440x900-final.png`, `console-usage-logs-premium-black-1440x900-final.png`, `console-models-charts-premium-black-1440x900-final.png`, and `console-mobile-premium-black-390x844-final.png`.
- First-viewport comparison evidence: `.trellis/tasks/08-18-zzapi-dark-palette-comfort/research/evidence/first-viewport/`.
- Viewports: 1440x900 desktop, 390x844 mobile; IAB persisted PNGs are 1430x894 and 380x822 at DPR 1 for the freeze comparisons. Chrome clip captures are used only for authenticated workspace mobile evidence.
- State: default dark theme, default preset, zh locale, guest homepage and authenticated administrator workspace.

### Audit steps

1. Homepage lower-fold desktop and mobile: healthy after the rejected blue-gray pass was replaced by premium black and silver/graphite section layers.
2. Authenticated dashboard overview: healthy; header/sidebar/canvas/card layers now share a neutral black material hierarchy, with blue limited to actions, focus, chart traces and status.
3. Channels and usage logs: healthy; dense filter/table surfaces share the same premium-black canvas and readable silver boundaries.
4. System settings and mobile dashboard: healthy; inputs remain distinct, mobile overview metrics use a 2+1 grid, and no horizontal overflow was observed.
5. Chart and text contract review: healthy; default-dark model/user/Sankey styles use readable silver labels/strokes, while light and explicit presets keep their legacy behavior.

### Required fidelity surfaces

- Typography: unchanged; supporting text opacity was lifted only in the default-dark workspace scope.
- Spacing/layout: unchanged except the mobile dashboard metric grid intentionally becomes 2+1 to prevent title truncation.
- Colors/tokens: premium black and neutral graphite dominate; silver boundaries define surfaces; ice blue is an accent rather than a background.
- Image/asset fidelity: no new image assets or CSS drawings were introduced; the frozen homepage assets remain unchanged.
- Copy/content: unchanged; all business labels and attribution remain intact.

### Comparison history

- Iteration 1: The initial cool blue-gray palette was visually rejected as uncomfortable. Replaced large blue surfaces with premium black/graphite and recaptured desktop/mobile lower-fold evidence.
- Iteration 2: Footer secondary text and dashboard supporting labels were too weak; added scoped contrast lifts and recaptured the CTA/footer and mobile dashboard states.
- Iteration 3: Chart styles still used legacy dark labels/strokes; added default-dark chart style propagation and tests, then rebuilt and recaptured the overview.

### Residual evidence limits

The authenticated theme drawer's DOM and computed surface were verified, but the browser extension screenshot surface did not consistently include the portal layer. Portal inheritance is covered by the body-scoped marker design and layout contract tests. No actionable P0/P1/P2 visual finding remains in the captured surfaces.

final result: passed

## Dark Palette Comfort QA — Wave 3 (Correct Development Runtime)

### Source And Implementation

- Source visual truth: `D:/new-api/.trellis/tasks/08-18-zzapi-product-redesign/research/evidence/dark-palette-audit/05-console-overview-dark-1440x900-current.png`.
- Brand reference: `C:/Users/npp_c/.codex/attachments/6044b8c8-9679-440c-bbe4-f58908c72e82/image-1.png`.
- Implementation desktop: `D:/new-api/.trellis/tasks/08-18-zzapi-dark-palette-comfort/research/evidence/wave3/console-default-dark-1440x900.png`.
- Implementation mobile: `D:/new-api/.trellis/tasks/08-18-zzapi-dark-palette-comfort/research/evidence/wave3/console-default-dark-390x844-final.png`.
- Operational desktop evidence: `console-channels-1440x900-final.png`, `console-usage-logs-1440x900-final.png`, and `console-system-settings-1440x900-final.png` in the same `wave3/` directory.
- Tablet and portal evidence: `console-overview-834x1194.png` and `console-theme-drawer-1440x900.png`; the portal is additionally verified by its live computed `rgb(17, 19, 21)` surface because the extension screenshot transport omits the visible drawer layer.
- Full comparison input: `D:/new-api/.trellis/tasks/08-18-zzapi-dark-palette-comfort/research/evidence/wave3/console-before-after-comparison.png`.
- Public route evidence: `pricing-dark-premium-black-1280x720.png`, `pricing-dark-premium-black-390x844-final.png`, and `pricing-light-390x844-final.png` in the same `wave3/` directory.
- Homepage evidence: `home-dark-first-1280x720-settled.png`, `home-dark-lower-1280x720.png`, and `home-dark-lower-390x844.png` in the same `wave3/` directory.
- Runtime: frontend Rsbuild development server at `http://localhost:3001`; the backend-served production bundle at port `3000` was explicitly excluded from this QA pass.
- Viewports: `1440 x 900`, `1280 x 720`, `834 x 1194`, and `390 x 844`; browser device scale factor `1`. The source and desktop console implementation are both native `1440 x 900` captures, so no density normalization was required.
- State: authenticated administrator overview, channels table, usage-log empty table, system settings form, and theme drawer in default dark; authenticated workspace with the Anthropic preset; public model plaza in default dark/light; and authenticated homepage in default dark.

### Full And Focused Comparison Evidence

The full comparison places the original mixed blue-charcoal console on the left and the final default-dark implementation on the right at the same `1440 x 900` viewport. It shows the intended change without an information-architecture difference: the previous blue sidebar selection, muddy warm cards, saturated blue wallet action, and mixed-temperature panels are replaced by neutral premium black, graphite, and silver layers. Focused evidence was not split into a second crop because the full-size native captures keep the header, sidebar, overview cards, status panel, and lower supporting panels readable in one comparison.

### Required Fidelity Surfaces

- Typography: font family, type scale, weights, wrapping, line height, and copy remain unchanged. Supporting labels are more legible through scoped color contrast rather than type changes.
- Spacing and layout rhythm: desktop structure is unchanged. At `390 x 844`, the dashboard keeps a stable single-column flow, model-plaza controls stack without overlap, and both pages report `scrollWidth === clientWidth`.
- Colors and tokens: the verified default workspace values are `#111315` canvas, `#1a1c1f` card, `#222529` popover, `#151719` sidebar, and `#c9cdd3` primary. Default public dark uses `#0e1012` canvas and silver product accents. Large blue surfaces are absent; small provider, status, and action colors retain semantic meaning.
- Image quality and asset fidelity: the dark model-plaza poster is a native `2048 x 1152` raster asset with a neutral metal/graphite treatment. Desktop and mobile crops keep the subject out of the title/search area. Existing logo and provider assets remain unchanged.
- Copy and content: no user-facing copy, business data, navigation item, attribution, or protected project identity changed.
- Interaction states: the theme drawer was exercised through the UI from default dark to the Anthropic preset and back. Anthropic produced its own body tokens while `data-product-workspace-active='true'` remained present; returning to default removed `data-theme-preset` and restored premium black. The homepage lower fold was also checked under Anthropic and inherited the preset tokens without defining local `--home-*` surfaces; returning to default restored the premium-black lower-fold tokens. Public light/dark switching was exercised through the visible theme menu.
- Accessibility and resilience: focus styling remains token-driven, text contrast is increased, no new motion was added, and the checked desktop/mobile tabs reported no browser console errors.

### Comparison History

- Earlier runtime mistake: a check was briefly pointed at port `3000`, which serves the backend-managed build rather than the frontend development runtime. That evidence was discarded and is not used for acceptance.
- Corrected pass: the frontend was started explicitly on port `3001`, every required desktop/mobile/theme state was recaptured there, and computed token values were recorded from the live development build.
- Theme-boundary pass: default dark remained premium black, the Anthropic preset retained its own semantic palette, default light retained the existing light product tokens, and all tested states were restored after verification.

### Findings

No actionable P0, P1, or P2 differences remain. The final palette reads as neutral premium black rather than deep blue, keeps the established zzapi layout and content, and remains usable at the required desktop and mobile viewports.

final result: passed

## Public Discovery Final QA

### Source And Implementation

- Visual source truth: the equal-size pricing, model-detail, rankings, About, Privacy, and User Agreement sources/comparison inputs already listed under the Public Pricing and Public Route Extension sections above.
- Final browser evidence: `D:/new-api/.trellis/tasks/08-18-zzapi-public-discovery/research/evidence/final-pass/`.
- Final pricing implementation: `pricing-dark-1280x720-webp-final.png`; native browser capture `1270 x 714` for a `1280 x 720` CSS viewport at device scale factor `1`.
- Responsive implementation states: desktop `1280 x 720`, tablet `834 x 1194`, mobile `390 x 844`; default dark plus desktop light, locale `zh`.
- State: seeded three-model catalog and detail, populated week rankings, default About fallback, missing Legal fallback; configured/error/empty/gated states use deterministic component/route fixtures named in `evidence-matrix.md`.

### Full And Focused Comparison

The full and focused equal-size comparisons in `evidence/detail-pass/` remain the visual fidelity target. The final pass retains their typography, spacing, hierarchy, poster crop, controls, cards, tables, route accessories, and copy. The subsequent fixes change state semantics, keyboard behavior, overflow containment, and asset delivery without changing the accepted visible composition. Focused review covered the pricing header/search/toolbar/first cards, model detail tabs/group table, rankings period tabs/leaderboard, About attribution, and Legal title/navigation behavior.

### Required Fidelity Surfaces

- Typography: route h1 ownership is explicit; model names and dense data retain their monospace hierarchy; no text is clipped at checked viewports.
- Spacing/layout: desktop, tablet, and mobile route roots report no horizontal overflow. Pricing reorganizes controls for mobile; model-detail and Legal tables use intentional internal horizontal scrolling.
- Colors/tokens: light and dark product tokens remain scoped; premium black is not applied to explicit presets. Status/provider colors remain small semantic accents.
- Image quality: only the active theme poster is mounted. Both `2048 x 1152` WebPs are visually within mean absolute channel error `1.1` of their source PNGs while reducing each asset from about `2.6 MB` to `77-82 KB`.
- Copy/content: protected new-api / QuantumNous / One API / AGPL attribution remains visible. All literal UI keys exist in all seven locales.
- Interaction/accessibility: hidden mobile menus leave the Tab order; focus cycles between trigger and menu, Escape restores the trigger, route/breakpoint close focuses real main content, and prior body overflow is restored exactly. Pricing table details and ranking periods are keyboard-operable. Legal anchors update and restore focus through Back/Forward.

### Comparison History

- P1 cached-data loss: background pricing refresh failures previously replaced usable catalog/detail content. Fixed by retaining resolved data and showing a non-blocking retry status.
- P1 Legal mobile overflow and history: wide HTML tables expanded a 390px document to ~1394px, and ShadowRoot anchors did not follow Back/Forward. Fixed with real scroll wrappers, centralized hash resolution, coordinated layout effects, and regression tests.
- P1 legacy mobile navigation: closed links remained tabbable and breakpoint/route closes could leak scroll lock or focus. Fixed without changing the header's visual classes or homepage layout.
- P2 performance: both large poster PNGs were mounted. Fixed with one resolved-theme WebP source.

No actionable P0, P1, or P2 finding remains after the second independent review, 63 related tests, typecheck, changed-file lint/format, production build, browser console checks, seven-locale sync, and homepage freeze verification.

final result: passed

## Dark Palette Comfort QA — Wave 2

### Source and implementation

- Source visual truth: `C:/Users/npp_c/.codex/attachments/6044b8c8-9679-440c-bbe4-f58908c72e82/image-1.png` plus the Wave 1 dark palette problem captures.
- Implementation screenshots: `.trellis/tasks/08-18-zzapi-dark-palette-comfort/research/evidence/wave2/`.
- Desktop CSS viewport: `1280 x 720`; mobile CSS viewport: `390 x 844`; desktop device scale factor `1`; mobile browser transport reported a `380px` layout viewport and `scrollWidth === clientWidth`.
- States: default dark public model plaza, default light public model plaza, default dark homepage first viewport and lower fold.

### Comparison and findings

The dark public page now reads as premium black/graphite rather than blue-black: the generated Z sculpture is neutral silver/charcoal, sits in the lower-right, and does not cross the hero copy. The public dark token values are `--product-canvas: #0e1012`, `--product-brand: #c9cdd3`, and `--product-brand-soft: #25282d`. The light route computed values remain `#fcfdfe` canvas and the original light poster.

The homepage first-viewport capture remained the frozen brand gateway after settling, and the lower-fold capture shows the intended graphite section hierarchy. Mobile layout metrics show no horizontal overflow. Browser console error logs for the final dark pricing tab were empty.

### Wave 2 residuals

- P3: The model cards keep provider-specific logos and small semantic blue/green status accents; these are content/status signals, not palette surfaces.
- P3: The browser screenshot transport timed out for one 390px dark poster capture, so the accepted mobile evidence for this wave is the DOM geometry/overflow check plus the previously accepted Wave 1 mobile captures. No mobile visual defect was inferred from the timeout.

final result: passed

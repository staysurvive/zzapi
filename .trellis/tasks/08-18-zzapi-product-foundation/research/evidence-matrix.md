# Product Foundation Evidence Matrix

| Contract | Automated evidence | Browser / visual evidence | Current Phase 1 status |
| --- | --- | --- | --- |
| Homepage is frozen | `git diff --exit-code d092808... -- <frozen paths>` plus untracked-path status check | `/` reviewed at 1440x900 and 390x844 in Light/Dark against `research/evidence/home-freeze` | passed; frozen paths have no diff |
| ProductShell is scoped and owns no landmark | `product-foundation.test.tsx`; selector review of `product-shell.css` | no standalone screenshot: infrastructure has no real Phase 1 business route | passed automated contract |
| Public product layout owns one main/skip target | `layout-contracts.test.tsx` plus typecheck | first real route capture deferred to Phase 2 | passed automated contract; visual capture deferred |
| Workspace owns one main/skip target | `layout-contracts.test.tsx`; inner `Main as='div'` regression coverage | authenticated route DOM review when a valid session is available; Phase 3 must recapture | passed automated contract; browser evidence deferred |
| Product mobile menu is keyboard/modal safe | `product-public-header.test.tsx`: expanded/controls, initial focus, Escape/focus return, disabled link, active route, authenticated requires-auth navigation, product dialog scope, route-change/unmount scroll cleanup | low-height real-route capture deferred to first Phase 2 consumer | passed automated contract; visual capture deferred |
| ResourceHeader and MetricStrip semantics | `product-foundation.test.tsx` heading and `dl/dt/dd` assertions | component visuals validated through first Phase 2/4 consumers, not a synthetic production route | passed automated contract |
| DataTable product appearance is additive | `data-table/__tests__/product-appearance.test.tsx` asserts existing root receives scope without a wrapper; legacy behavior tests remain unchanged | representative tables captured in Phase 4/5 | passed automated contract; visual capture deferred |
| Motion/focus accessibility | CSS selector audit; reduced-motion and forced-colors contract assertions where stable | homepage animation remains unchanged; product motion captured with first consumer | passed source review; consumer capture deferred |
| Changed-file quality | changed-file `oxlint`/`oxfmt`, `bun run typecheck`, targeted Vitest, `bun run build`, `git diff --check` | console reviewed on homepage; only development HMR fallback observed | passed for current Phase 1 changes |
| Full-suite zero-new-failure policy | compare exact failing identities to `quality-baseline.md` | N/A | 15 failing files / 8 failing tests unchanged; new Phase 1 tests pass |
| Copyright / protected identity | `bun run copyright:check`; source/header review | homepage footer attribution remains visible | new files pass; four unrelated baseline files still require header updates |

## Evidence locations

- Homepage source and screenshots: `.trellis/tasks/08-18-zzapi-product-redesign/research/home-freeze-manifest.md`.
- Quality baseline: `.trellis/tasks/08-18-zzapi-product-redesign/research/quality-baseline.md`.
- Current frontend findings: `.trellis/tasks/08-18-zzapi-product-foundation/research/current-frontend-evidence.md`.
- Phase 1 component tests: `web/src/components/layout/__tests__/`, `web/src/components/data-table/__tests__/product-appearance.test.tsx`, and `web/src/components/__tests__/dialog-product-scope.test.tsx`.

The matrix records deferred evidence explicitly. A deferred browser capture is not a pass for a later phase; the owning phase must replace it with route/state/viewport evidence after a real consumer exists.

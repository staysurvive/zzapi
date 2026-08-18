# Visual Target and QA Protocol

## Truth hierarchy

1. Homepage screenshot/code: zzapi Brand DNA and homepage freeze truth only.
2. Selected subpage visual target: fidelity truth for one route/state/viewport.
3. Screen contract: product/IA truth for every page, including pages without a visual mock.
4. Rendered browser state: implementation truth.

The homepage must never be compared directly to a different subpage in Design QA.

## Visible-phase direction gate

Before phases 2–5 begin visible page implementation:

1. Capture current representative screens.
2. Build exactly three materially different visual directions grounded in the same zzapi Brand DNA.
3. Include at minimum a representative public discovery screen, auth screen, workspace screen, dense admin screen and compact mobile screen across the overall program.
4. Present the directions with a recommendation and trade-offs; wait for user selection.
5. Save the selected route/state/viewport visual target and metadata into the owning child task.
6. Write screen contracts for every page in that wave before implementation.

## QA role split

- Product Design audit: current-state and implemented product/UX/responsive/a11y review across routes.
- Design QA: same-screen fidelity comparison only where a selected visual target exists.
- Vitest/RTL: DOM semantics, ARIA, keyboard, focus, state, callbacks and legacy compatibility.
- IAB: real layout, breakpoint overflow, scrolling, theme, hover/focus, motion, console/network.
- Code review: architecture, opt-in isolation, performance, i18n and protected attribution.

## Design QA evidence

For every target-backed screen record:

- source target path and implementation screenshot path
- route, role, theme, locale and deterministic data state
- CSS viewport, DPR and pixel dimensions
- full-view comparison plus focused typography/layout/icon regions when needed
- P0/P1/P2 finding history: finding → fix → same-viewport recapture → comparison
- `passed` only when no actionable P0/P1/P2 remains

Pages without a selected target are validated through screen contract + Product Design audit + browser evidence and are not falsely labeled as Design QA passed.


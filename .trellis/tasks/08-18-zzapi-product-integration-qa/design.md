# Technical Design — Product Integration QA

## Evidence Model

- Treat the route/surface manifest as the enumeration source, but verify it against the live route tree before final acceptance.
- For every route or logical section capture role, state, locale, theme, CSS viewport, density, scroll position, fixture/seed method, console result and artifact path.
- Use the same route/state/viewport/theme for source and implementation screenshots. Homepage screenshots are freeze/brand evidence only; product screens require their own selected target or screen contract.
- Design QA must combine source and implementation in one comparison input and record every P0/P1/P2 iteration, fix and recapture.

## Audit Lanes

1. Product/IA: task clarity, route ownership, navigation and state comprehension.
2. Brand/visual: typography, spacing, colors/tokens, image/asset fidelity, attribution and restrained zzapi DNA.
3. Responsive: desktop/tablet/mobile overflow, persistent actions, tables, menus and long text.
4. Accessibility: landmarks, focus order, keyboard, ARIA, contrast, reduced motion/transparency and screen-reader semantics.
5. Motion: input latency, interruptibility, spatial consistency and no unintended homepage changes.
6. Code quality: changed-file lint/format, typecheck, tests, build, i18n and frozen-file diff.

## Release Gate

- P0/P1/P2 findings block the phase until fixed and recaptured at the same state.
- P3 refinements may remain only when explicitly recorded.
- `design-qa.md` must end with exactly `final result: passed`; otherwise the task remains blocked and cannot be released.

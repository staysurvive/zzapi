# Implementation Plan — Product Integration QA

## Ordered Steps

1. Refresh the live route/role/state inventory and reconcile omitted/duplicate surfaces.
2. Generate deterministic fixtures for loading, empty, error, permission-denied and mutation-pending states without changing production semantics.
3. Capture representative and edge-state screenshots at desktop/tablet/mobile, light/dark and relevant locale settings.
4. Open source target and implementation capture together for each Design QA comparison; normalize density/crop before judging.
5. Run product, brand, responsive, a11y, motion and code-architecture audits.
6. For every P0/P1/P2 issue: record finding, fix code/docs, recapture same route/state/viewport and repeat comparison.
7. Run homepage frozen-path diff, screenshot hash comparison, copyright/i18n checks, changed-file lint/format, typecheck, related/full tests and production build.
8. Write root `design-qa.md` with required evidence and exact final result.
9. Only after all gates pass, hand off for commit/release discussion; do not publish while any phase is incomplete.

## Completion Checklist

- [ ] Every route and logical settings section has an owner and current evidence.
- [ ] No P0/P1/P2 findings remain.
- [ ] `design-qa.md` is `passed` and cites implementation screenshots.
- [ ] Homepage immutable paths and four baseline comparisons are clean.
- [ ] Full quality results are reported against the saved baseline.

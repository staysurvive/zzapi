# Implementation Plan — Public Discovery

## Ordered Waves

1. Re-read the live pricing/rankings/about/legal routes, hooks and loading/error components; update screen contracts if upstream route behavior differs.
2. Establish the product public shell/header on the model plaza and detail routes first, preserving query and permission contracts.
3. Implement model plaza discovery hierarchy and responsive filter/result states.
4. Implement model detail capability, compatibility, pricing and call-information hierarchy.
5. Implement rankings comparison hierarchy and trend semantics.
6. Implement About and Legal reading layouts, including configured-content fallback and attribution preservation.
7. Add behavior tests for filters, external docs fallback, not-found/error recovery, keyboard actions, and mobile-safe reading.
8. Run changed-file lint/format, typecheck, related tests and production build.
9. Capture same route/state screenshots at desktop/tablet/mobile and light/dark; perform Product Design audit and Design QA where a visual target exists.
10. Fix every P0/P1/P2 finding, recapture at the same state, then run homepage freeze checks.

## Validation Gates

- No homepage frozen file diff or untracked file.
- All seven locales receive new UI keys through the i18n workflow.
- Related tests pass; full-suite failures do not increase from the saved baseline.
- Screen contract and evidence matrix are updated with screenshot paths and deterministic fixtures.

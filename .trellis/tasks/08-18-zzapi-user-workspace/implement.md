# Implementation Plan — User Workspace

## Ordered Waves

1. Re-read route files, feature providers, API hooks, billing/key/chat contracts and refresh screen contracts with real states.
2. Wave 4A: migrate dashboard overview/models/flow and usage logs; establish shared dashboard overview information hierarchy.
3. Wave 4B: migrate keys and profile with security boundaries and copy/revoke feedback.
4. Wave 4C: migrate wallet and user subscription purchase/current-plan experience; leave admin `/subscriptions` untouched.
5. Wave 4D: migrate playground, chat and Chat2Link with streaming/cancel/error and narrow-screen behavior.
6. Add behavior tests per wave for critical actions and state transitions; do not mock the feature under test.
7. Run changed-file lint/format, typecheck, related tests/build and browser checks for roles/themes/viewports.
8. Run product UX, responsive, a11y, motion and Design QA audits; fix P0/P1/P2 findings with same-state recaptures.
9. Verify billing/key/chat invariants and homepage freeze before each wave is accepted.

## Validation Gates

- Financial, quota, API-key and conversation behavior remains contract-compatible.
- Mobile evidence proves no persistent control or critical data is clipped or overlapped.
- Locale keys are synced across seven supported frontend locales.

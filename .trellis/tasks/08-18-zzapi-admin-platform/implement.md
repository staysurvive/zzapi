# Implementation Plan — Admin and System Platform

## Ordered Waves

1. Re-read route registries, feature providers, permission helpers, settings registries and setup guards; update the source-verified section inventory.
2. Wave 5A: Channels and granular permission states.
3. Wave 5B: Models metadata and Deployments.
4. Wave 5C: Users, Redemption Codes and admin `/subscriptions`.
5. Wave 5D: Dashboard users analytics extension only; consume 4A shell.
6. Wave 5E: System Settings by source-verified group/section waves.
7. Wave 5F: System Info and isolated setup-only wizard.
8. Add behavior/permission tests for each wave, including direct URL and backend rejection states.
9. Run changed-file lint/format, typecheck, related tests/build and permission-aware browser evidence across roles.
10. Run dense-table responsive, a11y, motion and Design QA audits; fix P0/P1/P2 findings and recapture same state.
11. Verify homepage freeze, protected attribution and complete route/section matrix before phase acceptance.

## Validation Gates

- No privileged control is exposed solely by styling; permission and danger boundaries are explicit.
- Tablet/mobile captures prove persistent actions, table context and settings save feedback remain usable.
- Settings section count and routes come from live registries at implementation time.

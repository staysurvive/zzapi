# Implementation Plan — Auth and Workspace Shell

## Ordered Waves

1. Inventory auth routes/layouts, compatibility redirects, error routes, sidebar registries and focus behavior; refresh screen contracts.
2. Implement the auth ProductShell/header/main ownership without changing auth protocol behavior.
3. Migrate sign-in/sign-up/OTP/OAuth/reset/passkey/2FA screens and their pending/error/success states.
4. Convert inner `Main` to a non-landmark container and verify `SidebarInset` is the only workspace main.
5. Refine authenticated header/sidebar/Sheet mobile navigation, focus return, Escape, scroll lock and low-height behavior.
6. Add user-facing behavior tests for single-main semantics, skip target, auth pending/errors, menu keyboard flow and redirect preservation.
7. Run changed-file lint/format, typecheck, related tests/build and browser evidence across roles/themes/viewports.
8. Run responsive/a11y/motion audit and Design QA, fix P0/P1/P2 findings, recapture and verify homepage freeze.

## Validation Gates

- No changes under frozen homepage paths.
- Auth route behavior and backend contracts remain unchanged.
- Keyboard and screen-reader semantics are verified from rendered DOM, not class snapshots.
- All added copy is synced across seven locales.

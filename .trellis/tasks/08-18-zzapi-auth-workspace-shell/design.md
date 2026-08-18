# Technical Design — Auth and Workspace Shell

## Boundary and Dependencies

- Consume Product Foundation components and tokens through explicit product appearance props.
- Keep authentication protocols, OAuth providers, passkey/2FA flows, token handling, redirects and backend permission semantics unchanged.
- `AuthLayout` becomes the sole owner of the auth `main`; `SidebarInset` remains the sole workspace `main`. Inner `Main` changes to a non-landmark content container.
- The homepage legacy header and homepage route remain outside this migration.

## Auth Contract

- Sign-in/sign-up/OTP/password reset/OAuth/passkey states share trustworthy hierarchy but keep protocol-specific actions and errors visible.
- Every submit path exposes idle, pending, invalid, server-error and success/redirect states without relying on color alone.
- Redirect search parameters are preserved through auth prompts and compatibility routes; invalid or unsafe values follow existing router validation.
- Auth branding accepts site configuration while preserving new-api / QuantumNous attribution wherever it is currently exposed.

## Workspace Shell Contract

- Header answers current location and global actions; sidebar groups routes by user task, exposes active state, and does not hide permission failures behind generic errors.
- Mobile sidebar uses the existing Sheet primitive with focus return, Escape, inert background, body-scroll cleanup and low-height scrolling.
- Skip link targets the one real `#main-content`; no nested `main` is introduced by page layouts.

## Responsive, Motion and Rollback

- Desktop favors stable navigation and information density; tablet reduces sidebar pressure; mobile uses a task-first drawer and keeps persistent actions reachable.
- Use critically damped, short transitions for drawer and route feedback; no bounce unless a user gesture carries momentum. Reduced motion uses opacity/cross-fade.
- Migrate auth and workspace shell consumers incrementally so removing the product appearance prop restores the old shell.

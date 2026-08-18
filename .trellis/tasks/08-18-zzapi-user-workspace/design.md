# Technical Design — User Workspace

## Boundary and Data Contracts

- Reuse the authenticated shell and Product Foundation primitives; page-specific information architecture may differ by task.
- Preserve React Query keys, API payloads, billing/quota calculations, key lifecycle semantics, chat/playground protocols and permission checks.
- Separate presentation changes from billing/security logic. Sensitive values remain masked and are never copied into analytics or screenshots.
- Dashboard shared shell is owned by wave 4A; Phase 5 only extends admin users analytics.

## Wave Contracts

- 4A Dashboard/Usage: status-first overview, recent usage and next actions; logs expose time/model/tokens/cost/status/error with search and deterministic empty/loading/error states.
- 4B Keys/Profile: lifecycle state, last-used context, copy/revoke/create safety, account/security/preferences boundaries.
- 4C Wallet: balance, top-up, plans, current user subscription, invoices/limits and pending/failure/refund feedback. Admin `/subscriptions` remains Phase 5.
- 4D Playground/Chat/Chat2Link: request composition, streaming/error/cancel behavior, conversation/preset state and narrow-screen recovery.

## Responsive, Accessibility and Motion

- Desktop optimizes scan and comparison; tablet collapses auxiliary panels; mobile turns dense data into ordered summaries or safe horizontal regions without hiding critical values.
- Destructive or financial actions are explicit, keyboard reachable and announce pending/result states.
- Use short, interruptible feedback for filters, copy, submit, streaming and drawer changes; reduced motion removes large transforms.

## Rollback

- Each wave uses opt-in page appearance and can be reverted independently. No backend or shared homepage changes are required to roll back a wave.

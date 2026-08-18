# Technical Design — Admin and System Platform

## Boundary and Permission Contract

- Reuse the authenticated workspace shell and DataTablePage opt-in. Do not change backend permissions, channel scheduling, model/deployment data, redemption/subscription semantics, or system-settings APIs.
- Before each wave, re-read the live feature registries and permission helpers; the route manifest's approximate section count is not a substitute for source truth.
- For every admin surface record guest/user/admin/super-admin navigation visibility, direct URL result, action hidden/disabled/enabled state, backend rejection feedback, and granular channel permissions (`read`, `operate`, `write`, `sensitive_write`, `secret_view`).
- `/setup` is an unauthenticated setup-only wizard with its own public shell. It must never inherit the authenticated admin shell.

## Wave Contracts

- 5A Channels: health, availability, weight, failures, channel permissions and batch operations.
- 5B Models/Deployments: catalog metadata, deployment state, compatibility, routing and failures.
- 5C Users/Redemption/Subscriptions: search, status, quota/risk, code lifecycle, admin subscription operations and dangerous-action feedback.
- 5D Dashboard users analytics: extend the 4A dashboard skeleton without duplicating its structural redesign.
- 5E System Settings: stable seven-group navigation, 40-ish source-verified logical sections, save/pending/error feedback and naming clarity.
- 5F System Info/Setup: runtime diagnostics separated from site identity and a safe initial configuration wizard.

## Responsive and Safety

- Desktop keeps high-density table scanning and persistent bulk actions; tablet/mobile convert rows into ordered summaries or safe horizontal regions while preserving the target/action context.
- Selection, destructive actions, secret visibility and pending saves are keyboard and screen-reader visible; color is never the only status signal.
- Motion is restrained and interruptible; reduced motion is a cross-fade/static state.

## Rollback

- Each wave is opt-in and independently revertible. Shared shell changes must be additive and covered by default-branch compatibility tests.

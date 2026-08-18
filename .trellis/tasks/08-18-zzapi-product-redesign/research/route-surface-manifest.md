# Route / Surface Ownership Manifest

## Evidence dimensions

Every owned visible surface must eventually record:

- route or logical section
- route file / primary feature file
- role: guest, user, admin, super-admin, setup-only
- owning phase and wave
- loaded/loading/empty/error/disabled/permission-denied/mutation states as applicable
- light/dark, locale and responsive evidence
- deterministic fixture or real seeded-data method
- test/screenshot/audit artifact path

## Framework and compatibility routes

| Route / file | Responsibility | Role | Owner |
| --- | --- | --- | --- |
| `routes/__root.tsx` | setup gating, legacy redirects, root errors | all | Phase 3 shell + Phase 6 verify |
| `/` (`routes/index.tsx`) | final frozen homepage | guest/all | Frozen; Phase 6 verify only |
| `routes/(auth)/route.tsx` | auth route grouping | guest/all | Phase 3 |
| `routes/_authenticated/route.tsx` | auth guard and workspace shell | authenticated | Phase 3 |
| `/register` | compatibility redirect to sign-up | guest | Phase 3 |
| `/user/reset` and `/reset` | legacy/current reset compatibility | guest | Phase 3 |
| route index redirects for dashboard/models/usage/settings | canonical section redirect and invalid-param fallback | owning role | Owning phase; Phase 6 verify |

## Public discovery and brand surfaces — Phase 2

| Route | File | Role / condition | Key states |
| --- | --- | --- | --- |
| `/pricing` | `routes/pricing/index.tsx` | guest or auth-required by config | gated, loading, populated, empty, error, filters |
| `/pricing/$modelId` | `routes/pricing/$modelId/index.tsx` | same as pricing | loading, found, not-found, error |
| `/rankings` | `routes/rankings/index.tsx` | guest or auth-required by config | disabled redirect, loading, populated, empty, error |
| `/about` | `routes/about/index.tsx` | guest | configured HTML/Markdown, default brand content, loading, error |
| `/privacy-policy` | `routes/privacy-policy.tsx` | guest | configured, missing, loading, error |
| `/user-agreement` | `routes/user-agreement.tsx` | guest | configured, missing, loading, error |

Docs is not a local route. Configured external docs remains an external link; absent config must not route to nonexistent `/docs`. The chosen hide/disable/fallback behavior must be specified in Phase 2 design.

## Auth, callback and error surfaces — Phase 3

| Route | Role/context | Key states |
| --- | --- | --- |
| `/sign-in` | guest; authenticated redirects | password/passkey/OAuth availability, submit, error, redirect |
| `/sign-up` | guest; registration-enabled | disabled, verify, submit, error, success |
| `/forgot-password` | guest | submit, cooldown, error, success |
| `/otp` | guest/verification | pending, invalid, expired, success |
| `/reset`, `/user/reset` | guest | invalid token, form, submit, success |
| `/(auth)/oauth` | OAuth handoff | pending, denied, error, redirect |
| `/oauth/$provider` | provider callback/bind | pending, invalid provider, success, denied, error |
| `/401`, `/403`, `/404`, `/500`, `/503` | public errors | code-specific recovery actions |
| `/_authenticated/errors/$error` | workspace error | supported/invalid error param |

## User workspace — Phase 4 waves

| Wave | Route / logical sections | Role | Primary ownership |
| --- | --- | --- | --- |
| 4A | `/dashboard/overview`, `/dashboard/models`, `/dashboard/flow` | user+ | dashboard status/analytics/flow |
| 4A | `/usage-logs/common`, `/usage-logs/drawing`, `/usage-logs/task` | user+ | observability/log search and details |
| 4B | `/keys` | user+ | API key lifecycle and safety |
| 4B | `/profile` | user+ | account, security, preferences |
| 4C | `/wallet` | user+ | balance, top-up, current plan and user subscription purchase |
| 4D | `/playground` | authenticated with system feature enabled | request composition and response debug |
| 4D | `/chat/$chatId` | user+ | chat conversation and preset states |
| 4D | `/chat2link` | user+ | chat handoff/redirect/error |

`/dashboard/$section` shared shell and feature file are primarily owned by 4A. Phase 5 may extend/verify the admin-only users section but must not repeat the structural redesign.

## Admin platform — Phase 5 waves

| Wave | Route / logical sections | Role | Primary ownership |
| --- | --- | --- | --- |
| 5A | `/channels` | admin+ plus granular channel permissions | channel routing operations |
| 5B | `/models/metadata`, `/models/deployments` | admin+ | model catalog and deployments |
| 5C | `/users` | admin+ | users, groups, status, quota |
| 5C | `/redemption-codes` | admin+ | code creation/lifecycle |
| 5C | `/subscriptions` | admin+ | subscription management route |
| 5D | `/dashboard/users` | admin+ | user analytics extension; shared shell from 4A |
| 5E | `/system-settings/site/$section` | super-admin | system-info, notice, header-navigation, sidebar-modules |
| 5E | `/system-settings/auth/$section` | super-admin | basic-auth, oauth, passkey, bot-protection, custom-oauth |
| 5E | `/system-settings/security/$section` | super-admin | rate-limit, sensitive-words, ssrf, token-limits |
| 5E | `/system-settings/billing/$section` | super-admin | quota, currency, model-pricing, group-pricing, payment, checkin |
| 5E | `/system-settings/models/$section` | super-admin | global, routing-reliability, gemini, claude, grok, channel-affinity, model-deployment |
| 5E | `/system-settings/content/$section` | super-admin | dashboard, announcements, api-info, faq, uptime-kuma, chat, drawing |
| 5E | `/system-settings/operations/$section` | super-admin | behavior, alerts, email, worker, logs, performance, update-checker |
| 5F | `/system-info` | super-admin | runtime/version/system operations; distinct from site identity |
| 5F | `/setup` | setup-only, unauthenticated uninitialized install | initial configuration wizard, configured redirect |

The seven System Settings registries currently total 40 logical sections (site 4, auth 5, security 4, billing 6, models 7, content 7, operations 7). Phase 5 design must re-read the registries before implementation in case upstream changes this count. `/setup` receives its own public wizard shell, never the authenticated admin shell.

## Permission matrix requirements

For admin surfaces record guest/user/admin/super-admin behavior for:

- navigation visibility
- direct URL result (redirect/403/page)
- button hidden/disabled/enabled state and reason
- backend rejection feedback
- channel permissions: read, operate, write, sensitive_write, secret_view

Existing implementation currently consumes only part of the granular channel permission set; Phase 5 must verify actual backend contracts before mapping additional UI behavior.

## Phase 6 responsibility

Phase 6 verifies every row and logical section above. It does not become the implementation owner for a route omitted by phases 2–5. Any missing owner must be corrected in the manifest before the relevant phase starts.

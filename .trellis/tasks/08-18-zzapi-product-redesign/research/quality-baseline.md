# Frontend Quality Baseline

## Observed baseline — 2026-08-18

Environment: container `admiring_chatelet`, `/workspace` mapped to `D:/new-api/web`.

| Check | Current result |
| --- | --- |
| `bun run typecheck` | passed |
| `bun run lint` | failed: 348 errors / 78 warnings |
| `bun run test` | failed: 15/39 files, 8/133 tests |
| Bun version | local container 1.3.11; CI pins 1.3.14 |
| `format:check` | Windows bind-mount `Invalid argument` affects current full check |

Known test harness causes include eight `node:test` files collected by Vitest plus existing Bun/Zod runtime failures. CI currently runs typecheck/test but not lint/build.

## Phase gate before full baseline is green

1. Capture the complete baseline error/failure identities, not only counts.
2. Every changed TS/TSX/CSS file must have targeted lint/format checks with zero error.
3. Every affected behavior must have passing targeted tests.
4. Full lint/test must have no new error/failure identity compared with the saved baseline.
5. Typecheck and production build must pass.
6. New source files must pass copyright/header checks.
7. Align local/CI Bun before claiming a release-quality full-suite result.

## Final release expectation

The baseline exception is temporary isolation, not a permanent waiver. Before final release, prefer fixing the test harness and all relevant full-suite failures so typecheck, lint, test and build genuinely pass. Any remaining unrelated baseline must be listed with exact files, messages and proof that the redesign introduced no new failure.


# Auth and Workspace Screen Contract

| Surface | Route/state | Primary user job | Required evidence |
| --- | --- | --- | --- |
| Sign in | `/sign-in` idle/pending/error/success | Authenticate and continue safely | desktop/mobile, keyboard, redirect |
| Sign up | `/sign-up` disabled/verify/pending/error/success | Create an account | registration-disabled and validation states |
| OTP/reset/OAuth | `/otp`, `/forgot-password`, `/reset`, `/oauth/*` | Complete recovery/callback | pending/invalid/expired/success |
| Public errors | `/401`, `/403`, `/404`, `/500`, `/503` | Recover from failure | code-specific action and focus |
| Workspace shell | `/_authenticated/*` desktop/tablet/mobile | Navigate and understand location | one main, skip link, drawer keyboard |

Each row records role, deterministic auth fixture, theme, locale, viewport and artifact paths.

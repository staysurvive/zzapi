# Homepage First-Viewport Freeze Manifest

## Fixed source baseline

- Commit: `d092808a802835e3108be1ad20ba0eb7d04b9cf7`
- Captured: 2026-08-17 / 2026-08-18 session baseline
- Route: `/`
- Locale: `zh`
- Source reference: `C:/Users/npp_c/.codex/attachments/6044b8c8-9679-440c-bbe4-f58908c72e82/image-1.png`

## Immutable paths

```text
web/src/routes/index.tsx
web/public/landing-brand-core.png
web/src/styles/index.css

The dedicated `.trellis/tasks/08-19-zzapi-homepage-v5-below-fold/` task is an explicit
user-authorized exception for the homepage below-fold subtree. During that task,
the following remain byte-frozen:

```text
web/src/features/home/components/sections/hero.tsx
web/src/features/home/components/infrastructure-map.tsx
web/src/features/home/components/landing-entrance.tsx
web/src/features/home/lib/opening-focus.ts
```

Only the V5 task may modify `web/src/features/home/index.tsx`,
`web/src/features/home/components/index.ts`, `web/src/features/home/components/v5/**`,
the V5 data files/tests, `web/src/styles/home-below-fold.css`, and homepage locale
entries. The V5 task must keep `LandingEntrance → Hero → .home-below-fold`
composition intact and compare only the Hero element through its bottom edge.
```

`index.css` is frozen as a whole for this task. New product CSS must live in a separate scoped file and be imported from the ProductShell module.

User-authorized exception (2026-08-18): the palette below the first viewport may change through a new stylesheet scoped to `.home-below-fold`. The immutable paths above and the four first-viewport visual baselines remain frozen.

Validation command for the ordinary frozen-home contract:

```powershell
git diff --exit-code d092808a802835e3108be1ad20ba0eb7d04b9cf7 -- web/src/routes/index.tsx web/public/landing-brand-core.png web/src/styles/index.css web/src/features/home/components/sections/hero.tsx web/src/features/home/components/infrastructure-map.tsx web/src/features/home/components/landing-entrance.tsx web/src/features/home/lib/opening-focus.ts
git status --short -- web/src/features/home web/src/routes/index.tsx web/public/landing-brand-core.png web/src/styles/index.css
```

The second command is required because `git diff` does not report untracked files.

## Shared runtime dependencies

These files may receive additive product branches, but legacy/default behavior used by the homepage is frozen:

```text
web/src/components/layout/components/public-layout.tsx
web/src/components/layout/components/public-header.tsx
web/src/components/layout/components/footer.tsx
web/src/components/ui/button.tsx
web/src/styles/theme.css
web/src/styles/theme-presets.css
web/src/lib/motion.ts
```

Any change must be protected by explicit appearance/variant opt-in and a regression test proving the legacy branch still renders the same structure/classes/behavior. Prefer a new ProductPublicHeader instead of branching the existing header.

## Visual baselines

Persistent directory: `.trellis/tasks/08-18-zzapi-product-redesign/research/evidence/home-freeze`

Captured 2026-08-18 from `http://localhost:3001/` on the Codex in-app browser development surface at commit `d092808a802835e3108be1ad20ba0eb7d04b9cf7`.

| File | Requested CSS viewport | Captured PNG | DPR | Theme class | SHA-256 |
| --- | --- | --- | --- | --- | --- |
| `home-desktop-light-capture-1430x894.png` | 1440×900 | 1430×894 | 1.25 | `font-inter light` | `F9FCE62ACFD245403D9012C3A80EB1A66F995CE20C75966DFCAE73C1A2BCC35A` |
| `home-desktop-dark-capture-1430x894.png` | 1440×900 | 1430×894 | 1.25 | `font-inter dark` | `46F687C364498723C802B5FFC372DA4D25715D17DF8784E0736E53BDC7F17857` |
| `home-mobile-light-capture-380x822.png` | 390×844 | 380×822 | 1.0 | `font-inter light` | `ED2BA1F37B07093D2B338AC55B49D62EAE453A96CD006A49EC804D7C8DC33F84` |
| `home-mobile-dark-capture-380x822.png` | 390×844 | 380×822 | 1.0 | `font-inter dark` | `E54C4A522EAC27D79666A88D9076ED2BD40FC46E4CCC56B79298FE3FDD1B3950` |

Capture contract:

- Browser surface: Codex in-app browser; viewport capability set to the requested CSS viewport before capture.
- Actual page metrics: `innerWidth`/`innerHeight` exactly matched 1440×900 and 390×844. IAB viewport screenshot output excludes its surface insets, so the persisted PNG sizes are 1430×894 and 380×822; filenames record the physical PNG size instead of claiming the requested viewport size.
- Capture method: `tab.screenshot({ fullPage: false })`, no manual crop and scroll position 0.
- Locale: visible application copy is Chinese; current document `lang` remains `en` and is recorded as an existing baseline behavior.
- Zoom: no browser zoom operation was performed; IAB does not expose an independent zoom reading in the supported page-evaluate surface. DPR is recorded above.
- Settled state: waited 4500ms after `DOMContentLoaded`, then 1000ms after each explicit Light/Dark menu selection. The entrance overlay was gone and the full hero/network state was visible.
- Runtime note: this is the development surface, so the existing TanStack Query/Router devtool launchers are visible in the screenshots. Comparisons must use the same runtime surface or mask those launchers consistently.

Image SHA is an integrity check, not a substitute for aligned visual comparison.

## Pass condition

- Immutable paths have no diff against the fixed commit.
- No untracked file exists under immutable directories.
- Legacy shared branches pass structure/behavior tests.
- Four aligned first-viewport screenshots show no visible regression; below-fold palette changes are verified separately.

# Technical Design — Dark Palette Comfort

## Boundaries

This task changes color hierarchy only. Existing DOM structure, route behavior, data contracts, component APIs, and motion remain stable unless a class/data hook is required to scope tokens.

## Authenticated Workspace Scope

- In `AuthenticatedLayout`, use `useLayoutEffect` to set `data-product-workspace-active='true'` on `document.body` while the workspace is mounted and restore the exact prior attribute state on cleanup.
- In `product-shell.css`, start selectors from `[data-product-workspace-active='true']` and use the existing `:where(.dark *)` convention. Override semantic dark tokens only when the marker is present and `data-theme-preset` is absent. The body marker lets normal content and portal content inherit one palette without changing public routes or explicit presets.
- Map `ProductShell surface='workspace'` product tokens back to the workspace semantic tokens so its canvas no longer forces a separate `#0e1116` layer.
- Keep public/auth ProductShell variants unchanged.

Planned dark hierarchy:

| Layer            | Direction                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------- |
| Workspace canvas | premium black with a neutral graphite lift, visibly lighter than the current near-black shell |
| Sidebar/header   | slightly denser structural black with a silver boundary                                       |
| Card/table/input | progressively lifted neutral-cool surfaces                                                    |
| Popover/dialog   | highest non-modal surface with stronger text contrast                                         |
| Brand/focus      | restrained ice blue used for active state and focus, never as a large fill                    |

Dashboard atmosphere and Canvas-rendered chart colors are reviewed after the token pass. Hard-coded black hover strokes or dark labels are changed only where browser evidence still shows a P1/P2 issue.

## Homepage Below-Fold Scope

- Create `web/src/styles/home-below-fold.css` and import it after the existing global styles from `web/src/main.tsx`.
- Scope every token and selector under `.home-below-fold` / `.dark .home-below-fold`.
- Do not edit the frozen homepage component tree or `index.css`.
- Define local `--background`, `--foreground`, `--card`, `--muted`, `--muted-foreground`, `--border`, `--primary`, and related foreground tokens so existing Tailwind semantic utilities automatically adopt the palette.
- Add section differentiation only through existing stable descendants and semantic hooks. Avoid `nth-child` because the CTA is omitted for authenticated users.
- Preserve all existing intersection and counter animations.

## Accessibility And Motion

- Use opaque or near-opaque surfaces for dense operational content; translucency is limited to the workspace header where it communicates hierarchy.
- Maintain visible focus rings and AA text contrast.
- No new continuous motion, parallax, or large brightness transition is introduced.
- Reduced-motion behavior remains unchanged because this task does not add motion.

## Compatibility And Rollback

- Removing the workspace marker/token block restores the old console palette without touching feature components.
- Removing the new stylesheet import restores the old homepage lower palette while leaving the first viewport untouched.
- Custom presets remain authoritative when users explicitly choose them; default palette changes are scoped to the unpreset workspace state.

## Verification Strategy

- Product Design audit: current and revised screenshots for home below-fold and representative console pages.
- Design QA: exact first-viewport freeze comparisons at identical route/theme/viewport; lower sections use audit because there is no same-state visual mock.
- Automated checks: targeted tests, changed-file lint/format, typecheck, build, and frozen-path diff.

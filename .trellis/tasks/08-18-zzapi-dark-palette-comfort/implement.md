# Implementation Plan — Dark Palette Comfort

## Wave 1 — Token Unification

1. Add the authenticated workspace body marker lifecycle and a regression test proving exact cleanup/restoration.
2. Define scoped default dark workspace tokens for canvas, sidebar/header, card, muted, input, table, popover, text, borders, focus, status, skeleton and chart colors.
3. Map `ProductShell surface='workspace'` to the workspace semantic palette so no second near-black canvas remains.
4. Add `home-below-fold.css`, import it after the existing global stylesheet, and define isolated light/dark lower-page tokens.
5. Add focused regression coverage proving the new stylesheet is scoped below the Hero and the workspace palette requires the authenticated marker.

## Wave 2 — Evidence-Driven Polish

1. Capture homepage below-fold light/dark at desktop, tablet and mobile after scrolling sections into view.
2. Capture console overview, one dense table/log surface, one settings form and one overlay/popover in default dark.
3. Fix only remaining visible P1/P2 issues: Dashboard double-dark overlays, Canvas chart labels/strokes, footer contrast, or isolated full-strength `dark:bg-*-950` surfaces.
4. Re-capture the same states and record before/after evidence.

## Quality Gates

- `bun run typecheck`
- changed-file `oxlint`
- changed-file `oxfmt --check`
- relevant Vitest files, including workspace marker and palette-scope contracts
- `bun run build`
- `git diff --check`
- frozen homepage path diff against `d092808a802835e3108be1ad20ba0eb7d04b9cf7`
- browser console error check
- Trellis task validation

## Rollback Points

- Workspace rollback: remove the marker and its scoped token block.
- Homepage rollback: remove the new stylesheet import and file.
- Page-specific polish is isolated in a second commit-sized wave and can be removed independently.

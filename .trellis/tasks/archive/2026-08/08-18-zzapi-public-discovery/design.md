# Technical Design — Public Discovery

## Boundary and Dependencies

- Consume the Product Foundation contracts from `08-18-zzapi-product-foundation`; do not recreate shell tokens or bypass `ProductShell`, `ResourceHeader`, or `MetricStrip` when they fit.
- Keep all existing React Query hooks, route loaders, model/price/ranking DTOs, permission checks, and external documentation URLs unchanged.
- Use a product-scoped public layout/header opt-in. The frozen homepage continues to use the legacy `PublicLayout`/`PublicHeader` branch.
- Legal copy remains source-controlled/configured content with the same sanitization and rendering rules; this phase may change reading structure only.

## Page Contracts

- Model plaza: discovery-first layout with search/filter controls, provider and capability comparison, price visibility, and a clear model detail/use entry. Results must have a deterministic loading, empty, error, and permission-gated representation.
- Model detail: one primary identity heading, capability/compatibility/price sections, copyable call information, and a stable not-found/error recovery path.
- Rankings: comparison-oriented table/list with rank, change/trend, metric definition, and model/provider context. No color-only trend meaning.
- About: configurable content first; useful default zzapi product narrative when configuration is absent; preserve new-api / QuantumNous attribution and links.
- Legal: long-form reading layout with local section navigation only when headings exist, readable line length, anchor focus, and mobile-safe overflow.

## Responsive and Accessibility

- Mobile reorganizes controls into a compact filter entry point and single-column result flow; it must not merely shrink a desktop grid.
- Tablet preserves comparison context with fewer columns and horizontal safety only for genuinely tabular data.
- Every action is reachable by keyboard, has a visible focus state, and exposes loading/disabled/error state text.
- External docs stays an external link. If no docs URL is configured, render an explicit disabled/fallback state rather than inventing `/docs`.

## Motion and Rollback

- Use only the additive product page-enter and small state feedback variants. No homepage motion or global motion token changes.
- All route transitions and filter result updates remain interruptible and use reduced-motion cross-fades.
- Each route migrates opt-in independently; rollback removes the appearance prop without changing business code.

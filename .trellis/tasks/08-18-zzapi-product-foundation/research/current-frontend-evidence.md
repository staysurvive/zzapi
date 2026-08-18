# Current Frontend Evidence — Product Foundation

## Brand and frozen homepage

- Final brand reference: `C:/Users/npp_c/.codex/attachments/6044b8c8-9679-440c-bbe4-f58908c72e82/image-1.png`.
- Frozen baselines: `C:/Users/npp_c/AppData/Local/Temp/zzapi-home-frozen-baseline-d092808a/`.
- Frozen source boundary: `web/src/features/home/**`, `web/src/routes/index.tsx`, `web/public/landing-brand-core.png`.
- `web/src/styles/index.css` is frozen as a whole because it contains homepage-only `.home-hero`, `.zzapi-opening`, Gateway route and opening animation rules. Product styling must live in a separate scoped file.

## Layout evidence

- `web/src/components/layout/components/public-layout.tsx` owns the default public `main` when `showMainContainer !== false`; the homepage opts out and renders its own main.
- `web/src/components/layout/components/public-header.tsx` is shared by the homepage and other public pages. Any product redesign must be opt-in so the homepage default DOM/classes/motion remain unchanged.
- `web/src/components/ui/sidebar.tsx` renders `SidebarInset` as a `main`.
- `web/src/components/layout/components/main.tsx` also renders `main`, and is used inside authenticated routes through `SectionPageLayout`, Profile and Playground. This creates nested main landmarks.
- `web/src/components/skip-to-main.tsx` links to `#content`, but no matching authenticated target is present.
- `web/src/components/layout/components/section-page-layout.tsx` parses Title/Actions/Content/Breadcrumb compound slots and is the stable integration point for resource headers.
- `web/src/components/data-table/layout/data-table-page.tsx` is the actual shared DataTablePage path. It already provides mobile lists/card views, loading/empty states, toolbar slots and pagination, so appearance changes should be additive and must not duplicate existing responsive behavior.

## Motion evidence

- `web/src/lib/motion.ts` defines `pageEnter` with `y: 8` and `filter: blur(4px)`.
- `web/src/components/page-transition.tsx` applies `pageEnter` to authenticated route changes and bypasses it for reduced motion.
- The product direction is a 160–180ms opacity + 2–4px transition without blur. Because motion helpers are shared, use an additive product variant or verify every consumer before changing a default.

## Mobile public navigation evidence

- `public-header.tsx` keeps the full-screen menu mounted while closed and only applies `pointer-events-none opacity-0`; links remain potential focus targets.
- Trigger lacks `aria-expanded` and `aria-controls`.
- Escape handling, focus placement and focus return are absent.
- Overlay content uses a non-scrollable full-height flex container, risking low-height landscape clipping.
- Since this header is used by the frozen homepage, visual/behavior changes should be isolated behind product appearance unless an accessibility-only attribute can be proven output-neutral.

## Test and tool evidence

- `web/package.json` provides `typecheck`, `lint`, `test`, `build`, `format:check` and `i18n:sync` scripts.
- Vitest uses jsdom and `web/src/test-setup.ts`; React Testing Library and user-event are available.
- Frontend commands can run in container `admiring_chatelet`, whose `/workspace` maps to `D:/new-api/web`.
- Locale JSON files must not be edited directly. Add/update translations through `web/scripts/add-missing-keys.mjs`, then run `bun run i18n:sync`.

## Governance

- All source files preserve QuantumNous AGPL headers.
- new-api, QuantumNous, license, attribution and related links are protected and must remain intact.

# Product Foundation Screen Contract

阶段一交付的是可组合基础设施，不迁移完整业务页面。验收必须区分可直接观察的真实页面、可通过组件行为稳定验证的契约，以及必须等真实消费者接入后再做的视觉证据。禁止为了截图新增临时生产路由或把首页当作 Product Shell 的视觉目标。

| Surface / contract | Route or state | Primary user job | Required evidence in Phase 1 |
| --- | --- | --- | --- |
| Frozen homepage legacy branch | `/`, guest, settled opening state | Understand zzapi and start using the product | fixed-baseline source diff; desktop/mobile and light/dark browser review; legacy header/layout branch unchanged |
| Product public shell | component contract only; first real consumers start in Phase 2 | Navigate a public product page with one main landmark | ProductShell scope/surface/no-landmark test; PublicLayout product branch single `main#main-content` test; production build |
| Product public navigation | closed/open/disabled/requires-auth/route-change/unmount | Use navigation by pointer, touch or keyboard | trigger expanded/controls; focus enters menu; Escape closes and returns focus; disabled links leave tab order; body scroll cleanup; product-scoped auth dialog |
| Workspace shell landmark | authenticated layout composition | Skip directly to the workspace content and avoid nested main landmarks | `SidebarInset` owns the only `main#main-content`; inner Main consumers render as `div`; skip target matches and is focusable |
| Resource header | default and nested heading levels; compact actions | Identify the current resource and its status/actions | `h1` default; explicit heading level; description/meta/status/actions slots; compact mobile action flow |
| Metric strip | auto/horizontal/stack; 2–5 metrics | Scan key values without relying on color | semantic `dl/dt/dd`; textual status/trend; mobile single-column fallback |
| Product DataTable scope | legacy/product appearance | Adopt product tokens without changing table behavior | data attributes added to the existing first root only; no wrapper; legacy fixed-height/mobile/card/pagination contracts remain unchanged |
| Product motion and focus | normal/reduced-motion/forced-colors | Receive restrained feedback and visible keyboard focus | scoped CSS review; enter motion only uses opacity/transform; reduced-motion disables movement; forced-colors uses system Highlight |

## Viewport and theme contract

- Homepage freeze review: 1440x900 and 390x844, Light and Dark, same development surface and settled animation state as the fixed manifest.
- Product public route screenshots are intentionally deferred to Phase 2 because Phase 1 does not opt any business route into `appearance='product'`.
- Workspace browser evidence requires an authenticated session with seeded data. If unavailable in Phase 1, landmark and focus behavior must be protected by deterministic component tests and reverified on real routes in Phase 3.
- Low-height product menu evidence is owned by the first real Phase 2 consumer; Phase 1 must still prove scrolling, modal focus, Escape and cleanup behavior at component level.

## Failure conditions

- Any diff under a frozen homepage path.
- Any unscoped Product CSS selector or global token override.
- More than one main landmark in public product/workspace composition, or a missing `#main-content` skip target.
- A closed mobile menu that remains keyboard reachable, or an open menu that does not restore scroll/focus on close.
- Visual claims for a product branch with no real consumer route.


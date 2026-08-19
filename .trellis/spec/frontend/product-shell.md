# Product Shell and Shared Layout Contracts

## Scenario: Product route foundation

### 1. Scope / Trigger

- Trigger: A shared frontend layout, public header, dialog portal, data table, or skip-link target is added or changed for a non-home product route.
- Scope: `web/src/components/layout/`, `web/src/components/data-table/layout/data-table-page.tsx`, `web/src/components/dialog.tsx`, `web/src/components/ui/{dialog,sheet}.tsx`, and `web/src/styles/product-shell.css`.
- Homepage boundary: Preserve the legacy/default branches and do not edit `web/src/routes/index.tsx`, `web/public/landing-brand-core.png`, or `web/src/styles/index.css` for product work. The dedicated Trellis task `08-19-zzapi-homepage-v5-below-fold` is the only authorized exception for a scoped below-fold homepage subtree; it must keep the Hero/opening files frozen and must not alter non-home routes.

### 2. Signatures

- `ProductShell({ children, surface?: 'public' | 'auth' | 'workspace', className?, motion?: 'enter' | 'none' })` renders a scoped `div` and never a landmark.
- `PublicLayout({ appearance?: 'legacy' | 'product', ... })` keeps `legacy` as the default. The `product` branch owns exactly one `main#main-content`.
- `Main({ as?: 'main' | 'div', fluid?, ...htmlProps })` uses `main` by default; authenticated workspace inner consumers must pass `as='div'` when `SidebarInset` owns the main landmark.
- `ResourceHeader({ title, eyebrow?, description?, meta?, status?, actions?, headingLevel?: 1..6, compact?, className? })` defaults to `h1`.
- `MetricStrip({ items, layout?: 'auto' | 'horizontal' | 'stack', className? })` renders a `dl` with `dt`/`dd` semantics.
- `DataTablePage({ appearance?: 'legacy' | 'product', ... })` adds product data attributes to the existing first root only; it must not add a wrapper or alter table/mobile/pagination behavior.

### 3. Contracts

- Product scope: ProductShell emits `data-zzapi-product='true'`, `data-product-surface`, and `data-product-motion`. Product CSS selectors must start from `[data-zzapi-product]` or another `[data-product-*]` contract; no `:root` tokens or global selectors.
- Workspace theme scope: while `AuthenticatedLayout` is mounted, it sets `data-product-workspace-active='true'` on `document.body`. Default workspace dark tokens may apply only when that marker is present and `data-theme-preset` is absent. This body-level scope is intentional so dialogs, sheets, popovers, and other portal content inherit the same workspace palette without leaking it into public routes or explicit presets.
- Workspace marker cleanup: `AuthenticatedLayout` snapshots the exact prior marker value before mounting. On cleanup it removes an initially absent marker or restores the prior string value; it must not blindly clear an attribute owned by another mounted boundary.
- Main/skip target: Public product and workspace each expose one `main#main-content` with `tabIndex={-1}`. `SkipToMain` always points to `#main-content`. Auth ProductShell itself has no landmark; auth ownership is defined by the auth layout phase.
- Public navigation: `ProductPublicHeader` exposes `aria-expanded` and `aria-controls` on its menu trigger, gives the opened menu an accessible name, places focus into the menu, closes on Escape, returns focus to the trigger, and keeps disabled links out of the tab order with `aria-disabled` and `tabIndex={-1}`.
- Scroll lock: Opening the product menu stores the previous `document.body.style.overflow`; close, route change, unmount, and error cleanup restore that exact value.
- Auth prompt: A `requiresAuth` link prevents navigation for guests, opens a product-scoped dialog portal, and redirects to sign-in with the original target. Authenticated users navigate directly.
- Motion and focus: Product entry motion is opacity plus at most 3px transform; reduced motion disables the animation. Product focus uses the scoped brand color and forced-colors maps it to `Highlight`.
- i18n: New user-facing strings use `useTranslation().t(...)`; locale JSON is updated only through the repository i18n tooling.

### 4. Validation & Error Matrix

| Condition                                       | Required result                                                                                    |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `appearance` omitted or `legacy`                | Existing DOM/classes/behavior remain unchanged.                                                    |
| ProductShell receives `surface`                 | Scoped surface attribute is present; no `main` is introduced.                                      |
| Product public route renders                    | Exactly one `main#main-content`; skip link resolves to it.                                         |
| Workspace renders inside `SidebarInset`         | SidebarInset is the only main; inner `Main` renders a `div`.                                       |
| Default dark workspace mounts without a preset  | Body marker is `true`; workspace and portal semantic tokens resolve to the scoped default palette. |
| Workspace mounts with `data-theme-preset`       | The explicit preset remains authoritative; default workspace palette selectors do not match.       |
| Workspace unmounts                              | An absent prior marker is removed; any prior string value is restored exactly.                     |
| Product menu is closed                          | Menu content is not keyboard reachable and body overflow is unchanged.                             |
| Product menu opens                              | Trigger reports expanded/controls, menu is focusable and scrollable, body overflow is `hidden`.    |
| Menu closes by Escape, route change, or unmount | Focus returns when applicable and the exact prior body overflow is restored.                       |
| Disabled or guest-only link is activated        | Disabled link does not navigate; guest-only link opens the auth prompt.                            |
| Reduced motion or forced colors is active       | No product entrance transform; focus outline remains visible with system color in forced colors.   |
| A selector or token is not product-scoped       | Reject the change and move it to the scoped product stylesheet or an explicit opt-in branch.       |

### 5. Good / Base / Bad Cases

- Good: `<ProductShell surface='public'><main id='main-content' tabIndex={-1}>...</main></ProductShell>`.
- Base: `<PublicLayout>{children}</PublicLayout>` continues to use the legacy branch and its existing header/main output.
- Bad: Adding a `main` inside `ProductShell`, changing the frozen homepage header to reuse product menu behavior, or applying product tokens from `:root`.
- Bad: Applying workspace semantic tokens from a global `.dark` selector, or removing `data-product-workspace-active` unconditionally during cleanup. Either leaks product styling or destroys another boundary's marker.
- Bad: Closing the menu with `document.body.style.overflow = ''`; this destroys a caller's pre-existing overflow value.

### 6. Tests Required

- ProductShell test: assert surface/motion data attributes and absence of a `main` landmark.
- Layout contract test: assert one `main#main-content` for product public and workspace composition, and `Main as='div'` for nested workspace content.
- Workspace palette lifecycle test: assert the body marker while mounted, removal when initially absent, exact restoration when a prior value exists, and no removal of `data-theme-preset` during cleanup.
- Workspace theme browser matrix: verify default dark workspace tokens, an explicit preset, and a dark public ProductShell independently; portal surfaces must inherit the workspace palette only in the default workspace case.
- Product public header test: assert trigger ARIA, initial menu focus, Escape/focus return, disabled tab exclusion, active route, requires-auth behavior, and route-change/unmount overflow cleanup.
- ResourceHeader/MetricStrip test: assert heading level, `dl`/`dt`/`dd`, and textual status/trend output.
- DataTable appearance test: assert the existing first root receives product scope and no extra wrapper is introduced.
- Run `bun run typecheck`, changed-file `oxlint`/`oxfmt --check`, affected Vitest files, `bun run build`, `git diff --check`, and the homepage freeze diff/status checks.

### 7. Wrong vs Correct

#### Wrong

```tsx
<ProductShell>
  <main>{children}</main>
</ProductShell>
```

```css
:root {
  --product-brand: #1549f4;
}
```

#### Correct

```tsx
<ProductShell surface="public">
  <main id="main-content" tabIndex={-1}>
    {children}
  </main>
</ProductShell>
```

```css
[data-zzapi-product] {
  --product-brand: #1549f4;
}
```

```tsx
useLayoutEffect(() => {
  const attribute = "data-product-workspace-active";
  const previousValue = document.body.getAttribute(attribute);
  document.body.setAttribute(attribute, "true");

  return () => {
    if (previousValue === null) {
      document.body.removeAttribute(attribute);
      return;
    }
    document.body.setAttribute(attribute, previousValue);
  };
}, []);
```

```css
[data-product-workspace-active="true"]:where(.dark *):not([data-theme-preset]) {
  --background: #111315;
}
```

## Design Decisions

### Additive product opt-in

The legacy branch remains the default so the frozen homepage can retain its established DOM and motion. Product routes opt in explicitly through `appearance='product'`; later phases may migrate real consumers one group at a time.

### Landmark ownership stays outside ProductShell

The shell owns scope, canvas, and motion only. The layout that understands the page composition owns `main`, preventing nested landmarks when workspace primitives already provide one.

### Body marker for portal-consistent workspace themes

Workspace semantic tokens use a lifecycle-managed body marker instead of a ProductShell descendant selector because Base UI portals render outside the shell subtree. Combining the marker with the absence of `data-theme-preset` keeps portal surfaces consistent while preserving explicit user theme choices and public-route isolation.

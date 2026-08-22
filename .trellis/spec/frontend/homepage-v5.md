# Homepage V5 Below-Fold Contracts

## Scenario: Public homepage brand-chain demonstration

### 1. Scope / Trigger

- Trigger: Changes to `web/src/features/home/components/v5/`, the homepage V5 data hook/lib, or the scoped below-fold stylesheet.
- Scope: The below-fold narrative after the frozen hero/opening experience. This contract does not authorize changes to backend routes, Docker, the hero, or the Gateway opening graph.

### 2. Signatures

- `useHomepageV5Data({ isAuthenticated, openingPhase })` returns fixed demonstration models after `openingPhase === 'ambient'`; it may still read status for the existing base URL and docs link.
- `HomepageV5` renders stages in this order: request corridor, model catalog, value tabs, developer integration, CTA.
- `DeveloperIntegrationStage` exposes `cURL`, `Python`, and `Node.js` examples for the selected model while preserving the configured base URL and endpoint path.

### 3. Contracts

- The public demonstration catalog contains exactly the five sample IDs defined by `HOMEPAGE_DEMO_MODELS` and does not request `/api/pricing` or performance summaries.
- Selecting a model changes only local selection state and the generated code model ID; it must not create a network request.
- Fixed value demonstrations are presentation data, not billing, uptime, refund, or provider guarantees. Copy must make their demonstration nature clear where the state label is shown.
- Code tabs use `role="tab"`, `aria-selected`, `aria-controls`, stable tab IDs, and a labelled `role="tabpanel"`. Copy feedback is exposed through an `aria-live` region.

### 4. Validation & Error Matrix

| Condition | Required result |
| --- | --- |
| Opening phase is not ambient | Catalog remains empty/loading and no demo model is exposed yet. |
| Opening phase is ambient | Five fixed models are shown and no model-list request is made. |
| Unknown model selection | Current local selection remains unchanged. |
| Model has no OpenAI chat endpoint | Code surface shows the existing unavailable state and no copy action. |
| Narrow viewport | Decorative global spine/branches are removed; content stacks without page-level horizontal overflow. |
| Reduced motion | Existing reveal and interactive motion transitions are disabled. |

### 5. Good / Base / Bad Cases

- Good: Keep sample metrics in a named constant or panel-local fixture and label them as demonstration values.
- Base: Preserve the existing status-derived base URL and docs link without adding a second endpoint or changing route semantics.
- Bad: Fetching a live model list solely to populate the public demonstration, presenting fixed latency as an SLA, or changing the API path when switching languages.

### 6. Tests Required

- Stage-order regression: assert the five rendered `data-home-v5-stage` values and absence of the identity stage.
- Catalog regression: assert all five IDs, local selection, and zero API calls.
- Code example regression: assert language switching, copy content, keyboard boundary navigation, and tab/panel ARIA linkage.
- Value-panel regression: assert fixed metrics, route/refund views, and the usage chart's accessible `role="img"` name.
- Run affected Vitest files, `bun run typecheck`, changed-file Oxlint/Oxfmt, `bun run build`, and `git diff --check`.

### 7. Wrong vs Correct

#### Wrong

```tsx
const models = await api.get('/api/pricing')
<span>24ms</span> // presented as a production guarantee
```

#### Correct

```tsx
const models = openingReady ? HOMEPAGE_DEMO_MODELS : EMPTY_HOMEPAGE_MODELS
<span>{t('Fixed demonstration data')}</span>
```

## Design Decisions

### Fixed public demonstration, live status plumbing only

The homepage uses stable sample models and metrics so its narrative remains useful for logged-out visitors and does not turn presentation content into an implicit backend contract. Existing status plumbing remains limited to the configured base URL, docs link, and system name needed by the public shell.

### Accessible local code language tabs

The language switcher stays local to the code surface and uses explicit tab/panel relationships. This keeps copying deterministic while allowing keyboard users to move between `cURL`, `Python`, and `Node.js` without changing the request contract.

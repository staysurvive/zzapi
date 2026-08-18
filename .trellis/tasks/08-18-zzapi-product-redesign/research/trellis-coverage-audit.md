# Trellis Coverage Audit

Date: 2026-08-18

Source brief: `C:/Users/npp_c/.codex/attachments/6044b8c8-9679-440c-bbe4-f58908c72e82/pasted-text-1.txt`

## Result

The original redesign brief is covered by the parent task and six ordered child tasks. All complex children now have `prd.md`, `design.md`, `implement.md`, a screen contract, an evidence matrix, and validated `implement.jsonl` / `check.jsonl` context.

| Brief requirement | Trellis owner/evidence | Status |
| --- | --- | --- |
| Freeze homepage and use it only as Brand DNA | parent R1, `home-freeze-manifest.md`, every phase gate | covered |
| Inventory all routes, pages, roles and logical sections | `route-surface-manifest.md` | covered |
| Product/IA redesign rather than cosmetic reskin | parent R2/R3, phase-specific page contracts | covered |
| Shared but composable design system | Phase 1 Product Foundation | covered |
| Public discovery and brand surfaces | Phase 2 | covered |
| Auth flows and workspace navigation | Phase 3 | covered |
| User dashboard, usage, keys, billing, profile, tools/chat | Phase 4 waves 4A–4D | covered |
| Admin, tables, permissions, 40 settings sections and setup | Phase 5 waves 5A–5F | covered |
| Desktop/tablet/mobile and light/dark | every child screen contract and Phase 6 | covered |
| Keyboard, screen reader, contrast and reduced motion | Phase 1/3 foundations plus all phase gates | covered |
| Purposeful, restrained motion | parent motion contract, Apple-style interruptibility/reduced-motion gates | covered |
| Seven-locale i18n | parent R6 and every implementation gate | covered |
| Independent product/brand/responsive/a11y/motion/code audits | Phase 6 audit lanes | covered |
| Multi-round fix → recapture → compare loop | parent R7 and Phase 6 Design QA loop | covered |
| Direct reproducible evidence, not normal-data screenshots | route/state manifests and per-phase evidence matrices | covered |
| Preserve new-api / QuantumNous identity and attribution | parent R6 and every phase governance context | covered |

## Sequencing Contract

1. Complete and accept Product Foundation.
2. Plan refresh against live code before each later phase starts.
3. Implement Phase 2 through Phase 5 in order and in their named waves.
4. Run Phase 6 only as integration verification, never as the owner of an omitted page.

## Remaining Runtime Work

- Planning coverage is complete; implementation and browser evidence are not complete.
- Visual targets must be established for each visible product family before its visual implementation. Design QA is valid only for matching route/state/viewport artifacts.
- Existing lint/test failures remain a recorded baseline, not an exemption from changed-file zero-error or final release quality gates.

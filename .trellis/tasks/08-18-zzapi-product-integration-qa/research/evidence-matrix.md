# Integration QA Evidence Matrix

| Lane | Direct evidence | Pass condition |
| --- | --- | --- |
| Route coverage | reconciled route/section inventory | no unowned surface |
| Product/brand | same-state screenshots + audit report | no P0/P1/P2 |
| Responsive | desktop/tablet/mobile captures | no clipping/overlap/persistent-action loss |
| Accessibility | semantic DOM, keyboard, focus, contrast, reduced-motion checks | no high-priority issue |
| Motion | browser interaction capture and reduced-motion check | no latency/jump/unintended homepage drift |
| Quality | lint/typecheck/tests/build/i18n/copyright output | pass or precise baseline delta |
| Homepage freeze | git diff, status, four hashes | zero frozen-path change/regression |

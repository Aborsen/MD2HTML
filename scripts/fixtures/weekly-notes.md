# Weekly notes — 4 September

## Decisions

- The importer keeps its own queue. Sharing one with the exporter saved a
  table and cost us a week of debugging ordering.
- Retention stays at 90 days until someone asks for more with a reason.

## Numbers

| Metric | This week | Last week |
| --- | --- | --- |
| Runs | 12,904 | 11,338 |
| Median run | 4.1 s | 4.4 s |
| Failed runs | 31 | 62 |

## Next

- [ ] Cancel a run from the dashboard
- [ ] Write down what the scheduler guarantees, in one page

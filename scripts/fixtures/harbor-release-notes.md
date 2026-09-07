# Harbor 2.4 — release notes

Harbor 2.4 is a maintenance release. Nothing in it changes the shape of a
pipeline; everything in it makes an existing one easier to watch.

## What changed

| Area | Change | Notes |
| --- | --- | --- |
| Scheduler | Retries back off exponentially | Capped at 15 minutes |
| Storage | Manifests are written once | Was: once per replica |
| CLI | `harbor tail` follows a run | Ctrl-C leaves the run alone |

## Upgrading

The migration is online and takes about a minute on a table of ten million
rows. Run it before rolling the workers:

```bash
harbor migrate --to 2.4
harbor roll workers --batch 25%
```

> Roll the workers in batches. A single restart of the whole fleet drops the
> in-flight runs, and 2.4 is the first release that can pick them back up.

## Still open

- [x] Backoff on retries
- [x] One manifest per run
- [ ] Cancel a run from the dashboard
- [ ] Per-project quotas

Details on each in [the tracker](https://example.com/harbor/issues).

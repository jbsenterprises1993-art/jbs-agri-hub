# JBS Full Ecosystem — Live Work Dashboard

> This dashboard records **actual repository work only**. Planned/demo progress is never shown as completed.

## Pipeline
**Backup → Coding → Testing → Fixing → Retest → Ready → Release**

## App Status

| App | Source status | Current stage | Evidence |
|---|---|---|---|
| JBS Agri Hub | Existing source preserved | Testing/Integration | Existing master source + CI branch |
| JBS Owner | New source foundation | Planned | Full ecosystem specification |
| JBS Admin | New source foundation | Planned | Full ecosystem specification |
| JBS Billing | New source foundation | Planned | Full ecosystem specification |
| JBS Stock | New source foundation | Planned | Full ecosystem specification |
| JBS Accounts | New source foundation | Planned | Full ecosystem specification |
| JBS Attendance | New source foundation | Planned | Full ecosystem specification |
| JBS Marketing | New source foundation | Planned | Full ecosystem specification |
| JBS Delivery | New source foundation | Planned | Full ecosystem specification |
| JBS Controller | New source foundation | Planned | Full ecosystem specification |
| JBS Time Management | New source foundation | Planned | Full ecosystem specification |
| JBS AI | New source foundation | Planned | Full ecosystem specification |

## Rules
- Master source is never edited directly.
- Work is done on isolated development branches.
- Every meaningful change must have a commit.
- CI must run before a release candidate.
- A stage is marked complete only when there is evidence.
- Secrets/API keys are never committed.
- Existing Agri Hub code is reused; it is not discarded.
- The other 11 apps are newly generated source unless an original source archive is later found.

## Current checkpoint
- Development branch: `jbs/auto-development`
- CI workflow: `.github/workflows/jbs-ci.yml`
- Automation documentation: `docs/JBS_AUTOMATION.md`
- Draft PR: #1

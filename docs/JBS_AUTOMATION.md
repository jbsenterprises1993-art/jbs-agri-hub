# JBS Automatic Development

This repository uses the JBS automatic development workflow.

## Safety
- `main` is treated as the protected/master source.
- Automated work starts on a dedicated `jbs/*` branch.
- Never commit API keys, private keys, passwords, service-account secrets, or user credentials.
- A failed check is a failed check; do not mark it as passed manually.

## Pipeline
Backup -> Inspect -> Change -> Test -> Fix -> Retest -> Approve -> Release

## Current state
- Real connected app: JBS Agri Hub.
- Other planned JBS apps are managed outside this repository until their real source is connected.
- CI validates dependency installation, linting, TypeScript, and basic secret safety.

# JBS Controller OS — Two-Stage Delivery Roadmap

Status: STARTED — planning and repository checkpoint only. No app code has been changed, built, or deployed by this document.

## Objective
Deliver JBS Controller OS in two controlled stages:
1. Stage 1 — a standalone Android Controller app.
2. Stage 2 — advanced Android OS-style launcher features, after Stage 1 is stable and security-reviewed.

The first deliverable is an Android app, not a replacement Android operating system. Launcher/default-home capabilities are a later, optional Android integration and remain subject to platform permissions and device compatibility.

## Fixed product decisions
- Controller-level assistant is named **JBS AI** and appears as JBS AI only in the Controller App.
- The Owner App assistant remains **Owner AI**; do not rename it or expose JBS AI as its visible assistant.
- JBS AI is the central control-plane interface for current and future JBS apps, through registered and supported APIs/adapters.
- Keep JBS Coin and all existing app-specific color assignments and workflows intact.
- The JBS Owner App's approved purple + gold theme does not change other apps' colors.
- Free-first implementation. No paid credits, subscriptions, cloud spend, hardware purchases, or paid plans without explicit Owner approval.
- Do not merge a draft PR, publish, deploy, or change production settings without inspection, tests, and the relevant approval.
- JBS AI cannot approve its own updates. Its own software/model/tool/prompt updates require Controller approval only; Owner approval is still required for spending. Other app changes and privileged actions follow their existing approval gates.

## Stage 0 — Verify and protect the starting point
1. Confirm the source of truth and current branches before editing.
2. Inspect the existing JBS Controller / Orchestrator Hub UI and the actual Expo Android repository separately; do not assume the web prototype is the Android app.
3. Record the baseline commit, relevant files, current build/test state, known failures, and existing approval status.
4. Create a recoverable checkpoint before implementation. Do not rewrite shared history.
5. Inspect authentication, Firebase/backend rules, secrets handling, and the draft PR before reusing any code.
6. Do not copy secrets into documentation, client bundles, or commits.

**Exit criteria:** baseline and scope are documented; backup/checkpoint is verifiable; actual Android target and backend are identified; no production changes.

## Stage 1 — Standalone Android Controller App (first build)

### MVP screens
- Secure sign-in and role-aware session state.
- Controller dashboard with clear real vs. planned status.
- JBS AI assistant shell with task history and approved capabilities only; no fake claim of live model execution.
- JBS app registry: app name, purpose, version, environment, health/status, connected adapter, permissions, last backup and release history.
- Approval queue: proposal, requester, target app/action, risk, test evidence, approval state, and audit record.
- Master Document Vault index with document versions and source links.
- Backup Center status UI showing scope, last successful backup, verification and restore-test status.
- Security/incident inbox with recipient routing design for Controller and Owner.
- Update Center showing proposed version, inspected diff, test results, approver, release state, and rollback reference.
- Settings for language, accessibility, session/security options and app-specific theme.

### Required architecture and safety
- Backend-enforced identity, roles, and per-app/per-action least privilege; UI visibility alone is never authorization.
- Secure backend for credentials and provider keys; never embed secrets in the Android app.
- Append-only/tamper-evident audit trail for requests, approvals, permission changes, releases and restores.
- Use a versioned adapter/API boundary for each managed app. A disconnected or unsupported app must be clearly marked, not represented as controllable.
- Read-only status first; only enable an action after its backend authorization and test are verified.
- Dry-run/sandbox for updates; backup → inspect → isolated branch/workspace → test → diff review → approval → release → health verification/rollback.
- No unrestricted AI access, self-approval, automatic paid spending, or production deployment.
- Keep critical local safety behavior independent of Controller availability.

### Stage 1 acceptance tests
- Unauthorized/staff/customer accounts cannot call Owner/Controller-only backend actions by bypassing the UI.
- Every sensitive action checks authorization on the server and writes an audit record.
- Missing adapter, backend outage, expired session, and failed backup are shown honestly and fail safely.
- JBS AI and Owner AI naming is correct in screens, navigation and notifications.
- Existing JBS Coin and app color rules are unchanged.
- Android install/launch/navigation, network failure, session expiry and accessibility smoke tests pass.
- Build artifact and test results are recorded; deployment remains a separate approval.

## Stage 2 — Advanced OS-style launcher (only after Stage 1 acceptance)

### Candidate capabilities
- Optional home-screen/launcher experience with JBS-branded app grid, search, widgets and shortcuts.
- Deep links and approved app launching across registered JBS apps.
- Notification aggregation and action routing subject to Android notification permissions.
- Quick access to Controller status, approvals, alerts, backups and JBS AI.
- User-configurable layout, icon groups, search, accessibility and safe fallback to the normal launcher.
- Optional default-home role support where Android version/device permits; explain and request the operating-system role through the standard Android flow.
- Device-policy, kiosk or managed-device features only for supported, explicitly authorized devices and after a separate security review.

### Stage 2 boundaries
- Do not claim this replaces Android itself or gains root/system privileges.
- Do not silently set itself as default launcher, bypass Android permissions, read other apps' private data, or intercept protected actions.
- Launcher functions depend on Android APIs, OS version, manufacturer restrictions and the permissions the user grants.
- Keep a clear exit path to the normal home screen and test on target devices before rollout.

### Stage 2 acceptance tests
- Launcher works on the agreed Android versions/devices and degrades gracefully on unsupported devices.
- Default-home opt-in is explicit and reversible.
- Notifications/deep links use least privilege and cannot trigger unauthorized business actions.
- Normal Android navigation, emergency access and user escape/fallback remain available.
- Stage 1 Controller app remains usable even when launcher features are disabled.

## Work sequence and deliverables
1. Baseline/source audit and checkpoint.
2. Stage 1 screen map, data model, role matrix and API contracts.
3. Build the standalone Android MVP UI against clearly marked demo/read-only data first.
4. Implement and test trusted backend authorization before enabling privileged operations.
5. Connect registered app adapters one at a time.
6. Android build, smoke tests, security tests, and Owner review.
7. Stage 1 release decision; no automatic production release.
8. Stage 2 launcher prototype in an isolated branch.
9. Test opt-in/default-home flow, compatibility and fallback.
10. Separate Stage 2 approval and rollout decision.

## Current status
- The existing GitHub governance plan is a design document, not an implementation.
- The JBS Orchestrator Hub is a separate web prototype and is not proof of a native Android Controller app or live integrations.
- No Android APK, backend control plane, real AI provider connection, security alert delivery, verified backup/restore, or launcher has been created by this roadmap.
- Lovable workspace is on the Free plan. Do not assume credits are available or spend money to continue.
- Next engineering step: inspect the real Expo app tree, current branch/PR and backend rules; then choose the correct Android app codebase and create a verified checkpoint before coding.

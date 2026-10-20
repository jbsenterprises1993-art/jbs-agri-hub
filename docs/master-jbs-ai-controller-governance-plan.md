# Master JBS AI — Controller App Governance Plan

Status: PLANNED — documentation only. This file does not implement or deploy app features.

## Goal
Make the JBS Controller App the governed control center for Master JBS AI, approved AI providers/tools, security capabilities, robotics/IoT integrations, project documents, version history, and backup/restore workflows.


## JBS Ecosystem Head Controller — hierarchy decision

The JBS Controller App is the top-level governance and orchestration control plane for the entire JBS ecosystem. This includes JBS Owner App, JBS Agri Hub, all business/operations apps, Master JBS AI, security systems, document vault, backup/restore, future AI tools, automation, robotics, and IoT integrations.

- Controller is the central place to register projects, define permissions, review proposed updates, track approvals, manage versions, and view security/backup status.
- Owner App remains the business-owner interface; it is not a bypass around Controller's project registration and approval workflow.
- A project or new capability must not be exposed in Owner App until Controller approval is recorded by the trusted backend.
- Work may advance to the next stage only after the required Owner authorization is independently verified by the backend.
- For production releases and high-impact actions, both approvals and a release-specific approval must be recorded; AI cannot self-approve.
- This is a governance design decision, not a claim that the live app already implements it. Existing app code must be inspected and tested before rollout.

## Non-negotiable approval gates
1. Discovering a tool or preparing a proposal does not grant it access.
2. New provider, AI model, automation, security tool, robot, device, or integration is first recorded as a proposal in Controller.
3. Controller approval is required before a proposal is made visible/available in Owner App.
4. Owner authorization is separately required before implementation, privileged access, production changes, purchases, deployments, or moving to the next project stage.
5. The backend enforces both approvals. Hiding UI buttons is not authorization.
6. AI may research, summarize, draft, run approved tests, and recommend changes; it cannot approve its own work, grant itself permissions, or release to production.
7. Paid services, credits, subscriptions, hardware purchases, and cloud spend require explicit Owner approval.
8. Production changes follow: Backup → Inspect → Isolated Branch/Workspace → Test → Review Diff → Owner Approval → Release → Verify/Rollback Plan.

## Controller modules
- Master JBS AI Registry: provider/model/tool name, version, capabilities, cost/free tier, data handling, permissions, source links, compatibility, status, risk review, and rollback version.
- Provider Adapter Registry: add new tools through a versioned adapter interface; do not hardwire provider secrets into mobile apps.
- Project Approval Queue: proposed → controller-approved → owner-authorized → testing → release-approved → released; rejected/paused states include reason and audit entry.
- Master Document Vault: master plan, app specifications, architecture, policies, source references, release notes, test reports, and version history.
- Security Center: alert routing to Controller and Owner Apps, incident log, access review, session revocation, and recovery steps.
- Backup & Restore Center: manual and scheduled backups, encrypted copies, retention policy, backup verification, restore drills, and restore approval.
- Robotics/IoT Integration Catalog: device type, vendor, firmware, safety requirements, permissions, network boundary, simulator/test results, emergency stop and manual override requirements.
- Update Center: new tool discovery, compatibility checks, dependency/security scan, sandbox evaluation, cost review, release notes, and rollback.

## Security requirements
- Server-side identity and role authorization; trusted Owner permissions cannot be set by the client.
- Least privilege, MFA/re-authentication for sensitive actions, short-lived sessions where supported, and revocation.
- Secrets stay in a server-side secret manager; never commit credentials, API keys, OTP secrets, or private tokens to source control or app bundles.
- Encrypt sensitive data in transit and at rest; restrict backups separately from production credentials.
- Append-only or tamper-evident audit records for approvals, permission changes, tool installations, deployments, and restores.
- Alert on suspicious logins, repeated failed authentication, permission changes, unusual data access, failed backups, and deployment anomalies.
- Never expose full security details to untrusted users; notify authorized Owner/Controller recipients.

## Safe tool update lifecycle
1. Discover tool from trusted/official source.
2. Record purpose, owner, permissions, cost, data access, dependencies, license, and risks.
3. Review official documentation and compatibility.
4. Run in isolated sandbox with sample/non-production data.
5. Scan dependencies and inspect proposed changes.
6. Controller approval.
7. Owner authorization for access, spending, or next stage.
8. Test, record results, take backup, and require release approval.
9. Deploy only after approval; verify health and keep rollback ready.
10. Record version, changes, test evidence, approver, and date.

## Robotics and physical-world safety
- No live robot, motor, camera, gate, or machinery command from an unreviewed AI tool.
- Simulation/dry-run by default; hardware-in-the-loop and safety review before real actuation.
- Require explicit permissions, emergency stop, manual override, safe operating limits, and audit logs.
- A cybersecurity alert may trigger safe isolation, but destructive or business-critical actions need the approved response policy.

## Backup policy requirements
- Versioned backups of documents, configuration, source references, and approved metadata.
- Separate encrypted backup location/account with least-privilege access.
- Do not store raw production secrets in ordinary backups; use secret-manager recovery procedures.
- Show last successful backup, scope, age, verification result, and restore-test status.
- Restoring permissions, secrets, or production configuration requires fresh Owner authorization.
- Test restore into a separate environment before relying on a backup.

## Initial implementation sequence
1. Inspect the existing Controller App project and repository; preserve current work.
2. Create a verified backup/checkpoint.
3. Build a read-only Master JBS AI registry and approval-queue prototype.
4. Add backend-enforced Controller + Owner approval states.
5. Add document vault metadata and backup status UI.
6. Add sandbox/update lifecycle and security alerts.
7. Test authorization with separate Owner, staff, and unauthorized test accounts.
8. Run restore drills and review security findings.
9. Owner signs off before any production deployment.

## Current limitations / not yet done
This plan is not a working implementation. No production configuration, app permissions, paid service, live AI provider, robot, or deployment is changed by adding this document. Real implementation requires locating the actual Controller App codebase, reviewing its current architecture, and testing the backend authorization rules.

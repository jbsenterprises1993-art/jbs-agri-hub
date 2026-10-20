# JBS Controller OS — Final Watch Phase

Status: PLANNED; no watch app implemented or released.

## Confirmed order
1. Build and test standalone Android JBS Controller App.
2. Build and test optional Android OS-style launcher features.
3. **Final phase:** Build JBS Watch Edition as a companion to the Controller App.

User has not bought a smartwatch yet. No hardware purchase is needed now. Do not purchase hardware or paid services without explicit Owner approval.

## Watch Edition initial scope
- Wear OS companion app as first technical target, subject to Android/Wear OS version and device compatibility.
- App status and read-only Controller dashboard, pending approvals, security alerts, backup status, reports and optional JBS AI voice requests.
- Sensitive actions require backend-enforced permissions and confirmation/re-authentication as appropriate. No unattended privileged actions, AI self-approval, or bypass of Controller/Owner governance.
- Use a watch emulator for initial UI/interaction testing, then test on an actual selected device before claiming production compatibility.
- Apple Watch/watchOS requires a separate implementation and should not be promised as working without testing.
- The watch is not a standalone replacement OS or a substitute for the phone/backend.

## Exit gate before watch work
Stage 1 Android Controller App and Stage 2 launcher must pass their acceptance criteria, and the watch scope must be reviewed. Keep the JBS AI (Controller) vs Owner AI (Owner App) naming rule, JBS Coin, and app-specific colors intact.

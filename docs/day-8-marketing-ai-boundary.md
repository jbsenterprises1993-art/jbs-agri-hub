# Day 8 — Marketing + JBS AI boundary

Implemented:
- Local marketing drafts remain persisted.
- Scheduled posts can be detected when due.
- External publishing is represented as a boundary; the app does not mark a post published without a provider callback.
- AI task queue transitions remain explicit.
- Draft, write and publish permissions are distinct.
- Financial/admin actions are not implicitly granted to the AI task queue.

Still required before production publishing:
- Real provider credentials/configuration.
- Provider API callback/error handling.
- Server-side secret storage.
- Android runtime validation.

Voice control remains an architecture task until a real speech/command provider is configured.

import { addDocument, jbsCollections } from "@/services/jbs-firestore";

export interface JbsAuditEvent {
  actorId: string;
  action: string;
  module: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export async function recordJbsAuditEvent(event: JbsAuditEvent) {
  return addDocument(jbsCollections.auditLogs, event);
}

export type AiTaskStatus = "queued" | "running" | "completed" | "failed";

export type AiTask = {
  id: string;
  appId: string;
  instruction: string;
  status: AiTaskStatus;
  createdAt: string;
  completedAt?: string;
};

export type AiActionPermission = "read" | "draft" | "write" | "publish" | "financial";
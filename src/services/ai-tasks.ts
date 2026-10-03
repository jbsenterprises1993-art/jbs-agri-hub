import type { AiActionPermission, AiTask, AiTaskStatus } from "@/data/ai-types";

const statusTransitions: Record<AiTaskStatus, AiTaskStatus[]> = {
  queued: ["running", "failed"],
  running: ["completed", "failed"],
  completed: [],
  failed: ["queued"],
};

export function canTransitionAiTask(from: AiTaskStatus, to: AiTaskStatus): boolean {
  return statusTransitions[from].includes(to);
}

export function updateAiTaskStatus(task: AiTask, status: AiTaskStatus): AiTask {
  if (!canTransitionAiTask(task.status, status)) {
    throw new Error(`Invalid AI task transition: ${task.status} -> ${status}`);
  }

  return {
    ...task,
    status,
    completedAt: status === "completed" ? new Date().toISOString() : task.completedAt,
  };
}

export function canAiAction(permission: AiActionPermission, granted: AiActionPermission[]): boolean {
  return granted.includes(permission);
}
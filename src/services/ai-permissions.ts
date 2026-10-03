import type { AiActionPermission, AiTask } from "@/data/ai-types";
import { canAiAction } from "@/services/ai-tasks";

export function canQueueAiTask(granted: AiActionPermission[]): boolean {
  return canAiAction("draft", granted);
}

export function canExecuteAiTask(task: AiTask, granted: AiActionPermission[]): boolean {
  if (task.status !== "running") return false;
  return canAiAction("write", granted);
}

export function canPublishAiResult(granted: AiActionPermission[]): boolean {
  return canAiAction("publish", granted);
}

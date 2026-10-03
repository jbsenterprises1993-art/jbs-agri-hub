import type { AiTask } from "@/data/ai-types";
import type { JbsApp } from "@/data/jbs-ecosystem";

export type OrchestratorSummary = {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  blockedTasks: number;
};

export function buildOrchestratorSummary(apps: JbsApp[]): OrchestratorSummary {
  const tasks = apps.flatMap((app) => app.tasks);
  return {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((task) => task.status === "completed").length,
    activeTasks: tasks.filter((task) => task.status === "in_progress").length,
    blockedTasks: tasks.filter((task) => task.status === "blocked").length,
  };
}

export function nextAiTasks(tasks: AiTask[], limit = 5): AiTask[] {
  return tasks.filter((task) => task.status === "queued").slice(0, limit);
}
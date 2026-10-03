import { JBS_ECOSYSTEM } from "@/data/jbs-ecosystem";
import { buildOrchestratorSummary } from "@/services/orchestrator";

export function getOwnerControlSummary() {
  const summary = buildOrchestratorSummary(JBS_ECOSYSTEM);

  return {
    ...summary,
    progressPercent: summary.totalTasks
      ? Math.round((summary.completedTasks / summary.totalTasks) * 100)
      : 0,
    needsAttention: summary.blockedTasks > 0 || summary.activeTasks > 0,
  };
}

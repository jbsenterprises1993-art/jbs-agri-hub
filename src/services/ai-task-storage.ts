import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AiTask } from "@/data/ai-types";

export const AI_TASKS_KEY = "jbs_ai_tasks";

export async function getAiTasks(): Promise<AiTask[]> {
  try {
    const raw = await AsyncStorage.getItem(AI_TASKS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AiTask[]) : [];
  } catch {
    return [];
  }
}

export async function saveAiTask(task: AiTask): Promise<void> {
  const tasks = await getAiTasks();
  const next = tasks.filter((item) => item.id !== task.id);
  await AsyncStorage.setItem(AI_TASKS_KEY, JSON.stringify([task, ...next].slice(0, 200)));
}

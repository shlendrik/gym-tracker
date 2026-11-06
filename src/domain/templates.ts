import type { Template, Workout } from "../types";
import { uid } from "./calc";

/** Делает план из завершённой тренировки: те же упражнения, число подходов и повторы первого подхода. */
export function templateFromWorkout(
  workout: Pick<Workout, "entries">,
  name: string
): Template {
  return {
    id: uid(),
    name: name.trim(),
    updatedAt: new Date().toISOString(),
    items: workout.entries.map((e) => ({
      exerciseId: e.exerciseId,
      targetSets: Math.max(1, e.sets.length),
      targetReps: e.sets[0]?.reps || 10,
    })),
  };
}

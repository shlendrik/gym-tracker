import type { SetEntry, Workout } from "../types";

/**
 * Подходы упражнения из последней тренировки, где оно было.
 * Ожидает, что workouts отсортированы от новых к старым (так они хранятся в store).
 */
export function lastSetsFor(
  workouts: Workout[],
  exerciseId: string
): SetEntry[] | null {
  for (const w of workouts) {
    const entry = w.entries.find((e) => e.exerciseId === exerciseId);
    if (entry && entry.sets.length > 0) return entry.sets;
  }
  return null;
}

import { describe, expect, it } from "vitest";
import type { Workout } from "../types";
import { templateFromWorkout } from "./templates";

const workout: Pick<Workout, "entries"> = {
  entries: [
    {
      id: "e1",
      exerciseId: "bench-press",
      sets: [
        { id: "a", reps: 8, weight: 60, done: true },
        { id: "b", reps: 6, weight: 65, done: true },
        { id: "c", reps: 5, weight: 70, done: true },
      ],
    },
    {
      id: "e2",
      exerciseId: "db-fly",
      sets: [{ id: "d", reps: 12, weight: 14, done: true }],
    },
  ],
};

describe("план из тренировки", () => {
  it("переносит упражнения, число подходов и повторы первого подхода", () => {
    const t = templateFromWorkout(workout, "  Грудь  ");
    expect(t.name).toBe("Грудь");
    expect(t.items).toEqual([
      { exerciseId: "bench-press", targetSets: 3, targetReps: 8 },
      { exerciseId: "db-fly", targetSets: 1, targetReps: 12 },
    ]);
    expect(t.id).toBeTruthy();
  });
});

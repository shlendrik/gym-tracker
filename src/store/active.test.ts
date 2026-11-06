import { beforeEach, describe, expect, it } from "vitest";
import { workoutTonnage } from "../domain/calc";
import { useActive } from "./active";
import { useTemplates } from "./templates";
import { useWorkouts } from "./workouts";

beforeEach(() => {
  useActive.setState({ active: null });
  useWorkouts.setState({ workouts: [] });
  useTemplates.setState({ templates: [] });
});

function logSet(entryId: string, setId: string, weight: number, reps: number) {
  useActive.getState().updateSet(entryId, setId, { weight, reps, done: true });
}

describe("активная тренировка", () => {
  it("проходит путь: старт → подходы → завершение → история", () => {
    const s = useActive.getState();
    s.start();
    s.addExercise("bench-press");

    const entry = useActive.getState().active!.entries[0];
    logSet(entry.id, entry.sets[0].id, 60, 10);
    useActive.getState().addSet(entry.id);

    const updated = useActive.getState().active!.entries[0];
    expect(updated.sets).toHaveLength(2);
    // новый подход копирует значения предыдущего
    expect(updated.sets[1]).toMatchObject({ weight: 60, reps: 10, done: false });
    logSet(entry.id, updated.sets[1].id, 62.5, 8);

    const saved = useActive.getState().finish();
    expect(saved).not.toBeNull();
    expect(workoutTonnage(saved!)).toBe(60 * 10 + 62.5 * 8);
    expect(useActive.getState().active).toBeNull();
    expect(useWorkouts.getState().workouts).toHaveLength(1);
  });

  it("не сохраняет тренировку без выполненных подходов", () => {
    const s = useActive.getState();
    s.start();
    s.addExercise("squat");
    expect(useActive.getState().finish()).toBeNull();
    // черновик остаётся, данные не потеряны
    expect(useActive.getState().active).not.toBeNull();
    expect(useWorkouts.getState().workouts).toHaveLength(0);
  });

  it("отбрасывает невыполненные подходы при сохранении", () => {
    const s = useActive.getState();
    s.start();
    s.addExercise("deadlift");
    const entry = useActive.getState().active!.entries[0];
    logSet(entry.id, entry.sets[0].id, 100, 5);
    useActive.getState().addSet(entry.id); // второй подход не отмечен

    const saved = useActive.getState().finish()!;
    expect(saved.entries[0].sets).toHaveLength(1);
  });

  it("подставляет значения из прошлой тренировки", () => {
    const s = useActive.getState();
    s.start();
    s.addExercise("bench-press");
    const entry = useActive.getState().active!.entries[0];
    logSet(entry.id, entry.sets[0].id, 80, 6);
    useActive.getState().finish();

    useActive.getState().start();
    useActive.getState().addExercise("bench-press");
    const next = useActive.getState().active!.entries[0];
    expect(next.sets[0]).toMatchObject({ weight: 80, reps: 6, done: false });
  });

  it("создаёт тренировку из плана с целевыми подходами", () => {
    useTemplates.getState().add({
      id: "t1",
      name: "Push",
      updatedAt: new Date().toISOString(),
      items: [{ exerciseId: "overhead-press", targetSets: 3, targetReps: 8 }],
    });
    useActive.getState().start("t1");

    const active = useActive.getState().active!;
    expect(active.name).toBe("Push");
    expect(active.entries).toHaveLength(1);
    expect(active.entries[0].sets).toHaveLength(3);
    expect(active.entries[0].sets[0].reps).toBe(8);
  });
});

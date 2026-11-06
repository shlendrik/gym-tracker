import { describe, expect, it } from "vitest";
import {
  entryTonnage,
  estimate1RM,
  formatDuration,
  formatTonnage,
  setTonnage,
  workoutTonnage,
} from "./calc";
import type { ExerciseEntry, SetEntry } from "../types";

const set = (reps: number, weight: number, done = true): SetEntry => ({
  id: "s",
  reps,
  weight,
  done,
});

describe("тоннаж", () => {
  it("считает повторы × вес только для выполненных подходов", () => {
    expect(setTonnage(set(10, 60))).toBe(600);
    expect(setTonnage(set(10, 60, false))).toBe(0);
  });

  it("не учитывает подходы без повторов", () => {
    expect(setTonnage(set(0, 60))).toBe(0);
  });

  it("суммирует по упражнению и тренировке", () => {
    const a: ExerciseEntry = {
      id: "a",
      exerciseId: "x",
      sets: [set(10, 50), set(8, 55), set(5, 60, false)],
    };
    const b: ExerciseEntry = { id: "b", exerciseId: "y", sets: [set(12, 20)] };
    expect(entryTonnage(a)).toBe(500 + 440);
    expect(workoutTonnage({ entries: [a, b] })).toBe(500 + 440 + 240);
  });
});

describe("1RM по Эпли", () => {
  it("для одного повтора возвращает сам вес", () => {
    expect(estimate1RM(100, 1)).toBe(100);
  });

  it("растёт с числом повторов", () => {
    expect(estimate1RM(100, 10)).toBeCloseTo(133.33, 1);
  });

  it("возвращает 0 для пустых значений", () => {
    expect(estimate1RM(0, 5)).toBe(0);
    expect(estimate1RM(50, 0)).toBe(0);
  });
});

describe("форматирование", () => {
  it("длительность", () => {
    expect(formatDuration(65)).toBe("01:05");
    expect(formatDuration(3725)).toBe("1:02:05");
  });

  it("тоннаж переходит в тонны от 10 000 кг", () => {
    expect(formatTonnage(500)).toContain("кг");
    expect(formatTonnage(12500)).toContain("т");
  });
});

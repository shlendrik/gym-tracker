import { useMemo } from "react";
import { create } from "zustand";
import { BASE_EXERCISES } from "../data/exercises";
import { uid } from "../domain/calc";
import { storage } from "../storage";
import type { Exercise } from "../types";

type State = {
  custom: Exercise[];
  addCustom: (name: string) => Exercise;
};

export const useExercises = create<State>((set, get) => ({
  custom: storage.get<Exercise[]>("customExercises", []),
  addCustom: (name) => {
    const exercise: Exercise = {
      id: uid(),
      name: name.trim(),
      muscleGroup: "Другое",
      isCustom: true,
    };
    set({ custom: [...get().custom, exercise] });
    return exercise;
  },
}));

useExercises.subscribe((s) => storage.set("customExercises", s.custom));

/** Базовая библиотека + свои упражнения пользователя. */
export function useExerciseList(): Exercise[] {
  const custom = useExercises((s) => s.custom);
  return useMemo(() => [...BASE_EXERCISES, ...custom], [custom]);
}

export function useExerciseMap(): Map<string, Exercise> {
  const list = useExerciseList();
  return useMemo(() => new Map(list.map((e) => [e.id, e])), [list]);
}

import { create } from "zustand";
import { storage } from "../storage";
import type { Workout } from "../types";

type State = {
  /** Завершённые тренировки, от новых к старым */
  workouts: Workout[];
  add: (w: Workout) => void;
  remove: (id: string) => void;
};

export const useWorkouts = create<State>((set, get) => ({
  workouts: storage.get<Workout[]>("workouts", []),
  add: (w) => set({ workouts: [w, ...get().workouts] }),
  remove: (id) => set({ workouts: get().workouts.filter((w) => w.id !== id) }),
}));

useWorkouts.subscribe((s) => storage.set("workouts", s.workouts));

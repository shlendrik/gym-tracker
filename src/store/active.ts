import { create } from "zustand";
import { uid } from "../domain/calc";
import { lastSetsFor } from "../domain/history";
import { storage } from "../storage";
import type {
  ActiveWorkout,
  ExerciseEntry,
  SetEntry,
  Workout,
} from "../types";
import { useTemplates } from "./templates";
import { useWorkouts } from "./workouts";

type SetPatch = Partial<Pick<SetEntry, "reps" | "weight" | "done">>;

type State = {
  active: ActiveWorkout | null;
  start: (templateId?: string) => void;
  addExercise: (exerciseId: string) => void;
  removeExercise: (entryId: string) => void;
  addSet: (entryId: string) => void;
  updateSet: (entryId: string, setId: string, patch: SetPatch) => void;
  removeSet: (entryId: string, setId: string) => void;
  cancel: () => void;
  /** Сохраняет тренировку в историю. Вернёт null, если нет ни одного выполненного подхода. */
  finish: () => Workout | null;
};

const DEFAULT_REPS = 10;

const newSet = (reps = DEFAULT_REPS, weight = 0): SetEntry => ({
  id: uid(),
  reps,
  weight,
  done: false,
});

/** Подходы для нового упражнения: берём значения с прошлой тренировки, иначе пустые по умолчанию. */
function initialSets(
  exerciseId: string,
  fallbackCount = 1,
  fallbackReps = DEFAULT_REPS
): SetEntry[] {
  const last = lastSetsFor(useWorkouts.getState().workouts, exerciseId);
  if (last) return last.map((s) => newSet(s.reps, s.weight));
  return Array.from({ length: fallbackCount }, () => newSet(fallbackReps, 0));
}

const mapEntry = (
  active: ActiveWorkout,
  entryId: string,
  fn: (e: ExerciseEntry) => ExerciseEntry
): ActiveWorkout => ({
  ...active,
  entries: active.entries.map((e) => (e.id === entryId ? fn(e) : e)),
});

export const useActive = create<State>((set, get) => ({
  active: storage.get<ActiveWorkout | null>("activeWorkout", null),

  start: (templateId) => {
    const template = templateId
      ? useTemplates.getState().templates.find((t) => t.id === templateId)
      : undefined;
    const entries: ExerciseEntry[] = template
      ? template.items.map((item) => ({
          id: uid(),
          exerciseId: item.exerciseId,
          sets: initialSets(item.exerciseId, item.targetSets, item.targetReps),
        }))
      : [];
    set({
      active: {
        id: uid(),
        startedAt: new Date().toISOString(),
        templateId: template?.id,
        name: template?.name,
        entries,
      },
    });
  },

  addExercise: (exerciseId) => {
    const { active } = get();
    if (!active) return;
    const entry: ExerciseEntry = {
      id: uid(),
      exerciseId,
      sets: initialSets(exerciseId),
    };
    set({ active: { ...active, entries: [...active.entries, entry] } });
  },

  removeExercise: (entryId) => {
    const { active } = get();
    if (!active) return;
    set({
      active: {
        ...active,
        entries: active.entries.filter((e) => e.id !== entryId),
      },
    });
  },

  addSet: (entryId) => {
    const { active } = get();
    if (!active) return;
    set({
      active: mapEntry(active, entryId, (e) => {
        const prev = e.sets[e.sets.length - 1];
        return {
          ...e,
          sets: [...e.sets, newSet(prev?.reps ?? DEFAULT_REPS, prev?.weight ?? 0)],
        };
      }),
    });
  },

  updateSet: (entryId, setId, patch) => {
    const { active } = get();
    if (!active) return;
    set({
      active: mapEntry(active, entryId, (e) => ({
        ...e,
        sets: e.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)),
      })),
    });
  },

  removeSet: (entryId, setId) => {
    const { active } = get();
    if (!active) return;
    set({
      active: mapEntry(active, entryId, (e) => ({
        ...e,
        sets: e.sets.filter((s) => s.id !== setId),
      })),
    });
  },

  cancel: () => set({ active: null }),

  finish: () => {
    const { active } = get();
    if (!active) return null;

    // в историю попадают только выполненные подходы
    const entries = active.entries
      .map((e) => ({ ...e, sets: e.sets.filter((s) => s.done) }))
      .filter((e) => e.sets.length > 0);
    if (entries.length === 0) return null;

    const now = new Date();
    const workout: Workout = {
      id: active.id,
      date: now.toISOString(),
      templateId: active.templateId,
      name: active.name,
      durationSec: Math.max(
        0,
        Math.round((now.getTime() - new Date(active.startedAt).getTime()) / 1000)
      ),
      entries,
    };
    useWorkouts.getState().add(workout);
    set({ active: null });
    return workout;
  },
}));

useActive.subscribe((s) => storage.set("activeWorkout", s.active));

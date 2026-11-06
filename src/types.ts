export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  isCustom?: boolean;
};

export type SetEntry = {
  id: string;
  reps: number;
  weight: number; // кг
  done: boolean;
};

export type ExerciseEntry = {
  id: string;
  exerciseId: string;
  sets: SetEntry[];
};

/** Завершённая тренировка (хранится в истории). Названия упражнений берём по exerciseId. */
export type Workout = {
  id: string;
  date: string; // ISO-время завершения
  templateId?: string;
  name?: string;
  durationSec: number;
  entries: ExerciseEntry[];
};

/** Тренировка в процессе (черновик). */
export type ActiveWorkout = {
  id: string;
  startedAt: string; // ISO
  templateId?: string;
  name?: string;
  entries: ExerciseEntry[];
};

export type TemplateItem = {
  exerciseId: string;
  targetSets: number;
  targetReps: number;
};

export type Template = {
  id: string;
  name: string;
  items: TemplateItem[];
  updatedAt: string;
};

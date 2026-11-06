import type { ExerciseEntry, SetEntry } from "../types";

/** Подход учитывается в тоннаже, только если он отмечен выполненным и заполнен. */
export const isCounted = (s: SetEntry) => s.done && s.reps > 0 && s.weight >= 0;

export const setTonnage = (s: SetEntry) => (isCounted(s) ? s.reps * s.weight : 0);

export const entryTonnage = (e: ExerciseEntry) =>
  e.sets.reduce((sum, s) => sum + setTonnage(s), 0);

export const workoutTonnage = (w: { entries: ExerciseEntry[] }) =>
  w.entries.reduce((sum, e) => sum + entryTonnage(e), 0);

/** Расчётный максимум на 1 повтор по формуле Эпли. */
export function estimate1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

const nf = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

export const formatKg = (kg: number) => `${nf.format(kg)} кг`;

/** 1250 кг -> «1 250 кг»; от 10 000 — в тоннах: «12,5 т». */
export function formatTonnage(kg: number): string {
  if (kg >= 10000) return `${nf.format(kg / 1000)} т`;
  return formatKg(Math.round(kg * 10) / 10);
}

export function formatDuration(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Идентификатор без зависимости от crypto.randomUUID (оно недоступно по http в локальной сети). */
export const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

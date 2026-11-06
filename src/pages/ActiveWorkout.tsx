import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  entryTonnage,
  formatDuration,
  formatTonnage,
  workoutTonnage,
} from "../domain/calc";
import { useActive } from "../store/active";
import { useExerciseMap } from "../store/exercises";
import { confirmAction, haptic, notify } from "../telegram";
import type { ActiveWorkout as ActiveWorkoutData, SetEntry } from "../types";
import ActionBar from "../ui/ActionBar";
import ExercisePicker from "../ui/ExercisePicker";
import NumberInput from "../ui/NumberInput";

function useElapsed(startedAt: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export default function ActiveWorkout() {
  const active = useActive((s) => s.active);
  if (!active) return null;
  return <ActiveView active={active} />;
}

function ActiveView({ active }: { active: ActiveWorkoutData }) {
  const { addExercise, removeExercise, addSet, updateSet, removeSet, cancel, finish } =
    useActive.getState();
  const exerciseMap = useExerciseMap();
  const [pickerOpen, setPickerOpen] = useState(false);
  const elapsed = useElapsed(active.startedAt);
  const navigate = useNavigate();

  const hasDone = active.entries.some((e) => e.sets.some((s) => s.done));
  const hasUndone = active.entries.some((e) => e.sets.some((s) => !s.done));
  const finishHint =
    active.entries.length === 0
      ? "Добавьте упражнение, затем отмечайте выполненные подходы галочкой"
      : !hasDone
        ? "Отметьте галочкой хотя бы один выполненный подход"
        : undefined;

  const onFinish = async () => {
    if (hasUndone) {
      const ok = await confirmAction(
        "Невыполненные подходы не сохранятся. Завершить тренировку?"
      );
      if (!ok) return;
    }
    const saved = finish();
    if (!saved) {
      notify("Отметьте галочкой хотя бы один выполненный подход.");
      return;
    }
    haptic.success();
    navigate(`/saved/${saved.id}`);
  };

  const onCancel = async () => {
    const ok = await confirmAction("Отменить тренировку? Введённые данные будут потеряны.");
    if (ok) cancel();
  };

  const onRemoveExercise = async (entryId: string, name: string) => {
    const ok = await confirmAction(`Удалить «${name}» из тренировки?`);
    if (ok) removeExercise(entryId);
  };

  return (
    <div className="page">
      <div className="row">
        <h1 className="h1 clamp-2" style={{ marginBottom: 8 }}>
          {active.name ?? "Тренировка"}
        </h1>
        <button className="btn btn-ghost btn-danger btn-sm" onClick={onCancel}>
          Отменить
        </button>
      </div>

      <div className="summary">
        <div>
          <div className="value num">{formatDuration(elapsed)}</div>
          <div className="label">время</div>
        </div>
        <div>
          <div className="value num">{formatTonnage(workoutTonnage(active))}</div>
          <div className="label">тоннаж</div>
        </div>
      </div>

      {active.entries.length === 0 && (
        <div className="empty">Добавьте первое упражнение</div>
      )}

      <div className="stack">
        {active.entries.map((entry) => {
          const exercise = exerciseMap.get(entry.exerciseId);
          const name = exercise?.name ?? "Удалённое упражнение";
          const tonnage = entryTonnage(entry);
          return (
            <section className="card" key={entry.id}>
              <div className="exercise-head">
                <div>
                  <div className="exercise-name">{name}</div>
                  <div className="exercise-sub num">
                    {exercise?.muscleGroup}
                    {tonnage > 0 && ` · ${formatTonnage(tonnage)}`}
                  </div>
                </div>
                <button
                  className="icon-btn"
                  aria-label={`Удалить упражнение ${name}`}
                  onClick={() => onRemoveExercise(entry.id, name)}
                >
                  ⋯
                </button>
              </div>

              <div className="set-head">
                <span>#</span>
                <span>кг</span>
                <span>повт.</span>
                <span />
                <span />
              </div>

              {entry.sets.map((set, i) => (
                <SetRow
                  key={set.id}
                  index={i}
                  set={set}
                  onChange={(patch) => updateSet(entry.id, set.id, patch)}
                  onRemove={() => removeSet(entry.id, set.id)}
                />
              ))}

              <button className="add-set" onClick={() => addSet(entry.id)}>
                + Подход
              </button>
            </section>
          );
        })}
      </div>

      <button
        className="btn btn-block"
        style={{ marginTop: 14 }}
        onClick={() => setPickerOpen(true)}
      >
        + Добавить упражнение
      </button>

      <ActionBar
        text="Завершить тренировку"
        onClick={onFinish}
        disabled={!hasDone}
        hint={finishHint}
      />

      {pickerOpen && (
        <ExercisePicker
          onClose={() => setPickerOpen(false)}
          onPick={(id) => {
            addExercise(id);
            setPickerOpen(false);
          }}
        />
      )}
    </div>
  );
}

type SetRowProps = {
  index: number;
  set: SetEntry;
  onChange: (patch: Partial<Pick<SetEntry, "reps" | "weight" | "done">>) => void;
  onRemove: () => void;
};

function SetRow({ index, set, onChange, onRemove }: SetRowProps) {
  return (
    <div className={"set-row" + (set.done ? " done" : "")}>
      <span className="set-index">{index + 1}</span>
      <NumberInput
        label="Вес, кг"
        value={set.weight}
        step={2.5}
        decimal
        onChange={(weight) => onChange({ weight })}
      />
      <NumberInput
        label="Повторы"
        value={set.reps}
        step={1}
        onChange={(reps) => onChange({ reps })}
      />
      <button
        className={"check" + (set.done ? " on" : "")}
        aria-pressed={set.done}
        aria-label="Подход выполнен"
        onClick={() => {
          haptic.select();
          onChange({ done: !set.done });
        }}
      >
        <CheckIcon />
      </button>
      <button className="icon-btn" aria-label="Удалить подход" onClick={onRemove}>
        ×
      </button>
    </div>
  );
}

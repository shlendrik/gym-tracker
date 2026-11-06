import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { uid } from "../domain/calc";
import { useExerciseMap } from "../store/exercises";
import { useTemplates } from "../store/templates";
import { confirmAction, haptic } from "../telegram";
import type { Template, TemplateItem } from "../types";
import ActionBar from "../ui/ActionBar";
import ExercisePicker from "../ui/ExercisePicker";
import NumberInput from "../ui/NumberInput";

/** Элемент плана в редакторе: стабильный key нужен, чтобы при перестановке поля не «перепрыгивали». */
type EditorItem = TemplateItem & { key: string };

const DEFAULT_SETS = 3;
const DEFAULT_REPS = 10;

/** Конструктор плана: /templates/new — создание, /templates/:id — редактирование. */
export default function TemplateEditor() {
  const { id } = useParams();
  const templates = useTemplates((s) => s.templates);
  const addTemplate = useTemplates((s) => s.add);
  const updateTemplate = useTemplates((s) => s.update);
  const removeTemplate = useTemplates((s) => s.remove);
  const exerciseMap = useExerciseMap();
  const navigate = useNavigate();

  const existing = id ? templates.find((t) => t.id === id) : undefined;

  const [name, setName] = useState(existing?.name ?? "");
  const [items, setItems] = useState<EditorItem[]>(() =>
    (existing?.items ?? []).map((item) => ({ ...item, key: uid() }))
  );
  const [pickerOpen, setPickerOpen] = useState(false);

  if (id && !existing) return <Navigate to="/templates" replace />;

  const patchItem = (key: string, patch: Partial<TemplateItem>) =>
    setItems((list) => list.map((it) => (it.key === key ? { ...it, ...patch } : it)));

  const move = (index: number, delta: -1 | 1) =>
    setItems((list) => {
      const target = index + delta;
      if (target < 0 || target >= list.length) return list;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const canSave = name.trim().length > 0 && items.length > 0;
  const hint = !name.trim()
    ? "Введите название плана"
    : items.length === 0
      ? "Добавьте хотя бы одно упражнение"
      : undefined;

  const save = () => {
    if (!canSave) return;
    const template: Template = {
      id: existing?.id ?? uid(),
      name: name.trim(),
      updatedAt: new Date().toISOString(),
      items: items.map((it) => ({
        exerciseId: it.exerciseId,
        targetSets: it.targetSets,
        targetReps: it.targetReps,
      })),
    };
    if (existing) updateTemplate(template);
    else addTemplate(template);
    haptic.success();
    navigate("/templates");
  };

  const remove = async () => {
    if (!existing) return;
    const ok = await confirmAction(`Удалить план «${existing.name}»? Сохранённые тренировки не пострадают.`);
    if (!ok) return;
    removeTemplate(existing.id);
    navigate("/templates");
  };

  return (
    <div className="page">
      <Link to="/templates" className="back">
        ← Планы
      </Link>
      <h1 className="h1">{existing ? "Изменить план" : "Новый план"}</h1>

      <input
        className="text-input"
        placeholder="Название плана"
        value={name}
        maxLength={60}
        onChange={(e) => setName(e.target.value)}
      />

      <h2 className="h2">Упражнения</h2>

      {items.length === 0 && (
        <div className="empty-small">Добавьте упражнения, которые входят в план</div>
      )}

      <div className="stack">
        {items.map((item, i) => {
          const exercise = exerciseMap.get(item.exerciseId);
          const exerciseName = exercise?.name ?? "Удалённое упражнение";
          return (
            <section className="card" key={item.key}>
              <div className="exercise-head">
                <div>
                  <div className="exercise-name">{exerciseName}</div>
                  <div className="exercise-sub">{exercise?.muscleGroup}</div>
                </div>
                <div className="item-actions">
                  <button
                    className="icon-btn"
                    disabled={i === 0}
                    aria-label={`${exerciseName}: выше`}
                    onClick={() => move(i, -1)}
                  >
                    ↑
                  </button>
                  <button
                    className="icon-btn"
                    disabled={i === items.length - 1}
                    aria-label={`${exerciseName}: ниже`}
                    onClick={() => move(i, 1)}
                  >
                    ↓
                  </button>
                  <button
                    className="icon-btn"
                    aria-label={`Убрать ${exerciseName}`}
                    onClick={() => setItems((list) => list.filter((x) => x.key !== item.key))}
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="tpl-controls">
                <div>
                  <div className="field-label">Подходы</div>
                  <NumberInput
                    label="Подходы"
                    value={item.targetSets}
                    step={1}
                    min={1}
                    max={20}
                    onChange={(targetSets) => patchItem(item.key, { targetSets })}
                  />
                </div>
                <div>
                  <div className="field-label">Повторы</div>
                  <NumberInput
                    label="Повторы"
                    value={item.targetReps}
                    step={1}
                    min={1}
                    max={100}
                    onChange={(targetReps) => patchItem(item.key, { targetReps })}
                  />
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <button className="btn btn-block" style={{ marginTop: 14 }} onClick={() => setPickerOpen(true)}>
        + Добавить упражнение
      </button>

      {existing && (
        <button className="btn btn-ghost btn-danger btn-block" style={{ marginTop: 8 }} onClick={remove}>
          Удалить план
        </button>
      )}

      <ActionBar text="Сохранить план" onClick={save} disabled={!canSave} hint={hint} />

      {pickerOpen && (
        <ExercisePicker
          onClose={() => setPickerOpen(false)}
          onPick={(exerciseId) => {
            setItems((list) => [
              ...list,
              { key: uid(), exerciseId, targetSets: DEFAULT_SETS, targetReps: DEFAULT_REPS },
            ]);
            setPickerOpen(false);
          }}
        />
      )}
    </div>
  );
}

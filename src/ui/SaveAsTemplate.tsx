import { useState } from "react";
import { Link } from "react-router-dom";
import { templateFromWorkout } from "../domain/templates";
import { useTemplates } from "../store/templates";
import { haptic } from "../telegram";
import type { Workout } from "../types";

type Props = {
  workout: Workout;
  defaultName?: string;
};

/** Кнопка «Сохранить как план» с коротким вводом названия. */
export default function SaveAsTemplate({ workout, defaultName }: Props) {
  const addTemplate = useTemplates((s) => s.add);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultName ?? "");
  const [savedName, setSavedName] = useState<string | null>(null);

  if (savedName) {
    return (
      <div className="card">
        План «{savedName}» сохранён.{" "}
        <Link to="/templates" className="link">
          Открыть планы
        </Link>
      </div>
    );
  }

  if (!open) {
    return (
      <button className="btn btn-block" onClick={() => setOpen(true)}>
        Сохранить как план
      </button>
    );
  }

  const save = () => {
    if (!name.trim()) return;
    addTemplate(templateFromWorkout(workout, name));
    haptic.success();
    setSavedName(name.trim());
  };

  return (
    <div className="card stack">
      <input
        className="text-input"
        placeholder="Название плана"
        value={name}
        maxLength={60}
        autoFocus
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && save()}
      />
      <div className="row">
        <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
          Отмена
        </button>
        <button className="btn btn-primary btn-sm" disabled={!name.trim()} onClick={save}>
          Сохранить
        </button>
      </div>
    </div>
  );
}

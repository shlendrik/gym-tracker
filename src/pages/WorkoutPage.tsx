import { Link } from "react-router-dom";
import { formatTonnage, workoutTonnage } from "../domain/calc";
import { countLabel, formatDay } from "../domain/format";
import { useActive } from "../store/active";
import { useTemplates } from "../store/templates";
import { useWorkouts } from "../store/workouts";
import { haptic } from "../telegram";
import ActiveWorkout from "./ActiveWorkout";

export default function WorkoutPage() {
  const active = useActive((s) => s.active);
  const start = useActive((s) => s.start);
  const templates = useTemplates((s) => s.templates);
  const last = useWorkouts((s) => s.workouts[0]);

  if (active) return <ActiveWorkout />;

  const begin = (templateId?: string) => {
    haptic.tap();
    start(templateId);
  };

  return (
    <div className="page">
      <h1 className="h1">Тренировка</h1>

      <div className="stack">
        <button className="btn btn-primary btn-block" onClick={() => begin()}>
          Пустая тренировка
        </button>
        <Link to="/templates/new" className="btn btn-block">
          Создать план тренировки
        </Link>
      </div>

      {templates.length > 0 && (
        <>
          <h2 className="h2">Мои планы</h2>
          <div className="stack">
            {templates.map((t) => (
              <div className="card row" key={t.id}>
                <div>
                  <div className="exercise-name">{t.name}</div>
                  <div className="exercise-sub">
                    {countLabel(t.items.length, "упражнение", "упражнения", "упражнений")}
                  </div>
                </div>
                <button className="btn btn-sm" onClick={() => begin(t.id)}>
                  Начать
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {last && (
        <>
          <h2 className="h2">Последняя тренировка</h2>
          <Link to={`/history/${last.id}`} className="card row link-card">
            <div>
              <div className="exercise-name">{last.name ?? "Тренировка"}</div>
              <div className="exercise-sub">
                {formatDay(last.date)} ·{" "}
                {countLabel(last.entries.length, "упражнение", "упражнения", "упражнений")}
              </div>
            </div>
            <div className="exercise-name num">{formatTonnage(workoutTonnage(last))}</div>
          </Link>
        </>
      )}

      {!last && templates.length === 0 && (
        <div className="empty">
          Пока нет тренировок.
          <br />
          Начните первую — она сохранится в историю.
        </div>
      )}
    </div>
  );
}

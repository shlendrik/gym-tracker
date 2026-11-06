import { Link } from "react-router-dom";
import { formatDuration, formatTonnage, workoutTonnage } from "../domain/calc";
import { countLabel, formatDay, pluralize } from "../domain/format";
import { useWorkouts } from "../store/workouts";

export default function HistoryPage() {
  const workouts = useWorkouts((s) => s.workouts);
  const total = workouts.reduce((sum, w) => sum + workoutTonnage(w), 0);

  return (
    <div className="page">
      <h1 className="h1">История</h1>

      {workouts.length === 0 ? (
        <div className="empty">
          Пока нет сохранённых тренировок.
          <br />
          Завершите первую — она появится здесь.
        </div>
      ) : (
        <>
          <div className="card summary" style={{ margin: 0, gap: 32 }}>
            <div>
              <div className="value num">{workouts.length}</div>
              <div className="label">
                {pluralize(workouts.length, "тренировка", "тренировки", "тренировок")}
              </div>
            </div>
            <div>
              <div className="value num">{formatTonnage(total)}</div>
              <div className="label">общий тоннаж</div>
            </div>
          </div>

          <div className="stack" style={{ marginTop: 12 }}>
            {workouts.map((w) => (
              <Link className="card row link-card" key={w.id} to={`/history/${w.id}`}>
                <div>
                  <div className="exercise-name">{w.name ?? "Тренировка"}</div>
                  <div className="exercise-sub">
                    {formatDay(w.date)} ·{" "}
                    {countLabel(w.entries.length, "упражнение", "упражнения", "упражнений")} ·{" "}
                    {formatDuration(w.durationSec)}
                  </div>
                </div>
                <div className="exercise-name num">{formatTonnage(workoutTonnage(w))}</div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { entryTonnage, formatTonnage } from "../domain/calc";
import { countLabel, formatDay, formatTime } from "../domain/format";
import { useExerciseMap } from "../store/exercises";
import { useWorkouts } from "../store/workouts";
import ActionBar from "../ui/ActionBar";
import SaveAsTemplate from "../ui/SaveAsTemplate";
import WorkoutStats from "../ui/WorkoutStats";

/** Экран после завершения: подтверждает, что тренировка сохранена, и предлагает сделать из неё план. */
export default function WorkoutSavedPage() {
  const { id } = useParams();
  const workout = useWorkouts((s) => s.workouts.find((w) => w.id === id));
  const exerciseMap = useExerciseMap();
  const navigate = useNavigate();

  if (!workout) return <Navigate to="/" replace />;

  return (
    <div className="page">
      <div className="saved-badge" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
      <h1 className="h1" style={{ marginBottom: 4 }}>
        Тренировка сохранена
      </h1>
      <div className="muted">
        {workout.name ? `${workout.name} · ` : ""}
        {formatDay(workout.date)}, {formatTime(workout.date)}
      </div>

      <WorkoutStats workout={workout} />

      <div className="stack" style={{ marginBottom: 16 }}>
        {workout.entries.map((e) => (
          <div className="card row" key={e.id}>
            <div>
              <div className="exercise-name">
                {exerciseMap.get(e.exerciseId)?.name ?? "Удалённое упражнение"}
              </div>
              <div className="exercise-sub">
                {countLabel(e.sets.length, "подход", "подхода", "подходов")}
              </div>
            </div>
            <div className="exercise-name num">{formatTonnage(entryTonnage(e))}</div>
          </div>
        ))}
      </div>

      <SaveAsTemplate workout={workout} defaultName={workout.name} />

      <div style={{ textAlign: "center", marginTop: 12 }}>
        <Link to={`/history/${workout.id}`} className="link">
          Открыть в истории
        </Link>
      </div>

      <ActionBar text="Готово" onClick={() => navigate("/")} />
    </div>
  );
}

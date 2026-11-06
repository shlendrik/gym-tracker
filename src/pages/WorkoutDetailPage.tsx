import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { entryTonnage, formatKg, formatTonnage } from "../domain/calc";
import { formatDay, formatTime } from "../domain/format";
import { useExerciseMap } from "../store/exercises";
import { useWorkouts } from "../store/workouts";
import { confirmAction } from "../telegram";
import SaveAsTemplate from "../ui/SaveAsTemplate";
import WorkoutStats from "../ui/WorkoutStats";

/** Подробности сохранённой тренировки: все подходы, сохранение как план, удаление. */
export default function WorkoutDetailPage() {
  const { id } = useParams();
  const workout = useWorkouts((s) => s.workouts.find((w) => w.id === id));
  const removeWorkout = useWorkouts((s) => s.remove);
  const exerciseMap = useExerciseMap();
  const navigate = useNavigate();

  if (!workout) return <Navigate to="/history" replace />;

  const remove = async () => {
    const ok = await confirmAction("Удалить эту тренировку из истории? Это нельзя отменить.");
    if (!ok) return;
    removeWorkout(workout.id);
    navigate("/history", { replace: true });
  };

  return (
    <div className="page">
      <Link to="/history" className="back">
        ← История
      </Link>
      <h1 className="h1" style={{ marginBottom: 4 }}>
        {workout.name ?? "Тренировка"}
      </h1>
      <div className="muted">
        {formatDay(workout.date)}, {formatTime(workout.date)}
      </div>

      <WorkoutStats workout={workout} />

      <div className="stack" style={{ marginBottom: 16 }}>
        {workout.entries.map((entry) => {
          const exercise = exerciseMap.get(entry.exerciseId);
          return (
            <section className="card" key={entry.id}>
              <div className="exercise-head">
                <div>
                  <div className="exercise-name">{exercise?.name ?? "Удалённое упражнение"}</div>
                  <div className="exercise-sub">{exercise?.muscleGroup}</div>
                </div>
                <div className="exercise-name num">{formatTonnage(entryTonnage(entry))}</div>
              </div>
              {entry.sets.map((set, i) => (
                <div className="set-line num" key={set.id}>
                  <span className="muted">{i + 1}</span>
                  <span>
                    {formatKg(set.weight)} × {set.reps}
                  </span>
                </div>
              ))}
            </section>
          );
        })}
      </div>

      <SaveAsTemplate workout={workout} defaultName={workout.name} />

      <button className="btn btn-ghost btn-danger btn-block" style={{ marginTop: 12 }} onClick={remove}>
        Удалить тренировку
      </button>
    </div>
  );
}

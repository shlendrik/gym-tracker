import { formatTonnage, workoutTonnage } from "../domain/calc";
import { useWorkouts } from "../store/workouts";

export default function ProgressPage() {
  const workouts = useWorkouts((s) => s.workouts);
  const total = workouts.reduce((sum, w) => sum + workoutTonnage(w), 0);

  return (
    <div className="page">
      <h1 className="h1">Прогресс</h1>

      <div className="card row">
        <div>
          <div className="summary" style={{ margin: 0, gap: 32 }}>
            <div>
              <div className="value num">{workouts.length}</div>
              <div className="label">тренировок</div>
            </div>
            <div>
              <div className="value num">{formatTonnage(total)}</div>
              <div className="label">общий тоннаж</div>
            </div>
          </div>
        </div>
      </div>

      <div className="empty">
        Графики по периодам и история тренировок появятся на следующих этапах.
      </div>
    </div>
  );
}

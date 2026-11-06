import { formatDuration, formatTonnage, workoutTonnage } from "../domain/calc";
import { pluralize } from "../domain/format";
import type { Workout } from "../types";

/** Четыре ключевые цифры завершённой тренировки. */
export default function WorkoutStats({ workout }: { workout: Workout }) {
  const setsCount = workout.entries.reduce((n, e) => n + e.sets.length, 0);
  return (
    <div className="stats-grid">
      <div>
        <div className="value num">{formatTonnage(workoutTonnage(workout))}</div>
        <div className="label">тоннаж</div>
      </div>
      <div>
        <div className="value num">{formatDuration(workout.durationSec)}</div>
        <div className="label">время</div>
      </div>
      <div>
        <div className="value num">{workout.entries.length}</div>
        <div className="label">
          {pluralize(workout.entries.length, "упражнение", "упражнения", "упражнений")}
        </div>
      </div>
      <div>
        <div className="value num">{setsCount}</div>
        <div className="label">{pluralize(setsCount, "подход", "подхода", "подходов")}</div>
      </div>
    </div>
  );
}

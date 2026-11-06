import { useMemo, useState } from "react";
import { haptic } from "../telegram";
import { useExercises, useExerciseList } from "../store/exercises";

type Props = {
  onPick: (exerciseId: string) => void;
  onClose: () => void;
};

/** Выбор упражнения из библиотеки с поиском и созданием своего. */
export default function ExercisePicker({ onPick, onClose }: Props) {
  const [query, setQuery] = useState("");
  const list = useExerciseList();
  const addCustom = useExercises((s) => s.addCustom);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () => (q ? list.filter((e) => e.name.toLowerCase().includes(q)) : list),
    [list, q]
  );
  const exactMatch = list.some((e) => e.name.toLowerCase() === q);

  const pick = (id: string) => {
    haptic.select();
    onPick(id);
  };

  const createCustom = () => {
    const created = addCustom(query);
    pick(created.id);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <input
            className="search"
            placeholder="Найти упражнение"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Закрыть
          </button>
        </div>

        <div className="sheet-list">
          {q && !exactMatch && (
            <button className="pick" onClick={createCustom}>
              <span>Создать «{query.trim()}»</span>
              <span className="sub">Своё упражнение</span>
            </button>
          )}
          {filtered.map((e) => (
            <button key={e.id} className="pick" onClick={() => pick(e.id)}>
              <span>{e.name}</span>
              <span className="sub">{e.muscleGroup}</span>
            </button>
          ))}
          {filtered.length === 0 && !q && (
            <div className="empty">Список упражнений пуст</div>
          )}
        </div>
      </div>
    </div>
  );
}

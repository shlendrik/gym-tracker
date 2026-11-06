import { Link, useNavigate } from "react-router-dom";
import { countLabel } from "../domain/format";
import { useActive } from "../store/active";
import { useExerciseMap } from "../store/exercises";
import { useTemplates } from "../store/templates";
import { confirmAction, haptic } from "../telegram";

export default function TemplatesPage() {
  const templates = useTemplates((s) => s.templates);
  const exerciseMap = useExerciseMap();
  const hasActive = useActive((s) => s.active !== null);
  const start = useActive((s) => s.start);
  const navigate = useNavigate();

  const begin = async (templateId: string) => {
    if (hasActive) {
      const ok = await confirmAction(
        "Сейчас идёт другая тренировка. Начать новую? Текущая будет потеряна."
      );
      if (!ok) return;
    }
    haptic.tap();
    start(templateId);
    navigate("/");
  };

  const preview = (ids: string[]) => {
    const names = ids.map((id) => exerciseMap.get(id)?.name ?? "—");
    return names.slice(0, 3).join(", ") + (names.length > 3 ? "…" : "");
  };

  return (
    <div className="page">
      <h1 className="h1">Планы</h1>

      <Link to="/templates/new" className="btn btn-primary btn-block">
        + Новый план
      </Link>

      {templates.length === 0 ? (
        <div className="empty">
          Здесь будут ваши планы тренировок.
          <br />
          Создайте план заранее или сохраните завершённую тренировку как план.
        </div>
      ) : (
        <div className="stack" style={{ marginTop: 16 }}>
          {templates.map((t) => (
            <section className="card" key={t.id}>
              <div className="exercise-name">{t.name}</div>
              <div className="exercise-sub">
                {countLabel(t.items.length, "упражнение", "упражнения", "упражнений")}
                {t.items.length > 0 && ` · ${preview(t.items.map((i) => i.exerciseId))}`}
              </div>
              <div className="row" style={{ marginTop: 12 }}>
                <Link to={`/templates/${t.id}`} className="btn btn-ghost btn-sm">
                  Изменить
                </Link>
                <button className="btn btn-primary btn-sm" onClick={() => begin(t.id)}>
                  Начать
                </button>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

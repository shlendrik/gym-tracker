import { useTemplates } from "../store/templates";

export default function TemplatesPage() {
  const templates = useTemplates((s) => s.templates);

  return (
    <div className="page">
      <h1 className="h1">Планы</h1>

      {templates.length === 0 ? (
        <div className="empty">
          Сохранённых планов пока нет.
          <br />
          Создание и редактирование планов появится на следующем этапе.
        </div>
      ) : (
        <div className="stack">
          {templates.map((t) => (
            <div className="card" key={t.id}>
              <div className="exercise-name">{t.name}</div>
              <div className="exercise-sub">Упражнений: {t.items.length}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

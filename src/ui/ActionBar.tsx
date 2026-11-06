type Props = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  /** Короткая подсказка над кнопкой — почему она сейчас неактивна. */
  hint?: string;
};

/**
 * Главное действие экрана — всегда на виду, прилипает к низу.
 * Раньше это была нативная MainButton Telegram, но она скрывалась, пока действие недоступно,
 * и пользователь не понимал, где завершить тренировку. Теперь кнопка видна всегда,
 * а если действие недоступно — она неактивна и объясняет почему.
 */
export default function ActionBar({ text, onClick, disabled = false, hint }: Props) {
  return (
    <div className="action-bar">
      {hint && <div className="action-hint">{hint}</div>}
      <button className="btn btn-primary btn-block" disabled={disabled} onClick={onClick}>
        {text}
      </button>
    </div>
  );
}

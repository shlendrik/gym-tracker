import { useEffect, useRef } from "react";
import { inTelegram, tg } from "../telegram";

type Props = {
  text: string;
  onClick: () => void;
  visible?: boolean;
};

/**
 * Главное действие экрана. В Telegram — нативная MainButton,
 * в обычном браузере — обычная кнопка, прилипшая к низу.
 */
export default function MainAction({ text, onClick, visible = true }: Props) {
  const handlerRef = useRef(onClick);
  handlerRef.current = onClick;

  useEffect(() => {
    if (!tg || !inTelegram) return;
    const button = tg.MainButton;
    const handler = () => handlerRef.current();
    button.setText(text);
    button.onClick(handler);
    if (visible) button.show();
    else button.hide();
    return () => {
      button.offClick(handler);
      button.hide();
    };
  }, [text, visible]);

  if (inTelegram || !visible) return null;
  return (
    <div className="main-action-fallback">
      <button className="btn btn-primary btn-block" onClick={onClick}>
        {text}
      </button>
    </div>
  );
}

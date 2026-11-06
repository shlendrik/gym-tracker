import { useState } from "react";
import { haptic } from "../telegram";

type Props = {
  value: number;
  onChange: (value: number) => void;
  step: number;
  label: string;
  decimal?: boolean;
  min?: number;
  max?: number;
};

const round = (n: number) => Math.round(n * 100) / 100;
const fmt = (n: number) => String(round(n));

/**
 * Числовое поле со степпером − / +. Разрешает вводить дробные значения (2.5).
 * Пока поле редактируют, показываем набранный текст (draft), иначе — отформатированное значение,
 * поэтому текст и значение не могут разойтись.
 */
export default function NumberInput({
  value,
  onChange,
  step,
  label,
  decimal = false,
  min = 0,
  max = 9999,
}: Props) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? fmt(value);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const bump = (delta: number) => {
    haptic.tap();
    setDraft(null);
    onChange(round(clamp(value + delta)));
  };

  const handleInput = (typed: string) => {
    const raw = typed.replace(/[^\d.,]/g, "");
    setDraft(raw);
    const n = parseFloat(raw.replace(",", "."));
    if (!Number.isNaN(n)) onChange(round(clamp(decimal ? n : Math.round(n))));
  };

  return (
    <div className="stepper">
      <button
        type="button"
        className="step-btn"
        onClick={() => bump(-step)}
        aria-label={`${label}: меньше`}
      >
        −
      </button>
      <input
        className="step-input"
        type="text"
        inputMode={decimal ? "decimal" : "numeric"}
        value={shown}
        aria-label={label}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={(e) => e.target.select()}
        onBlur={() => setDraft(null)}
      />
      <button
        type="button"
        className="step-btn"
        onClick={() => bump(step)}
        aria-label={`${label}: больше`}
      >
        +
      </button>
    </div>
  );
}

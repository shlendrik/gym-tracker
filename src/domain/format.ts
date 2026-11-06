const dayFmt = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" });
const weekdayFmt = new Intl.DateTimeFormat("ru-RU", { weekday: "short" });
const timeFmt = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" });

/** «6 ноября, пт» */
export function formatDay(iso: string): string {
  const d = new Date(iso);
  return `${dayFmt.format(d)}, ${weekdayFmt.format(d)}`;
}

/** «12:20» */
export const formatTime = (iso: string) => timeFmt.format(new Date(iso));

/** Склонение: pluralize(2, "подход", "подхода", "подходов") → «подхода». */
export function pluralize(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14)) return few;
  return many;
}

export const countLabel = (n: number, one: string, few: string, many: string) =>
  `${n} ${pluralize(n, one, few, many)}`;

/**
 * Обёртка над Telegram WebApp API с фолбэком для обычного браузера
 * (чтобы приложение можно было отлаживать без Telegram).
 */
export const tg: WebApp | undefined =
  typeof window !== "undefined" ? window.Telegram?.WebApp : undefined;

/** В обычном браузере скрипт Telegram подгружается, но platform = "unknown". */
export const inTelegram = Boolean(tg && tg.platform !== "unknown");

export function initTelegram() {
  if (!tg || !inTelegram) return;
  try {
    tg.ready();
    tg.expand();
    if (tg.isVersionAtLeast("6.1")) {
      tg.setHeaderColor("bg_color");
      tg.setBackgroundColor("bg_color");
    }
    // чтобы свайп вниз по списку не закрывал приложение
    if (tg.isVersionAtLeast("7.7")) tg.disableVerticalSwipes();
  } catch {
    // старые клиенты: часть методов может отсутствовать
  }
}

export const haptic = {
  tap() {
    if (inTelegram) tg?.HapticFeedback.impactOccurred("light");
  },
  select() {
    if (inTelegram) tg?.HapticFeedback.selectionChanged();
  },
  success() {
    if (inTelegram) tg?.HapticFeedback.notificationOccurred("success");
  },
};

export function confirmAction(message: string): Promise<boolean> {
  if (tg && inTelegram && tg.isVersionAtLeast("6.2")) {
    return new Promise((resolve) => tg.showConfirm(message, (ok) => resolve(ok)));
  }
  return Promise.resolve(window.confirm(message));
}

export function notify(message: string) {
  if (tg && inTelegram && tg.isVersionAtLeast("6.2")) tg.showAlert(message);
  else window.alert(message);
}

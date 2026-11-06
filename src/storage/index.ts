/**
 * Абстракция над хранилищем. Сейчас — localStorage.
 * Позже можно подменить реализацию (Telegram CloudStorage / бэкенд), не трогая остальной код.
 */
export interface KVStorage {
  get<T>(key: string, fallback: T): T;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

const PREFIX = "gt:";
export const SCHEMA_VERSION = 1;

export const storage: KVStorage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // хранилище недоступно или переполнено — работаем в памяти
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      // ignore
    }
  },
};

/** Миграции схемы данных. Добавляйте шаги по мере изменения моделей. */
function runMigrations() {
  const current = storage.get<number>("schemaVersion", 0);
  if (current < 1) {
    // v1: начальная схема, ничего переносить не нужно
  }
  if (current !== SCHEMA_VERSION) storage.set("schemaVersion", SCHEMA_VERSION);
}

// выполняется при первом импорте, до создания хранилищ
runMigrations();

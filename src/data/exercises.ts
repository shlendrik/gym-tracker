import type { Exercise } from "../types";

const ex = (id: string, name: string, muscleGroup: string): Exercise => ({
  id,
  name,
  muscleGroup,
});

export const BASE_EXERCISES: Exercise[] = [
  // Грудь
  ex("bench-press", "Жим штанги лёжа", "Грудь"),
  ex("db-bench-press", "Жим гантелей лёжа", "Грудь"),
  ex("incline-bench-press", "Жим на наклонной скамье", "Грудь"),
  ex("db-fly", "Разводка гантелей", "Грудь"),
  ex("dips", "Отжимания на брусьях", "Грудь"),
  ex("cable-crossover", "Кроссовер", "Грудь"),
  ex("push-up", "Отжимания от пола", "Грудь"),

  // Спина
  ex("deadlift", "Становая тяга", "Спина"),
  ex("pull-up", "Подтягивания", "Спина"),
  ex("barbell-row", "Тяга штанги в наклоне", "Спина"),
  ex("lat-pulldown", "Тяга верхнего блока", "Спина"),
  ex("seated-cable-row", "Тяга нижнего блока", "Спина"),
  ex("db-row", "Тяга гантели одной рукой", "Спина"),
  ex("back-extension", "Гиперэкстензия", "Спина"),

  // Ноги
  ex("squat", "Приседания со штангой", "Ноги"),
  ex("front-squat", "Фронтальные приседания", "Ноги"),
  ex("leg-press", "Жим ногами", "Ноги"),
  ex("romanian-deadlift", "Румынская тяга", "Ноги"),
  ex("lunge", "Выпады", "Ноги"),
  ex("bulgarian-split-squat", "Болгарские приседания", "Ноги"),
  ex("leg-extension", "Разгибание ног", "Ноги"),
  ex("leg-curl", "Сгибание ног", "Ноги"),
  ex("hip-thrust", "Ягодичный мост", "Ноги"),
  ex("calf-raise", "Подъём на носки стоя", "Ноги"),

  // Плечи
  ex("overhead-press", "Жим штанги стоя", "Плечи"),
  ex("db-shoulder-press", "Жим гантелей сидя", "Плечи"),
  ex("lateral-raise", "Махи гантелей в стороны", "Плечи"),
  ex("rear-delt-fly", "Махи гантелей в наклоне", "Плечи"),
  ex("upright-row", "Тяга штанги к подбородку", "Плечи"),
  ex("shrug", "Шраги", "Плечи"),
  ex("face-pull", "Тяга к лицу на блоке", "Плечи"),

  // Бицепс
  ex("barbell-curl", "Подъём штанги на бицепс", "Бицепс"),
  ex("hammer-curl", "Молотковые сгибания", "Бицепс"),
  ex("preacher-curl", "Сгибания на скамье Скотта", "Бицепс"),
  ex("db-curl", "Сгибания гантелей", "Бицепс"),

  // Трицепс
  ex("french-press", "Французский жим", "Трицепс"),
  ex("triceps-pushdown", "Разгибания на блоке", "Трицепс"),
  ex("close-grip-bench", "Жим узким хватом", "Трицепс"),

  // Пресс
  ex("crunch", "Скручивания", "Пресс"),
  ex("hanging-leg-raise", "Подъём ног в висе", "Пресс"),
  ex("cable-crunch", "Скручивания на блоке", "Пресс"),
];

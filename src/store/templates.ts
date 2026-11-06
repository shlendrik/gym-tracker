import { create } from "zustand";
import { storage } from "../storage";
import type { Template } from "../types";

type State = {
  templates: Template[];
  add: (t: Template) => void;
  update: (t: Template) => void;
  remove: (id: string) => void;
};

export const useTemplates = create<State>((set, get) => ({
  templates: storage.get<Template[]>("templates", []),
  add: (t) => set({ templates: [t, ...get().templates] }),
  update: (t) =>
    set({ templates: get().templates.map((x) => (x.id === t.id ? t : x)) }),
  remove: (id) => set({ templates: get().templates.filter((t) => t.id !== id) }),
}));

useTemplates.subscribe((s) => storage.set("templates", s.templates));

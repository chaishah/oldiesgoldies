"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ModuleId = "switchboard" | "watch" | "master-key" | "emergency-exit";

type AcademyState = {
  learnerName: string;
  activeModule: ModuleId;
  completedModules: ModuleId[];
  setLearnerName: (name: string) => void;
  setActiveModule: (moduleId: ModuleId) => void;
  completeModule: (moduleId: ModuleId) => void;
  resetProgress: () => void;
};

export const useAcademyStore = create<AcademyState>()(
  persist(
    (set) => ({
      learnerName: "",
      activeModule: "switchboard",
      completedModules: [],
      setLearnerName: (name) => set({ learnerName: name }),
      setActiveModule: (moduleId) => set({ activeModule: moduleId }),
      completeModule: (moduleId) =>
        set((state) => ({
          completedModules: state.completedModules.includes(moduleId)
            ? state.completedModules
            : [...state.completedModules, moduleId]
        })),
      resetProgress: () =>
        set({
          activeModule: "switchboard",
          completedModules: []
        })
    }),
    {
      name: "retro-tech-academy"
    }
  )
);

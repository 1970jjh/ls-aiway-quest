"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type DiagnoseState = {
  scores: number[];           // 8문항 점수 (1~5)
  completedAt: number | null;
  commitment: {
    bestWay: string;          // 가장 잘하는 Way
    weakWay: string;          // 가장 부족한 Way
    actions: string[];        // 30일 실천 액션 3가지
    declaration: string;      // 다짐 1줄
    completedAt: number | null;
  };
};

type DiagnoseActions = {
  setScore: (idx: number, v: number) => void;
  finishDiagnose: () => void;
  resetDiagnose: () => void;
  setCommit: (patch: Partial<DiagnoseState["commitment"]>) => void;
  finishCommit: () => void;
};

const init = (): DiagnoseState => ({
  scores: Array(8).fill(0),
  completedAt: null,
  commitment: {
    bestWay: "",
    weakWay: "",
    actions: ["", "", ""],
    declaration: "",
    completedAt: null,
  },
});

export const useDiagnoseStore = create<DiagnoseState & DiagnoseActions>()(
  persist(
    (set) => ({
      ...init(),
      setScore: (idx, v) =>
        set((s) => {
          const next = [...s.scores];
          next[idx] = v;
          return { scores: next };
        }),
      finishDiagnose: () => set({ completedAt: Date.now() }),
      resetDiagnose: () => set(init()),
      setCommit: (patch) => set((s) => ({ commitment: { ...s.commitment, ...patch } })),
      finishCommit: () =>
        set((s) => ({ commitment: { ...s.commitment, completedAt: Date.now() } })),
    }),
    { name: "ls-aiway-diagnose", version: 1 }
  )
);

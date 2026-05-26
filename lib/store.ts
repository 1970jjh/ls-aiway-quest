"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  QuestId,
  QuestProgress,
  QuestAttempt,
  ScoreBreakdown,
  SessionInfo,
  PlayMode,
  CrewMember,
} from "./types";
import { QUESTS, calculateRank } from "./quests";

// ============================================================
// 전역 Quest Store (개인전/팀전 + 재도전 시스템)
// ============================================================

type State = {
  session: SessionInfo | null;
  progress: Record<QuestId, QuestProgress>;
  startedAt: number | null;
  finalCompletedAt: number | null;
};

type Actions = {
  // 세션
  startSession: (params: {
    mode: PlayMode;
    sessionCode: string;
    participantName: string;
    crewName?: string;
    members?: CrewMember[];
  }) => void;
  resetSession: () => void;

  // Quest 진행
  recordAttempt: (
    questId: QuestId,
    score: ScoreBreakdown,
    payload: Record<string, unknown>,
    durationSec: number
  ) => void;
  resetQuest: (questId: QuestId) => void;

  // FINAL 완료
  markFinalCompleted: () => void;

  // 셀렉터
  getTotalScore: () => number;
  getCompletionTimeSec: () => number;
  getRank: () => ReturnType<typeof calculateRank> | null;
  getProgress: (questId: QuestId) => QuestProgress;
};

const emptyProgress = (questId: QuestId): QuestProgress => ({
  questId,
  attempts: [],
  bestScore: 0,
  bestAttempt: null,
  unlocked: false,
  firstClearedAt: undefined,
});

const initialProgress = (): Record<QuestId, QuestProgress> => {
  const map: Record<string, QuestProgress> = {};
  QUESTS.forEach((q, i) => {
    map[q.id] = {
      ...emptyProgress(q.id),
      // 첫 퀘스트(Q1)만 처음부터 해금 — 나머지는 순차 해금
      unlocked: i === 0,
    };
  });
  return map as Record<QuestId, QuestProgress>;
};

export const useQuestStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      session: null,
      progress: initialProgress(),
      startedAt: null,
      finalCompletedAt: null,

      startSession: ({ mode, sessionCode, participantName, crewName, members }) => {
        const now = Date.now();
        set({
          session: {
            mode,
            sessionCode,
            participantName,
            crewName,
            members,
            startedAt: now,
            totalDurationMinutes: 150,
          },
          startedAt: now,
          finalCompletedAt: null,
          progress: initialProgress(),
        });
      },

      resetSession: () => {
        set({
          session: null,
          progress: initialProgress(),
          startedAt: null,
          finalCompletedAt: null,
        });
      },

      recordAttempt: (questId, score, payload, durationSec) => {
        const cur = get().progress[questId] ?? emptyProgress(questId);
        const attemptNo = cur.attempts.length + 1;
        const attempt: QuestAttempt = { attemptNo, score, payload, durationSec };
        const newBest = score.finalScore > cur.bestScore;
        const next: QuestProgress = {
          ...cur,
          attempts: [...cur.attempts, attempt],
          bestScore: newBest ? score.finalScore : cur.bestScore,
          bestAttempt: newBest ? attempt : cur.bestAttempt,
          firstClearedAt:
            !cur.firstClearedAt && score.passStatus === "PASS" ? Date.now() : cur.firstClearedAt,
        };

        // 다음 퀘스트 해금 (PASS 시)
        const updated: Record<QuestId, QuestProgress> = { ...get().progress, [questId]: next };
        if (score.passStatus === "PASS") {
          const idx = QUESTS.findIndex((q) => q.id === questId);
          const nextQ = QUESTS[idx + 1];
          if (nextQ && !updated[nextQ.id]?.unlocked) {
            updated[nextQ.id] = { ...updated[nextQ.id], unlocked: true };
          }
        }
        set({ progress: updated });
      },

      resetQuest: (questId) => {
        set((s) => ({
          progress: { ...s.progress, [questId]: emptyProgress(questId) },
        }));
      },

      markFinalCompleted: () => {
        set({ finalCompletedAt: Date.now() });
      },

      getTotalScore: () => {
        const progress = get().progress;
        return Object.values(progress).reduce((sum, p) => sum + (p.bestScore ?? 0), 0);
      },

      getCompletionTimeSec: () => {
        const s = get();
        if (!s.startedAt || !s.finalCompletedAt) return 0;
        return Math.floor((s.finalCompletedAt - s.startedAt) / 1000);
      },

      getRank: () => {
        const total = get().getTotalScore();
        if (total === 0) return null;
        return calculateRank(total);
      },

      getProgress: (questId) => {
        return get().progress[questId] ?? emptyProgress(questId);
      },
    }),
    {
      name: "ls-aiway-quest-state",
      version: 1,
    }
  )
);

// 진행 시간 (분) — 실시간 계산용 헬퍼
export function getElapsedMin(startedAt: number | null): number {
  if (!startedAt) return 0;
  return Math.floor((Date.now() - startedAt) / 1000 / 60);
}

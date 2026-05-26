// ============================================================
// LS Cable & System — AI Work Way Quest
// 8 Quests + FINAL Boss · Solo/Team Mode · Retry System
// ============================================================

export type WayId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type QuestId = `Q${WayId}` | "FINAL";

export type Category = "MINDSET" | "ACTION" | "STANDARD";
export type QuestType = "ANALYTICAL" | "EXPERIENCE";

export type PlayMode = "SOLO" | "TEAM";

export interface CrewMember {
  id: string;
  name: string;
}

export interface SessionInfo {
  mode: PlayMode;
  sessionCode: string;
  participantName: string;
  crewName?: string;
  members?: CrewMember[];
  startedAt?: number;
  completedAt?: number;
  totalDurationMinutes: number;
}

export interface QuestMeta {
  id: QuestId;
  wayId?: WayId;
  category?: Category;
  type: QuestType;
  title: string;
  titleKo: string;
  wayLabel: string;
  shortDesc: string;
  durationMin: number;
  image: string;
  intro: string;
  goal: string;
  passThreshold: number;
  href: string;
}

export interface ScoreBreakdown {
  systemAuto: number;
  geminiScore: number;
  finalScore: number;
  passStatus: "PASS" | "FAIL";
  rationale?: string;
  evaluatedAt: number;
}

export interface QuestAttempt {
  attemptNo: number;
  score: ScoreBreakdown;
  payload: Record<string, unknown>;
  durationSec: number;
}

export interface QuestProgress {
  questId: QuestId;
  attempts: QuestAttempt[];
  bestScore: number;
  bestAttempt: QuestAttempt | null;
  unlocked: boolean;
  firstClearedAt?: number;
}

export interface QuestGameState {
  session: SessionInfo | null;
  progress: Record<QuestId, QuestProgress>;
  totalScore: number;
  completionTimeSec: number;
  rank: "AI ROOKIE" | "AI COLLABORATOR" | "AI ARCHITECT" | "AI PIONEER" | null;
}

export interface LeaderboardEntry {
  rank: number;
  participantName: string;
  crewName?: string;
  mode: PlayMode;
  totalScore: number;
  completionTimeSec: number;
  rankBadge: string;
  completedAt: number;
}

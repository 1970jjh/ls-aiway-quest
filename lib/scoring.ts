import type { ScoreBreakdown } from "./types";

// ============================================================
// 점수 계산 — 시스템 자동 채점 + Gemini 채점 가중평균
// ============================================================

export function computeFinalScore(params: {
  systemAuto: number;
  geminiScore: number;
  passThreshold: number;
  systemWeight?: number;
  rationale?: string;
}): ScoreBreakdown {
  const { systemAuto, geminiScore, passThreshold, systemWeight = 0.4, rationale } = params;
  const finalScore = Math.round(systemAuto * systemWeight + geminiScore * (1 - systemWeight));
  return {
    systemAuto,
    geminiScore,
    finalScore,
    passStatus: finalScore >= passThreshold ? "PASS" : "FAIL",
    rationale,
    evaluatedAt: Date.now(),
  };
}

// ============================================================
// 클라이언트 → /api/score 호출 헬퍼
// ============================================================

export async function callScoreAPI(
  questId: string,
  payload: Record<string, unknown>
): Promise<{ score: number; rationale: string }> {
  try {
    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questId, payload }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { score: data.score ?? 50, rationale: data.rationale ?? "" };
  } catch (e) {
    console.error("score API failed:", e);
    return { score: 50, rationale: "AI 채점 일시 오류 — 시스템 자동 점수로 대체합니다." };
  }
}

export async function callChatAPI(
  history: { role: "user" | "model"; text: string }[]
): Promise<{ reply: string }> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { reply: data.reply ?? "" };
  } catch (e) {
    console.error("chat API failed:", e);
    return { reply: "AI 응답 일시 오류. 잠시 후 다시 시도해주세요." };
  }
}

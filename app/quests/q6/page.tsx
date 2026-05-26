"use client";
import { useMemo, useState } from "react";
import { QuestShell } from "@/components/QuestShell";
import { HudPanel } from "@/components/HudPanel";
import { getQuest } from "@/lib/quests";
import { Q6_PEER_PRACTICES } from "@/data/quest-data";
import { callScoreAPI, computeFinalScore } from "@/lib/scoring";
import { useQuestStore } from "@/lib/store";
import type { ScoreBreakdown } from "@/lib/types";

// Q6 · PRACTICE BANK · Best Practice는 개인기가 아닌 조직의 힘
export default function Q6Page() {
  const q = getQuest("Q6")!;
  const recordAttempt = useQuestStore((s) => s.recordAttempt);
  const startedAt = useState(Date.now())[0];

  const [own, setOwn] = useState({
    title: "", area: "", method: "", impact: "",
  });
  const [peerScores, setPeerScores] = useState<Record<string, { star: number; comment: string }>>(
    Object.fromEntries(Q6_PEER_PRACTICES.map((p) => [p.id, { star: 0, comment: "" }]))
  );
  const [busy, setBusy] = useState(false);
  const [scoreView, setScoreView] = useState<ScoreBreakdown | null>(null);

  const systemAuto = useMemo(() => {
    let pts = 0;
    if (own.title.trim().length >= 5) pts += 10;
    if (own.area.trim().length >= 5) pts += 10;
    if (own.method.trim().length >= 30) pts += 15;
    if (own.method.trim().length >= 100) pts += 10;
    if (own.impact.trim().length >= 15) pts += 10;
    // 동료 평가 — 모두 별점 + 코멘트 20자 이상
    const peerReviewed = Object.values(peerScores).filter(
      (v) => v.star > 0 && v.comment.trim().length >= 20
    ).length;
    pts += peerReviewed * 15;
    return Math.min(100, pts);
  }, [own, peerScores]);

  async function submit() {
    setBusy(true);
    try {
      const peerSummary = Object.entries(peerScores)
        .map(([id, v]) => `${id}: ${v.star}★ — ${v.comment}`)
        .join(" / ");
      const payload = { ...own, peerReviews: peerSummary };
      const { score: g, rationale } = await callScoreAPI("Q6", payload);
      const sb = computeFinalScore({
        systemAuto,
        geminiScore: g,
        passThreshold: q.passThreshold,
        rationale,
      });
      setScoreView(sb);
      recordAttempt("Q6", sb, payload, Math.floor((Date.now() - startedAt) / 1000));
    } finally {
      setBusy(false);
    }
  }

  return (
    <QuestShell quest={q} onSubmit={submit} busy={busy} scoreView={scoreView}>
      <HudPanel subtitle="STEP 01 · 본인 사례 등록" title="당신의 작은 자랑거리 1건">
        <p className="text-sm text-ls-dim mb-3">
          최근 한 달간 당신이 AI를 활용해서 만든 '재현 가능한' 노하우 1건을 등록하라.
        </p>
        <div className="grid gap-3">
          <input
            value={own.title}
            onChange={(e) => setOwn({ ...own, title: e.target.value })}
            placeholder="사례 제목 (예: 거래처 미팅 자동 요약 + 메일 초안 생성)"
            className="input-quest"
          />
          <input
            value={own.area}
            onChange={(e) => setOwn({ ...own, area: e.target.value })}
            placeholder="적용 영역 (예: 영업 / 회의록 / 리서치 / 번역 등)"
            className="input-quest"
          />
          <textarea
            value={own.method}
            onChange={(e) => setOwn({ ...own, method: e.target.value })}
            rows={5}
            maxLength={500}
            placeholder="구체적인 방법: 어떤 도구를 어떻게 쓰는지, 따라할 수 있게 단계별로. 다른 동료가 그대로 적용 가능해야 합니다."
            className="input-quest"
          />
          <input
            value={own.impact}
            onChange={(e) => setOwn({ ...own, impact: e.target.value })}
            placeholder="효과 (예: 주 3시간 절감 / 정확도 +20% / 응답 속도 2배)"
            className="input-quest"
          />
        </div>
      </HudPanel>

      <HudPanel subtitle="STEP 02 · 동료 사례 평가" title="3건 모두 별점 + 코멘트 남기기">
        <p className="text-sm text-ls-dim mb-3">
          단순 별점이 아닌, 동료가 다음에 더 잘하도록 도와주는 의미있는 피드백을 남겨라.
        </p>
        {Q6_PEER_PRACTICES.map((peer) => (
          <div key={peer.id} className="mb-4 p-4 bg-ls-navy/60 border border-ls-line rounded">
            <p className="text-xs text-ls-sky font-bold mb-1">{peer.author}</p>
            <p className="text-sm font-bold mb-1">{peer.title}</p>
            <p className="text-xs text-ls-dim mb-3">{peer.content}</p>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs text-ls-dim">별점:</p>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() =>
                    setPeerScores((prev) => ({
                      ...prev,
                      [peer.id]: { ...prev[peer.id], star },
                    }))
                  }
                  className="text-xl"
                  style={{
                    color: peerScores[peer.id].star >= star ? "#FFC940" : "#3a4a6a",
                  }}
                >
                  ★
                </button>
              ))}
            </div>
            <input
              value={peerScores[peer.id].comment}
              onChange={(e) =>
                setPeerScores((prev) => ({
                  ...prev,
                  [peer.id]: { ...prev[peer.id], comment: e.target.value },
                }))
              }
              placeholder="이 사례의 좋은 점 + 발전 제안 (20자 이상)"
              className="input-quest"
              maxLength={200}
            />
          </div>
        ))}
      </HudPanel>
    </QuestShell>
  );
}

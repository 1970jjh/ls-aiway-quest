"use client";
import { useMemo, useState } from "react";
import { QuestShell } from "@/components/QuestShell";
import { HudPanel } from "@/components/HudPanel";
import { getQuest } from "@/lib/quests";
import { Q5_AI_DRAFT, Q5_STAMP_TYPES } from "@/data/quest-data";
import { callScoreAPI, computeFinalScore } from "@/lib/scoring";
import { useQuestStore } from "@/lib/store";
import type { ScoreBreakdown } from "@/lib/types";

// Q5 · HUMAN STAMP · AI로 가속하고 사람이 마침표를 찍는다
export default function Q5Page() {
  const q = getQuest("Q5")!;
  const recordAttempt = useQuestStore((s) => s.recordAttempt);
  const startedAt = useState(Date.now())[0];

  const [stamps, setStamps] = useState([
    { type: "FACT", location: "", insight: "" },
    { type: "CONTEXT", location: "", insight: "" },
    { type: "INSIGHT", location: "", insight: "" },
  ]);
  const [busy, setBusy] = useState(false);
  const [scoreView, setScoreView] = useState<ScoreBreakdown | null>(null);

  const systemAuto = useMemo(() => {
    let pts = 0;
    stamps.forEach((s) => {
      if (s.type) pts += 10;
      if (s.location.trim().length >= 10) pts += 10;
      if (s.insight.trim().length >= 20) pts += 10;
      if (s.insight.trim().length >= 50) pts += 5;
    });
    // 3유형 골고루
    const uniqueTypes = new Set(stamps.map((s) => s.type)).size;
    pts += uniqueTypes >= 3 ? 5 : 0;
    return Math.min(100, pts);
  }, [stamps]);

  function updateStamp(idx: number, patch: Partial<{ type: string; location: string; insight: string }>) {
    setStamps((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }

  async function submit() {
    setBusy(true);
    try {
      const payload = { stamps };
      const { score: g, rationale } = await callScoreAPI("Q5", payload);
      const sb = computeFinalScore({
        systemAuto,
        geminiScore: g,
        passThreshold: q.passThreshold,
        rationale,
      });
      setScoreView(sb);
      recordAttempt("Q5", sb, payload, Math.floor((Date.now() - startedAt) / 1000));
    } finally {
      setBusy(false);
    }
  }

  return (
    <QuestShell quest={q} onSubmit={submit} busy={busy} scoreView={scoreView}>
      <HudPanel subtitle="AI 초안 · 그대로 제출하지 마라">
        <div className="p-4 bg-ls-navy/70 border border-ls-line rounded">
          <p className="text-xs text-ls-sky font-bold mb-2">'2025 LS 신사업 전망 보고서' AI 초안:</p>
          <p className="text-sm whitespace-pre-line text-ls-white/90">{Q5_AI_DRAFT}</p>
        </div>
      </HudPanel>

      <HudPanel subtitle="STAMP TYPES · 3가지 마침표 유형">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Q5_STAMP_TYPES.map((t) => (
            <div key={t.id} className="p-3 bg-ls-navy border border-ls-line rounded">
              <p className="text-sm font-bold" style={{ color: t.color }}>
                {t.label}
              </p>
              <p className="text-xs text-ls-dim mt-1">{t.desc}</p>
            </div>
          ))}
        </div>
      </HudPanel>

      <HudPanel subtitle="STEP · 3지점 식별 + 마침표 찍기" title="3가지 유형으로 각각 1개씩, 총 3개">
        {stamps.map((s, i) => (
          <div key={i} className="mb-5 p-4 bg-ls-navy/60 border border-ls-line rounded">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-ls-sky font-bold">지점 {i + 1}</span>
              <div className="flex gap-1">
                {Q5_STAMP_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => updateStamp(i, { type: t.id })}
                    className={`px-2 py-1 text-xs font-bold border rounded ${
                      s.type === t.id ? "border-ls-sky text-ls-sky" : "border-ls-line text-ls-dim"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <input
              value={s.location}
              onChange={(e) => updateStamp(i, { location: e.target.value })}
              placeholder="초안의 어느 부분? (예: '해저 케이블 분야는 30% 이상 성장' 부분)"
              className="input-quest mb-2"
            />
            <textarea
              value={s.insight}
              onChange={(e) => updateStamp(i, { insight: e.target.value })}
              rows={2}
              placeholder="당신의 마침표 — 어떤 팩트체크/맥락/통찰을 더할 것인가?"
              className="input-quest"
              maxLength={250}
            />
          </div>
        ))}
      </HudPanel>
    </QuestShell>
  );
}

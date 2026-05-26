"use client";
import { useMemo, useState } from "react";
import { QuestShell } from "@/components/QuestShell";
import { HudPanel } from "@/components/HudPanel";
import { getQuest } from "@/lib/quests";
import { Q2_AI_DRAFTS } from "@/data/quest-data";
import { callScoreAPI, computeFinalScore } from "@/lib/scoring";
import { useQuestStore } from "@/lib/store";
import type { ScoreBreakdown } from "@/lib/types";

// Q2 · VALUE BLENDER · 경험을 더해, 가치를 완성한다
export default function Q2Page() {
  const q = getQuest("Q2")!;
  const recordAttempt = useQuestStore((s) => s.recordAttempt);
  const startedAt = useState(Date.now())[0];

  const [draftId, setDraftId] = useState("DRAFT-A");
  const draft = Q2_AI_DRAFTS.find((d) => d.id === draftId)!;

  const [additions, setAdditions] = useState("");
  const [finalText, setFinalText] = useState("");
  const [busy, setBusy] = useState(false);
  const [scoreView, setScoreView] = useState<ScoreBreakdown | null>(null);

  const systemAuto = useMemo(() => {
    let pts = 0;
    if (additions.trim().length >= 30) pts += 20;
    if (additions.trim().length >= 100) pts += 20;
    // expectedAddons 키워드 중 몇 개 포함했는지
    const matched = draft.expectedAddons.filter((kw) =>
      additions.toLowerCase().includes(kw.toLowerCase().slice(0, 3))
    ).length;
    pts += matched * 10;
    if (finalText.trim().length >= 100) pts += 15;
    if (finalText.trim().length >= 250) pts += 15;
    return Math.min(100, pts);
  }, [additions, finalText, draft]);

  async function submit() {
    setBusy(true);
    try {
      const payload = { topic: draft.topic, additions, finalText };
      const { score: g, rationale } = await callScoreAPI("Q2", payload);
      const sb = computeFinalScore({
        systemAuto,
        geminiScore: g,
        passThreshold: q.passThreshold,
        rationale,
      });
      setScoreView(sb);
      recordAttempt("Q2", sb, payload, Math.floor((Date.now() - startedAt) / 1000));
    } finally {
      setBusy(false);
    }
  }

  return (
    <QuestShell quest={q} onSubmit={submit} busy={busy} scoreView={scoreView}>
      <HudPanel subtitle="STEP 01 · 과제 선택" title="두 가지 주제 중 하나를 골라라">
        <div className="grid md:grid-cols-2 gap-3">
          {Q2_AI_DRAFTS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDraftId(d.id)}
              className={`p-4 text-left border rounded transition-all ${
                draftId === d.id
                  ? "bg-ls-deepblue/40 border-ls-sky"
                  : "bg-ls-navy border-ls-line hover:border-ls-blue"
              }`}
            >
              <p className="text-xs text-ls-sky font-bold mb-1">{d.id}</p>
              <p className="text-sm font-bold">{d.topic}</p>
            </button>
          ))}
        </div>
      </HudPanel>

      <HudPanel
        subtitle="STEP 02 · AI 초안 살펴보기"
        title="Gemini가 5분 만에 만든 80점짜리 초안"
      >
        <div className="p-4 bg-ls-navy/70 border-l-2 border-ls-sky">
          <p className="text-xs text-ls-sky font-bold mb-2">AI 생성 초안:</p>
          <p className="text-sm text-ls-white/90 whitespace-pre-line">{draft.aiDraft}</p>
        </div>
        <div className="mt-3 flex gap-2 flex-wrap">
          <p className="text-xs text-ls-dim">기대 보강 영역:</p>
          {draft.expectedAddons.map((kw) => (
            <span
              key={kw}
              className="text-xs px-2 py-0.5 bg-ls-deepblue/30 border border-ls-line rounded"
            >
              {kw}
            </span>
          ))}
        </div>
      </HudPanel>

      <HudPanel
        subtitle="STEP 03 · 당신의 경험을 더하라"
        title="LS 현장 맥락 · 본인 경험 · 고유 전문성"
      >
        <p className="text-sm text-ls-dim mb-3">
          AI 초안에 어떤 경험·맥락·전문성을 추가하면 '대체 불가'가 될까? 키워드 + 구체적 내용을 적어라.
        </p>
        <textarea
          value={additions}
          onChange={(e) => setAdditions(e.target.value)}
          rows={5}
          maxLength={500}
          placeholder="예) - 프로젝트 실적: 2024년 카타르 해저 케이블 1.2GW 수주 → 6개월 조기 납품 사례&#10;- 기술 차별점: 자체 R&D 525kV HVDC 케이블 인증 보유 (경쟁사 대비 +30% 효율)&#10;- 현지 대응 노하우: 중동·동남아 현지 법인 운영 15년 노하우, 24시간 기술 지원"
          className="input-quest"
        />
        <p className="text-[10px] text-ls-dim text-right">{additions.length}/500</p>
      </HudPanel>

      <HudPanel subtitle="STEP 04 · 최종 결과물" title="AI 초안 + 당신의 경험 = 최종 1page">
        <p className="text-sm text-ls-dim mb-3">
          위 추가 내용을 녹여 다시 한 번 완성도 있는 최종 결과물을 작성하라. 이것이 LS만의 가치다.
        </p>
        <textarea
          value={finalText}
          onChange={(e) => setFinalText(e.target.value)}
          rows={8}
          maxLength={1000}
          placeholder="여기에 AI 초안과 당신의 경험·전문성을 결합한 최종 결과물을 작성하세요. 이것이 'LS 김OO만의 답변'이 됩니다."
          className="input-quest"
        />
        <p className="text-[10px] text-ls-dim text-right">{finalText.length}/1000</p>
      </HudPanel>
    </QuestShell>
  );
}

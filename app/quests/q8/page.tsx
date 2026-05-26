"use client";
import { useMemo, useState } from "react";
import { QuestShell } from "@/components/QuestShell";
import { HudPanel } from "@/components/HudPanel";
import { getQuest } from "@/lib/quests";
import { Q8_CHECKLIST_ITEMS } from "@/data/quest-data";
import { callScoreAPI, computeFinalScore } from "@/lib/scoring";
import { useQuestStore } from "@/lib/store";
import type { ScoreBreakdown } from "@/lib/types";

// Q8 · FINAL OWNER · 결과물의 최종 책임자는 '나'다
export default function Q8Page() {
  const q = getQuest("Q8")!;
  const recordAttempt = useQuestStore((s) => s.recordAttempt);
  const startedAt = useState(Date.now())[0];

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [evidence, setEvidence] = useState<Record<string, string>>({});
  const [declaration, setDeclaration] = useState("");
  const [signature, setSignature] = useState("");
  const [busy, setBusy] = useState(false);
  const [scoreView, setScoreView] = useState<ScoreBreakdown | null>(null);

  const checkedCount = Object.values(checked).filter(Boolean).length;

  const systemAuto = useMemo(() => {
    let pts = 0;
    Q8_CHECKLIST_ITEMS.forEach((item) => {
      if (checked[item.id]) pts += item.weight * 0.6;
      if ((evidence[item.id] || "").trim().length >= 15) pts += item.weight * 0.4;
    });
    if (declaration.trim().length >= 30) pts += 10;
    if (signature.trim()) pts += 5;
    return Math.min(100, Math.round(pts));
  }, [checked, evidence, declaration, signature]);

  async function submit() {
    setBusy(true);
    try {
      const payload = {
        checklistPassed: checkedCount,
        evidence,
        declaration,
        signature,
      };
      const { score: g, rationale } = await callScoreAPI("Q8", payload);
      const sb = computeFinalScore({
        systemAuto,
        geminiScore: g,
        passThreshold: q.passThreshold,
        rationale,
      });
      setScoreView(sb);
      recordAttempt("Q8", sb, payload, Math.floor((Date.now() - startedAt) / 1000));
    } finally {
      setBusy(false);
    }
  }

  return (
    <QuestShell quest={q} onSubmit={submit} busy={busy} scoreView={scoreView}>
      <HudPanel subtitle="STEP 01 · 5가지 위험 체크리스트" title="모두 통과시키고 증거를 남겨라">
        {Q8_CHECKLIST_ITEMS.map((item) => (
          <div key={item.id} className="mb-3 p-4 bg-ls-navy/60 border border-ls-line rounded">
            <label className="flex items-start gap-3 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={!!checked[item.id]}
                onChange={(e) =>
                  setChecked((prev) => ({ ...prev, [item.id]: e.target.checked }))
                }
                className="mt-1 w-5 h-5 accent-ls-sky"
              />
              <div className="flex-1">
                <p className="text-sm font-bold">{item.label}</p>
                <p className="text-[10px] text-ls-dim">가중치 {item.weight}점</p>
              </div>
            </label>
            <input
              value={evidence[item.id] || ""}
              onChange={(e) => setEvidence((prev) => ({ ...prev, [item.id]: e.target.value }))}
              placeholder="확인한 증거 (예: 수치 출처 확인 / 동료에게 검토 받음 등)"
              className="input-quest text-xs"
              maxLength={150}
              disabled={!checked[item.id]}
            />
          </div>
        ))}
        <div className="mt-3 p-3 bg-ls-deepblue/20 border-l-2 border-ls-sky">
          <p className="text-sm">
            체크 완료: <strong className="text-ls-sky">{checkedCount}/5</strong>
          </p>
        </div>
      </HudPanel>

      <HudPanel subtitle="STEP 02 · 책임 선언문" title="AI 파트너 · 책임자 '나' — 한 문장 선언">
        <p className="text-sm text-ls-dim mb-3">
          단순 다짐이 아니라, AI 협업 결과물에 대한 당신만의 구체적 책임 행동을 선언하라.
        </p>
        <textarea
          value={declaration}
          onChange={(e) => setDeclaration(e.target.value)}
          rows={4}
          maxLength={400}
          placeholder="예) 나는 AI가 만든 모든 결과물에 대해 ① 출처를 명시하고 ② 본인이 직접 팩트체크한 후 ③ 내 이름으로 책임지고 제출한다. 의심스러운 부분은 출처 확인 전 어떠한 결정에도 사용하지 않는다."
          className="input-quest"
        />
        <p className="text-[10px] text-ls-dim text-right">{declaration.length}/400</p>
      </HudPanel>

      <HudPanel subtitle="STEP 03 · 서명" title="당신의 이름을 남겨라">
        <p className="text-sm text-ls-dim mb-3">
          서명은 곧 책임의 시작. 본인 이름과 오늘 날짜를 남겨라.
        </p>
        <input
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          placeholder={`예) ${new Date().toLocaleDateString("ko-KR")} · 김OO 책임자`}
          className="input-quest text-center font-display text-xl"
        />
      </HudPanel>
    </QuestShell>
  );
}

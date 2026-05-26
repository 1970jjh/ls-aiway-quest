"use client";
import { useMemo, useState } from "react";
import { QuestShell } from "@/components/QuestShell";
import { HudPanel } from "@/components/HudPanel";
import { getQuest } from "@/lib/quests";
import { Q7_AI_STATEMENTS } from "@/data/quest-data";
import { callScoreAPI, computeFinalScore } from "@/lib/scoring";
import { useQuestStore } from "@/lib/store";
import type { ScoreBreakdown } from "@/lib/types";

type Judgment = "TRUST" | "SUSPECT" | "REJECT" | "";

// Q7 · SOURCE HUNTER · 데이터의 생명은 정확한 출처에서 나온다
export default function Q7Page() {
  const q = getQuest("Q7")!;
  const recordAttempt = useQuestStore((s) => s.recordAttempt);
  const startedAt = useState(Date.now())[0];

  const [judgments, setJudgments] = useState<Record<string, { judgment: Judgment; reason: string }>>(
    Object.fromEntries(Q7_AI_STATEMENTS.map((s) => [s.id, { judgment: "" as Judgment, reason: "" }]))
  );
  const [fakeId, setFakeId] = useState("");
  const [report, setReport] = useState("");
  const [busy, setBusy] = useState(false);
  const [scoreView, setScoreView] = useState<ScoreBreakdown | null>(null);

  const systemAuto = useMemo(() => {
    let pts = 0;
    // 분류 + 사유 (각 진술 10점)
    Q7_AI_STATEMENTS.forEach((s) => {
      const j = judgments[s.id];
      if (j.judgment) pts += 5;
      if (j.reason.trim().length >= 10) pts += 5;
    });
    // 가짜 식별 정답 (STMT-B)
    if (fakeId === "STMT-B") pts += 30;
    // 리포트 길이
    if (report.trim().length >= 50) pts += 15;
    if (report.trim().length >= 150) pts += 15;
    return Math.min(100, pts);
  }, [judgments, fakeId, report]);

  function setJudgment(id: string, patch: Partial<{ judgment: Judgment; reason: string }>) {
    setJudgments((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  async function submit() {
    setBusy(true);
    try {
      const payload = {
        classifications: Q7_AI_STATEMENTS.map((s) => ({
          id: s.id,
          judgment: judgments[s.id].judgment,
          reason: judgments[s.id].reason,
        })),
        fakeId,
        report,
      };
      const { score: g, rationale } = await callScoreAPI("Q7", payload);
      const sb = computeFinalScore({
        systemAuto,
        geminiScore: g,
        passThreshold: q.passThreshold,
        rationale,
      });
      setScoreView(sb);
      recordAttempt("Q7", sb, payload, Math.floor((Date.now() - startedAt) / 1000));
    } finally {
      setBusy(false);
    }
  }

  return (
    <QuestShell quest={q} onSubmit={submit} busy={busy} scoreView={scoreView}>
      <HudPanel subtitle="STEP 01 · 4건의 AI 진술 분류" title="신뢰 · 의심 · 반박">
        <p className="text-sm text-ls-dim mb-4">
          4건 중 1건은 환각(가짜)이다. 각 진술에 대해 분류하고 사유를 적어라.
        </p>
        {Q7_AI_STATEMENTS.map((s) => (
          <div key={s.id} className="mb-4 p-4 bg-ls-navy/60 border border-ls-line rounded">
            <p className="text-xs text-ls-sky font-bold mb-2">{s.id}</p>
            <p className="text-sm mb-3">{s.text}</p>
            <div className="flex gap-2 mb-2">
              {[
                { id: "TRUST", label: "✓ 신뢰", color: "#62B645" },
                { id: "SUSPECT", label: "? 의심", color: "#FFC940" },
                { id: "REJECT", label: "✗ 반박", color: "#FF5577" },
              ].map((j) => (
                <button
                  key={j.id}
                  onClick={() => setJudgment(s.id, { judgment: j.id as Judgment })}
                  className={`px-3 py-1.5 text-xs font-bold border rounded ${
                    judgments[s.id].judgment === j.id
                      ? "border-ls-sky"
                      : "border-ls-line text-ls-dim"
                  }`}
                  style={judgments[s.id].judgment === j.id ? { color: j.color } : {}}
                >
                  {j.label}
                </button>
              ))}
            </div>
            <input
              value={judgments[s.id].reason}
              onChange={(e) => setJudgment(s.id, { reason: e.target.value })}
              placeholder="판단 사유 (예: 출처가 명확함 / 수치가 부정확함 / 사실 확인 필요)"
              className="input-quest text-xs"
              maxLength={150}
            />
          </div>
        ))}
      </HudPanel>

      <HudPanel subtitle="STEP 02 · 가짜 진술 식별" title="4건 중 환각(가짜)은 어느 것인가?">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Q7_AI_STATEMENTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setFakeId(s.id)}
              className={`p-3 text-sm font-bold border rounded ${
                fakeId === s.id ? "bg-ls-danger/30 border-ls-danger" : "bg-ls-navy border-ls-line"
              }`}
            >
              {s.id}
            </button>
          ))}
        </div>
      </HudPanel>

      <HudPanel subtitle="STEP 03 · 검증 리포트" title="당신의 검증 결과를 짧게">
        <p className="text-sm text-ls-dim mb-3">
          어떤 출처로 어떻게 검증했는지, 사후 검증이 가능하도록 적어라.
        </p>
        <textarea
          value={report}
          onChange={(e) => setReport(e.target.value)}
          rows={4}
          maxLength={400}
          placeholder="예) STMT-B는 환각으로 판단. 검증 방법: ① 공식 보도자료 검색 결과 해당 계약 사실 없음 ② 미국 시장 진출은 진행 중이나 $50억 단독 계약은 부정확. 출처: LS 공식 IR 자료."
          className="input-quest"
        />
      </HudPanel>
    </QuestShell>
  );
}

"use client";
import { useMemo, useState } from "react";
import { QuestShell } from "@/components/QuestShell";
import { HudPanel } from "@/components/HudPanel";
import { getQuest } from "@/lib/quests";
import { Q4_RBTFE_FRAME, Q4_SAMPLE_TASKS } from "@/data/quest-data";
import { callChatAPI, callScoreAPI, computeFinalScore } from "@/lib/scoring";
import { useQuestStore } from "@/lib/store";
import type { ScoreBreakdown } from "@/lib/types";

// Q4 · PROMPT MASTER · 상세한 지시가 압도적 차이를 만든다
export default function Q4Page() {
  const q = getQuest("Q4")!;
  const recordAttempt = useQuestStore((s) => s.recordAttempt);
  const startedAt = useState(Date.now())[0];

  const [taskId, setTaskId] = useState("TASK-1");
  const task = Q4_SAMPLE_TASKS.find((t) => t.id === taskId)!;

  const [rbtfe, setRbtfe] = useState({
    role: "", background: "", task: "", format: "", example: "",
  });
  const [vagueOutput, setVagueOutput] = useState("");
  const [detailedOutput, setDetailedOutput] = useState("");
  const [differences, setDifferences] = useState(["", "", ""]);
  const [running, setRunning] = useState<"none" | "vague" | "detailed">("none");
  const [busy, setBusy] = useState(false);
  const [scoreView, setScoreView] = useState<ScoreBreakdown | null>(null);

  const systemAuto = useMemo(() => {
    let pts = 0;
    // RBTFE 5요소 (각 12점)
    Object.values(rbtfe).forEach((v) => {
      if (v.trim().length >= 10) pts += 12;
    });
    // 차이점 3가지
    differences.forEach((d) => {
      if (d.trim().length >= 15) pts += 12;
    });
    if (detailedOutput.trim().length >= 50) pts += 4;
    return Math.min(100, pts);
  }, [rbtfe, differences, detailedOutput]);

  async function runVague() {
    setRunning("vague");
    const { reply } = await callChatAPI([
      { role: "user", text: task.vague },
    ]);
    setVagueOutput(reply || "(AI 응답 일시 오류 — 다시 시도)");
    setRunning("none");
  }

  async function runDetailed() {
    if (!rbtfe.role || !rbtfe.task) return;
    setRunning("detailed");
    const composedPrompt = `[Role]: ${rbtfe.role}
[Background]: ${rbtfe.background}
[Task]: ${rbtfe.task}
[Format]: ${rbtfe.format}
[Example tone]: ${rbtfe.example}

위 조건에 맞춰 결과물을 작성해주세요.`;
    const { reply } = await callChatAPI([{ role: "user", text: composedPrompt }]);
    setDetailedOutput(reply || "(AI 응답 일시 오류)");
    setRunning("none");
  }

  async function submit() {
    setBusy(true);
    try {
      const payload = {
        task: task.label,
        role: rbtfe.role,
        background: rbtfe.background,
        taskDetail: rbtfe.task,
        format: rbtfe.format,
        example: rbtfe.example,
        differences: differences.filter(Boolean),
      };
      const { score: g, rationale } = await callScoreAPI("Q4", payload);
      const sb = computeFinalScore({
        systemAuto,
        geminiScore: g,
        passThreshold: q.passThreshold,
        rationale,
      });
      setScoreView(sb);
      recordAttempt("Q4", sb, payload, Math.floor((Date.now() - startedAt) / 1000));
    } finally {
      setBusy(false);
    }
  }

  return (
    <QuestShell quest={q} onSubmit={submit} busy={busy} scoreView={scoreView}>
      <HudPanel subtitle="STEP 01 · 과제 선택">
        <div className="grid md:grid-cols-3 gap-3">
          {Q4_SAMPLE_TASKS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTaskId(t.id)}
              className={`p-3 text-left border rounded ${
                taskId === t.id ? "bg-ls-deepblue/40 border-ls-sky" : "bg-ls-navy border-ls-line"
              }`}
            >
              <p className="text-xs text-ls-sky font-bold">{t.id}</p>
              <p className="text-sm">{t.label}</p>
            </button>
          ))}
        </div>
      </HudPanel>

      {/* ROUND 1 — 막연한 지시 */}
      <HudPanel subtitle="ROUND 1 · 막연한 지시" title="한 줄 지시로 시도">
        <div className="p-3 bg-ls-navy border-l-2 border-ls-danger mb-3">
          <p className="text-xs text-ls-danger font-bold mb-1">막연한 프롬프트:</p>
          <p className="text-sm font-mono">"{task.vague}"</p>
        </div>
        <button onClick={runVague} disabled={running === "vague"} className="btn-ghost mb-3">
          {running === "vague" ? "AI 실행 중..." : "🔄 막연한 지시로 AI 호출"}
        </button>
        {vagueOutput && (
          <div className="p-4 bg-ls-navy/60 border border-ls-line rounded">
            <p className="text-xs text-ls-dim mb-2">AI 응답 (Round 1):</p>
            <p className="text-sm whitespace-pre-wrap">{vagueOutput}</p>
          </div>
        )}
      </HudPanel>

      {/* ROUND 2 — RBTFE */}
      <HudPanel
        subtitle="ROUND 2 · R-B-T-F-E 프레임"
        title="5요소를 모두 채우면 압도적 차이"
      >
        <div className="grid gap-3">
          {Q4_RBTFE_FRAME.map((f) => (
            <div key={f.key}>
              <label className="text-xs uppercase tracking-wider text-ls-sky font-bold">
                {f.label}
              </label>
              <input
                value={(rbtfe as any)[f.key]}
                onChange={(e) => setRbtfe((prev) => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="input-quest mt-1"
              />
            </div>
          ))}
        </div>
        <button
          onClick={runDetailed}
          disabled={running === "detailed" || !rbtfe.role || !rbtfe.task}
          className="btn-quest mt-4"
        >
          {running === "detailed" ? "AI 실행 중..." : "🚀 상세 프롬프트로 AI 호출"}
        </button>
        {detailedOutput && (
          <div className="mt-3 p-4 bg-ls-mint/10 border border-ls-mint/50 rounded">
            <p className="text-xs text-ls-mint mb-2">AI 응답 (Round 2 · 상세 프롬프트):</p>
            <p className="text-sm whitespace-pre-wrap">{detailedOutput}</p>
          </div>
        )}
      </HudPanel>

      {/* STEP 3 — 차이점 분석 */}
      <HudPanel subtitle="STEP 03 · 차이점 분석" title="두 결과의 본질적 차이 3가지">
        <p className="text-sm text-ls-dim mb-3">
          단순히 "더 자세하다"가 아니라, 무엇이 어떻게 달라졌는지 본질을 통찰하라.
        </p>
        {differences.map((d, i) => (
          <input
            key={i}
            value={d}
            onChange={(e) =>
              setDifferences((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
            }
            placeholder={`차이점 ${i + 1} · 예: Round 2는 받는 사람의 입장에서 작성되어 공감대 형성이 더 강함`}
            className="input-quest mb-2"
            maxLength={150}
          />
        ))}
      </HudPanel>
    </QuestShell>
  );
}

"use client";
import { useMemo, useRef, useState } from "react";
import { QuestShell } from "@/components/QuestShell";
import { HudPanel } from "@/components/HudPanel";
import { getQuest } from "@/lib/quests";
import { FINAL_REPORT_STRUCTURE } from "@/data/quest-data";
import { callChatAPI, callScoreAPI, computeFinalScore } from "@/lib/scoring";
import { useQuestStore } from "@/lib/store";
import type { ScoreBreakdown } from "@/lib/types";

type Msg = { role: "user" | "model"; text: string };

// FINAL · AI WORK WAY MASTER · 8 Way 통합 케이스
export default function FinalQuestPage() {
  const q = getQuest("FINAL")!;
  const recordAttempt = useQuestStore((s) => s.recordAttempt);
  const markFinal = useQuestStore((s) => s.markFinalCompleted);
  const startedAt = useState(Date.now())[0];
  const turnCountRef = useRef(0);

  const [chat, setChat] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [chatBusy, setChatBusy] = useState(false);

  const [report, setReport] = useState("");
  const [bestWays, setBestWays] = useState<string[]>([]);
  const [weakWay, setWeakWay] = useState("");
  const [thirtyDayPlan, setThirtyDayPlan] = useState("");
  const [busy, setBusy] = useState(false);
  const [scoreView, setScoreView] = useState<ScoreBreakdown | null>(null);

  const systemAuto = useMemo(() => {
    let pts = 0;
    pts += Math.min(30, Math.floor(report.trim().length / 30));
    pts += bestWays.length * 5;
    if (weakWay) pts += 10;
    if (thirtyDayPlan.trim().length >= 50) pts += 15;
    if (thirtyDayPlan.trim().length >= 150) pts += 10;
    pts += Math.min(20, turnCountRef.current * 5);
    return Math.min(100, pts);
  }, [report, bestWays, weakWay, thirtyDayPlan, turnCountRef.current]);

  async function sendChat() {
    if (!draft.trim()) return;
    const next: Msg[] = [...chat, { role: "user", text: draft }];
    setChat(next);
    setDraft("");
    setChatBusy(true);
    turnCountRef.current += 1;
    const { reply } = await callChatAPI(next);
    setChat([...next, { role: "model", text: reply }]);
    setChatBusy(false);
  }

  function toggleBestWay(w: string) {
    setBestWays((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : prev.length < 3 ? [...prev, w] : prev
    );
  }

  async function submit() {
    setBusy(true);
    try {
      const payload = {
        report,
        turnCount: turnCountRef.current,
        bestWays,
        weakWay,
        thirtyDayPlan,
      };
      const { score: g, rationale } = await callScoreAPI("FINAL", payload);
      const sb = computeFinalScore({
        systemAuto,
        geminiScore: g,
        passThreshold: q.passThreshold,
        rationale,
      });
      setScoreView(sb);
      recordAttempt("FINAL", sb, payload, Math.floor((Date.now() - startedAt) / 1000));
      markFinal();
    } finally {
      setBusy(false);
    }
  }

  const WAY_OPTIONS = ["Q1·몰입", "Q2·경험", "Q3·Agile", "Q4·프롬프트", "Q5·마침표", "Q6·공유", "Q7·출처", "Q8·책임"];

  return (
    <QuestShell quest={q} onSubmit={submit} busy={busy} scoreView={scoreView}>
      <HudPanel subtitle="REPORT STRUCTURE · 권장 리포트 구성">
        <div className="grid md:grid-cols-2 gap-3">
          {FINAL_REPORT_STRUCTURE.map((s, i) => (
            <div key={i} className="p-3 bg-ls-navy/60 border-l-2 border-ls-sky">
              <p className="text-xs text-ls-sky font-bold mb-1">{s.section}</p>
              <p className="text-xs text-ls-white/80">{s.hint}</p>
            </div>
          ))}
        </div>
      </HudPanel>

      <HudPanel
        subtitle="STEP 01 · Gemini와 협업"
        title="대화로 다듬어라 (턴 수가 점수에 반영됩니다)"
      >
        <p className="text-sm text-ls-dim mb-3">
          5턴 이상 대화하며 리포트를 다듬어라. AI를 비서로 활용하되, 최종 마침표는 당신이 찍는다.
        </p>
        <div className="max-h-60 overflow-y-auto mb-3 p-3 bg-ls-navy border border-ls-line rounded space-y-2">
          {chat.length === 0 ? (
            <p className="text-xs text-ls-dim text-center py-4">
              AI에게 "8 Way 통합 리포트를 어떻게 구성할까?" 같은 질문부터 시작해보세요.
            </p>
          ) : (
            chat.map((m, i) => (
              <div
                key={i}
                className={`text-xs whitespace-pre-wrap p-2 rounded ${
                  m.role === "user" ? "bg-ls-deepblue/30 ml-8" : "bg-ls-line/30 mr-8"
                }`}
              >
                <p className="text-[10px] text-ls-dim mb-1">{m.role === "user" ? "YOU" : "AI"}</p>
                {m.text}
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !chatBusy) sendChat();
            }}
            placeholder="AI에게 질문하거나 초안을 의뢰하세요..."
            className="input-quest"
          />
          <button onClick={sendChat} disabled={chatBusy || !draft.trim()} className="btn-quest whitespace-nowrap">
            {chatBusy ? "..." : "전송"}
          </button>
        </div>
        <p className="text-[10px] text-ls-dim mt-2">대화 턴: {turnCountRef.current}회</p>
      </HudPanel>

      <HudPanel subtitle="STEP 02 · 최종 리포트 본문" title="1page 종합 실천 리포트">
        <textarea
          value={report}
          onChange={(e) => setReport(e.target.value)}
          rows={14}
          maxLength={2500}
          placeholder="여기에 8 Way를 모두 녹여낸 1page 리포트를 작성하세요. AI와의 대화 결과를 참고하되, 본인의 문체와 통찰로 마무리하세요."
          className="input-quest font-mono text-sm"
        />
        <p className="text-[10px] text-ls-dim text-right">{report.length}/2500</p>
      </HudPanel>

      <HudPanel subtitle="STEP 03 · 자기평가" title="가장 잘한 Way 3개 + 부족한 Way 1개">
        <p className="text-sm text-ls-dim mb-2">가장 잘한 Way 3개 선택:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {WAY_OPTIONS.map((w) => (
            <button
              key={w}
              onClick={() => toggleBestWay(w)}
              className={`px-3 py-2 text-xs font-bold border rounded ${
                bestWays.includes(w)
                  ? "bg-ls-green/20 border-ls-green text-ls-mint"
                  : "border-ls-line text-ls-dim"
              }`}
            >
              {w}
            </button>
          ))}
        </div>
        <p className="text-sm text-ls-dim mb-2">가장 부족한 Way 1개:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {WAY_OPTIONS.map((w) => (
            <button
              key={w}
              onClick={() => setWeakWay(w)}
              className={`px-3 py-2 text-xs font-bold border rounded ${
                weakWay === w
                  ? "bg-ls-danger/20 border-ls-danger text-ls-danger"
                  : "border-ls-line text-ls-dim"
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </HudPanel>

      <HudPanel subtitle="STEP 04 · 30일 실천 계획" title="가장 부족한 Way를 어떻게 채울 것인가">
        <textarea
          value={thirtyDayPlan}
          onChange={(e) => setThirtyDayPlan(e.target.value)}
          rows={5}
          maxLength={600}
          placeholder="예) Week 1: Q7 SOURCE HUNTER 약점 보완 - 모든 AI 결과에 출처 표기 / Week 2: 동료 1명에게 검증 받기 / Week 3: 부서 회의에서 공유 / Week 4: 자체 출처 검증 가이드 1page 작성."
          className="input-quest"
        />
      </HudPanel>
    </QuestShell>
  );
}

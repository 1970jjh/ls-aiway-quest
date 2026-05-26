"use client";
import { useMemo, useState } from "react";
import { QuestShell } from "@/components/QuestShell";
import { HudPanel } from "@/components/HudPanel";
import { getQuest } from "@/lib/quests";
import { Q1_TASK_TYPES } from "@/data/quest-data";
import { callScoreAPI } from "@/lib/scoring";
import { computeFinalScore } from "@/lib/scoring";
import { useQuestStore } from "@/lib/store";
import type { ScoreBreakdown } from "@/lib/types";

// Q1 · FLOW SHIFTER · 단순 반복을 넘어, 몰입으로
export default function Q1Page() {
  const q = getQuest("Q1")!;
  const recordAttempt = useQuestStore((s) => s.recordAttempt);
  const startedAt = useState(Date.now())[0];

  const [tasks, setTasks] = useState([
    { label: "", category: "" },
    { label: "", category: "" },
    { label: "", category: "" },
    { label: "", category: "" },
    { label: "", category: "" },
  ]);
  const [savedHours, setSavedHours] = useState(0);
  const [commitment, setCommitment] = useState("");
  const [busy, setBusy] = useState(false);
  const [scoreView, setScoreView] = useState<ScoreBreakdown | null>(null);

  const systemAuto = useMemo(() => {
    let pts = 0;
    // 모든 업무에 라벨 + 카테고리 (각 12점 × 5 = 60)
    const filled = tasks.filter((t) => t.label.trim() && t.category).length;
    pts += filled * 12;
    // 절감 시간 입력 (10점)
    if (savedHours > 0) pts += 10;
    // 다짐 길이 + 구체성 (30점)
    if (commitment.trim().length >= 20) pts += 15;
    if (commitment.trim().length >= 50) pts += 15;
    return Math.min(100, pts);
  }, [tasks, savedHours, commitment]);

  function setTask(idx: number, patch: Partial<{ label: string; category: string }>) {
    setTasks((prev) => prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
  }

  async function submit() {
    setBusy(true);
    try {
      const payload = { tasks, savedHours, commitment };
      const { score: g, rationale } = await callScoreAPI("Q1", payload);
      const sb = computeFinalScore({
        systemAuto,
        geminiScore: g,
        passThreshold: q.passThreshold,
        rationale,
      });
      setScoreView(sb);
      recordAttempt(
        "Q1",
        sb,
        payload,
        Math.floor((Date.now() - startedAt) / 1000)
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <QuestShell quest={q} onSubmit={submit} busy={busy} scoreView={scoreView}>
      {/* STEP 1 — 업무 분류 */}
      <HudPanel subtitle="STEP 01 · 업무 분해하기" title="지난주 업무 5가지를 적고, 4단계로 분류하라">
        <p className="text-sm text-ls-dim mb-4">
          단순 반복은 AI에게, 몰입이 필요한 일은 사람에게. 그 경계를 정확히 짓는다.
        </p>
        <div className="space-y-3">
          {tasks.map((t, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 items-start">
              <input
                value={t.label}
                onChange={(e) => setTask(i, { label: e.target.value })}
                placeholder={`업무 ${i + 1} · 예) 주간 회의록 작성, 영업 보고서 양식 채우기...`}
                className="input-quest"
              />
              <div className="flex gap-1 flex-wrap">
                {Q1_TASK_TYPES.map((tt) => (
                  <button
                    key={tt.id}
                    onClick={() => setTask(i, { category: tt.id })}
                    className={`px-3 py-2 text-xs font-bold border rounded transition-all ${
                      t.category === tt.id
                        ? "bg-ls-deepblue border-ls-sky text-ls-sky"
                        : "bg-ls-navy border-ls-line text-ls-dim hover:border-ls-blue"
                    }`}
                    style={t.category === tt.id ? { boxShadow: `0 0 10px ${tt.color}55` } : {}}
                  >
                    {tt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-[10px] text-ls-dim">
          {Q1_TASK_TYPES.map((tt) => (
            <div key={tt.id} className="flex gap-1 items-start">
              <span style={{ color: tt.color }}>●</span>
              <span>
                <strong className="text-ls-white">{tt.label}</strong>
                <br />
                {tt.desc}
              </span>
            </div>
          ))}
        </div>
      </HudPanel>

      {/* STEP 2 — 절감 시간 */}
      <HudPanel subtitle="STEP 02 · 확보 가능한 시간 산출" title="AI 위임으로 절감 가능한 주당 시간은?">
        <p className="text-sm text-ls-dim mb-3">
          위에서 'AI 완전 대체' + 'AI 보조' 분류한 업무를 합산해 절감 가능한 시간을 정수로 적어라.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={savedHours || ""}
            onChange={(e) => setSavedHours(Number(e.target.value) || 0)}
            placeholder="예: 5"
            className="input-quest max-w-[120px] text-center text-2xl font-display"
            min={0}
            max={40}
          />
          <span className="text-ls-mint text-lg">시간 / 주</span>
        </div>
      </HudPanel>

      {/* STEP 3 — 재투입 다짐 */}
      <HudPanel
        subtitle="STEP 03 · 몰입의 시간으로"
        title="확보한 시간을 어디에 재투입할 것인가?"
      >
        <p className="text-sm text-ls-dim mb-3">
          단순 회수가 아니라 '재배치'다. 어떤 고부가가치 영역(창의·전략·관계·학습)에 그 시간을 쓸 것인지, 1~3줄로 다짐하라.
        </p>
        <textarea
          value={commitment}
          onChange={(e) => setCommitment(e.target.value)}
          rows={3}
          maxLength={300}
          placeholder="예) 절감한 주 5시간을 신규 고객사 영업 전략 수립과 후배 멘토링에 투입한다. 매주 금요일 30분은 다음 주 가설을 정리하는 몰입의 시간으로 확정."
          className="input-quest"
        />
        <p className="text-[10px] text-ls-dim text-right">{commitment.length}/300</p>
      </HudPanel>
    </QuestShell>
  );
}

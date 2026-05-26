"use client";
import { useMemo, useState } from "react";
import { QuestShell } from "@/components/QuestShell";
import { HudPanel } from "@/components/HudPanel";
import { getQuest } from "@/lib/quests";
import { Q3_EXAMPLE_SPRINTS } from "@/data/quest-data";
import { callScoreAPI, computeFinalScore } from "@/lib/scoring";
import { useQuestStore } from "@/lib/store";
import type { ScoreBreakdown } from "@/lib/types";

// Q3 · AGILE SPRINTER · AI 활용! Agile하게 도전한다
export default function Q3Page() {
  const q = getQuest("Q3")!;
  const recordAttempt = useQuestStore((s) => s.recordAttempt);
  const startedAt = useState(Date.now())[0];

  const [hypothesis, setHypothesis] = useState("");
  const [approach, setApproach] = useState("");
  const [successCriteria, setSuccessCriteria] = useState("");
  const [failurePlan, setFailurePlan] = useState("");
  const [busy, setBusy] = useState(false);
  const [scoreView, setScoreView] = useState<ScoreBreakdown | null>(null);

  const systemAuto = useMemo(() => {
    let pts = 0;
    [hypothesis, approach, successCriteria, failurePlan].forEach((s) => {
      if (s.trim().length >= 20) pts += 15;
      if (s.trim().length >= 60) pts += 10;
    });
    return Math.min(100, pts);
  }, [hypothesis, approach, successCriteria, failurePlan]);

  async function submit() {
    setBusy(true);
    try {
      const payload = { hypothesis, approach, successCriteria, failurePlan };
      const { score: g, rationale } = await callScoreAPI("Q3", payload);
      const sb = computeFinalScore({
        systemAuto,
        geminiScore: g,
        passThreshold: q.passThreshold,
        rationale,
      });
      setScoreView(sb);
      recordAttempt("Q3", sb, payload, Math.floor((Date.now() - startedAt) / 1000));
    } finally {
      setBusy(false);
    }
  }

  return (
    <QuestShell quest={q} onSubmit={submit} busy={busy} scoreView={scoreView}>
      <HudPanel subtitle="EXAMPLES · 작은 실험 예시">
        <p className="text-sm text-ls-dim mb-3">
          참고만 하고, 당신의 업무 맥락에 맞게 직접 설계하라.
        </p>
        <ul className="space-y-2">
          {Q3_EXAMPLE_SPRINTS.map((s, i) => (
            <li key={i} className="text-sm text-ls-white/80">
              {s}
            </li>
          ))}
        </ul>
      </HudPanel>

      <HudPanel subtitle="STEP 01 · 가설 정의" title="당신의 가설은 무엇인가?">
        <p className="text-sm text-ls-dim mb-3">
          "AI를 OOO에 쓰면 OOO이 OOO만큼 좋아질 것이다" 형태로 명확하게.
        </p>
        <textarea
          value={hypothesis}
          onChange={(e) => setHypothesis(e.target.value)}
          rows={3}
          maxLength={250}
          placeholder="예) Gemini로 주간 회의록을 자동 요약하면, 회의 후 정리 시간이 30분 → 5분으로 줄어들 것이다."
          className="input-quest"
        />
        <p className="text-[10px] text-ls-dim text-right">{hypothesis.length}/250</p>
      </HudPanel>

      <HudPanel subtitle="STEP 02 · 시도 방법" title="7일 안에 어떻게 시도할 것인가?">
        <textarea
          value={approach}
          onChange={(e) => setApproach(e.target.value)}
          rows={4}
          maxLength={400}
          placeholder="예) Day 1: 회의록 템플릿과 RBTFE 프롬프트 작성 / Day 2~4: 매 회의 후 AI 요약 3회 시도 / Day 5: 동료 1명에게 결과 검토 요청 / Day 6: 비교 분석 / Day 7: 결과 정리"
          className="input-quest"
        />
        <p className="text-[10px] text-ls-dim text-right">{approach.length}/400</p>
      </HudPanel>

      <HudPanel subtitle="STEP 03 · 성공/실패 기준" title="무엇을 보고 판단할 것인가?">
        <p className="text-sm text-ls-dim mb-3">
          측정 가능한 기준이어야 한다. 시간·횟수·만족도·정확도 등 숫자로 표현.
        </p>
        <textarea
          value={successCriteria}
          onChange={(e) => setSuccessCriteria(e.target.value)}
          rows={3}
          maxLength={300}
          placeholder="예) 성공: 회의록 작성 시간이 30분 → 10분 이하로 단축 + 동료 평가 4점 이상(5점 만점). 실패: 시간 단축 효과 없음 또는 정확도 부족으로 재작성 필요."
          className="input-quest"
        />
        <p className="text-[10px] text-ls-dim text-right">{successCriteria.length}/300</p>
      </HudPanel>

      <HudPanel subtitle="STEP 04 · 실패해도 배운다" title="실패 시 무엇을 학습할 것인가?">
        <p className="text-sm text-ls-dim mb-3">
          Agile의 본질 — 실패조차 자산이다. 실패 시나리오에서 얻을 학습 포인트를 명시하라.
        </p>
        <textarea
          value={failurePlan}
          onChange={(e) => setFailurePlan(e.target.value)}
          rows={3}
          maxLength={300}
          placeholder="예) 실패 시: ① AI 한계점 파악 (어떤 회의 유형이 어려운지) ② 프롬프트 개선 포인트 발견 ③ 다음 스프린트는 더 작은 단위로 재설계."
          className="input-quest"
        />
        <p className="text-[10px] text-ls-dim text-right">{failurePlan.length}/300</p>
      </HudPanel>
    </QuestShell>
  );
}

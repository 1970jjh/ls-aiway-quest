"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Chip, HudPanel, ProgressBar } from "@/components/HudPanel";
import { DIAGNOSE_QUESTIONS, SCALE_LABELS, calculateDiagnoseLevel } from "@/data/diagnose";
import { useDiagnoseStore } from "@/lib/diagnose-store";

export default function DiagnosePage() {
  const router = useRouter();
  const scores = useDiagnoseStore((s) => s.scores);
  const setScore = useDiagnoseStore((s) => s.setScore);
  const finish = useDiagnoseStore((s) => s.finishDiagnose);
  const completed = useDiagnoseStore((s) => s.completedAt);
  const [done, setDone] = useState(!!completed);

  const filled = scores.filter((v) => v > 0).length;
  const allFilled = filled === 8;
  const result = allFilled ? calculateDiagnoseLevel(scores) : null;

  function submit() {
    finish();
    setDone(true);
  }

  return (
    <main className="min-h-screen pb-24">
      <header className="border-b border-ls-line bg-ls-navy/85 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/quests/hub" className="text-xs text-ls-dim hover:text-ls-sky font-mono">
            ← QUEST HUB
          </Link>
          <div className="flex items-center gap-2">
            <Chip>SELF DIAGNOSIS</Chip>
            <Chip>{filled}/8 응답</Chip>
          </div>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 pt-12">
        {!done ? (
          <>
            <p className="text-xs uppercase tracking-[0.3em] text-ls-sky font-bold">
              STEP 0 · 출발선 진단
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-display font-bold mb-4">
              지금 당신은 AI Work Way를 어디까지 실천하고 있는가?
            </h1>
            <p className="text-ls-dim mb-8">
              8개 문항에 솔직하게 답하세요. 출발선을 알아야 도착선이 보입니다. <br />
              모든 답변은 본인 디바이스에만 저장되며, Quest 정복 후 변화를 비교합니다.
            </p>

            <HudPanel>
              <div className="space-y-6">
                {DIAGNOSE_QUESTIONS.map((q, i) => (
                  <div key={i} className="p-4 bg-ls-navy/60 border border-ls-line rounded">
                    <div className="flex items-start gap-2 mb-2">
                      <Chip variant={q.category.toLowerCase() as any}>WAY {q.wayId}</Chip>
                      <p className="text-sm font-bold flex-1">{q.question}</p>
                    </div>
                    <p className="text-xs text-ls-dim ml-1 mb-3">💡 {q.hint}</p>
                    <div className="grid grid-cols-5 gap-1">
                      {SCALE_LABELS.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => setScore(i, s.value)}
                          className={`px-2 py-2 text-[10px] font-bold border rounded transition-all ${
                            scores[i] === s.value
                              ? "border-ls-sky"
                              : "border-ls-line text-ls-dim hover:border-ls-blue"
                          }`}
                          style={
                            scores[i] === s.value ? { color: s.color, background: `${s.color}15` } : {}
                          }
                        >
                          <div className="text-lg font-display">{s.value}</div>
                          <div className="leading-tight">{s.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-ls-line">
                <ProgressBar value={filled} max={8} />
                <p className="mt-2 text-xs text-ls-dim text-right">
                  {filled} / 8 응답 — {allFilled ? "준비 완료!" : `${8 - filled}문항 남음`}
                </p>
                <button
                  onClick={submit}
                  disabled={!allFilled}
                  className="btn-quest mt-4 w-full"
                >
                  결과 보기 → Quest 정복 시작
                </button>
              </div>
            </HudPanel>
          </>
        ) : (
          result && (
            <>
              <p className="text-xs uppercase tracking-[0.3em] text-ls-sky font-bold">
                DIAGNOSIS RESULT · 출발선 진단 결과
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl font-display font-bold mb-6">
                당신의 현재 AI Work Way 수준
              </h1>

              <HudPanel className="bg-gradient-to-br from-ls-deepblue/30 to-ls-navy">
                <div className="text-center mb-6">
                  <p className="text-xs text-ls-sky uppercase tracking-wider">현재 레벨</p>
                  <h2 className="text-6xl font-display text-ls-sky glow-sky mt-2">
                    {result.level}
                  </h2>
                  <p className="text-ls-mint text-sm mt-2">{result.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-ls-navy border border-ls-line rounded">
                    <p className="text-xs text-ls-dim uppercase">총점</p>
                    <p className="text-4xl font-display text-ls-mint">{result.total}</p>
                    <p className="text-[10px] text-ls-dim">/ 40 만점</p>
                  </div>
                  <div className="text-center p-4 bg-ls-navy border border-ls-line rounded">
                    <p className="text-xs text-ls-dim uppercase">평균 점수</p>
                    <p className="text-4xl font-display text-ls-sky">{result.avg.toFixed(1)}</p>
                    <p className="text-[10px] text-ls-dim">/ 5.0 만점</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <p className="text-xs text-ls-sky font-bold">8 Way 영역별 점수</p>
                  {DIAGNOSE_QUESTIONS.map((q, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Chip variant={q.category.toLowerCase() as any}>{q.questId}</Chip>
                      <div className="flex-1">
                        <ProgressBar value={scores[i]} max={5} />
                      </div>
                      <span className="text-xs font-mono text-ls-sky w-8 text-right">
                        {scores[i]}/5
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => router.push("/quests/hub")}
                    className="btn-quest flex-1"
                  >
                    🚀 8 Quest 정복 시작
                  </button>
                  <button onClick={() => setDone(false)} className="btn-ghost">
                    🔄 다시 진단
                  </button>
                </div>
              </HudPanel>
            </>
          )
        )}
      </section>
    </main>
  );
}

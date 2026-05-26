"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Chip, HudPanel } from "@/components/HudPanel";
import { useQuestStore } from "@/lib/store";
import { useDiagnoseStore } from "@/lib/diagnose-store";
import { QUESTS } from "@/lib/quests";

const WAY_OPTIONS = QUESTS.filter((q) => q.id !== "FINAL").map((q) => ({
  id: q.id,
  label: `${q.id} · ${q.titleKo}`,
}));

export default function CommitPage() {
  const router = useRouter();
  const session = useQuestStore((s) => s.session);
  const setCommit = useDiagnoseStore((s) => s.setCommit);
  const finishCommit = useDiagnoseStore((s) => s.finishCommit);
  const commitment = useDiagnoseStore((s) => s.commitment);

  const [bestWay, setBestWay] = useState(commitment.bestWay);
  const [weakWay, setWeakWay] = useState(commitment.weakWay);
  const [actions, setActions] = useState<string[]>(
    commitment.actions.length === 3 ? commitment.actions : ["", "", ""]
  );
  const [declaration, setDeclaration] = useState(commitment.declaration);
  const [done, setDone] = useState(!!commitment.completedAt);

  function submit() {
    setCommit({ bestWay, weakWay, actions, declaration });
    finishCommit();
    setDone(true);
  }

  return (
    <main className="min-h-screen pb-24">
      <header className="border-b border-ls-line bg-ls-navy/85 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/result" className="text-xs text-ls-dim hover:text-ls-sky font-mono">
            ← RESULT
          </Link>
          <Chip>COMMITMENT · 실천 다짐</Chip>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 pt-12">
        {!done ? (
          <>
            <p className="text-xs uppercase tracking-[0.3em] text-ls-sky font-bold">
              FINAL STEP · 다짐의 시간
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-display font-bold mb-4">
              2.5시간의 학습을 일상의 습관으로
            </h1>
            <p className="text-ls-dim mb-8">
              가장 잘하는 영역을 자랑하고, 가장 부족한 영역에 30일 실천 액션 3가지를 약속하세요.<br />
              마지막으로 당신의 다짐 한 줄을 남깁니다.
            </p>

            <HudPanel subtitle="STEP 01 · 가장 잘하는 Way" title="자랑스러운 영역 1개">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {WAY_OPTIONS.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setBestWay(w.id)}
                    className={`px-3 py-2 text-xs text-left font-bold border rounded ${
                      bestWay === w.id
                        ? "bg-ls-green/20 border-ls-green text-ls-mint"
                        : "border-ls-line text-ls-dim"
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </HudPanel>

            <HudPanel subtitle="STEP 02 · 가장 부족한 Way" title="채워야 할 영역 1개">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {WAY_OPTIONS.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setWeakWay(w.id)}
                    className={`px-3 py-2 text-xs text-left font-bold border rounded ${
                      weakWay === w.id
                        ? "bg-ls-danger/20 border-ls-danger text-ls-danger"
                        : "border-ls-line text-ls-dim"
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </HudPanel>

            <HudPanel subtitle="STEP 03 · 30일 실천 액션" title="구체적 행동 3가지">
              <p className="text-sm text-ls-dim mb-3">
                추상적 다짐 X. 다음 30일 안에 측정 가능한 액션 3개를 적으세요.
              </p>
              {actions.map((a, i) => (
                <input
                  key={i}
                  value={a}
                  onChange={(e) =>
                    setActions((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
                  }
                  placeholder={
                    [
                      "예) Week 1: 매 회의 후 AI 회의록 자동화 시도 3회",
                      "예) Week 2: 부서 동료에게 R-B-T-F-E 프롬프트 1건 공유",
                      "예) Week 3~4: 자체 출처 검증 가이드 1page 작성",
                    ][i]
                  }
                  className="input-quest mb-2"
                  maxLength={150}
                />
              ))}
            </HudPanel>

            <HudPanel subtitle="STEP 04 · 다짐 한 줄" title="당신의 AI Work Way 선언">
              <textarea
                value={declaration}
                onChange={(e) => setDeclaration(e.target.value)}
                rows={3}
                maxLength={250}
                placeholder="예) 나는 AI를 파트너로, 책임은 나의 것으로. 매주 금요일 30분은 'AI Work Way 회고의 시간'으로 만든다. 함께 만든 LS의 약속, 손가락이 기억하게 하리라."
                className="input-quest"
              />
              <p className="text-[10px] text-ls-dim text-right">{declaration.length}/250</p>
            </HudPanel>

            <button
              onClick={submit}
              disabled={!bestWay || !weakWay || !actions.every((a) => a) || !declaration.trim()}
              className="btn-quest w-full mt-4"
            >
              📝 다짐 등록하기
            </button>
          </>
        ) : (
          <HudPanel className="bg-gradient-to-br from-ls-green/20 to-ls-navy text-center">
            <div className="py-8">
              <p className="text-xs text-ls-mint uppercase tracking-wider mb-2">
                COMMITMENT REGISTERED · 다짐 등록 완료
              </p>
              <h2 className="text-4xl font-display font-bold text-ls-mint glow-green mb-4">
                🎉 함께 만든 약속, 손가락이 기억할 것
              </h2>
              <p className="text-ls-white/85 mb-2">
                {session?.mode === "TEAM" ? session.crewName : session?.participantName}
              </p>
              <p className="text-xs text-ls-dim italic">{new Date().toLocaleString("ko-KR")}</p>
            </div>

            <div className="space-y-4 text-left">
              <div className="p-4 bg-ls-navy/60 border-l-2 border-ls-mint rounded">
                <p className="text-xs text-ls-mint font-bold mb-1">🏆 가장 잘하는 Way</p>
                <p className="text-sm">{bestWay}</p>
              </div>
              <div className="p-4 bg-ls-navy/60 border-l-2 border-ls-gold rounded">
                <p className="text-xs text-ls-gold font-bold mb-1">📌 30일 채울 Way</p>
                <p className="text-sm">{weakWay}</p>
              </div>
              <div className="p-4 bg-ls-navy/60 border-l-2 border-ls-sky rounded">
                <p className="text-xs text-ls-sky font-bold mb-2">📋 30일 실천 액션</p>
                <ul className="space-y-1 text-sm">
                  {actions.map((a, i) => (
                    <li key={i}>
                      <span className="text-ls-sky">{i + 1}.</span> {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-ls-deepblue/30 border-2 border-ls-sky rounded">
                <p className="text-xs text-ls-sky font-bold mb-2">✊ 나의 선언</p>
                <p className="text-sm italic">"{declaration}"</p>
              </div>
            </div>

            <div className="mt-8 flex gap-3 flex-wrap justify-center">
              <Link href="/result" className="btn-quest">
                📊 최종 결과 다시 보기
              </Link>
              <Link href="/" className="btn-ghost">
                🏠 홈으로
              </Link>
            </div>
          </HudPanel>
        )}
      </section>
    </main>
  );
}

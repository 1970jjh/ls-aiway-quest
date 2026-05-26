"use client";
import Image from "next/image";
import Link from "next/link";
import { useQuestStore } from "@/lib/store";
import { QUESTS, calculateRank, formatDuration } from "@/lib/quests";
import { Chip, HudPanel, ProgressBar } from "@/components/HudPanel";

export default function ResultPage() {
  const session = useQuestStore((s) => s.session);
  const progress = useQuestStore((s) => s.progress);
  const totalScore = useQuestStore((s) => s.getTotalScore());
  const completionTime = useQuestStore((s) => s.getCompletionTimeSec());
  const rankInfo = calculateRank(totalScore);

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="hud-panel p-8 text-center max-w-md">
          <h2 className="text-2xl font-display font-bold mb-3">세션이 없습니다</h2>
          <Link href="/setup" className="btn-quest">
            새 세션 시작
          </Link>
        </div>
      </main>
    );
  }

  const eightCleared = QUESTS.slice(0, 8).filter((q) => progress[q.id]?.firstClearedAt).length;
  const finalDone = !!progress["FINAL"]?.firstClearedAt;

  return (
    <main className="min-h-screen pb-24">
      {/* HERO */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image src="/images/final-master.jpg" alt="Result" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-ls-navy/30 to-ls-navy" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ls-sky font-bold">FINAL RESULT</p>
            <h1 className="mt-3 text-6xl md:text-8xl font-display font-bold">
              <span className="text-ls-sky glow-sky">
                {rankInfo.badge} {rankInfo.rank}
              </span>
            </h1>
            <p className="mt-2 text-ls-mint text-lg">{rankInfo.description}</p>
            <p className="mt-2 font-bold text-2xl">
              {session.mode === "TEAM" ? session.crewName : session.participantName}
            </p>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="max-w-5xl mx-auto px-4 -mt-12 relative z-10 mb-12">
        <HudPanel className="bg-gradient-to-br from-ls-deepblue/30 to-ls-navy">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-xs text-ls-dim uppercase">총점</p>
              <p className="text-6xl font-display text-ls-sky glow-sky">{totalScore}</p>
              <p className="text-xs text-ls-dim">/ 900 만점</p>
              <ProgressBar value={totalScore} max={900} />
            </div>
            <div>
              <p className="text-xs text-ls-dim uppercase">완주 시간</p>
              <p className="text-3xl font-display text-ls-mint mt-2">
                {completionTime > 0 ? formatDuration(completionTime) : "진행 중"}
              </p>
              <p className="text-xs text-ls-dim mt-1">
                {finalDone ? "🏁 FINAL 통과" : "FINAL 미통과"}
              </p>
            </div>
            <div>
              <p className="text-xs text-ls-dim uppercase">통과 Quest</p>
              <p className="text-3xl font-display text-ls-gold mt-2">
                {eightCleared} <span className="text-sm">/ 8</span>
              </p>
              <p className="text-xs text-ls-dim mt-1">
                + FINAL {finalDone ? "✓" : "—"}
              </p>
            </div>
          </div>
        </HudPanel>
      </section>

      {/* Quest별 상세 점수 */}
      <section className="max-w-5xl mx-auto px-4 mb-12">
        <h2 className="text-2xl font-display font-bold mb-6">QUEST별 상세 점수</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {QUESTS.map((q) => {
            const p = progress[q.id];
            const cleared = !!p?.firstClearedAt;
            return (
              <div
                key={q.id}
                className={`hud-panel p-4 ${cleared ? "border-ls-green" : "border-ls-line opacity-70"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex gap-2 items-center mb-1">
                      <Chip>{q.id}</Chip>
                      {cleared ? (
                        <Chip variant="pass">PASS</Chip>
                      ) : (
                        <Chip variant="fail">미통과</Chip>
                      )}
                      {(p?.attempts.length ?? 0) > 1 && (
                        <Chip variant="retry">🔄 {p.attempts.length}회</Chip>
                      )}
                    </div>
                    <p className="text-sm font-bold">{q.title}</p>
                    <p className="text-xs text-ls-dim">{q.titleKo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-display text-ls-sky">{p?.bestScore ?? 0}</p>
                    <p className="text-[10px] text-ls-dim">/ 100</p>
                  </div>
                </div>
                <ProgressBar value={p?.bestScore ?? 0} max={100} />
                {p?.bestAttempt?.score.rationale && (
                  <p className="mt-3 text-xs text-ls-dim italic line-clamp-3">
                    💬 {p.bestAttempt.score.rationale}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 다짐 진입 */}
      {finalDone && (
        <section className="max-w-3xl mx-auto px-4 mb-8">
          <Link
            href="/commit"
            className="hud-panel block p-6 border-ls-mint text-center hover:border-ls-sky transition-colors bg-gradient-to-br from-ls-green/15 to-ls-navy"
          >
            <p className="text-xs text-ls-mint font-bold tracking-[0.3em] uppercase mb-2">
              FINAL STEP · COMMITMENT
            </p>
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-2">
              ✊ 다짐 — 일상의 습관으로 옮기기
            </h3>
            <p className="text-sm text-ls-dim mb-4">
              가장 잘하는 Way를 자랑하고, 부족한 Way에 30일 실천 액션 3가지를 약속하세요.
            </p>
            <span className="text-ls-sky font-bold">📝 다짐 작성하기 →</span>
          </Link>
        </section>
      )}

      {/* 액션 */}
      <section className="max-w-3xl mx-auto px-4 mb-16 text-center">
        <HudPanel>
          <h3 className="text-xl font-display font-bold mb-3">아직 도전할 수 있습니다</h3>
          <p className="text-sm text-ls-dim mb-6">
            시간 내라면 부족한 Quest를 재도전해 점수를 더 올릴 수 있습니다.
            <br />
            한 번 더 도전해 등급을 올려보세요.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/quests/hub" className="btn-quest">
              🔄 Quest Hub로 돌아가기
            </Link>
            <Link href="/" className="btn-ghost">
              🏠 홈으로
            </Link>
          </div>
        </HudPanel>
      </section>

      <footer className="border-t border-ls-line py-6 text-center text-xs text-ls-dim">
        LS Cable & System · AI Work Way Quest · 함께 만든, 함께 지키는 LS의 약속
      </footer>
    </main>
  );
}

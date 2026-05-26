"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuestStore, getElapsedMin } from "@/lib/store";
import { QUESTS, CATEGORY_LABEL, calculateRank, formatDuration } from "@/lib/quests";
import { Chip, HudPanel, ProgressBar } from "@/components/HudPanel";

export default function QuestHubPage() {
  const session = useQuestStore((s) => s.session);
  const startedAt = useQuestStore((s) => s.startedAt);
  const progress = useQuestStore((s) => s.progress);
  const totalScore = useQuestStore((s) => s.getTotalScore());

  const [elapsedMin, setElapsedMin] = useState(0);
  useEffect(() => {
    const tick = () => setElapsedMin(getElapsedMin(startedAt));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [startedAt]);

  const remainingMin = session ? Math.max(0, session.totalDurationMinutes - elapsedMin) : 0;
  const allEightCleared = QUESTS.slice(0, 8).every((q) => progress[q.id]?.firstClearedAt);
  const finalUnlocked = allEightCleared || progress["FINAL"]?.unlocked;

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="hud-panel p-8 max-w-md text-center">
          <h2 className="text-2xl font-display font-bold mb-3">세션이 시작되지 않았습니다</h2>
          <p className="text-ls-dim mb-6">먼저 세션 코드를 등록해주세요.</p>
          <Link href="/setup" className="btn-quest">
            세션 시작하기
          </Link>
        </div>
      </main>
    );
  }

  const rankInfo = totalScore > 0 ? calculateRank(totalScore) : null;

  return (
    <main className="min-h-screen pb-24">
      <header className="border-b border-ls-line bg-ls-navy/85 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <Link href="/" className="text-xs text-ls-dim hover:text-ls-sky font-mono">
            ← HOME
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <Chip>{session.mode === "SOLO" ? "👤 개인전" : "👥 팀전"}</Chip>
            <Chip>{session.sessionCode}</Chip>
            <Chip>
              {session.mode === "TEAM" ? session.crewName : session.participantName}
            </Chip>
          </div>
        </div>
      </header>

      {/* 자가진단 안내 */}
      <section className="max-w-6xl mx-auto px-4 pt-8 mb-4">
        <Link
          href="/diagnose"
          className="hud-panel block p-4 border-ls-gold hover:border-ls-sky transition-colors"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] text-ls-gold font-bold tracking-[0.3em] uppercase">
                ⭐ STEP 0 — 출발선 진단 (선택)
              </p>
              <p className="text-base font-bold mt-1">
                Quest 시작 전, AI Work Way 자가진단 8문항으로 본인 현재 수준 파악
              </p>
            </div>
            <span className="text-ls-sky font-bold">진단하기 →</span>
          </div>
        </Link>
      </section>

      {/* 진행 현황 패널 */}
      <section className="max-w-6xl mx-auto px-4 mb-8">
        <HudPanel subtitle="VOYAGE STATUS · 진행 현황">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] uppercase text-ls-dim">총점 (베스트 합산)</p>
              <p className="text-4xl font-display text-ls-sky glow-sky">{totalScore}</p>
              <p className="text-[10px] text-ls-dim">/ 900 최대</p>
              <ProgressBar value={totalScore} max={900} />
            </div>
            <div>
              <p className="text-[10px] uppercase text-ls-dim">경과 시간</p>
              <p className="text-4xl font-display text-ls-mint">{elapsedMin}분</p>
              <p className="text-[10px] text-ls-dim">/ 권장 {session.totalDurationMinutes}분</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-ls-dim">잔여 시간</p>
              <p className={`text-4xl font-display ${remainingMin < 30 ? "text-ls-danger" : "text-ls-gold"}`}>
                {remainingMin}분
              </p>
              <p className="text-[10px] text-ls-dim">시간 내 재도전 가능</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-ls-dim">현재 등급</p>
              <p className="text-2xl font-display text-ls-sky">
                {rankInfo ? `${rankInfo.badge} ${rankInfo.rank}` : "—"}
              </p>
              <p className="text-[10px] text-ls-dim">{rankInfo?.description ?? "아직 점수 없음"}</p>
            </div>
          </div>
        </HudPanel>
      </section>

      {/* TERRITORY별 Quest 목록 */}
      <section className="max-w-6xl mx-auto px-4 mb-10">
        {["MINDSET", "ACTION", "STANDARD"].map((category) => {
          const quests = QUESTS.filter((q) => q.category === category);
          return (
            <div key={category} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Chip variant={category.toLowerCase() as any}>{category}</Chip>
                <h2 className="text-xl font-display font-bold">{CATEGORY_LABEL[category]}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quests.map((q) => {
                  const p = progress[q.id];
                  const cleared = !!p?.firstClearedAt;
                  const best = p?.bestScore ?? 0;
                  const attempts = p?.attempts.length ?? 0;
                  const locked = !p?.unlocked;
                  return (
                    <Link
                      key={q.id}
                      href={locked ? "#" : q.href}
                      onClick={(e) => {
                        if (locked) e.preventDefault();
                      }}
                      className={`hud-panel p-0 overflow-hidden block group transition-all ${
                        locked ? "opacity-40 cursor-not-allowed" : ""
                      } ${cleared ? "border-ls-green" : ""}`}
                    >
                      <div className="relative aspect-[20/9] overflow-hidden">
                        <Image src={q.image} alt={q.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-ls-navy/90 via-ls-navy/40 to-transparent" />
                        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
                          <Chip>{q.id}</Chip>
                          {cleared && <Chip variant="pass">✓ PASS</Chip>}
                          {attempts > 0 && !cleared && <Chip variant="fail">✗ {attempts}회 시도</Chip>}
                          {attempts > 0 && cleared && <Chip variant="retry">🔄 {attempts}회 시도</Chip>}
                        </div>
                        <div className="absolute bottom-3 left-4 right-4">
                          <h3 className="text-xl font-display font-bold">{q.title}</h3>
                          <p className="text-xs text-ls-mint">"{q.titleKo}"</p>
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <p className="text-xs text-ls-dim">베스트 점수</p>
                          <p className={`text-2xl font-display ${cleared ? "text-ls-sky" : "text-ls-dim"}`}>
                            {best} <span className="text-xs text-ls-dim">/ 100</span>
                          </p>
                        </div>
                        <div className="text-right">
                          {locked ? (
                            <p className="text-xs text-ls-dim">🔒 잠김</p>
                          ) : (
                            <p className="text-xs text-ls-sky font-bold">
                              {cleared ? "🔄 재도전" : "▶ 도전"} →
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* FINAL BOSS */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Chip variant="action">FINAL</Chip>
          <h2 className="text-xl font-display font-bold">FINAL BOSS · 8 Way 통합 케이스</h2>
        </div>
        <Link
          href={finalUnlocked ? "/quests/final" : "#"}
          onClick={(e) => {
            if (!finalUnlocked) e.preventDefault();
          }}
          className={`hud-panel block p-0 overflow-hidden group ${
            finalUnlocked ? "border-ls-sky" : "opacity-50 cursor-not-allowed"
          }`}
        >
          <div className="relative aspect-[24/8] overflow-hidden">
            <Image src="/images/final-master.jpg" alt="FINAL" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-ls-navy/95 via-ls-navy/50 to-transparent" />
            <div className="absolute inset-0 flex items-center px-8">
              <div>
                <p className="text-[10px] text-ls-sky font-bold tracking-[0.3em]">FINAL BOSS</p>
                <h3 className="mt-2 text-3xl font-display font-bold">AI WORK WAY MASTER</h3>
                <p className="text-ls-mint">8 Way 통합 · 본부장 보고 30분 챌린지</p>
                {!finalUnlocked && (
                  <p className="mt-3 text-sm text-ls-gold">
                    🔒 Q1~Q8을 모두 PASS하면 잠금 해제됩니다.
                  </p>
                )}
                {finalUnlocked && (
                  <p className="mt-3 text-sm text-ls-sky font-bold">▶ 도전 →</p>
                )}
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* 종료 옵션 */}
      <section className="max-w-6xl mx-auto px-4 mb-16 text-center">
        <p className="text-sm text-ls-dim mb-3">
          모든 Quest를 마쳤다면 최종 결과를 확인하세요. 시간 내라면 언제든 재도전할 수 있습니다.
        </p>
        <Link href="/result" className="btn-ghost">
          📊 현재까지의 결과 보기
        </Link>
      </section>
    </main>
  );
}

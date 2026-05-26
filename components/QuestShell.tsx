"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Chip, HudPanel, ProgressBar } from "./HudPanel";
import type { QuestMeta, ScoreBreakdown } from "@/lib/types";
import { QUESTS, CATEGORY_LABEL } from "@/lib/quests";
import { useQuestStore } from "@/lib/store";

export function QuestShell({
  quest,
  children,
  onSubmit,
  submitLabel = "제출 · 평가받기",
  busy,
  scoreView,
  startedAtRef,
}: {
  quest: QuestMeta;
  children: React.ReactNode;
  onSubmit?: () => Promise<void> | void;
  submitLabel?: string;
  busy?: boolean;
  scoreView?: ScoreBreakdown | null;
  startedAtRef?: React.MutableRefObject<number>;
}) {
  const router = useRouter();
  const session = useQuestStore((s) => s.session);
  const progress = useQuestStore((s) => s.progress[quest.id]);
  const idx = QUESTS.findIndex((q) => q.id === quest.id);
  const next = QUESTS[idx + 1];

  // 타이머 (전체 잔여 시간)
  const [elapsedMin, setElapsedMin] = useState(0);
  useEffect(() => {
    if (!session?.startedAt) return;
    const tick = () => setElapsedMin(Math.floor((Date.now() - (session.startedAt ?? 0)) / 60000));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [session?.startedAt]);

  const remainingMin = session ? Math.max(0, session.totalDurationMinutes - elapsedMin) : 0;
  const isRetry = (progress?.attempts.length ?? 0) > 0;

  return (
    <main className="min-h-screen pb-24">
      {/* HEADER */}
      <header className="border-b border-ls-line bg-ls-navy/85 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/quests/hub" className="text-xs text-ls-dim hover:text-ls-sky font-mono">
              ← QUEST HUB
            </Link>
            <Chip>{quest.id}</Chip>
            {quest.category && (
              <Chip variant={quest.category.toLowerCase() as any}>{quest.category}</Chip>
            )}
            <span className="text-[10px] text-ls-dim font-mono hidden md:inline">
              {quest.titleKo}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isRetry && <Chip variant="retry">RETRY · 시도 {progress.attempts.length}회</Chip>}
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-wider text-ls-dim">잔여 시간</p>
              <p className="text-sm font-mono text-ls-sky timer-glow">
                {String(Math.floor(remainingMin / 60)).padStart(2, "0")}:
                {String(remainingMin % 60).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative h-[36vh] min-h-[280px] overflow-hidden">
        <Image src={quest.image} alt={quest.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-ls-navy/30 via-ls-navy/55 to-ls-navy" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto px-4 w-full pb-8">
            <p className="text-xs uppercase tracking-[0.4em] text-ls-sky font-bold">
              {quest.id} · {quest.category ? CATEGORY_LABEL[quest.category] : "FINAL BOSS"}
            </p>
            <h1 className="mt-3 text-3xl md:text-5xl font-display font-bold leading-tight">
              {quest.title}
            </h1>
            <p className="mt-2 text-ls-sky/80 font-bold text-lg">{quest.titleKo}</p>
            <p className="mt-2 text-sm text-ls-dim italic">"{quest.wayLabel}"</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip>{quest.durationMin}분</Chip>
              <Chip>{quest.type === "ANALYTICAL" ? "🧠 분석" : "🎬 체험"}</Chip>
              <Chip>PASS ≥ {quest.passThreshold}점</Chip>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO + CONTENT */}
      <section className="max-w-5xl mx-auto px-4 pt-8 space-y-6">
        {/* 상황 브리핑 */}
        <HudPanel subtitle="SITUATION BRIEFING · 상황 브리핑" title="당신의 미션">
          <p className="text-sm md:text-base text-ls-white/90 leading-relaxed whitespace-pre-line">
            {quest.intro}
          </p>
          <div className="mt-4 p-3 bg-ls-deepblue/20 border-l-2 border-ls-sky">
            <p className="text-xs text-ls-sky font-bold mb-1">🎯 학습 목표</p>
            <p className="text-sm text-ls-white/90">{quest.goal}</p>
          </div>
        </HudPanel>

        {children}

        {/* 제출 + 점수 */}
        {!scoreView ? (
          <HudPanel subtitle="SUBMIT · 평가받기">
            <p className="text-sm text-ls-dim mb-4">
              제출 시 시스템 자동 점수와 Gemini AI 채점이 합산되어{" "}
              <strong className="text-ls-sky">최종 점수</strong>가 산출됩니다.
              <br />
              <strong className="text-ls-mint">{quest.passThreshold}점 이상</strong>이면 PASS — 미달
              시에도 재도전이 가능합니다.
            </p>
            <button onClick={onSubmit} disabled={busy} className="btn-quest w-full md:w-auto">
              {busy ? "AI 채점 중..." : submitLabel}
            </button>
          </HudPanel>
        ) : (
          <ScoreCard
            quest={quest}
            score={scoreView}
            onRetry={() => {
              // 페이지 리로드해서 새 시도
              window.location.reload();
            }}
            onNext={() => {
              if (quest.id === "FINAL") {
                router.push("/result");
              } else if (next) {
                router.push(next.href);
              } else {
                router.push("/quests/hub");
              }
            }}
            isBest={
              progress?.bestScore === scoreView.finalScore &&
              progress?.attempts[progress.attempts.length - 1]?.score.finalScore ===
                scoreView.finalScore
            }
          />
        )}
      </section>
    </main>
  );
}

function ScoreCard({
  quest,
  score,
  onRetry,
  onNext,
  isBest,
}: {
  quest: QuestMeta;
  score: ScoreBreakdown;
  onRetry: () => void;
  onNext: () => void;
  isBest: boolean;
}) {
  const passed = score.passStatus === "PASS";
  return (
    <div className={`hud-panel p-6 md:p-8 ${passed ? "border-ls-green" : "border-ls-danger"}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className={passed ? "badge-pass" : "badge-fail"}>
          {passed ? "✓ PASS" : "✗ RETRY 추천"}
        </span>
        {isBest && <span className="badge-retry">🏆 BEST SCORE</span>}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-ls-navy border border-ls-line rounded">
          <p className="text-[10px] text-ls-dim uppercase">시스템 자동</p>
          <p className="text-3xl font-display text-ls-mint">{score.systemAuto}</p>
          <p className="text-[9px] text-ls-dim">/ 100</p>
        </div>
        <div className="text-center p-4 bg-ls-navy border border-ls-line rounded">
          <p className="text-[10px] text-ls-dim uppercase">Gemini AI</p>
          <p className="text-3xl font-display text-ls-sky">{score.geminiScore}</p>
          <p className="text-[9px] text-ls-dim">/ 100</p>
        </div>
        <div className="text-center p-4 bg-ls-deepblue/30 border-2 border-ls-sky rounded">
          <p className="text-[10px] text-ls-sky uppercase font-bold">최종 점수</p>
          <p className="text-4xl font-display text-ls-sky glow-sky">{score.finalScore}</p>
          <p className="text-[9px] text-ls-dim">/ 100 · PASS {quest.passThreshold}</p>
        </div>
      </div>

      {score.rationale && (
        <div className="p-4 bg-ls-navy/60 border-l-2 border-ls-sky mb-6">
          <p className="text-xs text-ls-sky font-bold mb-2">AI 피드백</p>
          <p className="text-sm text-ls-white/90 whitespace-pre-line">{score.rationale}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button onClick={onRetry} className="btn-ghost">
          🔄 재도전 (점수 갱신 가능)
        </button>
        <button onClick={onNext} className="btn-quest">
          {quest.id === "FINAL" ? "🏆 최종 결과 보기" : "다음 Quest →"}
        </button>
      </div>

      <p className="mt-4 text-xs text-ls-dim italic">
        💡 같은 Quest를 여러 번 시도할 수 있으며, <strong className="text-ls-sky">최고 점수</strong>가 자동으로 기록됩니다.
        앞 단계 Quest도 시간 내라면 재도전 가능합니다.
      </p>
    </div>
  );
}

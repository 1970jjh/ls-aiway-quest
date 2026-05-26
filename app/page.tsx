"use client";
import Image from "next/image";
import Link from "next/link";
import { QUESTS, CATEGORY_LABEL } from "@/lib/quests";
import { Chip } from "@/components/HudPanel";

// LS Cable & System — AI Work Way Quest · HOME
export default function HomePage() {
  return (
    <main className="min-h-screen relative">
      {/* HERO */}
      <section className="relative h-[100vh] min-h-[640px] overflow-hidden">
        <div className="absolute inset-0 hero-breath">
          <Image
            src="/images/00-hero.jpeg"
            alt="AI Work Way Quest"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="hero-glow-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-ls-navy/30 via-ls-navy/55 to-ls-navy" />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <p className="text-xs uppercase tracking-[0.4em] text-ls-sky font-bold">
              LS CABLE & SYSTEM · PEOPLE & CULTURE
            </p>
            <h1 className="mt-4 text-5xl md:text-7xl font-display font-bold leading-none">
              AI WORK WAY<br />
              <span className="text-ls-sky glow-sky">QUEST</span>
            </h1>
            <p className="mt-3 text-ls-mint font-bold text-xl">
              Greater Value Together — 함께 만든, 함께 지키는 LS의 약속
            </p>
            <p className="mt-6 max-w-2xl text-lg text-ls-white/85 leading-relaxed">
              LS Cable & System만의 'AI를 활용 일하는 방식'을 8개 퀘스트로 체화한다.<br />
              혼자 또는 동료와 함께, 2~3시간 동안 AI 시대의 일하는 방식을 손가락이 기억하게 만들어라.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Chip>2.5시간 1회 완결</Chip>
              <Chip>8 QUESTS + FINAL BOSS</Chip>
              <Chip>개인 / 팀 선택</Chip>
              <Chip>무제한 재도전</Chip>
              <Chip>Gemini AI 채점</Chip>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/setup" className="btn-quest text-lg">
                ▶ Quest 시작하기
              </Link>
              <Link href="/quests/hub" className="btn-ghost text-lg">
                📋 Quest 목록 보기
              </Link>
              <Link href="/proposal" className="btn-ghost text-lg">
                📄 제안서 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* OPENING VIDEO */}
      <section className="max-w-6xl mx-auto px-4 -mt-32 relative z-10 mb-12">
        <div className="hud-panel p-6 md:p-8 backdrop-blur-md">
          <p className="text-[10px] tracking-[0.3em] text-ls-sky font-bold uppercase">
            OPENING VIDEO · 오프닝 영상
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-display font-bold">
            "AI WORK WAY VOYAGE" · 시작하기 전, 함께 보세요
          </h2>
          <div className="mt-5 aspect-video bg-ls-navy border border-ls-line rounded-sm overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/TXxOND2bTXg?rel=0&modestbranding=1&playsinline=1"
              title="LS AI Work Way Quest · Opening"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <p className="mt-3 text-xs text-ls-dim italic text-center">
            🎬 LS Cable & System · AI Work Way Quest 오프닝 영상 · Gemini TTS + moviepy 제작
          </p>
        </div>
      </section>

      {/* PROGRAM OVERVIEW */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="hud-panel p-6 md:p-8 backdrop-blur-md">
          <p className="text-[10px] tracking-[0.3em] text-ls-sky font-bold uppercase">
            PROGRAM OVERVIEW · 프로그램 소개
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-display font-bold mb-6">
            WHY · WHAT · HOW · WHAT IF
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {OVERVIEW_ITEMS.map((it) => (
              <div
                key={it.tag}
                className="relative bg-ls-navy border border-ls-line p-5 rounded-sm overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ background: it.color }}
                />
                <div className="flex items-baseline gap-3 mb-3">
                  <span
                    className="font-display font-bold text-2xl tracking-wider"
                    style={{ color: it.color }}
                  >
                    {it.tag}
                  </span>
                  <span className="text-xs text-ls-dim">{it.kr}</span>
                </div>
                <h4 className="text-base md:text-lg font-bold mb-2 leading-snug">{it.title}</h4>
                <p className="text-sm text-ls-white/85 leading-relaxed">{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI WORK WAY 8 */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-ls-sky font-bold">
            8 QUESTS · LS AI WORK WAY 8개 행동약속
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-display font-bold">
            8개의 영토 · 8개의 행동약속
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUESTS.filter((q) => q.id !== "FINAL").map((q) => (
            <Link
              key={q.id}
              href={q.href}
              className="hud-panel p-0 overflow-hidden block group transition-colors"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={q.image}
                  alt={q.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ls-navy/95 via-ls-navy/30 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1">
                  <Chip variant={q.category?.toLowerCase() as any}>{q.category}</Chip>
                </div>
                <div className="absolute top-3 right-3"><Chip>{q.id}</Chip></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-[10px] text-ls-sky font-bold tracking-wider mb-0.5">
                    WAY #{q.wayId}
                  </p>
                  <h3 className="text-base font-bold leading-tight">{q.title}</h3>
                  <p className="text-[11px] text-ls-mint mt-1 line-clamp-1">"{q.titleKo}"</p>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-ls-white/85 line-clamp-2">{q.shortDesc}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-[10px] text-ls-dim">⏱ {q.durationMin}분</span>
                  <span className="text-xs text-ls-sky font-bold group-hover:translate-x-1 transition-transform">
                    진입 →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* FINAL BOSS */}
        <div className="mt-6">
          <Link
            href={QUESTS.find((q) => q.id === "FINAL")!.href}
            className="hud-panel block p-0 overflow-hidden group border-ls-sky"
          >
            <div className="relative aspect-[24/8] overflow-hidden">
              <Image
                src="/images/final-master.jpg"
                alt="FINAL"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ls-navy/95 via-ls-navy/40 to-ls-navy/20" />
              <div className="absolute inset-0 flex items-center px-8">
                <div>
                  <p className="text-[10px] text-ls-sky font-bold tracking-[0.3em]">FINAL BOSS</p>
                  <h3 className="mt-2 text-3xl md:text-4xl font-display font-bold">
                    AI WORK WAY MASTER
                  </h3>
                  <p className="mt-1 text-ls-mint text-lg">
                    8 Way 통합 · 내일 9시 본부장 보고
                  </p>
                  <p className="mt-3 text-sm text-ls-white/80 max-w-xl">
                    30분 안에 8개 Way를 모두 녹여낸 1page 종합 실천 리포트를 작성하라.
                    AI와 협업하되, 마침표는 당신이 찍어라.
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <div className="hud-panel p-10 text-center bg-gradient-to-br from-ls-deepblue/40 to-ls-navy">
          <p className="text-[10px] tracking-[0.3em] text-ls-sky font-bold uppercase mb-2">
            READY?
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
            이제, 당신의 AI Work Way Voyage가 시작된다
          </h2>
          <p className="text-ls-dim mb-8">
            8개의 Quest · 무제한 재도전 · AI 채점 · 개인전/팀전 모두 가능
          </p>
          <Link href="/setup" className="btn-quest text-lg">
            🚀 세션 코드 입력하고 시작하기
          </Link>
        </div>
      </section>

      <footer className="border-t border-ls-line py-6 text-center text-xs text-ls-dim">
        LS Cable & System · AI Work Way Quest · powered by Gemini AI · designed for People & Culture Team
      </footer>
    </main>
  );
}

const OVERVIEW_ITEMS = [
  {
    tag: "WHY",
    kr: "왜 필요한가",
    title: "AI Work Way 선포 → '아는 것'을 '하는 것'으로",
    body: "LS Cable & System만의 'AI를 활용 일하는 방식' 8개 행동약속이 선포되었습니다. 이제는 일상 업무의 미묘한 순간마다 8 Ways를 판단 기준으로 작동시켜야 합니다.",
    color: "#9b6dff",
  },
  {
    tag: "WHAT",
    kr: "무엇을 담았는가",
    title: "2.5시간 · 8 Quest + FINAL Boss · 무제한 재도전",
    body: "8개 Way를 8개의 미개척 영토로 형상화했습니다. 분석/체험을 교차하는 핑퐁 구조로, 손가락이 기억할 때까지 도전·실패·재도전할 수 있습니다.",
    color: "#FFC940",
  },
  {
    tag: "HOW",
    kr: "어떻게 작동하는가",
    title: "AI 채점 + PASS/FAIL + 베스트 점수 기록",
    body: "각 Quest는 시스템 자동 채점과 Gemini AI 평가가 합산됩니다. PASS 기준 미달 시 무제한 재도전이 가능하며, 최고 점수가 자동으로 기록됩니다.",
    color: "#3DD9FF",
  },
  {
    tag: "WHAT IF",
    kr: "그래서 무엇이 달라지는가",
    title: "2.5시간 후, 손가락이 AI Work Way를 기억한다",
    body: "단순 강의가 아닌 체험·체화 중심. 종료 1주 후 행동 의도 4.0+ / 1개월 후 적어도 1개 Way를 실제 업무에 적용하는 비율 65%+를 목표합니다.",
    color: "#62B645",
  },
];

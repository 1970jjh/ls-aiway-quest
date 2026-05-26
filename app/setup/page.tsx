"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuestStore } from "@/lib/store";
import { Chip, HudPanel } from "@/components/HudPanel";

export default function SetupPage() {
  const router = useRouter();
  const start = useQuestStore((s) => s.startSession);

  const [mode, setMode] = useState<"SOLO" | "TEAM">("SOLO");
  const [sessionCode, setSessionCode] = useState("LSAW-001");
  const [name, setName] = useState("");
  const [crewName, setCrewName] = useState("");
  const [memberLine, setMemberLine] = useState("");
  const [err, setErr] = useState("");

  function handleStart() {
    if (!/^LSAW-\d{3}$/.test(sessionCode)) {
      setErr("⚠ 세션 코드는 LSAW-001 ~ LSAW-010 형식입니다.");
      return;
    }
    if (!name.trim()) {
      setErr("⚠ 본인 이름을 입력해주세요.");
      return;
    }
    if (mode === "TEAM" && !crewName.trim()) {
      setErr("⚠ Crew(팀) 이름을 입력해주세요.");
      return;
    }
    const members =
      mode === "TEAM"
        ? memberLine
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((n, i) => ({ id: `m_${i}`, name: n }))
        : undefined;

    start({
      mode,
      sessionCode,
      participantName: name.trim(),
      crewName: mode === "TEAM" ? crewName.trim() : undefined,
      members,
    });
    router.push("/quests/hub");
  }

  return (
    <main className="min-h-screen pb-24">
      <header className="border-b border-ls-line bg-ls-navy/85 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xs text-ls-dim hover:text-ls-sky font-mono">
            ← LS AI WORK WAY QUEST
          </Link>
          <Chip>SESSION SETUP</Chip>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-4 pt-12">
        <p className="text-xs uppercase tracking-[0.3em] text-ls-sky font-bold">
          STEP 1 · 진행 모드 선택
        </p>
        <h1 className="mt-2 text-3xl md:text-4xl font-display font-bold mb-4">
          개인전 · 팀전 — 당신은 어떻게 모험할 것인가?
        </h1>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <ModeCard
            selected={mode === "SOLO"}
            onClick={() => setMode("SOLO")}
            title="👤 개인전 SOLO"
            features={[
              "혼자 진행 — 본인 페이스로 자유 접속",
              "완주 시간 + 점수 기록",
              "전직원 리더보드 등재 가능",
              "권장 시간: 2~2.5시간",
            ]}
            highlight="개인이 원할 때 참여하고 완주 시간·점수가 기록됩니다"
          />
          <ModeCard
            selected={mode === "TEAM"}
            onClick={() => setMode("TEAM")}
            title="👥 팀전 TEAM"
            features={[
              "Crew 4~6인 함께 진행",
              "태블릿/노트북 1대로 토의 + 입력",
              "차수 내 Crew별 점수 경쟁",
              "권장 시간: 2.5~3시간",
            ]}
            highlight="여러 사람이 토론·합의해서 함께 답안을 만듭니다"
          />
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-ls-sky font-bold">
          STEP 2 · 세션 정보 입력
        </p>
        <h2 className="mt-2 text-2xl md:text-3xl font-display font-bold mb-4">
          세션 코드와 이름을 입력하세요
        </h2>

        <HudPanel>
          <div className="grid gap-5">
            <div>
              <label className="text-xs uppercase tracking-wider text-ls-dim">
                세션 코드 (LSAW-001 ~ LSAW-010 · 운영진 안내)
              </label>
              <input
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                className="input-quest mt-2 font-mono"
                placeholder="LSAW-001"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-ls-dim">
                {mode === "SOLO" ? "본인 이름" : "Crew 대표자 이름"}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-quest mt-2"
                placeholder={mode === "SOLO" ? "예: 김경호" : "예: 김경호 (Crew 대표)"}
              />
            </div>

            {mode === "TEAM" && (
              <>
                <div>
                  <label className="text-xs uppercase tracking-wider text-ls-dim">
                    Crew(팀) 이름
                  </label>
                  <input
                    value={crewName}
                    onChange={(e) => setCrewName(e.target.value)}
                    className="input-quest mt-2"
                    placeholder="예: 피플앤컬처 1팀"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-ls-dim">
                    Crew 구성원 (쉼표 구분 · 본인 외)
                  </label>
                  <input
                    value={memberLine}
                    onChange={(e) => setMemberLine(e.target.value)}
                    className="input-quest mt-2 text-sm"
                    placeholder="예: 이수민, 박지훈, 김다영"
                  />
                </div>
              </>
            )}

            {err && (
              <div className="p-3 bg-ls-danger/15 border-l-2 border-ls-danger text-xs text-ls-danger">
                {err}
              </div>
            )}

            <button onClick={handleStart} className="btn-quest mt-2">
              🚀 시작하기 — Quest Hub으로
            </button>
            <p className="text-xs text-ls-dim text-center mt-2">
              💡 시작 시점부터 완주 시간이 기록됩니다. 중간 새로고침은 가능하나, '리셋'은 모든 진행을 초기화합니다.
            </p>
          </div>
        </HudPanel>
      </section>
    </main>
  );
}

function ModeCard({
  selected,
  onClick,
  title,
  features,
  highlight,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  features: string[];
  highlight: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`hud-panel p-6 text-left transition-all ${
        selected
          ? "border-ls-sky bg-ls-deepblue/30 ring-2 ring-ls-sky/40"
          : "border-ls-line hover:border-ls-blue"
      }`}
    >
      <h3 className="text-2xl font-display font-bold mb-3">{title}</h3>
      <ul className="space-y-2 mb-4">
        {features.map((f, i) => (
          <li key={i} className="text-sm text-ls-white/85 flex gap-2">
            <span className="text-ls-sky">▸</span>
            {f}
          </li>
        ))}
      </ul>
      <p className="text-xs text-ls-mint italic border-t border-ls-line pt-3">💡 {highlight}</p>
      {selected && (
        <div className="mt-3 text-xs text-ls-sky font-bold flex items-center gap-1">
          ✓ 선택됨
        </div>
      )}
    </button>
  );
}

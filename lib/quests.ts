import type { QuestMeta } from "./types";

// ============================================================
// LS Cable & System — AI Work Way 8 Quests
// 함께 만든 LS의 약속을 체화하는 8개 퀘스트 + FINAL BOSS
// ============================================================

export const QUESTS: QuestMeta[] = [
  // ─────────────── TERRITORY 1: MINDSET ───────────────
  {
    id: "Q1",
    wayId: 1,
    category: "MINDSET",
    type: "ANALYTICAL",
    title: "FLOW SHIFTER",
    titleKo: "단순 반복을 넘어, 몰입으로",
    wayLabel: "반복적인 업무는 AI에게 위임하고, 확보된 시간은 창의적 사고와 고부가가치 업무에 집중합니다.",
    shortDesc: "내 1주 업무를 분해 → AI 위임 가능 시간 확보 → 몰입 영역으로 전환",
    durationMin: 12,
    image: "/images/q1-flow-shifter.jpg",
    intro:
      "지난 주 당신의 업무 일지를 펼친다. 어디까지가 AI에게 맡길 단순 반복인가? 어디부터가 당신의 몰입이 만드는 가치인가? 둘 사이를 정확히 가르고, 확보 가능한 '몰입 시간'을 손에 쥐어보자.",
    goal: "반복 업무를 AI에 위임하고, 확보한 시간을 고부가가치 영역으로 재배치하는 사고 훈련",
    passThreshold: 60,
    href: "/quests/q1",
  },
  {
    id: "Q2",
    wayId: 2,
    category: "MINDSET",
    type: "EXPERIENCE",
    title: "VALUE BLENDER",
    titleKo: "경험을 더해, 가치를 완성한다",
    wayLabel: "AI가 그리는 밑그림에 우리의 경험과 전문성을 더해 대체 불가능한 성과를 창출합니다.",
    shortDesc: "Gemini 초안 + 내 현장 경험 = 대체불가 결과물 만들기",
    durationMin: 15,
    image: "/images/q2-value-blender.jpg",
    intro:
      "AI는 빠르게 80점짜리 초안을 만든다. 그러나 '대체 불가'를 만드는 마지막 20점은 당신의 현장 경험과 LS만의 맥락에서 나온다. AI 초안 위에 당신만의 통찰을 덧입혀라.",
    goal: "AI 결과물에 개인의 경험·전문성을 결합해 대체불가 가치를 만드는 협업 패턴 체득",
    passThreshold: 60,
    href: "/quests/q2",
  },

  // ─────────────── TERRITORY 2: ACTION ───────────────
  {
    id: "Q3",
    wayId: 3,
    category: "ACTION",
    type: "ANALYTICAL",
    title: "AGILE SPRINTER",
    titleKo: "AI 활용! Agile하게 도전한다",
    wayLabel: "AI 활용에 정답은 없다는 생각으로, 완벽함보다는 빠른 시도와 실패를 통해 '애자일(Agile)'하게 도전합니다.",
    shortDesc: "1주 안에 끝낼 'AI 작은 실험' 설계 — 가설/시도/실패허용/배운점",
    durationMin: 15,
    image: "/images/q3-agile-sprinter.jpg",
    intro:
      "완벽한 계획은 늦다. 1주 안에 끝낼 수 있는 AI 활용 '작은 실험' 하나를 설계하라. 가설은 무엇이고, 어떻게 시도하고, 실패를 어떻게 학습으로 바꿀 것인가?",
    goal: "AI를 두려워하지 않고 작게·빠르게 시도하는 Agile 마인드셋 형성",
    passThreshold: 65,
    href: "/quests/q3",
  },
  {
    id: "Q4",
    wayId: 4,
    category: "ACTION",
    type: "EXPERIENCE",
    title: "PROMPT MASTER",
    titleKo: "상세한 지시가 압도적 차이를 만든다",
    wayLabel: "역할 부여, 배경 설명, 지시사항, 출력 포맷, 예시 등을 포함한 상세하고 명확한 디렉션으로 AI 활용을 극대화합니다.",
    shortDesc: "같은 과제 · 두 번의 프롬프트 · 압도적 차이를 직접 체감",
    durationMin: 18,
    image: "/images/q4-prompt-master.jpg",
    intro:
      "같은 AI에게 같은 과제를 두 번 시킨다. 한 번은 막연하게, 한 번은 R-B-T-F-E 프레임으로 상세하게. 두 결과물의 차이가 곧 '상세한 지시의 힘'이다.",
    goal: "RBTFE(역할-배경-지시-포맷-예시) 프레임으로 프롬프트를 작성하는 실전 역량",
    passThreshold: 70,
    href: "/quests/q4",
  },
  {
    id: "Q5",
    wayId: 5,
    category: "ACTION",
    type: "ANALYTICAL",
    title: "HUMAN STAMP",
    titleKo: "AI로 가속하고 사람이 마침표를 찍는다",
    wayLabel: "아이디어와 구성은 AI로 빠르게 구체화하고, 핵심 논리와 최종 메시지는 사람의 통찰(Insight)로 마무리합니다.",
    shortDesc: "AI 결과물에서 '사람의 마침표가 반드시 필요한 3지점' 찾기",
    durationMin: 12,
    image: "/images/q5-human-stamp.jpg",
    intro:
      "AI가 만든 보고서 초안 한 페이지가 책상 위에 있다. 그대로 제출할 수는 없다. 어디에 '사람의 마침표'가 필요한가? 통찰·맥락·판단의 자리를 정확히 짚어내라.",
    goal: "AI 결과물의 한계를 식별하고 인간 통찰로 완성도를 올리는 분별력 훈련",
    passThreshold: 60,
    href: "/quests/q5",
  },
  {
    id: "Q6",
    wayId: 6,
    category: "ACTION",
    type: "EXPERIENCE",
    title: "PRACTICE BANK",
    titleKo: "Best Practice는 개인기가 아닌 조직의 힘",
    wayLabel: "AI 활용 우수 사례를 지속적으로 적극 공유하여, 개인의 노하우를 조직의 자산으로 내재화합니다.",
    shortDesc: "나의 AI 우수사례 1건 등록 + 동료 사례 3건 평가 → 조직 자산화",
    durationMin: 15,
    image: "/images/q6-practice-bank.jpg",
    intro:
      "당신이 지난 한 달간 AI를 써서 만든 '작은 자랑거리' 하나를 LS의 Practice Bank에 적금하라. 그리고 동료가 적금한 사례 3건을 평가하라. 개인의 노하우가 조직의 자산이 되는 순간이다.",
    goal: "AI 활용 노하우의 공유·기록·평가를 통해 조직 학습 사이클을 작동시키는 경험",
    passThreshold: 65,
    href: "/quests/q6",
  },

  // ─────────────── TERRITORY 3: STANDARD ───────────────
  {
    id: "Q7",
    wayId: 7,
    category: "STANDARD",
    type: "ANALYTICAL",
    title: "SOURCE HUNTER",
    titleKo: "데이터의 생명은 정확한 출처에서 나온다",
    wayLabel: "외부 정보를 활용할 때는 명확한 출처(Source)와 근거를 남겨, 언제든 사후 검증이 가능하도록 합니다.",
    shortDesc: "AI 생성 진술 4건 중 1건은 환각(가짜) — 출처 추적·반박·검증 리포트",
    durationMin: 15,
    image: "/images/q7-source-hunter.jpg",
    intro:
      "AI가 LS 신사업 관련 인사이트 4건을 생성했다. 그중 1건은 환각(hallucination)이다. 출처를 추적하고, 의심하고, 반박하고, 검증 리포트를 남겨라. 데이터의 생명은 정확한 출처에서 나온다.",
    goal: "AI 산출물의 환각·편향을 의심하고 출처 검증 습관을 체화",
    passThreshold: 70,
    href: "/quests/q7",
  },
  {
    id: "Q8",
    wayId: 8,
    category: "STANDARD",
    type: "EXPERIENCE",
    title: "FINAL OWNER",
    titleKo: "결과물의 최종 책임자는 '나'다",
    wayLabel: "AI는 파트너일 뿐, 모든 결과물에 대한 팩트 체크 및 최종 책임은 전적으로 나에게 있습니다.",
    shortDesc: "AI 결과물 팩트체크 + 5가지 위험 체크리스트 + 책임 서명",
    durationMin: 13,
    image: "/images/q8-final-owner.jpg",
    intro:
      "내일 9시. 본부장 책상에 올라갈 AI 결과물 한 부가 당신 손에 있다. 보내기 전, 5가지를 체크하고, 마지막으로 당신의 서명을 남겨라. AI는 파트너일 뿐, 책임은 전적으로 당신의 것이다.",
    goal: "AI 결과물의 팩트체크·위험 점검·최종 책임자로서의 자세를 행동으로 학습",
    passThreshold: 65,
    href: "/quests/q8",
  },

  // ─────────────── FINAL BOSS ───────────────
  {
    id: "FINAL",
    type: "EXPERIENCE",
    title: "AI WORK WAY MASTER",
    titleKo: "8 Ways 통합 케이스 — 내일 9시 본부장 보고",
    wayLabel: "8개 행동약속을 통합 적용하는 종합 케이스",
    shortDesc: "8 Way를 모두 녹여낸 1page 종합 실천 리포트 작성",
    durationMin: 30,
    image: "/images/final-master.jpg",
    intro:
      "본부장이 내일 9시에 묻는다. '우리 부서는 AI Work Way 8을 어떻게 실천하고 있는가?' 당신은 30분 안에, 8개 Way를 모두 녹여낸 1page 종합 실천 리포트를 답해야 한다. AI와 협업하되, 마침표는 당신이 찍어라.",
    goal: "8개 Way를 통합 사고로 적용해 실전 산출물을 만드는 마스터 케이스",
    passThreshold: 70,
    href: "/quests/final",
  },
];

export function getQuest(id: string): QuestMeta | undefined {
  return QUESTS.find((q) => q.id === id.toUpperCase());
}

export const CATEGORY_LABEL: Record<string, string> = {
  MINDSET: "TERRITORY 1 · MINDSET (마인드셋)",
  ACTION: "TERRITORY 2 · ACTION (실천)",
  STANDARD: "TERRITORY 3 · STANDARD (기준)",
};

export const CATEGORY_COLOR: Record<string, string> = {
  MINDSET: "#9b6dff",
  ACTION: "#3DD9FF",
  STANDARD: "#62B645",
};

// 등급 산정
export function calculateRank(totalScore: number): {
  rank: "AI ROOKIE" | "AI COLLABORATOR" | "AI ARCHITECT" | "AI PIONEER";
  badge: string;
  description: string;
} {
  // 최대 점수: 8 Quests × 100 + FINAL × 100 = 900
  if (totalScore >= 810) {
    return {
      rank: "AI PIONEER",
      badge: "🏆",
      description: "AI 시대를 선도하는 LS의 개척자",
    };
  }
  if (totalScore >= 630) {
    return {
      rank: "AI ARCHITECT",
      badge: "🎖️",
      description: "AI를 설계하는 전문가",
    };
  }
  if (totalScore >= 450) {
    return {
      rank: "AI COLLABORATOR",
      badge: "🤝",
      description: "AI와 협업하는 동료",
    };
  }
  return {
    rank: "AI ROOKIE",
    badge: "🌱",
    description: "첫 걸음을 뗀 신입",
  };
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}시간 ${m}분 ${s}초`;
  return `${m}분 ${s}초`;
}

/**
 * LS Cable & System — AI Work Way Quest
 * 자가진단 8문항 (Quest 진입 전, 현재 수준 측정)
 */

export interface DiagnoseQuestion {
  wayId: number;
  questId: string;        // Q1 ~ Q8
  category: "MINDSET" | "ACTION" | "STANDARD";
  question: string;
  hint: string;
}

export const DIAGNOSE_QUESTIONS: DiagnoseQuestion[] = [
  {
    wayId: 1,
    questId: "Q1",
    category: "MINDSET",
    question: "나는 반복 업무를 AI에 위임하고, 확보된 시간을 고부가가치 업무에 쓰고 있다.",
    hint: "회의록·요약·자료취합 등을 AI에 맡기고 있는가?",
  },
  {
    wayId: 2,
    questId: "Q2",
    category: "MINDSET",
    question: "나는 AI 결과물에 내 경험과 전문성을 더해 대체불가 결과를 만든다.",
    hint: "AI 초안을 그대로 쓰지 않고 LS 현장 맥락을 더하는가?",
  },
  {
    wayId: 3,
    questId: "Q3",
    category: "ACTION",
    question: "나는 AI 활용에 정답이 없다는 마음으로 작게 빠르게 시도한다.",
    hint: "완벽함을 기다리지 않고 1주 이내 작은 실험을 해본 적이 있는가?",
  },
  {
    wayId: 4,
    questId: "Q4",
    category: "ACTION",
    question: "나는 AI에 지시할 때 역할·배경·지시·포맷·예시(R-B-T-F-E)를 명확히 한다.",
    hint: "막연한 한 줄 지시 대신 5요소가 담긴 프롬프트를 쓰는가?",
  },
  {
    wayId: 5,
    questId: "Q5",
    category: "ACTION",
    question: "나는 AI로 가속한 결과물의 핵심 논리·메시지에 마침표를 직접 찍는다.",
    hint: "AI 결과물에 내 통찰·맥락·판단을 더해 완성하는가?",
  },
  {
    wayId: 6,
    questId: "Q6",
    category: "ACTION",
    question: "나는 나만의 AI 활용 노하우를 동료와 적극 공유하고 있다.",
    hint: "본인 노하우를 조직에 기여하고, 동료 사례를 배우는가?",
  },
  {
    wayId: 7,
    questId: "Q7",
    category: "STANDARD",
    question: "나는 AI 결과물의 출처를 검증하고, 사후 검증이 가능하도록 기록한다.",
    hint: "환각·편향을 의심하고 출처를 추적하는가?",
  },
  {
    wayId: 8,
    questId: "Q8",
    category: "STANDARD",
    question: "나는 AI는 파트너일 뿐, 최종 결과물의 책임은 나에게 있다고 행동한다.",
    hint: "팩트체크 후 내 이름으로 책임지고 산출물을 제출하는가?",
  },
];

export const SCALE_LABELS = [
  { value: 1, label: "전혀 그렇지 않다", color: "#FF5577" },
  { value: 2, label: "그렇지 않다", color: "#FFC940" },
  { value: 3, label: "보통이다", color: "#8FA3C7" },
  { value: 4, label: "그렇다", color: "#3DD9FF" },
  { value: 5, label: "매우 그렇다", color: "#62B645" },
];

export function calculateDiagnoseLevel(scores: number[]): {
  total: number;
  avg: number;
  level: "초기" | "탐색" | "성장" | "숙련" | "선도";
  description: string;
} {
  const total = scores.reduce((s, v) => s + v, 0);
  const avg = total / scores.length;
  let level: any, description: string;
  if (avg >= 4.5) {
    level = "선도";
    description = "이미 AI Work Way의 본질을 손가락이 기억하고 있습니다. Quest로 정련하세요.";
  } else if (avg >= 3.5) {
    level = "숙련";
    description = "대부분의 영역에서 자신감을 가지고 AI를 활용 중입니다. 부족한 영역을 Quest로 채우세요.";
  } else if (avg >= 2.5) {
    level = "성장";
    description = "AI 활용의 윤곽이 잡혀 있습니다. Quest로 깊이를 더하세요.";
  } else if (avg >= 1.5) {
    level = "탐색";
    description = "AI 활용을 시작했지만 체계가 필요합니다. 8 Quest로 본격적으로 다져보세요.";
  } else {
    level = "초기";
    description = "AI Work Way의 첫 발을 떼는 단계입니다. 8 Quest가 안내가 됩니다.";
  }
  return { total, avg, level, description };
}

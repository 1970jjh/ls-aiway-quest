import { NextResponse } from "next/server";
import { geminiJsonScore } from "@/lib/gemini";

export const runtime = "nodejs";

// ============================================================
// LS AI Work Way Quest — AI 채점 라우터
// 8 Quest + FINAL 각 평가 프롬프트
// ============================================================

const PROMPTS: Record<string, (p: any) => string> = {
  // Q1 · FLOW SHIFTER
  Q1: (p) => `당신은 LS Cable & System의 AI Work Way 평가관입니다.
Way #1 "단순 반복을 넘어, 몰입으로" — 반복업무는 AI에 위임, 확보된 시간은 고부가가치 영역으로.

[참여자 응답]
- 분류한 업무 (각 업무 - 분류): ${(p.tasks ?? []).map((t: any) => `${t.label} → ${t.category}`).join(" / ")}
- 확보 가능한 주당 시간: ${p.savedHours}시간
- 그 시간 재투입 다짐: ${p.commitment}

[평가 기준]
1. 분류의 정확성 (30점): 단순 반복 vs 몰입 필요 업무를 명확히 구분했는가
2. 시간 산출의 합리성 (20점): 절감 시간이 현실적이고 구체적인가
3. 재투입 다짐의 가치 (50점): 확보 시간을 진정 고부가가치(창의/전략/관계)에 쓰겠다는 구체적 다짐인가

JSON으로만 답변: {"score": 0~100 정수, "rationale": "한국어 2~3문장 평가 사유"}`,

  // Q2 · VALUE BLENDER
  Q2: (p) => `LS Cable & System AI Work Way #2 "경험을 더해, 가치를 완성한다" 평가관입니다.
AI 초안 위에 사용자의 경험·전문성을 더한 결과물을 평가합니다.

[원본 AI 초안 주제]: ${p.topic}
[사용자가 더한 경험/맥락]: ${p.additions}
[최종 결과물]: ${p.finalText}

[평가 기준]
1. 경험·전문성 추가의 구체성 (40점): LS만의 맥락·현장 사례·고유 경험이 명확히 반영되었는가
2. 대체불가성 (30점): 다른 누구도 이 결과를 만들 수 없을 만큼 본인 색깔이 살아있는가
3. 완성도 (30점): AI 초안의 80점이 100점으로 올라갔는가

JSON: {"score": 0~100, "rationale": "한국어 평가 2~3문장"}`,

  // Q3 · AGILE SPRINTER
  Q3: (p) => `LS AI Work Way #3 "AI 활용! Agile하게 도전한다" 평가관.
7일 안에 끝낼 작은 AI 실험 설계를 평가합니다.

[가설]: ${p.hypothesis}
[시도 방법]: ${p.approach}
[성공/실패 판단 기준]: ${p.successCriteria}
[실패 시 학습 계획]: ${p.failurePlan}

[평가 기준]
1. 작고 빠른 실험성 (30점): 7일 안에 정말 끝낼 수 있는 작은 단위인가
2. 가설의 구체성 (25점): 가설이 검증 가능하고 측정 가능한가
3. 실패 허용 (25점): 실패해도 배울 수 있게 설계되었는가
4. AI 활용의 실전성 (20점): AI를 진짜 도구로 쓰는 설계인가

JSON: {"score": 0~100, "rationale": "한국어 2~3문장"}`,

  // Q4 · PROMPT MASTER
  Q4: (p) => `LS AI Work Way #4 "상세한 지시가 압도적 차이를 만든다" 평가관.
R-B-T-F-E 프롬프트 프레임 적용 결과를 평가합니다.

[과제]: ${p.task}
[Role]: ${p.role}
[Background]: ${p.background}
[Task]: ${p.taskDetail}
[Format]: ${p.format}
[Example]: ${p.example}
[학습자가 도출한 차이점 3가지]: ${(p.differences ?? []).join(" / ")}

[평가 기준]
1. RBTFE 5요소 작성 충실도 (50점): 5개 항목이 모두 구체적이고 의미있는가
2. 차이점 분석의 통찰 (50점): 막연한 지시 vs 상세 지시의 본질적 차이를 통찰력 있게 짚었는가

JSON: {"score": 0~100, "rationale": "한국어 2~3문장"}`,

  // Q5 · HUMAN STAMP
  Q5: (p) => `LS AI Work Way #5 "AI로 가속하고 사람이 마침표를 찍는다" 평가관.
AI 초안에서 '사람의 마침표가 필요한 3지점'을 식별하고 채워넣은 결과를 평가합니다.

[식별한 3지점]:
1. ${p.stamps?.[0]?.type} — ${p.stamps?.[0]?.location}: ${p.stamps?.[0]?.insight}
2. ${p.stamps?.[1]?.type} — ${p.stamps?.[1]?.location}: ${p.stamps?.[1]?.insight}
3. ${p.stamps?.[2]?.type} — ${p.stamps?.[2]?.location}: ${p.stamps?.[2]?.insight}

[평가 기준]
1. 식별의 정확성 (40점): 3지점이 정말 사람 마침표가 필요한 곳인가 (팩트체크/맥락/통찰 중 적절히 분포)
2. 인사이트의 깊이 (40점): 추가한 통찰이 AI가 만들 수 없는 사람의 가치인가
3. 균형 (20점): 3유형(팩트/맥락/통찰)을 골고루 식별했는가

JSON: {"score": 0~100, "rationale": "한국어 2~3문장"}`,

  // Q6 · PRACTICE BANK
  Q6: (p) => `LS AI Work Way #6 "Best Practice는 개인기가 아닌 조직의 힘" 평가관.
AI 활용 우수사례 등록 + 동료 평가의 품질을 채점합니다.

[등록한 본인 사례]
제목: ${p.title}
적용 영역: ${p.area}
구체적 방법: ${p.method}
효과: ${p.impact}
[동료 사례 3건에 대한 별점·코멘트 품질 요약]: ${p.peerReviews}

[평가 기준]
1. 본인 사례의 재현 가능성 (40점): 다른 동료가 따라할 수 있을 만큼 구체적인가
2. 효과의 구체성 (30점): "주 N시간 절감/품질 N% 향상" 같은 측정값이 있는가
3. 동료 평가의 성실성 (30점): 단순 별점이 아닌 의미있는 피드백을 남겼는가

JSON: {"score": 0~100, "rationale": "한국어 2~3문장"}`,

  // Q7 · SOURCE HUNTER
  Q7: (p) => `LS AI Work Way #7 "데이터의 생명은 정확한 출처에서 나온다" 평가관.
AI 진술 4건에 대한 출처 검증 결과를 평가합니다.

[참여자 분류]:
${(p.classifications ?? [])
  .map((c: any) => `- ${c.id}: ${c.judgment} (사유: ${c.reason || "?"})`)
  .join("\n")}
[참여자가 식별한 가짜 진술 ID]: ${p.fakeId}
[검증 리포트]: ${p.report}

정답: STMT-B가 환각/가짜.

[평가 기준]
1. 가짜 식별 정확성 (40점): STMT-B를 정확히 가짜로 식별했는가 (정답이면 +40, 오답이면 0)
2. 분류 사유의 논리성 (30점): 신뢰/의심/반박 판단 사유가 합리적인가
3. 검증 리포트의 품질 (30점): 출처 검증 방법이 구체적이고 사후 검증 가능한 형태인가

JSON: {"score": 0~100, "rationale": "한국어 2~3문장"}`,

  // Q8 · FINAL OWNER
  Q8: (p) => `LS AI Work Way #8 "결과물의 최종 책임자는 '나'다" 평가관.
체크리스트 통과 + 책임 선언문을 평가합니다.

[체크리스트 통과율]: ${p.checklistPassed}/5 항목
[책임 선언문]: ${p.declaration}

[평가 기준]
1. 체크리스트 완수율 (40점): 5개 모두 체크해야 만점
2. 책임 선언문의 구체성 (35점): 'AI 결과물에 대한 나의 책임'이 추상적 다짐이 아닌 구체적 행동 선언인가
3. 진정성 (25점): 단순 형식이 아닌 진심이 담긴 선언인가

JSON: {"score": 0~100, "rationale": "한국어 2~3문장"}`,

  // FINAL · AI WORK WAY MASTER
  FINAL: (p) => `LS Cable & System AI Work Way MASTER 평가관.
8개 Way를 모두 녹여낸 종합 실천 리포트를 평가합니다.

[제출 리포트 전문]:
${p.report}
[Gemini와의 대화 턴 수]: ${p.turnCount}
[가장 잘 실천한 Way]: ${(p.bestWays ?? []).join(", ")}
[가장 부족한 Way]: ${p.weakWay}
[향후 30일 실천 계획]: ${p.thirtyDayPlan}

[평가 기준]
1. 8 Way 통합 사고 (40점): 보고서 안에 8개 Way의 흔적이 모두 자연스럽게 녹아있는가
2. 실천 가능성 (25점): 30일 계획이 추상적 다짐이 아닌 실행 가능한 액션인가
3. AI 협업 능력 (15점): Gemini와의 협업 흔적(대화 턴수, 정제 과정)이 보이는가
4. 본인 통찰 (20점): AI가 만든 게 아니라 본인의 사고가 마침표 찍은 흔적이 있는가

JSON: {"score": 0~100, "rationale": "한국어 3~4문장"}`,
};

export async function POST(req: Request) {
  try {
    const { questId, payload } = await req.json();
    const promptFn = PROMPTS[questId?.toUpperCase()];
    if (!promptFn) {
      return NextResponse.json({ score: 50, rationale: "알 수 없는 Quest ID" }, { status: 400 });
    }
    const prompt = promptFn(payload);
    const { score, rationale } = await geminiJsonScore(prompt);
    return NextResponse.json({ score, rationale });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { score: 50, rationale: `채점 오류: ${e?.message ?? "unknown"}` },
      { status: 500 }
    );
  }
}

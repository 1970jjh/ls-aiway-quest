# LS Cable & System — AI Work Way Quest

LS Cable & System의 "함께 만든, 함께 지키는 AI Work Way 8" 행동약속을
8개의 Quest로 체화하는 게이미피케이션 학습 플랫폼.

## 핵심 사양

- **단위 차수**: 2.5시간 1회 완결 × 10차수 기준 (24~30명/차수)
- **참여 모드**: 👤 개인전 (SOLO) / 👥 팀전 (TEAM 4~6인) — 선택형
- **콘텐츠**: 8 Quest (Q1~Q8) + FINAL BOSS — AI Work Way 8개 행동약속 1:1 매핑
- **평가**: 시스템 자동 채점 (40%) + Gemini AI 채점 (60%) → PASS/FAIL 판정
- **재도전**: 무제한 — 시간 내라면 어떤 Quest든 재도전 가능, 베스트 점수 자동 기록
- **AI 모델**: `gemini-2.5-flash` (채점+대화) / `gemini-3.1-flash-image-preview` (이미지 사전 생성)

## AI Work Way 8개 행동약속 → 8 Quest 매핑

| # | Way | Quest | 유형 |
|---|-----|-------|------|
| 1 | Mindset · 단순 반복을 넘어, 몰입으로 | Q1 FLOW SHIFTER | 분석 |
| 2 | Mindset · 경험을 더해, 가치를 완성한다 | Q2 VALUE BLENDER | 체험 |
| 3 | Action · AI 활용! Agile하게 도전한다 | Q3 AGILE SPRINTER | 분석 |
| 4 | Action · 상세한 지시가 압도적 차이를 만든다 | Q4 PROMPT MASTER | 체험 |
| 5 | Action · AI로 가속하고 사람이 마침표를 찍는다 | Q5 HUMAN STAMP | 분석 |
| 6 | Action · Best Practice는 개인기가 아닌 조직의 힘 | Q6 PRACTICE BANK | 체험 |
| 7 | Standard · 데이터의 생명은 정확한 출처에서 | Q7 SOURCE HUNTER | 분석 |
| 8 | Standard · 결과물의 최종 책임자는 '나'다 | Q8 FINAL OWNER | 체험 |
|   | 8 Way 통합 케이스 | FINAL · AI WORK WAY MASTER | 종합 |

## 디렉토리 구조

```
ls-aiway-quest/
├── app/
│   ├── page.tsx                # HOME (히어로 + 8 Quest 갤러리)
│   ├── setup/                  # 모드/세션 코드 등록
│   ├── quests/
│   │   ├── hub/                # 진행 현황 + 8 Quest 진입
│   │   ├── q1/ ~ q8/           # 8개 Quest
│   │   └── final/              # FINAL BOSS
│   ├── result/                 # 최종 결과 + 등급
│   └── api/
│       ├── score/              # Gemini AI 채점
│       └── chat/               # Quest 4·FINAL용 채팅
├── components/
│   ├── HudPanel.tsx            # 공통 HUD/Chip/ProgressBar
│   └── QuestShell.tsx          # Quest 공통 shell (헤더/타이머/점수카드)
├── data/quest-data.ts          # 8 Quest 상황·카드 데이터
├── lib/
│   ├── quests.ts               # Quest 메타 + 등급 산정
│   ├── types.ts                # TS 타입
│   ├── store.ts                # Zustand 게임 상태 (재도전/베스트점수)
│   ├── scoring.ts              # 점수 계산 헬퍼
│   └── gemini.ts               # Gemini API 래퍼
└── public/images/              # Gemini 사전 생성 10장 (HERO + 8 Quest + FINAL)
```

## 실행

```bash
npm install
cp .env.local.example .env.local
# GEMINI_API_KEY 입력

npm run dev          # 로컬 개발 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버
```

## 평가 시스템 요약

- **시스템 자동 점수** (0~100): 입력 충실도·구조 완성도 (가중치 40%)
- **Gemini AI 점수** (0~100): 내용의 통찰력·구체성·LS Way 적합도 (가중치 60%)
- **최종 점수** = 시스템 × 0.4 + Gemini × 0.6
- **PASS 기준**: Quest별 60~70점 (난이도별 차등)
- **재도전**: 무제한 — 시간 내라면 같은 Quest를 여러 번 시도 가능, 베스트 점수가 최종 반영
- **앞앞 단계 Quest 재도전**: 항상 허용 (Hub에서 진입)

## 등급

| 등급 | 점수 (총 900점 만점) | 칭호 |
|------|------|------|
| 🏆 AI PIONEER | 810~ | AI 시대를 선도하는 LS의 개척자 |
| 🎖️ AI ARCHITECT | 630~809 | AI를 설계하는 전문가 |
| 🤝 AI COLLABORATOR | 450~629 | AI와 협업하는 동료 |
| 🌱 AI ROOKIE | ~449 | 첫 걸음을 뗀 신입 |

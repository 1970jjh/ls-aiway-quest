"use client";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef } from "react";
import "./proposal.css";

// LS Cable & System AI Work Way Quest 제안서 페이지
// 신라HM 페이지의 구조를 LS 톤으로 재해석 + JJ References 모듈 통합

export default function ProposalPage() {
  const refsRef = useRef<HTMLDivElement>(null);

  // JS 로드 표시 → CSS reveal hide/show 시점 동기화
  useEffect(() => {
    document.documentElement.classList.add("js-loaded");
    // 초기에 viewport 안에 있는 reveal 요소는 즉시 표시
    document.querySelectorAll(".reveal").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add("revealed");
      }
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("revealed");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* JJ References Shared CSS */}
      <link rel="stylesheet" href="/jjref/jj-references.css" />

      <div className="proposal-root">
        {/* NAV */}
        <nav className="prop-nav">
          <div className="prop-nav-inner">
            <div className="prop-brand">
              LS · AI <span className="accent">WORK WAY</span> QUEST
            </div>
            <ul className="prop-nav-links">
              <li><a href="#why">WHY</a></li>
              <li><a href="#program">PROGRAM</a></li>
              <li><a href="#quest">DEMO</a></li>
              <li><a href="#references">레퍼런스</a></li>
              <li><a href="#contact">CONTACT</a></li>
            </ul>
          </div>
        </nav>

        {/* HERO */}
        <section className="prop-hero">
          <div className="prop-hero-inner">
            <div>
              <div className="prop-eyebrow">LS CABLE & SYSTEM · 2026 임원·관리자 AI WORKSHOP</div>
              <h1 className="prop-h1">
                <span className="prop-h1-sub">함께 만든, 함께 지키는</span>
                <br />
                LS <span className="prop-gold">AI Work Way</span><br />
                <span className="prop-h1-em">QUEST</span>
              </h1>
              <p className="prop-lead">
                선포한 8가지 행동약속을 <b>'아는 것'에서 '하는 것'으로</b>.<br />
                2.5시간 온라인 게이미피케이션 — <b>8개 Quest를 직접 풀고 손가락이 기억하게</b> 만듭니다.<br />
                AI 채점 · 무제한 재도전 · 개인전/팀전 선택.
              </p>
              <div className="prop-tags">
                <span className="prop-tag">#AI Work Way 8</span>
                <span className="prop-tag">#게이미피케이션</span>
                <span className="prop-tag">#온라인 2.5h</span>
                <span className="prop-tag">#개인/팀 선택</span>
                <span className="prop-tag">#무제한 재도전</span>
              </div>
              <div className="prop-buttons">
                <a
                  href="/proposal/LS전선_AIWorkWay_제안서_JJCreative.pdf"
                  className="prop-btn prop-btn-primary"
                  download
                >
                  📥 제안서 PDF 다운로드
                </a>
                <Link href="/" className="prop-btn prop-btn-outline">
                  ▶ 데모 Quest 체험하기
                </Link>
                <a href="#program" className="prop-btn prop-btn-outline">
                  📄 프로그램 보기
                </a>
              </div>
            </div>
            <div className="prop-hero-media">
              <div className="prop-video">
                <iframe
                  src="https://www.youtube.com/embed/b7sWDnm1glY?rel=0&modestbranding=1"
                  title="LS Cable & System AI Work Way Quest · 오프닝 영상"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <p className="prop-video-cap">
                🎬 오프닝 영상 · "Greater Value Together — 함께 만든 약속, 함께 지킬 시간"
              </p>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="prop-stats">
          <div className="prop-stats-inner">
            <div className="prop-stat"><div className="prop-stat-num">2.5H</div><div>온라인 1회 완결</div></div>
            <div className="prop-stat"><div className="prop-stat-num">8</div><div>Quest + FINAL BOSS</div></div>
            <div className="prop-stat"><div className="prop-stat-num">∞</div><div>재도전 가능</div></div>
            <div className="prop-stat"><div className="prop-stat-num">24~30</div><div>명/회차</div></div>
            <div className="prop-stat"><div className="prop-stat-num">10</div><div>차수 기준</div></div>
          </div>
        </section>

        {/* WHY/WHAT/HOW/WHATIF */}
        <section id="why" className="prop-section">
          <div className="prop-section-inner">
            <div className="prop-eyebrow">BACKGROUND & NECESSITY</div>
            <h2 className="prop-section-title reveal">
              왜 지금 LS 구성원이 <span className="prop-gold">AI Work Way를 체화</span>해야 하는가
            </h2>
            <p className="prop-section-desc reveal">
              안내문만으로는 손가락이 기억하지 못합니다. 직접 풀어보고, 실패하고, 재도전하는 2.5시간이 필요합니다.
            </p>

            <div className="prop-why-grid">
              <div className="prop-why-card reveal">
                <div className="prop-why-key" style={{ color: "#9b6dff" }}>WHY</div>
                <h3>선포 후 단계 — Behavior Activation이 핵심</h3>
                <p>
                  LS만의 'AI를 활용 일하는 방식' 8개 행동약속이 선포되었습니다. 이제는 <b>일상 업무의 미묘한 순간마다 8 Ways가 판단 기준으로 작동하느냐</b>가 본질입니다. 그러나 안내문/포스터/공지로는 손가락이 기억하지 못합니다.
                </p>
              </div>
              <div className="prop-why-card reveal">
                <div className="prop-why-key" style={{ color: "#FFC940" }}>WHAT</div>
                <h3>2.5시간 · 8 Quest + FINAL BOSS · 무제한 재도전</h3>
                <p>
                  8개 Way를 <b>8개의 미개척 영토(Quest)</b>로 형상화. <b>분석/체험 핑퐁 구조</b>로 학습자가 직접 풀이/실험/평가받습니다. PASS 미달 시 재도전, PASS 후에도 점수 갱신을 위한 재도전 무제한.
                </p>
              </div>
              <div className="prop-why-card reveal">
                <div className="prop-why-key" style={{ color: "#3DD9FF" }}>HOW</div>
                <h3>온라인 · AI 채점 · PASS/FAIL · 개인/팀 선택</h3>
                <p>
                  웹 접속만으로 즉시 시작. <b>Gemini AI가 즉시 채점</b>하고 PASS/FAIL을 알려줍니다. 개인전(SOLO) 모드는 본인 페이스로 자유 접속·완주시간/점수 기록, 팀전(TEAM) 모드는 Crew 4~6인 함께 진행.
                </p>
              </div>
              <div className="prop-why-card reveal">
                <div className="prop-why-key" style={{ color: "#62B645" }}>WHAT IF</div>
                <h3>2.5시간 후, 손가락이 AI Work Way를 기억한다</h3>
                <p>
                  단순 강의가 아닌 <b>체험·체화 중심</b>. 종료 1주 후 행동 의도 4.0+ / 1개월 후 적어도 1개 Way를 실제 업무에 적용하는 비율 65%+를 목표합니다. <b>완주 시 'AI WORK PIONEER' 등급</b>이 부여됩니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PROGRAM */}
        <section id="program" className="prop-section prop-section-alt">
          <div className="prop-section-inner">
            <div className="prop-eyebrow">PROGRAM STRUCTURE</div>
            <h2 className="prop-section-title reveal">
              8 Quest <span className="prop-gold">완전 자율 진행 + AI 채점</span>
            </h2>
            <p className="prop-section-desc reveal">
              모든 Quest는 <b>AI Work Way 8개 행동약속과 1:1 매핑</b>. 시스템 자동 채점(40%) + Gemini AI 평가(60%)로 PASS/FAIL.
            </p>

            <div className="prop-quest-grid">
              {QUEST_LIST.map((q) => (
                <div key={q.id} className="prop-quest-card reveal">
                  <div className="prop-quest-id" data-cat={q.cat}>
                    {q.id} · {q.cat}
                  </div>
                  <h4>{q.title}</h4>
                  <p className="prop-quest-way">"{q.way}"</p>
                  <p className="prop-quest-desc">{q.desc}</p>
                </div>
              ))}
              <div className="prop-quest-card prop-final reveal">
                <div className="prop-quest-id">FINAL · BOSS</div>
                <h4>AI WORK WAY MASTER</h4>
                <p className="prop-quest-way">"8 Way 통합 케이스 — 본부장 보고 30분 챌린지"</p>
                <p className="prop-quest-desc">
                  Q1~Q8을 모두 통과한 후 도전 가능. Gemini와 협업해 1page 종합 실천 리포트를 작성합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DEMO QUEST CTA */}
        <section id="quest" className="prop-section prop-section-cta">
          <div className="prop-section-inner">
            <div className="prop-eyebrow">LIVE DEMO</div>
            <h2 className="prop-section-title reveal">
              <span className="prop-gold">지금 바로</span> 데모 Quest를 체험해보세요
            </h2>
            <p className="prop-section-desc reveal">
              아래 링크에서 실제 운영 사이트에 접속할 수 있습니다. Gemini AI 채점은 실제 작동 중입니다.
            </p>

            <div className="prop-demo-buttons reveal">
              <Link href="/" className="prop-btn-large">
                <span className="prop-btn-large-eyebrow">메인 사이트</span>
                <span className="prop-btn-large-title">▶ AI Work Way Quest</span>
                <span className="prop-btn-large-sub">HERO + 8 Quest 갤러리 + FINAL</span>
              </Link>
              <Link href="/setup" className="prop-btn-large">
                <span className="prop-btn-large-eyebrow">세션 등록</span>
                <span className="prop-btn-large-title">🚀 개인전 / 팀전 시작</span>
                <span className="prop-btn-large-sub">모드 선택 + 세션 코드 입력</span>
              </Link>
              <Link href="/diagnose" className="prop-btn-large">
                <span className="prop-btn-large-eyebrow">자가진단</span>
                <span className="prop-btn-large-title">📋 AI Work Way 자가진단</span>
                <span className="prop-btn-large-sub">8문항 · 현재 수준 측정</span>
              </Link>
              <Link href="/quests/q1" className="prop-btn-large">
                <span className="prop-btn-large-eyebrow">샘플 Quest</span>
                <span className="prop-btn-large-title">🎮 Q1 FLOW SHIFTER</span>
                <span className="prop-btn-large-sub">단순 반복을 넘어, 몰입으로</span>
              </Link>
            </div>
          </div>
        </section>

        {/* PROPOSAL SLIDES */}
        <section className="prop-section">
          <div className="prop-section-inner">
            <div className="prop-eyebrow">PROPOSAL SUMMARY</div>
            <h2 className="prop-section-title reveal">
              <span className="prop-gold">제안서 13장</span> 한눈에 보기
            </h2>
            <p className="prop-section-desc reveal">
              전체 PDF는 상단 다운로드 버튼에서 받을 수 있습니다.
            </p>
            <div className="prop-slide-grid reveal">
              {Array.from({ length: 13 }, (_, i) => (
                <div key={i} className="prop-slide-thumb">
                  <Image
                    src={`/proposal/slides/slide-${String(i + 1).padStart(2, "0")}.jpg`}
                    alt={`슬라이드 ${i + 1}`}
                    width={400}
                    height={225}
                    className="prop-slide-img"
                  />
                  <span className="prop-slide-num">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="prop-section prop-section-alt">
          <div className="prop-section-inner">
            <div className="prop-eyebrow">NEXT STEP</div>
            <h2 className="prop-section-title reveal">
              <span className="prop-gold">함께</span> AI Work Way를 체화할 시간
            </h2>
            <div className="prop-contact-grid">
              <div className="prop-contact-card">
                <div className="prop-contact-label">제안자</div>
                <div className="prop-contact-value">전재현 소장</div>
              </div>
              <div className="prop-contact-card">
                <div className="prop-contact-label">소속</div>
                <div className="prop-contact-value">JJ Creative 교육연구소</div>
              </div>
              <div className="prop-contact-card">
                <div className="prop-contact-label">이메일</div>
                <div className="prop-contact-value">
                  <a href="mailto:ksajhjeon@gmail.com">ksajhjeon@gmail.com</a>
                </div>
              </div>
              <div className="prop-contact-card">
                <div className="prop-contact-label">홈페이지</div>
                <div className="prop-contact-value">
                  <a href="https://www.jjcreative.co.kr" target="_blank" rel="noopener">
                    www.jjcreative.co.kr
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* JJ REFERENCES INTRO */}
        <section id="references" className="prop-section prop-section-alt">
          <div className="prop-section-inner">
            <div className="prop-eyebrow">REFERENCES</div>
            <h2 className="prop-section-title reveal">
              JJ Creative <span className="prop-gold">교육 레퍼런스 752+건</span>
            </h2>
            <p className="prop-section-desc reveal">
              2023~2026 누적 강의 후기 · 블로그 · 강사양성 · 콘텐츠 아카이브 · 90+ 고객사 / 19 교육주제
            </p>

            <div className="ref-stats-grid reveal">
              <div className="ref-stat">
                <div className="ref-stat-num">752+</div>
                <div className="ref-stat-label">총 레퍼런스 건수</div>
              </div>
              <div className="ref-stat">
                <div className="ref-stat-num">90+</div>
                <div className="ref-stat-label">교육 진행 고객사</div>
              </div>
              <div className="ref-stat">
                <div className="ref-stat-num">19</div>
                <div className="ref-stat-label">교육 주제 영역</div>
              </div>
              <div className="ref-stat">
                <div className="ref-stat-num">4Y+</div>
                <div className="ref-stat-label">누적 운영 기간</div>
              </div>
            </div>

            <div className="ref-clients-row reveal">
              <span className="ref-client-chip featured">⭐ LIG D&amp;A</span>
              <span className="ref-client-chip">현대자동차</span>
              <span className="ref-client-chip">한화시스템</span>
              <span className="ref-client-chip">한국수력원자력</span>
              <span className="ref-client-chip">효성ITX</span>
              <span className="ref-client-chip">한국기술교육대학교</span>
              <span className="ref-client-chip">한국표준협회</span>
              <span className="ref-client-chip">동아쏘시오그룹</span>
              <span className="ref-client-chip">한국에너지공단</span>
              <span className="ref-client-chip">삼성전자</span>
              <span className="ref-client-chip">신세계건설</span>
              <span className="ref-client-chip">SBI저축은행</span>
              <span className="ref-client-chip">LG전자</span>
              <span className="ref-client-chip">삼성물산</span>
              <span className="ref-client-chip">코오롱</span>
              <span className="ref-client-chip">SPC GFS</span>
            </div>

            <div className="ref-topic-grid reveal">
              {REFERENCE_TOPICS.map((t) => (
                <div key={t.title} className="ref-topic-card">
                  <div className="ref-topic-icon">{t.icon}</div>
                  <div className="ref-topic-title">{t.title}</div>
                  <div className="ref-topic-clients">{t.clients}</div>
                </div>
              ))}
            </div>

            <div className="reveal" style={{ textAlign: "center", marginTop: 40 }}>
              <a
                href="https://service-3-ai-851830077252.us-west1.run.app/"
                target="_blank"
                rel="noopener"
                className="prop-btn prop-btn-primary"
              >
                🎓 JJ AI 교육 홈페이지에서 더 자세히 보기
              </a>
            </div>
          </div>
        </section>

        {/* JJ REFERENCES MODULE (동적 — JS 모듈 로드 시 자동 렌더) */}
        <div ref={refsRef} data-jjref="auto" data-cta="#contact" />

        {/* FOOTER */}
        <footer className="prop-footer">
          <div className="prop-footer-brand">
            JJ <span className="accent">CREATIVE</span> 교육연구소
          </div>
          <div className="prop-footer-meta">
            JJ Creative 교육연구소 · 전재현 소장
            <br />
            이메일{" "}
            <a href="mailto:ksajhjeon@gmail.com">ksajhjeon@gmail.com</a>
            {" "}· 홈페이지{" "}
            <a href="https://www.jjcreative.co.kr" target="_blank" rel="noopener">
              www.jjcreative.co.kr
            </a>
          </div>
          <div className="prop-footer-copy">
            © 2026 JJ Creative 교육연구소 · LS Cable & System AI Work Way Quest 제안서
          </div>
        </footer>
      </div>

      <Script src="/jjref/jj-references-data.js" strategy="afterInteractive" />
      <Script src="/jjref/jj-references.js" strategy="afterInteractive" />
    </>
  );
}

// ============================================================
// 8 Quest 요약 데이터
// ============================================================
const REFERENCE_TOPICS = [
  { icon: "🤖", title: "AI · ChatGPT 비즈니스", clients: "신라HM · 한수원 · 효성ITX · 아워홈 외" },
  { icon: "👑", title: "리더십 · 임원 코칭", clients: "LIG D&A · 웅진 · 한빛원자력본부 외" },
  { icon: "💎", title: "핵심가치 · 조직문화", clients: "크래프톤 · 코카콜라코리아 · 한화 외" },
  { icon: "🚀", title: "신입·승격 온보딩", clients: "현대모비스 · SPC GFS · 해성디에스 외" },
  { icon: "🎯", title: "마케팅 · 영업 · CX", clients: "교보 리얼코 · 현대아산 · 한화첨단소재 외" },
  { icon: "🎮", title: "게이미피케이션 학습", clients: "크래프톤 WAY · 신라HM 워크숍 · LS Quest" },
];

const QUEST_LIST = [
  { id: "Q1", cat: "MINDSET", title: "FLOW SHIFTER", way: "단순 반복을 넘어, 몰입으로", desc: "1주 업무를 4단계로 분해 → AI 위임으로 확보한 몰입 시간 산출" },
  { id: "Q2", cat: "MINDSET", title: "VALUE BLENDER", way: "경험을 더해, 가치를 완성한다", desc: "Gemini 80점 초안 + LS 현장 경험 = 대체불가 100점 결과물" },
  { id: "Q3", cat: "ACTION", title: "AGILE SPRINTER", way: "AI 활용! Agile하게 도전한다", desc: "7일 안에 끝낼 AI 작은 실험 — 가설/시도/판단기준/실패계획 설계" },
  { id: "Q4", cat: "ACTION", title: "PROMPT MASTER", way: "상세한 지시가 압도적 차이를 만든다", desc: "막연한 지시 vs R-B-T-F-E 프레임 — 같은 AI, 두 결과의 본질 차이 분석" },
  { id: "Q5", cat: "ACTION", title: "HUMAN STAMP", way: "AI로 가속하고 사람이 마침표를 찍는다", desc: "AI 초안에서 '사람의 마침표가 필요한 3지점' 식별 + 통찰 추가" },
  { id: "Q6", cat: "ACTION", title: "PRACTICE BANK", way: "Best Practice는 개인기가 아닌 조직의 힘", desc: "본인 AI 우수사례 1건 적금 + 동료 3건 별점·코멘트 평가" },
  { id: "Q7", cat: "STANDARD", title: "SOURCE HUNTER", way: "데이터의 생명은 정확한 출처에서 나온다", desc: "AI 진술 4건 중 환각(가짜) 1건 식별 + 출처 검증 리포트" },
  { id: "Q8", cat: "STANDARD", title: "FINAL OWNER", way: "결과물의 최종 책임자는 '나'다", desc: "5가지 위험 체크리스트 + 책임 선언문 + 본인 서명" },
];

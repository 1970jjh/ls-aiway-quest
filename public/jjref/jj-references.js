/* JJ Creative References Section — Vanilla JS Renderer (no build tools) */
/* Usage:
   1) Include jj-references.css + jj-references-data.js + this file
   2) Place <section id="references"></section> in the page
   3) Call JJReferences.mount('#references')  (auto-mounts on DOMContentLoaded)
*/
(function (global) {
  'use strict';

  var COMPETENCY_MAP = {
    "AI/디지털 리터러시": { topics: ["AI/생성형AI","AI코딩/홈페이지","AI퀘스트"], desc: "생성형 AI 업무활용, 프롬프트 엔지니어링, AI 교육게임" },
    "리더십/매니지먼트": { topics: ["리더십","승진자과정","성과관리","멘토링/코칭"], desc: "신임팀장, 승진자, 성과관리, 코칭 리더십" },
    "조직활성화/팀빌딩": { topics: ["팀빌딩/조직활성화","소통/협업","핵심가치/비전"], desc: "팀빌딩, 소통워크숍, 핵심가치 내재화" },
    "신입/온보딩": { topics: ["신입/온보딩","역량강화"], desc: "신입사원 입문교육, 역량강화, 리텐션" },
    "경영시뮬레이션/게임": { topics: ["경영시뮬레이션","게이미피케이션"], desc: "경영 의사결정 시뮬레이션, 교육 게이미피케이션" },
    "생산성/워크스마트": { topics: ["생산성/워크스마트","기획/전략","문제해결","팔로워십/셀프리더십"], desc: "업무 효율화, 문제해결, 자기주도 역량" }
  };

  var TABS = ["ALL", "COMPANY", "TOPIC", "COMPETENCY", "TIMELINE"];
  var YEARS = ["전체", "2026", "2025", "2024", "2023"];
  var TYPES = ["전체", "강의후기", "블로그글", "공지/안내", "강사양성", "정보/팁", "과정후기", "AI앱", "AI게임", "체험회", "세미나", "교육안내", "프로젝트후기", "콘텐츠/연재"];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function computeStats(data) {
    var companies = {}, types = {};
    data.forEach(function (d) {
      if (d.c) companies[d.c] = 1;
      d.p.split(',').forEach(function (p) { p = p.trim(); if (p) types[p] = 1; });
    });
    return {
      total: data.length,
      clients: Object.keys(companies).length,
      lectures: data.filter(function (d) { return d.y === '강의후기'; }).length,
      topics: Object.keys(types).length
    };
  }

  function filterData(data, state) {
    var s = (state.search || '').toLowerCase();
    return data.filter(function (d) {
      if (s) {
        if (d.t.toLowerCase().indexOf(s) < 0 && d.c.toLowerCase().indexOf(s) < 0 && d.p.toLowerCase().indexOf(s) < 0) return false;
      }
      if (state.year !== '전체' && d.d.indexOf(state.year) !== 0) return false;
      if (state.type !== '전체' && d.y !== state.type) return false;
      return true;
    });
  }

  function groupBy(arr, keyFn) {
    var m = {};
    arr.forEach(function (d) {
      var keys = keyFn(d);
      (Array.isArray(keys) ? keys : [keys]).forEach(function (k) {
        if (!k) return;
        if (!m[k]) m[k] = [];
        m[k].push(d);
      });
    });
    return m;
  }
  function sortEntriesByCountDesc(obj) {
    return Object.keys(obj).map(function (k) { return [k, obj[k]]; })
      .sort(function (a, b) { return b[1].length - a[1].length; });
  }

  function renderRow(r) {
    var topics = r.p.split(',').map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 2);
    var tags = '';
    if (r.c) tags += '<span class="jjref-tag jjref-tag-company">' + esc(r.c) + '</span>';
    tags += '<span class="jjref-tag jjref-tag-type">' + esc(r.y) + '</span>';
    topics.forEach(function (t) { tags += '<span class="jjref-tag jjref-tag-topic">' + esc(t) + '</span>'; });
    return '<a class="jjref-row" href="' + esc(r.u) + '" target="_blank" rel="noreferrer">' +
      '<div class="jjref-row-left">' +
        '<div class="jjref-row-date">' + esc(r.d) + '</div>' +
        '<div class="jjref-row-main">' +
          '<div class="jjref-tags">' + tags + '</div>' +
          '<h3 class="jjref-row-title">' + esc(r.t) + '</h3>' +
        '</div>' +
      '</div>' +
      '<span class="jjref-view">View ↗</span>' +
    '</a>';
  }

  function renderAll(filtered, pageSize) {
    var shown = filtered.slice(0, pageSize);
    var html = '<div class="jjref-list">';
    if (!shown.length) html += '<div class="jjref-empty">검색 결과가 없습니다.</div>';
    shown.forEach(function (r) { html += renderRow(r); });
    html += '</div>';
    if (pageSize < filtered.length) {
      html += '<button class="jjref-more" data-action="load-more">Load More (' + Math.min(pageSize, filtered.length) + ' / ' + filtered.length + ')</button>';
    }
    return html;
  }

  function renderCompany(filtered, selected) {
    var map = groupBy(filtered.filter(function (d) { return d.c; }), function (d) { return d.c; });
    var entries = sortEntriesByCountDesc(map);
    var chips = '<div class="jjref-chips">';
    entries.forEach(function (e) {
      chips += '<button class="jjref-chip' + (selected === e[0] ? ' active' : '') + '" data-action="select-company" data-value="' + esc(e[0]) + '">' + esc(e[0]) + ' (' + e[1].length + ')</button>';
    });
    chips += '</div>';
    var shown = selected ? entries.filter(function (e) { return e[0] === selected; }) : entries.slice(0, 15);
    var body = '';
    shown.forEach(function (e) {
      body += '<div class="jjref-group">' +
        '<h3 class="jjref-group-title">' + esc(e[0]) + ' <span class="jjref-count-inline">' + e[1].length + '건</span></h3>' +
        '<div>';
      e[1].slice(0, 10).forEach(function (r) { body += renderRow(r); });
      body += '</div></div>';
    });
    if (!entries.length) body = '<div class="jjref-empty">해당 조건에 맞는 고객사가 없습니다.</div>';
    return chips + body;
  }

  function renderTopic(filtered, selected) {
    var map = groupBy(filtered, function (d) { return d.p.split(',').map(function (s) { return s.trim(); }); });
    var entries = sortEntriesByCountDesc(map);
    var chips = '<div class="jjref-chips">';
    entries.forEach(function (e) {
      chips += '<button class="jjref-chip' + (selected === e[0] ? ' active' : '') + '" data-action="select-topic" data-value="' + esc(e[0]) + '">' + esc(e[0]) + ' (' + e[1].length + ')</button>';
    });
    chips += '</div>';
    var shown = selected ? entries.filter(function (e) { return e[0] === selected; }) : entries.slice(0, 12);
    var body = '';
    shown.forEach(function (e) {
      body += '<div class="jjref-group">' +
        '<h3 class="jjref-group-title topic-style"><span class="jjref-group-title-bar"></span>' + esc(e[0]) + ' <span class="jjref-count-inline">' + e[1].length + '건</span></h3>' +
        '<div>';
      e[1].slice(0, 8).forEach(function (r) { body += renderRow(r); });
      body += '</div></div>';
    });
    if (!entries.length) body = '<div class="jjref-empty">해당 조건의 주제가 없습니다.</div>';
    return chips + body;
  }

  function renderCompetency(filtered) {
    var data = Object.keys(COMPETENCY_MAP).map(function (name) {
      var info = COMPETENCY_MAP[name];
      var items = filtered.filter(function (d) {
        return info.topics.some(function (t) { return d.p.indexOf(t) >= 0; });
      });
      var companies = [];
      var seen = {};
      items.forEach(function (d) {
        if (d.c && !seen[d.c]) { seen[d.c] = 1; companies.push(d.c); }
      });
      return { name: name, desc: info.desc, count: items.length, companies: companies };
    }).sort(function (a, b) { return b.count - a.count; });
    var html = '<div class="jjref-comp-grid">';
    data.forEach(function (c) {
      var companies = c.companies.slice(0, 8).map(function (x) {
        return '<span class="jjref-comp-tag">' + esc(x) + '</span>';
      }).join('');
      if (c.companies.length > 8) companies += '<span class="jjref-comp-tag">+' + (c.companies.length - 8) + '</span>';
      html += '<div class="jjref-comp">' +
        '<div class="jjref-comp-head">' +
          '<h4 class="jjref-comp-name">' + esc(c.name) + '</h4>' +
          '<span class="jjref-comp-count">' + c.count + '</span>' +
        '</div>' +
        '<p class="jjref-comp-desc">' + esc(c.desc) + '</p>' +
        '<div class="jjref-comp-companies">' + companies + '</div>' +
      '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderTimeline(filtered) {
    var map = groupBy(filtered, function (d) { return d.d.substring(0, 4); });
    var entries = Object.keys(map).map(function (k) { return [k, map[k]]; })
      .sort(function (a, b) { return b[0].localeCompare(a[0]); });
    if (!entries.length) return '<div class="jjref-empty">해당 연도의 자료가 없습니다.</div>';
    var html = '<div class="jjref-timeline">';
    entries.forEach(function (e) {
      html += '<div class="jjref-timeline-year">' +
        '<div class="jjref-timeline-head">' +
          '<div class="jjref-timeline-dot"></div>' +
          '<h3 class="jjref-timeline-yr">' + esc(e[0]) + '</h3>' +
          '<span class="jjref-timeline-count">' + e[1].length + '건</span>' +
        '</div>';
      e[1].slice(0, 20).forEach(function (d) {
        html += '<a class="jjref-timeline-item" href="' + esc(d.u) + '" target="_blank" rel="noreferrer">' +
          '<span class="jjref-timeline-date">' + esc(d.d) + '</span>' +
          (d.c ? '<span class="jjref-timeline-company">' + esc(d.c) + '</span>' : '') +
          '<span class="jjref-timeline-title">' + esc(d.t) + '</span>' +
        '</a>';
      });
      if (e[1].length > 20) html += '<div class="jjref-timeline-more">+' + (e[1].length - 20) + '건 더</div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  function render(root, state) {
    var data = (global.JJ_REFERENCES_DATA || []);
    var filtered = filterData(data, state);
    var stats = computeStats(data);

    var statsHtml =
      '<div class="jjref-stats">' +
        '<div class="jjref-stat"><div class="jjref-stat-icon">📚</div><div><p class="jjref-stat-label">Total Contents</p><p class="jjref-stat-value">' + stats.total + '+</p></div></div>' +
        '<div class="jjref-stat"><div class="jjref-stat-icon">👥</div><div><p class="jjref-stat-label">Clients</p><p class="jjref-stat-value">' + stats.clients + '+</p></div></div>' +
        '<div class="jjref-stat"><div class="jjref-stat-icon">🏆</div><div><p class="jjref-stat-label">Lectures</p><p class="jjref-stat-value">' + stats.lectures + '+</p></div></div>' +
        '<div class="jjref-stat"><div class="jjref-stat-icon">💼</div><div><p class="jjref-stat-label">Topics</p><p class="jjref-stat-value">' + stats.topics + '</p></div></div>' +
      '</div>';

    var tabsHtml = '<div class="jjref-tabs">';
    TABS.forEach(function (t) {
      tabsHtml += '<button class="jjref-tab' + (state.tab === t ? ' active' : '') + '" data-action="set-tab" data-value="' + t + '">' + t + '</button>';
    });
    tabsHtml += '</div>';

    var yearOpts = YEARS.map(function (y) {
      return '<option value="' + y + '"' + (state.year === y ? ' selected' : '') + '>' + (y === '전체' ? '전체 연도' : y + '년') + '</option>';
    }).join('');
    var typeOpts = TYPES.map(function (y) {
      return '<option value="' + esc(y) + '"' + (state.type === y ? ' selected' : '') + '>' + (y === '전체' ? '전체 유형' : esc(y)) + '</option>';
    }).join('');

    var filterHtml =
      '<div class="jjref-filters">' +
        '<div class="jjref-search">' +
          '<span class="jjref-search-icon">🔍</span>' +
          '<input type="text" placeholder="검색 (고객사, 주제, 키워드...)" value="' + esc(state.search) + '" data-action="search" />' +
          (state.search ? '<button class="jjref-search-clear" data-action="clear-search">✕</button>' : '') +
        '</div>' +
        '<select class="jjref-select" data-action="set-year">' + yearOpts + '</select>' +
        '<select class="jjref-select" data-action="set-type">' + typeOpts + '</select>' +
        '<div class="jjref-count">' + filtered.length + '건</div>' +
      '</div>';

    var body = '';
    if (state.tab === 'ALL') body = renderAll(filtered, state.pageSize);
    else if (state.tab === 'COMPANY') body = renderCompany(filtered, state.selectedCompany);
    else if (state.tab === 'TOPIC') body = renderTopic(filtered, state.selectedTopic);
    else if (state.tab === 'COMPETENCY') body = renderCompetency(filtered);
    else if (state.tab === 'TIMELINE') body = renderTimeline(filtered);

    var ctaHref = state.ctaHref || '#contact';
    var cta =
      '<div class="jjref-cta">' +
        '<div class="jjref-cta-box">' +
          '<div class="jjref-cta-icon">💼</div>' +
          '<h2 class="jjref-cta-title">교육 문의 및 제안</h2>' +
          '<p class="jjref-cta-desc">JJ Creative 교육연구소는 기업의 요구에 맞춘<br/>최적의 AI 교육 솔루션을 제공합니다.</p>' +
          '<a class="jjref-cta-btn" href="' + esc(ctaHref) + '">Contact Us Now</a>' +
        '</div>' +
      '</div>';

    root.innerHTML =
      '<div class="jjref-root">' +
        '<div class="jjref-container">' +
          '<div class="jjref-header">' +
            '<h1 class="jjref-title">REFERENCES</h1>' +
            '<p class="jjref-subtitle">JJ Creative with AI Education Portfolio</p>' +
          '</div>' +
          statsHtml +
          tabsHtml +
          filterHtml +
          body +
          cta +
        '</div>' +
      '</div>';
  }

  function mount(selector, options) {
    var root = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!root) return;
    var state = {
      tab: 'ALL',
      search: '',
      year: '전체',
      type: '전체',
      pageSize: 20,
      selectedCompany: null,
      selectedTopic: null,
      ctaHref: (options && options.ctaHref) || '#contact'
    };

    var searchDebounceTimer = null;
    function rerender() { render(root, state); }

    root.addEventListener('click', function (e) {
      var target = e.target.closest('[data-action]');
      if (!target) return;
      var action = target.getAttribute('data-action');
      var value = target.getAttribute('data-value');
      if (action === 'set-tab') {
        state.tab = value;
        state.pageSize = 20;
        state.selectedCompany = null;
        state.selectedTopic = null;
        rerender();
      } else if (action === 'load-more') {
        state.pageSize += 20;
        rerender();
      } else if (action === 'select-company') {
        state.selectedCompany = state.selectedCompany === value ? null : value;
        rerender();
      } else if (action === 'select-topic') {
        state.selectedTopic = state.selectedTopic === value ? null : value;
        rerender();
      } else if (action === 'clear-search') {
        state.search = '';
        rerender();
      }
    });

    root.addEventListener('input', function (e) {
      var target = e.target;
      var action = target.getAttribute && target.getAttribute('data-action');
      if (action === 'search') {
        clearTimeout(searchDebounceTimer);
        var v = target.value;
        searchDebounceTimer = setTimeout(function () {
          state.search = v;
          state.pageSize = 20;
          var activeEl = document.activeElement;
          rerender();
          // restore focus to search input after re-render
          var input = root.querySelector('[data-action="search"]');
          if (input) { input.focus(); try { input.setSelectionRange(v.length, v.length); } catch (_) {} }
        }, 180);
      }
    });

    root.addEventListener('change', function (e) {
      var target = e.target;
      var action = target.getAttribute && target.getAttribute('data-action');
      if (action === 'set-year') { state.year = target.value; state.pageSize = 20; rerender(); }
      else if (action === 'set-type') { state.type = target.value; state.pageSize = 20; rerender(); }
    });

    rerender();
  }

  global.JJReferences = { mount: mount };

  document.addEventListener('DOMContentLoaded', function () {
    var el = document.querySelector('#references[data-jjref="auto"]');
    if (el) mount(el, { ctaHref: el.getAttribute('data-cta') || '#contact' });
  });
})(window);

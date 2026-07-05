/* ================= 공통 유틸 ================= */
const DAY_KO = ['일', '월', '화', '수', '목', '금', '토'];
const MAX_SELECT = 6;

function fmtDate(iso, withYear = false) {
  const d = new Date(iso + 'T00:00:00+09:00');
  const s = `${d.getMonth() + 1}/${d.getDate()}(${DAY_KO[d.getDay()]})`;
  return withYear ? `${d.getFullYear()}.${s}` : s;
}

/* 자연계 시험만 사용 (수리논술 사이트 기준) */
function naturalExams(school) {
  return school.exams.filter(e => e.track === '자연');
}
function hasNatural(school) {
  return naturalExams(school).length > 0;
}
function allDates(school) {
  return [...new Set(naturalExams(school).flatMap(e => e.dates))].sort();
}
function earliestDate(school) {
  return allDates(school)[0];
}
function isBeforeSuneung(school) {
  return earliestDate(school) < META.suneung;
}
function isDateConfirmed(school) {
  return naturalExams(school).every(e => e.confirmed && e.dates.length === 1);
}
function dateSummary(school) {
  return naturalExams(school).map(e => {
    const ds = e.dates.map(d => fmtDate(d));
    return e.dates.length > 1 ? `${ds[0]}~${ds[ds.length - 1]} 중` : ds[0];
  }).join(' · ');
}

/* 두 단원 비율 벡터의 (IDF 가중) 코사인 유사도.
   흔한 단원(미적분)을 down-weight 해 학교별 특색이 드러나게 한다. */
function cosineUnit(va, vb) {
  const keys = new Set([...Object.keys(va), ...Object.keys(vb)]);
  let dot = 0, na = 0, nb = 0;
  keys.forEach(k => {
    const w = (typeof UNIT_WEIGHT !== 'undefined' && UNIT_WEIGHT[k]) || 1;
    const x = (va[k] || 0) * w, y = (vb[k] || 0) * w;
    dot += x * y; na += x * x; nb += y * y;
  });
  return (na && nb) ? dot / Math.sqrt(na * nb) : 0;
}

/* 유형 유사도 (0~1).
   두 학교 모두 기출 집계가 있으면 실제 단원 분포(코사인)로 계산,
   없으면(약술 등) style/scope 추정치로 폴백. */
function similarity(a, b) {
  const ea = examData(a.id), eb = examData(b.id);
  const formatFactor = a.format === b.format ? 1 : 0.4;
  if (ea && eb) {
    const cos = cosineUnit(ea.unitVec, eb.unitVec);      // 0~1
    return Math.max(0, Math.min(1, cos * formatFactor));
  }
  const sa = new Set(a.scope), sb = new Set(b.scope);
  const inter = [...sa].filter(x => sb.has(x)).length;
  const union = new Set([...sa, ...sb]).size;
  const scopeSim = union ? inter / union : 0;
  const styleDist = Math.abs(a.style.proof - b.style.proof)
    + Math.abs(a.style.calc - b.style.calc)
    + Math.abs(a.style.depth - b.style.depth);
  const styleSim = 1 - styleDist / 12;
  return Math.max(0, Math.min(1, (0.45 * scopeSim + 0.55 * styleSim) * formatFactor));
}

/* 이 유사도가 실제 기출 데이터로 계산됐는지 */
function similarityIsReal(a, b) {
  return !!(examData(a.id) && examData(b.id));
}

/* ================= 상태 ================= */
const state = {
  selected: [],
  filters: { period: 'all', format: 'all', min: 'all' },
};
const POOL = SCHOOLS.filter(hasNatural);
const byId = Object.fromEntries(SCHOOLS.map(s => [s.id, s]));

/* URL 해시로 조합 공유 */
function loadFromHash() {
  const m = location.hash.match(/s=([\w,]+)/);
  if (!m) return;
  state.selected = m[1].split(',').filter(id => byId[id] && hasNatural(byId[id])).slice(0, MAX_SELECT);
}
function syncHash() {
  const h = state.selected.length ? `#s=${state.selected.join(',')}` : ' ';
  history.replaceState(null, '', state.selected.length ? h : location.pathname);
}

/* ================= 학교 풀 렌더 ================= */
const GROUPS = [
  { title: '수능 전 (10/3 ~ 11/1)', match: s => isBeforeSuneung(s) },
  { title: '수능 직후 첫 주말 (11/21~22)', match: s => { const d = earliestDate(s); return d >= '2026-11-21' && d <= '2026-11-22'; } },
  { title: '수능 후 평일 (11/23~27)', match: s => { const d = earliestDate(s); return d >= '2026-11-23' && d <= '2026-11-27'; } },
  { title: '둘째 주말 (11/28 ~ 12/1)', match: s => { const d = earliestDate(s); return d >= '2026-11-28' && d <= '2026-12-01'; } },
  { title: '마지막 주말 (12/5~6)', match: s => earliestDate(s) >= '2026-12-05' },
];

function passFilters(s) {
  const f = state.filters;
  if (f.period === 'before' && !isBeforeSuneung(s)) return false;
  if (f.period === 'after' && isBeforeSuneung(s)) return false;
  if (f.format !== 'all' && s.format !== f.format) return false;
  if (f.min === '없음' && s.minGrade !== '없음') return false;
  return true;
}

function renderPool() {
  const root = document.getElementById('schoolGroups');
  root.innerHTML = '';
  GROUPS.forEach(g => {
    const items = POOL.filter(g.match).filter(passFilters)
      .sort((a, b) => earliestDate(a).localeCompare(earliestDate(b)) || a.tier - b.tier);
    if (!items.length) return;
    const title = document.createElement('div');
    title.className = 'pool-group-title';
    title.textContent = g.title;
    root.appendChild(title);
    items.forEach(s => {
      const sel = state.selected.includes(s.id);
      const btn = document.createElement('button');
      btn.className = 'school-chip' + (sel ? ' selected' : '')
        + (!sel && state.selected.length >= MAX_SELECT ? ' disabled' : '');
      btn.innerHTML = `
        <span class="name">${s.name}</span>
        <span class="meta">
          <span>${dateSummary(s)}</span>
          ${s.format === '약술' ? '<span class="badge plain">약술</span>' : ''}
          ${s.minGrade === '없음' ? '<span class="badge ok">최저X</span>' : ''}
          ${!isDateConfirmed(s) ? '<span class="badge warn">확인 필요</span>' : ''}
        </span>`;
      btn.title = `수능최저: ${s.minDetail || '기준 확인중'}`;
      btn.addEventListener('click', () => toggleSchool(s.id));
      root.appendChild(btn);
    });
  });
}

function toggleSchool(id) {
  const i = state.selected.indexOf(id);
  if (i >= 0) state.selected.splice(i, 1);
  else if (state.selected.length < MAX_SELECT) state.selected.push(id);
  else return;
  syncHash();
  renderAll();
}

/* ================= 슬롯 ================= */
function renderSlots() {
  const root = document.getElementById('slots');
  root.innerHTML = '';
  for (let i = 0; i < MAX_SELECT; i++) {
    const id = state.selected[i];
    const el = document.createElement('div');
    if (id) {
      el.className = 'slot filled';
      el.textContent = byId[id].name;
      el.title = '클릭하면 제외';
      el.addEventListener('click', () => toggleSchool(id));
    } else {
      el.className = 'slot';
      el.textContent = `${i + 1}지망`;
    }
    root.appendChild(el);
  }
}

/* ================= 분석 ================= */
function renderAnalysis() {
  const root = document.getElementById('analysis');
  const sel = state.selected.map(id => byId[id]);
  document.getElementById('shareRow').hidden = sel.length === 0;

  if (!sel.length) {
    root.innerHTML = '<p class="empty-hint">👈 대학을 선택하면 여기에 분석 결과가 나타납니다.</p>';
    return;
  }

  /* --- 타임라인 --- */
  const dateMap = {};
  sel.forEach(s => naturalExams(s).forEach(e => e.dates.forEach(d => {
    (dateMap[d] = dateMap[d] || []).push({ school: s, exam: e, ambiguous: e.dates.length > 1 || !e.confirmed });
  })));
  const dates = [...new Set([...Object.keys(dateMap), META.suneung])].sort();

  let html = '<h3>📅 시험 일정 타임라인</h3><div class="timeline">';
  dates.forEach(d => {
    if (d === META.suneung) {
      html += `<div class="timeline-row suneung"><span class="timeline-date">${fmtDate(d)}</span><span class="timeline-schools">수능</span></div>`;
      return;
    }
    const entries = dateMap[d];
    html += `<div class="timeline-row"><span class="timeline-date">${fmtDate(d)}</span><span class="timeline-schools">`
      + entries.map(en => {
        const sess = en.exam.session ? `<small>· ${en.exam.session}</small>` : '';
        const amb = en.ambiguous ? '<span class="badge warn">확인 필요</span>' : '';
        return `<span><b>${en.school.name}</b>${sess} ${amb}</span>`;
      }).join(' ')
      + '</span></div>';
  });
  html += '</div>';

  /* --- 충돌 검사 --- */
  html += '<h3>⚠️ 시험일 겹침 검사</h3>';
  let conflicts = 0;
  Object.keys(dateMap).sort().forEach(d => {
    const entries = dateMap[d];
    if (entries.length < 2) return;
    conflicts++;
    const names = entries.map(e => e.school.name).join(' · ');
    const anyAmbiguous = entries.some(e => e.ambiguous);
    const sessions = entries.map(e => e.exam.session);
    const known = sessions.every(Boolean);
    const allDiff = known && new Set(sessions).size === sessions.length;
    if (known && !allDiff) {
      html += `<div class="conflict-card red"><b>${fmtDate(d)} — ${names}</b><br>같은 시간대 응시 불가 조합입니다. 하나는 포기해야 합니다.</div>`;
    } else if (allDiff && entries.length === 2) {
      const [a, b] = entries;
      html += `<div class="conflict-card amber"><b>${fmtDate(d)} — ${names}</b><br>오전/오후 분산으로 둘 다 응시 가능할 수 있습니다. 이동 동선 확인: ${a.school.region} ↔ ${b.school.region}. 입실 완료 시간 기준으로 이동 시간을 반드시 계산하세요.</div>`;
    } else {
      html += `<div class="conflict-card ${anyAmbiguous ? 'amber' : 'red'}"><b>${fmtDate(d)} — ${names}</b><br>같은 날 시험이며 고사 시간${anyAmbiguous ? '·날짜가 미확정' : '이 미공개'} 상태입니다. 모집요강 발표 후 시간대 중복 여부를 반드시 확인하세요.</div>`;
    }
  });
  if (!conflicts) {
    html += '<div class="conflict-card green"><b>겹치는 시험일이 없습니다.</b> 현재 조합은 일정상 6장 모두 실제 응시가 가능합니다.</div>';
  }

  /* --- 유형 시너지 --- */
  if (sel.length >= 2) {
    html += '<h3>🔗 준비 시너지 (유형 유사도)</h3>';
    const pairs = [];
    for (let i = 0; i < sel.length; i++)
      for (let j = i + 1; j < sel.length; j++)
        pairs.push([sel[i], sel[j], similarity(sel[i], sel[j]), similarityIsReal(sel[i], sel[j])]);
    pairs.sort((a, b) => b[2] - a[2]);
    let anyReal = false, anyEst = false;
    pairs.forEach(([a, b, v, real]) => {
      const pct = Math.round(v * 100);
      real ? anyReal = true : anyEst = true;
      html += `<div class="syn-row">
        <span class="syn-pair">${a.name} × ${b.name}</span>
        <span class="syn-bar"><i style="width:${pct}%"></i></span>
        <span class="syn-pct">${pct}%${real ? '' : '<small>*</small>'}</span>
      </div>`;
    });
    const notes = [];
    if (anyReal) notes.push('기출 DB의 단원별 출제 분포(코사인 유사도)로 계산했습니다.');
    if (anyEst) notes.push('<small>*</small> 표시는 기출 데이터가 없어 출제범위·스타일로 추정한 값입니다.');
    html += `<p style="font-size:12px;color:var(--ink-soft);margin-top:8px">* ${notes.join(' ')}</p>`;
  }

  root.innerHTML = html;
}

/* ================= 추천 ================= */
function renderRecommend() {
  const root = document.getElementById('recommend');
  const sel = state.selected.map(id => byId[id]);
  if (!sel.length || sel.length >= MAX_SELECT) {
    root.innerHTML = sel.length >= MAX_SELECT
      ? '<div class="rec-box"><h3>✅ 6장 모두 선택 완료</h3><p style="font-size:13.5px">위 겹침 검사에서 빨간 카드가 없다면 일정상 완주 가능한 조합입니다. 링크를 복사해서 저장해 두세요.</p><a class="btn primary small" style="margin-top:10px" href="#contact">이 조합으로 상담 신청 →</a></div>'
      : '';
    return;
  }

  const selDates = new Set(sel.flatMap(allDates));
  const cands = POOL.filter(s => !state.selected.includes(s.id)).map(s => {
    const myDates = allDates(s);
    const overlap = myDates.filter(d => selDates.has(d));
    const hardConflict = overlap.length && isDateConfirmed(s)
      && sel.some(o => isDateConfirmed(o) && allDates(o).some(d => overlap.includes(d)));
    let score = 0;
    const reasons = [];
    if (!overlap.length) { score += 40; reasons.push('시험일 안 겹침'); }
    else { score -= 25; reasons.push(`⚠ ${overlap.map(fmtDate).join(', ')} 겹칠 가능성`); }
    const best = sel.reduce((m, o) => {
      const v = similarity(s, o);
      return v > m.v ? { v, o } : m;
    }, { v: -1, o: null });
    score += best.v * 45;
    if (best.v >= 0.7) reasons.push(`${best.o.name}와(과) 유형 유사 — 준비 시너지 ${Math.round(best.v * 100)}%`);
    const avgTier = sel.reduce((a, o) => a + o.tier, 0) / sel.length;
    const tierGap = Math.abs(s.tier - avgTier);
    score += Math.max(0, 12 - tierGap * 8);
    if (s.tier > avgTier + 0.7) reasons.push('안정 카드로 활용 가능');
    if (s.minGrade === '없음') { score += 6; reasons.push('수능최저 없음'); }
    if (isBeforeSuneung(s) && sel.every(o => !isBeforeSuneung(o))) {
      score += 6; reasons.push('수능 전 실전 경험 확보 가능');
    }
    return { s, score, reasons, hardConflict };
  }).filter(c => !c.hardConflict)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const remain = MAX_SELECT - sel.length;
  const heading = sel.length >= 4
    ? `🎯 남은 ${remain}장, 이 조합에 어울리는 대학`
    : `💡 함께 준비하기 좋은 대학 추천`;

  root.innerHTML = `<div class="rec-box"><h3>${heading}</h3>`
    + cands.map(c => `
      <div class="rec-item">
        <b>${c.s.name}</b> <span style="color:var(--ink-soft);font-size:12.5px">${dateSummary(c.s)} · ${c.s.format === '약술' ? '약술형' : '심층 수리논술'}</span>
        <div class="rec-reasons">${c.reasons.join(' · ')}</div>
      </div>`).join('')
    + '</div>';
}

/* ================= 공유 ================= */
function buildShareText() {
  const sel = state.selected.map(id => byId[id]);
  let t = `[2027 수리논술 조합 시뮬레이터]\n내 논술 6장 조합:\n`;
  sel.forEach((s, i) => { t += `${i + 1}. ${s.name} — ${dateSummary(s)}${s.minGrade === '없음' ? ' (최저X)' : ''}\n`; });
  t += `\n겹침 체크·유형 유사도 분석 결과 보기 → ${location.href}`;
  return t;
}
function flash(btn, msg) {
  const orig = btn.textContent;
  btn.textContent = msg;
  setTimeout(() => { btn.textContent = orig; }, 1500);
}

/* ================= 기출 DB ================= */
let openDbId = null;

function renderDb() {
  const grid = document.getElementById('dbGrid');
  const q = document.getElementById('dbSearch').value.trim();
  grid.innerHTML = '';
  SCHOOLS.filter(s => hasNatural(s) && (!q || s.name.includes(q)))
    .sort((a, b) => a.tier - b.tier || earliestDate(a).localeCompare(earliestDate(b)))
    .forEach(s => {
      const card = document.createElement('div');
      card.className = 'db-card';
      card.innerHTML = `
        <div class="db-head">
          <h3>${s.name}</h3>
          <span class="badge ${s.format === '약술' ? 'plain' : 'soon'}">${s.format === '약술' ? '약술형' : '수리논술'}</span>
        </div>
        <div class="db-meta">
          <span>📅 ${dateSummary(s)}</span>
          <span>📍 ${s.region}</span>
          <span>🎯 ${s.minDetail || '최저 기준 확인중'}</span>
          ${s.reflect ? `<span>${s.reflect}</span>` : ''}
        </div>
        <div class="db-open">${openDbId === s.id ? '닫기 ▲' : '기출 · 경향 보기 ▼'}</div>`;
      card.addEventListener('click', () => {
        openDbId = openDbId === s.id ? null : s.id;
        renderDb();
        if (openDbId) document.getElementById('dbDetail')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
      grid.appendChild(card);
      if (openDbId === s.id) grid.appendChild(buildDbDetail(s));
    });
}

/* 과목 분포 막대 (기출 집계 기반) */
function subjectBars(ex) {
  const max = Math.max(...Object.values(ex.subjects));
  return '<div class="subj-bars">' + SUBJECT_ORDER_DB
    .filter(s => ex.subjects[s])
    .map(s => {
      const c = ex.subjects[s], pct = Math.round(c / ex.total * 100);
      return `<div class="subj-bar-row">
        <span class="subj-name">${s}</span>
        <span class="subj-track"><i style="width:${Math.round(c / max * 100)}%"></i></span>
        <span class="subj-val">${c}문항 · ${pct}%</span>
      </div>`;
    }).join('') + '</div>';
}

/* 자동 생성 경향 요약 문장 */
function tendencySummary(s, ex) {
  const top = ex.topTopics.slice(0, 3).map(t => `${t.t}(${t.c})`).join(', ');
  const yrs = ex.years.map(y => y.year);
  const span = yrs.length ? `${Math.min(...yrs)}~${Math.max(...yrs)}` : '';
  const kw = ex.topKeywords.slice(0, 5).map(k => k.k).join(' · ');
  return `<p><b>${s.name}</b>는 ${span} 기출 <b>${ex.total}문항</b>(수리논술 기준) 중
    <b>${top}</b> 단원이 가장 많이 출제됐습니다.
    빈출 세부 키워드는 <b>${kw}</b> 등입니다.</p>
    ${subjectBars(ex)}`;
}

function buildDbDetail(s) {
  const el = document.createElement('div');
  el.className = 'db-detail';
  el.id = 'dbDetail';
  const notes = naturalExams(s).map(e => e.note).filter(Boolean).join(' / ');
  const ex = examData(s.id);

  const tendencyHtml = ex
    ? tendencySummary(s, ex)
    : (s.tendency
        ? `<p>${s.tendency}</p>`
        : `<div class="placeholder">📝 ${s.name}는 아직 기출 DB에 축적된 수리논술 문항이 없습니다(약술형 또는 수집 예정). 문항이 확보되는 대로 단원 분포를 공개합니다.</div>`);

  // 연도별 출제 단원 표 (실데이터)
  let yearTable = '';
  if (ex) {
    const rows = ex.years.map(y => `<tr>
      <td><b>${y.year}</b></td>
      <td>${y.total}</td>
      <td>${y.units.map(u => `<span class="unit-chip">${u.t} ${u.c}</span>`).join(' ')}</td>
    </tr>`).join('');
    yearTable = `
      <h4>연도별 출제 단원</h4>
      <div class="table-scroll">
      <table class="past-table">
        <thead><tr><th>연도</th><th>문항수</th><th>출제 단원 (문항수)</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      </div>
      <p style="font-size:12px;color:var(--ink-soft);margin-top:8px">
        * 본 연구소 기출 DB(수리논술 문항)를 단원별로 분류·집계한 결과입니다. 과학논술·인문/구술 문항은 제외했습니다.
        완답률(등급대별 난이도) 지표는 첨삭 답안 표본이 쌓인 문항부터 순차 공개합니다. <span class="badge soon">집계 예정</span>
      </p>`;
  }

  el.innerHTML = `
    <h3>${s.name} 기출 DB</h3>
    <div class="db-detail-meta">
      시험일 ${dateSummary(s)} · ${s.region}${s.reflect ? ` · ${s.reflect}` : ''}
      <br>🎯 수능최저: ${s.minDetail || '기준 확인중'}
      <span style="color:var(--ink-soft)">— 자연·의약학은 기준이 다를 수 있음, 요강 확인</span>
      ${notes ? `<br>※ ${notes}` : ''}
      ${!isDateConfirmed(s) ? '<br><span class="badge warn">확인 필요</span> 일정 미확정 — 모집요강 확인 필수' : ''}
    </div>
    <h4>출제 경향${ex ? ` <span class="badge soon">기출 ${ex.total}문항 분석</span>` : ''}</h4>
    ${tendencyHtml}
    ${yearTable}
    <div class="share-row" style="margin-top:14px">
      <a class="btn primary small" href="#contact">📩 ${s.name} 대비 상담 신청</a>
      <button class="btn ghost small db-close">닫기</button>
    </div>`;
  el.querySelector('.db-close').addEventListener('click', e => {
    e.stopPropagation();
    openDbId = null;
    renderDb();
  });
  return el;
}

/* ================= 상담 신청 CTA ================= */
function buildInquiry() {
  const name = document.getElementById('cfName').value.trim();
  const phone = document.getElementById('cfPhone').value.trim();
  const grade = document.getElementById('cfGrade').value.trim();
  const msg = document.getElementById('cfMsg').value.trim();
  const sel = state.selected.map(id => byId[id]);

  let body = `[수리논술 상담 신청]\n이름: ${name}\n연락처: ${phone}\n`;
  if (grade) body += `학년·성적대: ${grade}\n`;
  if (msg) body += `\n상담 내용:\n${msg}\n`;
  if (sel.length) {
    body += '\n[시뮬레이터에서 선택한 조합]\n';
    sel.forEach((s, i) => { body += `${i + 1}. ${s.name} — ${dateSummary(s)}\n`; });
    body += `조합 링크: ${location.href}\n`;
  }
  return { subject: `[수리논술 상담] ${name}`, body };
}

function renderContactCombo() {
  const el = document.getElementById('cfCombo');
  const sel = state.selected.map(id => byId[id]);
  el.hidden = !sel.length;
  if (sel.length) el.textContent = `✓ 선택한 조합 ${sel.length}개(${sel.map(s => s.name).join(', ')})가 신청 내용에 함께 담깁니다.`;
}

document.getElementById('cfEmail').textContent = META.contactEmail;

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const { subject, body } = buildInquiry();
  location.href = `mailto:${META.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.getElementById('cfCopyBtn').addEventListener('click', function () {
  if (!document.getElementById('contactForm').reportValidity()) return;
  const { body } = buildInquiry();
  navigator.clipboard.writeText(`받는 곳: ${META.contactEmail}\n\n${body}`).then(() => flash(this, '복사됨! ✓'));
});

/* ================= 초기화 ================= */
function renderAll() {
  renderPool();
  renderSlots();
  renderAnalysis();
  renderRecommend();
  renderContactCombo();
}

document.querySelectorAll('.chip-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    const { filter, value } = btn.dataset;
    state.filters[filter] = value;
    document.querySelectorAll(`.chip-filter[data-filter="${filter}"]`)
      .forEach(b => b.classList.toggle('active', b === btn));
    renderPool();
  });
});

document.getElementById('clearBtn').addEventListener('click', () => {
  state.selected = [];
  syncHash();
  renderAll();
});

document.getElementById('copyLinkBtn').addEventListener('click', function () {
  navigator.clipboard.writeText(location.href).then(() => flash(this, '복사됨! ✓'));
});
document.getElementById('copyTextBtn').addEventListener('click', function () {
  navigator.clipboard.writeText(buildShareText()).then(() => flash(this, '복사됨! ✓'));
});
document.getElementById('dbSearch').addEventListener('input', renderDb);

loadFromHash();
renderAll();
renderDb();

/* ============================================================
   2027학년도 논술전형 데이터
   수집일: 2026-07-02 (입시학원 블로그·대학 발표 자료 교차 수집)
   ⚠ confirmed:false 항목은 출처 간 불일치 또는 미발표 상태.
     반드시 각 대학 모집요강으로 최종 확인 후 갱신할 것.
   - session(오전/오후), tendency(출제 경향), pastStats(완답률)는
     추후 원장 첨삭 데이터/모집요강으로 채우는 필드. null = 미입력.
   - style/scope 는 유형 유사도 계산용 추정치(임시). 나중에 교체.
     proof(증명·논증), calc(계산), depth(심화도) : 1~5
   ============================================================ */

const META = {
  asOf: '2026-07-02',
  admissionYear: '2027학년도',
  suneung: '2026-11-19',
  contactEmail: 'dream152789@gmail.com', // 상담 신청 수신 주소 — 바꾸면 CTA에 자동 반영
};

const SCHOOLS = [
  /* ---------- 수능 전 ---------- */
  { id: 'uos', name: '서울시립대', region: '서울 동대문(전농)', format: '심층', tier: 1,
    minGrade: '없음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-10-03'], session: null, confirmed: true, note: null }],
    style: { proof: 5, calc: 3, depth: 4 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'sungshin', name: '성신여대', region: '서울 성북(돈암)', format: '심층', tier: 3,
    minGrade: null, reflect: null,
    exams: [{ track: '자연', dates: ['2026-10-03', '2026-10-04'], session: null, confirmed: false, note: '출처 간 10/3·10/4 불일치 — 요강 확인 필요' }],
    style: { proof: 2, calc: 3, depth: 2 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  { id: 'hongik', name: '홍익대(서울)', region: '서울 마포(상수)', format: '심층', tier: 2,
    minGrade: '있음', reflect: null,
    exams: [
      { track: '자연', dates: ['2026-10-04'], session: null, confirmed: false, note: null },
      { track: '인문', dates: ['2026-10-03'], session: null, confirmed: false, note: null },
    ],
    style: { proof: 3, calc: 4, depth: 3 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'yonsei', name: '연세대(서울)', region: '서울 서대문(신촌)', format: '심층', tier: 1,
    minGrade: '없음', reflect: '논술 100%',
    exams: [{ track: '자연', dates: ['2026-10-10'], session: null, confirmed: true, note: '수능 전 시행' }],
    style: { proof: 5, calc: 3, depth: 5 }, scope: ['수Ⅰ', '수Ⅱ', '미적분', '기하'],
    tendency: null, pastStats: null },

  { id: 'catholic', name: '가톨릭대', region: '부천(역곡·성심캠)', format: '심층', tier: 2,
    minGrade: null, reflect: null,
    exams: [
      { track: '자연', dates: ['2026-10-11'], session: null, confirmed: false, note: '일반 모집단위(자연·간호 등)' },
      { track: '자연', dates: ['2026-11-22'], session: null, confirmed: false, note: '의예·약학' },
    ],
    style: { proof: 3, calc: 3, depth: 3 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'cau_c', name: '중앙대(창의형)', region: '서울 동작(흑석)', format: '심층', tier: 1,
    minGrade: '없음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-10-11'], session: null, confirmed: false, note: '창의형 — 수능 전 시행' }],
    style: { proof: 3, calc: 4, depth: 4 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'yonsei_m', name: '연세대(미래)', region: '원주', format: '심층', tier: 2,
    minGrade: '없음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-10-16'], session: null, confirmed: false, note: '의예 — 수리+과학 논술' }],
    style: { proof: 4, calc: 3, depth: 4 }, scope: ['수Ⅰ', '수Ⅱ', '미적분', '과학'],
    tendency: null, pastStats: null },

  { id: 'dankook', name: '단국대(죽전)', region: '용인(죽전)', format: '심층', tier: 2,
    minGrade: '없음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-10-17', '2026-10-18'], session: null, confirmed: false, note: '10/17~18 중 계열별 날짜 확인 필요' }],
    style: { proof: 2, calc: 4, depth: 2 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'eulji', name: '을지대', region: '성남', format: '약술', tier: 4,
    minGrade: null, reflect: null,
    exams: [{ track: '자연', dates: ['2026-10-16', '2026-10-17', '2026-10-18'], session: null, confirmed: false, note: '약술형 — 날짜 출처 불일치' }],
    style: { proof: 1, calc: 3, depth: 1 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  { id: 'sangmyung', name: '상명대', region: '서울 종로(홍지)', format: '약술', tier: 3,
    minGrade: null, reflect: null,
    exams: [{ track: '자연', dates: ['2026-10-30'], session: null, confirmed: false, note: '약술형' }],
    style: { proof: 1, calc: 3, depth: 1 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  { id: 'seokyeong', name: '서경대', region: '서울 성북(정릉)', format: '약술', tier: 4,
    minGrade: null, reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-01'], session: null, confirmed: false, note: '약술형 — 수능 전' }],
    style: { proof: 1, calc: 3, depth: 1 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  /* ---------- 수능 직후 첫 주말 (11/21~22) ---------- */
  { id: 'korea', name: '고려대(서울)', region: '서울 성북(안암)', format: '심층', tier: 1,
    minGrade: '있음', reflect: '논술 100%',
    exams: [{ track: '자연', dates: ['2026-11-21', '2026-11-22'], session: null, confirmed: false, note: '11/21~22 — 계열·모집단위별 날짜 확인 필요(자연 11/21 유력)' }],
    style: { proof: 4, calc: 4, depth: 5 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'sogang', name: '서강대', region: '서울 마포(신수)', format: '심층', tier: 1,
    minGrade: '있음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-21', '2026-11-22'], session: null, confirmed: false, note: '11/21~22 — 계열별 날짜 확인 필요(자연 11/21 유력)' }],
    style: { proof: 4, calc: 4, depth: 4 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'skku', name: '성균관대', region: '수원(율전·자연캠)', format: '심층', tier: 1,
    minGrade: '있음', reflect: '논술 100%',
    exams: [{ track: '자연', dates: ['2026-11-21', '2026-11-22'], session: null, confirmed: false, note: '11/21~22 — 계열별 날짜 확인 필요(자연 11/22 유력)' }],
    style: { proof: 3, calc: 5, depth: 4 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'khu', name: '경희대', region: '서울(회기)·용인(국제캠)', format: '심층', tier: 1,
    minGrade: '있음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-21', '2026-11-22'], session: null, confirmed: false, note: '11/21~22 — 계열별 날짜 확인 필요 / 의약학은 수학+과학' }],
    style: { proof: 3, calc: 4, depth: 4 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'konkuk', name: '건국대', region: '서울 광진(화양)', format: '심층', tier: 2,
    minGrade: '있음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-21'], session: '오후', confirmed: false, note: '인문·통합 오전(9:20~) → 자연 오후 추정' }],
    style: { proof: 3, calc: 4, depth: 3 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'soongsil', name: '숭실대', region: '서울 동작(상도)', format: '심층', tier: 2,
    minGrade: '있음', reflect: '논술 90% + 교과 10%',
    exams: [{ track: '자연', dates: ['2026-11-21'], session: null, confirmed: true, note: '수학·수Ⅰ·수Ⅱ·미적분 출제(요강 확인)' }],
    style: { proof: 2, calc: 4, depth: 2 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'sookmyung', name: '숙명여대', region: '서울 용산(청파)', format: '심층', tier: 2,
    minGrade: '있음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-21', '2026-11-22'], session: null, confirmed: false, note: '11/21~22 — 계열별 날짜 확인 필요' }],
    style: { proof: 3, calc: 3, depth: 3 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'kau', name: '한국항공대', region: '고양(화전)', format: '심층', tier: 3,
    minGrade: null, reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-21'], session: null, confirmed: false, note: null }],
    style: { proof: 2, calc: 4, depth: 2 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'swu', name: '서울여대', region: '서울 노원(공릉)', format: '심층', tier: 3,
    minGrade: '없음', reflect: null,
    exams: [{ track: '인문', dates: ['2026-11-21'], session: null, confirmed: false, note: '자연계 실시 여부 확인 필요' }],
    style: { proof: 2, calc: 2, depth: 2 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  { id: 'dongguk', name: '동국대', region: '서울 중구(필동)', format: '심층', tier: 2,
    minGrade: '있음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-22'], session: null, confirmed: false, note: null }],
    style: { proof: 3, calc: 3, depth: 3 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'hongik_s', name: '홍익대(세종)', region: '세종', format: '약술', tier: 4,
    minGrade: null, reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-22'], session: null, confirmed: false, note: '약술형' }],
    style: { proof: 1, calc: 3, depth: 1 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  { id: 'suwon', name: '수원대', region: '화성(봉담)', format: '약술', tier: 4,
    minGrade: null, reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-22'], session: null, confirmed: false, note: '약술형' }],
    style: { proof: 1, calc: 3, depth: 1 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  { id: 'tukorea', name: '한국공학대', region: '시흥(정왕)', format: '약술', tier: 4,
    minGrade: null, reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-22'], session: null, confirmed: false, note: '약술형' }],
    style: { proof: 1, calc: 3, depth: 1 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  /* ---------- 수능 후 평일 ---------- */
  { id: 'seoultech', name: '서울과기대', region: '서울 노원(공릉)', format: '심층', tier: 2,
    minGrade: '없음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-23'], session: null, confirmed: false, note: '월요일 시행' }],
    style: { proof: 3, calc: 3, depth: 3 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'syu', name: '삼육대', region: '서울 노원(공릉)', format: '약술', tier: 4,
    minGrade: null, reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-23', '2026-11-24'], session: null, confirmed: false, note: '약술형 — 11/23~24' }],
    style: { proof: 1, calc: 3, depth: 1 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  { id: 'koreatech', name: '한국기술교대', region: '천안', format: '약술', tier: 4,
    minGrade: null, reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-25'], session: null, confirmed: false, note: '약술형' }],
    style: { proof: 1, calc: 3, depth: 1 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  { id: 'kyonggi', name: '경기대', region: '수원·서울', format: '약술', tier: 4,
    minGrade: null, reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-27'], session: null, confirmed: false, note: '금요일 시행 — 약술 유사 유형' }],
    style: { proof: 1, calc: 3, depth: 1 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  /* ---------- 둘째 주말 (11/28~29) ---------- */
  { id: 'hanyang', name: '한양대', region: '서울 성동(왕십리)', format: '심층', tier: 1,
    minGrade: '없음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-28'], session: null, confirmed: false, note: null }],
    style: { proof: 5, calc: 3, depth: 5 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'ewha', name: '이화여대', region: '서울 서대문(대현)', format: '심층', tier: 1,
    minGrade: '있음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-28'], session: null, confirmed: false, note: null }],
    style: { proof: 3, calc: 4, depth: 3 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'sejong', name: '세종대', region: '서울 광진(군자)', format: '심층', tier: 2,
    minGrade: '있음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-28'], session: null, confirmed: false, note: null }],
    style: { proof: 3, calc: 3, depth: 3 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'kwangwoon', name: '광운대', region: '서울 노원(월계)', format: '심층', tier: 2,
    minGrade: '없음', reflect: '논술 80% + 교과 20%',
    exams: [
      { track: '자연', dates: ['2026-11-28'], session: null, confirmed: true, note: null },
      { track: '인문', dates: ['2026-11-29'], session: null, confirmed: true, note: null },
    ],
    style: { proof: 2, calc: 4, depth: 2 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'pnu', name: '부산대', region: '부산(장전)', format: '심층', tier: 2,
    minGrade: '있음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-28'], session: null, confirmed: false, note: null }],
    style: { proof: 3, calc: 3, depth: 3 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'knu', name: '경북대', region: '대구(산격)', format: '심층', tier: 2,
    minGrade: '있음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-28'], session: null, confirmed: false, note: 'AAT 유형(객관식+서술 혼합)' }],
    style: { proof: 2, calc: 3, depth: 2 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'korea_s', name: '고려대(세종)', region: '세종', format: '심층', tier: 3,
    minGrade: null, reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-28'], session: null, confirmed: false, note: null }],
    style: { proof: 2, calc: 4, depth: 2 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'kangnam', name: '강남대', region: '용인(구갈)', format: '약술', tier: 4,
    minGrade: null, reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-28'], session: null, confirmed: false, note: '약술형' }],
    style: { proof: 1, calc: 3, depth: 1 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  { id: 'cau', name: '중앙대(일반)', region: '서울 동작(흑석)', format: '심층', tier: 1,
    minGrade: null, reflect: '논술 100%',
    exams: [{ track: '자연', dates: ['2026-11-29'], session: null, confirmed: false, note: '수능최저 폐지/유지 출처 상충 — 요강 확인 필수' }],
    style: { proof: 3, calc: 4, depth: 3 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'duksung', name: '덕성여대', region: '서울 도봉(쌍문)', format: '심층', tier: 3,
    minGrade: null, reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-29'], session: null, confirmed: false, note: '유형(심층/약술) 확인 필요' }],
    style: { proof: 2, calc: 3, depth: 2 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  { id: 'shinhan', name: '신한대', region: '의정부', format: '약술', tier: 4,
    minGrade: null, reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-29'], session: null, confirmed: false, note: '약술형' }],
    style: { proof: 1, calc: 3, depth: 1 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  { id: 'gachon', name: '가천대', region: '성남(태평)', format: '약술', tier: 3,
    minGrade: '있음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-11-29', '2026-11-30', '2026-12-01'], session: null, confirmed: false, note: '11/29~12/1 — 모집단위별 지정일 확인 필요' }],
    style: { proof: 1, calc: 3, depth: 1 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  /* ---------- 마지막 주말 (12/5~6) ---------- */
  { id: 'kookmin', name: '국민대', region: '서울 성북(정릉)', format: '약술', tier: 3,
    minGrade: '있음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-12-05', '2026-12-06'], session: null, confirmed: false, note: '약술형 — 12/5~6 중 계열별 날짜 확인 필요' }],
    style: { proof: 1, calc: 3, depth: 1 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  { id: 'inha', name: '인하대', region: '인천(용현)', format: '심층', tier: 2,
    minGrade: '없음', reflect: null,
    exams: [
      { track: '인문', dates: ['2026-12-05'], session: null, confirmed: true, note: null },
      { track: '자연', dates: ['2026-12-05', '2026-12-06'], session: null, confirmed: false, note: '자연 날짜 확인 필요(12/6 유력) / 의약학은 최저 있음' },
    ],
    style: { proof: 3, calc: 4, depth: 3 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },

  { id: 'hanshin', name: '한신대', region: '오산', format: '약술', tier: 4,
    minGrade: null, reflect: null,
    exams: [{ track: '자연', dates: ['2026-12-05'], session: null, confirmed: false, note: '약술형' }],
    style: { proof: 1, calc: 3, depth: 1 }, scope: ['수Ⅰ', '수Ⅱ'],
    tendency: null, pastStats: null },

  { id: 'ajou', name: '아주대', region: '수원(원천)', format: '심층', tier: 2,
    minGrade: '없음', reflect: null,
    exams: [{ track: '자연', dates: ['2026-12-06'], session: null, confirmed: false, note: '의약학은 최저 있음' }],
    style: { proof: 3, calc: 3, depth: 3 }, scope: ['수Ⅰ', '수Ⅱ', '미적분'],
    tendency: null, pastStats: null },
];

/* ------------------------------------------------------------
   수능최저 상세 (2026-07-02 수집 — 대부분 "인문/대표 기준 참고치")
   ⚠ 자연계열은 수학(미적/기하)·과탐 지정 등 조건이 다를 수 있고,
     의약학 계열은 별도 상향 기준. null = 기준 미수집(확인중).
   출처: 코어스터디(2026.6.12 최저 총정리), 목동키(중앙대 폐지),
         이카루스(광운대 확정), 아르케랩·메이드학원 등 교차.
   ------------------------------------------------------------ */
const MIN_DETAIL = {
  yonsei:    '최저 없음',
  uos:       '최저 없음',
  hanyang:   '최저 없음 (논술·교과 모두 미적용)',
  kwangwoon: '최저 없음 (확정)',
  seoultech: '최저 없음',
  dankook:   '최저 없음',
  swu:       '최저 없음',
  yonsei_m:  '최저 없음 (2027 폐지)',
  ajou:      '최저 없음 · 의약학 계열만 적용',
  inha:      '최저 없음 · 의약학 계열만 적용',
  sogang:    '3합 6 + 한국사 4 (참고치)',
  skku:      '3합 6 · 일부 자연 3합 5 강화 · 탐구 2과목 평균 (참고치)',
  khu:       '3합 7 수준 + 한국사 5 (참고치)',
  konkuk:    '3합 7 수준 + 한국사 5 (참고치)',
  dongguk:   '3합 7 수준 + 한국사 4 (참고치)',
  hongik:    '2합 5 (한국사 포함) — 2027 대폭 완화',
  cau:       '폐지 발표(2월 자료) vs 3합 6 유지(6월 자료) 상충 — 요강 확인 필수',
  cau_c:     '창의형 — 최저 미적용(확인 필요)',
  korea:     '적용 · 기준 확인중 (한국사 4 별도)',
  soongsil:  '적용 · 2개 영역 반영(2027 완화) — 등급 합 확인중',
  sookmyung: '적용 · 기준 확인중',
  ewha:      '적용 · 기준 확인중',
  sejong:    '적용 · 기준 확인중',
  pnu:       '적용 + 한국사 4 · 기준 확인중',
  knu:       '적용 · 기준 확인중',
  gachon:    '적용 · 기준 확인중',
  kookmin:   '적용 · 기준 확인중',
  catholic:  '일반 확인중 · 의예/약학은 상향 기준',
};
SCHOOLS.forEach(s => { s.minDetail = MIN_DETAIL[s.id] || null; });

/* 기출 DB — 학교별 연도 리스트.
   full(완답률)·byGrade(등급대별 완답률)는 첨삭 데이터 집계 후 입력.
   예: { year: 2026, problems: [{ no: '1-1', topic: '미적분·접선', full: 34, byGrade: {1: 71, 2: 52, 3: 28} }] } */
const PAST_DB_YEARS = [2026, 2025, 2024, 2023, 2022];

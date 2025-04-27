// instructor-database.js: 상세페이지에서 URL의 idx 파라미터로 강사 정보 동적 표시

// 강사 정보 등록 폼 구조에 맞는 임의 강사 10명 데이터
const instructors = [
    {
        // 기본 정보
        name: '김마음',
        phone: '010-1234-5678',
        email: 'maeum@university.ac.kr',
        organization: '○○대학교 심리학과',
        position: '부교수 / 15년 경력',
        profileImage: '',
        privacySettings: ['phone'],
        // 전문 분야
        mainFields: ['노인심리', '트라우마 관리', '종사자 소진 예방'],
        specialTopics: '노인 우울증 개입 전략, 외상 후 스트레스 관리, 돌봄종사자 자기돌봄',
        teachingScope: '심리지원교육 전반, 상담 실습',
        // 강의 특성
        teachingStyle: '혼합형',
        styleMixedRatio: '이론 30% + 실습 70%',
        optimalSize: '15-20명',
        pedagogyMethods: ['소그룹 활동', '역할극', '마음챙김 실습'],
        teachingMethod: ['집합교육', '온라인'],
        // 강의 이력
        lectureHistory: [
            { date: '2024-03-15', topic: '트라우마 관리와 회복', target: '생활지원사', organization: '부산광역지원기관', participants: 30, method: '집합교육', time: '3시간', summary: '트라우마 관리 실습', note: '', rating: 4.8 },
            { date: '2024-05-20', topic: '돌봄종사자 소진 예방', target: '생활지원사', organization: '경남광역지원기관', participants: 25, method: '집합교육', time: '2시간', summary: '소진 예방 워크숍', note: '', rating: 4.9 },
            { date: '2024-07-10', topic: '노인 우울증 이해와 개입', target: '생활지원사', organization: '울산광역지원기관', participants: 20, method: '온라인', time: '2시간', summary: '우울증 개입 전략', note: '', rating: 4.7 }
        ],
        historyNote: '',
        // 종합 평가
        satisfactionRating: 5,
        expertiseRating: 5,
        pedagogyRating: 5,
        overallEvaluation: '이론과 실습을 균형있게 구성하며, 참여자 상호작용을 효과적으로 유도함',
        strengthsWeaknesses: '',
        recommendingAgency: '경남광역지원기관',
        recommender: '김수연',
        recommendationLevel: 'high',
        feedbackSummary: '실제 사례를 바탕으로 한 실습이 매우 유익했음. 전문성과 현장 이해도가 높음.',
        // 비용 및 일정
        feeBasis: '시간당 25만원 (하루 최대 4시간)',
        availableDays: [
            { day: '화', available: true, start: '09:00', end: '17:00' },
            { day: '목', available: true, start: '09:00', end: '17:00' },
            { day: '금', available: true, start: '09:00', end: '17:00' }
        ],
        regions: ['전국'],
        regionNote: '숙박 필요시 사전 협의',
        // 강의 자료
        materialsList: '트라우마 관리 워크북, 소진 자가진단 도구, 케이스 스터디 자료 10종',
        sampleLecture: '', // 파일 경로(샘플 강의안)
        worksheets: '', // 파일 경로(워크시트)
        sharingConsent: 'yes',
        sharingConditionsText: '',
        // 기타
        privacyConsent: true,
        registerDate: '2024-06-01',
        updateDate: '2024-06-10'
    },
    {
        // 기본 정보
        name: '박실무',
        phone: '010-5555-6666',
        email: 'parkteach@example.com',
        organization: '경기상담센터',
        position: '전문 강사',
        profileImage: '',
        privacySettings: [],
        // 전문 분야
        mainFields: ['노인 의사소통', '트라우마 관리'],
        specialTopics: '노인 의사소통, 트라우마 관리',
        teachingScope: '현장 실무 중심 강의',
        // 강의 특성
        teachingStyle: '실습 중심',
        styleMixedRatio: '',
        optimalSize: '20명',
        pedagogyMethods: ['실습', '사례연구'],
        teachingMethod: ['집합교육'],
        // 강의 이력
        lectureHistory: [
            { date: '2023-11-05', topic: '트라우마 관리', target: '생활지원사', organization: '경기상담센터', participants: 20, method: '집합교육', time: '2시간', summary: '트라우마 관리 실습', note: '', rating: 4.9 }
        ],
        historyNote: '',
        // 종합 평가
        satisfactionRating: 5,
        expertiseRating: 4,
        pedagogyRating: 5,
        overallEvaluation: '참여자 만족도 매우 높음',
        strengthsWeaknesses: '',
        recommendingAgency: '경기도복지재단',
        recommender: '최담당',
        recommendationLevel: 'high',
        feedbackSummary: '',
        // 비용 및 일정
        feeBasis: '시간당 20만원',
        availableDays: [
            { day: '월', available: true, start: '10:00', end: '16:00' },
            { day: '금', available: true, start: '10:00', end: '16:00' }
        ],
        regions: ['경기', '서울'],
        regionNote: '',
        // 강의 자료
        materialsList: '트라우마 관리 교재',
        sampleLecture: '',
        worksheets: '',
        sharingConsent: 'conditional',
        sharingConditionsText: '사전 협의 필요',
        // 기타
        privacyConsent: true,
        registerDate: '2024-05-15',
        updateDate: '2024-06-01'
    },
    {
        name: '김전문',
        email: 'kimpro@example.com',
        phone: '010-1111-2222',
        organization: '서울노인복지센터',
        position: '수석 상담사',
        specialTopics: '노인상담, 소진예방',
        mainFields: ['상담', '소진예방'],
        region: '서울',
        target: '전담사회복지사 대상',
        rating: 4.5,
        reviews: 23,
        detail: '노인상담 및 소진예방 전문가로, 서울 지역에서 10년 이상 활동. 다양한 실무 경험과 사례를 바탕으로 강의 진행.',
        lectureHistory: [
            { date: '2024-03-01', topic: '노인상담의 실제', target: '전담사회복지사', organization: '서울노인복지센터', participants: 30, rating: 4.7 },
            { date: '2023-12-15', topic: '소진예방 워크숍', target: '전담사회복지사', organization: '서울시청', participants: 25, rating: 4.5 }
        ],
        availableDays: ['월', '수', '금'],
        materialsList: ['노인상담 교안', '소진예방 실습자료'],
        overallEvaluation: '실무 중심의 강의로 높은 만족도',
        recommendingAgency: '서울시복지재단',
        recommender: '이담당',
        otherInfo: '현장 실습 경험 다수'
    },
    {
        name: '이교육',
        email: 'leeedu@example.com',
        phone: '010-3333-4444',
        organization: '부산교육복지관',
        position: '교육팀장',
        specialTopics: '프로그램 개발/평가, ICT 활용',
        mainFields: ['프로그램 개발', 'ICT 활용'],
        region: '부산',
        target: '전담사회복지사, 생활지원사 대상',
        rating: 4.0,
        reviews: 18,
        detail: 'ICT 활용 및 프로그램 개발/평가를 전문으로 하며 부산 및 경남권에서 활발히 활동.',
        lectureHistory: [
            { date: '2024-02-10', topic: 'ICT 활용 교육', target: '생활지원사', organization: '부산교육복지관', participants: 40, rating: 4.2 }
        ],
        availableDays: ['화', '목'],
        materialsList: ['ICT 실습자료', '프로그램 평가 매뉴얼'],
        overallEvaluation: '참여형 교육 진행',
        recommendingAgency: '부산사회서비스원',
        recommender: '박추천',
        otherInfo: ''
    },
    {
        name: '박강사',
        email: 'parkteach@example.com',
        phone: '010-5555-6666',
        organization: '경기상담센터',
        position: '전문 강사',
        specialTopics: '노인 의사소통, 트라우마 관리',
        mainFields: ['의사소통', '트라우마 관리'],
        region: '경기',
        target: '생활지원사 대상',
        rating: 4.9,
        reviews: 21,
        detail: '노인 의사소통 및 트라우마 관리 분야에서 다수의 현장 강의 경험 보유.',
        lectureHistory: [
            { date: '2023-11-05', topic: '트라우마 관리', target: '생활지원사', organization: '경기상담센터', participants: 20, rating: 4.9 }
        ],
        availableDays: ['월', '화', '금'],
        materialsList: ['트라우마 관리 교재'],
        overallEvaluation: '참여자 만족도 매우 높음',
        recommendingAgency: '경기도복지재단',
        recommender: '최담당',
        otherInfo: '트라우마 전문 자격증 보유'
    },
    {
        name: '최경력',
        email: 'choicareer@example.com',
        phone: '010-7777-8888',
        organization: '대구복지관',
        position: '위기관리팀장',
        specialTopics: '사례관리, 위기 대응',
        mainFields: ['사례관리', '위기 대응'],
        region: '대구',
        target: '전담사회복지사 대상',
        rating: 4.2,
        reviews: 15,
        detail: '위기 대응 및 사례관리 분야에서 15년 경력의 베테랑 강사.',
        lectureHistory: [
            { date: '2024-01-20', topic: '위기 대응 실제', target: '전담사회복지사', organization: '대구복지관', participants: 35, rating: 4.3 }
        ],
        availableDays: ['수', '목'],
        materialsList: ['위기관리 매뉴얼'],
        overallEvaluation: '경험 기반 강의',
        recommendingAgency: '대구광역시청',
        recommender: '정추천',
        otherInfo: ''
    },
    {
        name: '정상담',
        email: 'jeongcounsel@example.com',
        phone: '010-9999-0000',
        organization: '광주심리지원센터',
        position: '상담실장',
        specialTopics: '스트레스 관리, 자기돌봄',
        mainFields: ['스트레스 관리', '자기돌봄'],
        region: '광주',
        target: '생활지원사, 전담사회복지사 대상',
        rating: 4.7,
        reviews: 17,
        detail: '스트레스 관리와 자기돌봄의 실제적 방법을 제시하는 강의로 높은 만족도.',
        lectureHistory: [
            { date: '2024-03-10', topic: '자기돌봄 워크숍', target: '전담사회복지사', organization: '광주심리지원센터', participants: 28, rating: 4.8 }
        ],
        availableDays: ['월', '금'],
        materialsList: ['자기돌봄 실습자료'],
        overallEvaluation: '실습 위주 강의',
        recommendingAgency: '광주시복지재단',
        recommender: '오추천',
        otherInfo: ''
    },
    {
        name: '강우수',
        email: 'kangbest@example.com',
        phone: '010-1212-3434',
        organization: '경남서비스센터',
        position: '행정팀장',
        specialTopics: '행정/회계, 서비스 제공 매뉴얼',
        mainFields: ['행정', '회계'],
        region: '경남',
        target: '행정인력, 전담사회복지사 대상',
        rating: 4.1,
        reviews: 12,
        detail: '현장 행정 실무와 회계, 서비스 제공 매뉴얼 분야의 실전 강의.',
        lectureHistory: [
            { date: '2023-10-15', topic: '행정 실무', target: '행정인력', organization: '경남서비스센터', participants: 18, rating: 4.0 }
        ],
        availableDays: ['화', '목'],
        materialsList: ['행정 실무 자료'],
        overallEvaluation: '실무 적용도 높음',
        recommendingAgency: '경남복지재단',
        recommender: '유추천',
        otherInfo: ''
    },
    {
        name: '오현장',
        email: 'ohfield@example.com',
        phone: '010-5656-7878',
        organization: '울산현장교육원',
        position: '실습강사',
        specialTopics: '현장실습, 응급처치',
        mainFields: ['현장실습', '응급처치'],
        region: '울산',
        target: '생활지원사 대상',
        rating: 4.3,
        reviews: 10,
        detail: '응급처치와 현장실습 노하우를 전수하는 실습 중심 강사.',
        lectureHistory: [
            { date: '2023-09-05', topic: '응급처치 실습', target: '생활지원사', organization: '울산현장교육원', participants: 22, rating: 4.4 }
        ],
        availableDays: ['수', '금'],
        materialsList: ['응급처치 매뉴얼'],
        overallEvaluation: '실습 효과 우수',
        recommendingAgency: '울산복지관',
        recommender: '문추천',
        otherInfo: ''
    },
    {
        name: '유전문',
        email: 'youtech@example.com',
        phone: '010-2323-4545',
        organization: '서울AI교육센터',
        position: 'AI교육 강사',
        specialTopics: '빅데이터, AI교육',
        mainFields: ['빅데이터', 'AI교육'],
        region: '서울',
        target: '전담사회복지사, 생활지원사 대상',
        rating: 4.8,
        reviews: 19,
        detail: 'AI 및 빅데이터 교육 분야에서 최신 트렌드와 실무 적용 사례 강의.',
        lectureHistory: [
            { date: '2024-04-01', topic: 'AI 실무 교육', target: '전담사회복지사', organization: '서울AI교육센터', participants: 32, rating: 4.9 }
        ],
        availableDays: ['월', '수'],
        materialsList: ['AI 실습자료', '빅데이터 교안'],
        overallEvaluation: '최신 트렌드 반영',
        recommendingAgency: '서울혁신센터',
        recommender: '신추천',
        otherInfo: ''
    },
    {
        name: '문상세',
        email: 'mooninfo@example.com',
        phone: '010-9898-7878',
        organization: '전북사례관리센터',
        position: '사례관리사',
        specialTopics: '사례관리, ICT 활용',
        mainFields: ['사례관리', 'ICT 활용'],
        region: '전북',
        target: '전담사회복지사 대상',
        rating: 4.4,
        reviews: 14,
        detail: 'ICT 활용 기반의 사례관리 강의로 높은 호응.',
        lectureHistory: [
            { date: '2023-12-20', topic: 'ICT 기반 사례관리', target: '전담사회복지사', organization: '전북사례관리센터', participants: 27, rating: 4.5 }
        ],
        availableDays: ['화', '목'],
        materialsList: ['사례관리 실습자료'],
        overallEvaluation: 'ICT 실무 적용',
        recommendingAgency: '전북복지재단',
        recommender: '강추천',
        otherInfo: ''
    },
    {
        name: '신리뷰',
        email: 'shinreview@example.com',
        phone: '010-5656-1212',
        organization: '강원상담센터',
        position: '상담전문가',
        specialTopics: '상담, 위기개입',
        mainFields: ['상담', '위기개입'],
        region: '강원',
        target: '생활지원사 대상',
        rating: 4.6,
        reviews: 11,
        detail: '상담 및 위기개입 분야의 실전 사례 중심 강의.',
        lectureHistory: [
            { date: '2024-01-15', topic: '위기개입 사례', target: '생활지원사', organization: '강원상담센터', participants: 19, rating: 4.7 }
        ],
        availableDays: ['월', '수', '금'],
        materialsList: ['상담 사례집'],
        overallEvaluation: '실전 사례 중심',
        recommendingAgency: '강원복지재단',
        recommender: '이추천',
        otherInfo: ''
    }
];
window.instructors = instructors;

// DOM이 로드된 후 실행
document.addEventListener("DOMContentLoaded", function() {
    // 강사 목록을 HTML에 렌더링
    renderInstructorList();
    
    // 검색 버튼 이벤트 리스너 추가
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            filterInstructors();
        });
    }

    // 정렬 드롭다운 이벤트 리스너 추가
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            filterInstructors();
        });
    }
    
    // 키워드 검색 필드에 엔터키 이벤트 리스너 추가
    const keywordInput = document.getElementById('keyword');
    if (keywordInput) {
        keywordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterInstructors();
            }
        });
    }
    
    // 온라인 상태 모니터링 초기화
    initOnlineStatusIndicator();
    
    // 고급 필터 토글 버튼 추가
    addAdvancedFilterToggle();
});

// 온라인 상태 표시기 추가
function initOnlineStatusIndicator() {
    // 헤더의 네비게이션 액션 영역에 상태 표시기 추가
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;
    
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'onlineStatusIndicator';
    navActions.prepend(statusIndicator);
    
    // utils.js의 함수 호출
    if (typeof window.initOnlineStatusMonitor === 'function') {
        window.initOnlineStatusMonitor();
    } else {
        // utils.js가 로드되지 않은 경우 직접 구현
        function updateOnlineStatus() {
            if (navigator.onLine) {
                statusIndicator.className = 'online-status online';
                statusIndicator.innerHTML = '<i class="fas fa-wifi"></i> 온라인';
            } else {
                statusIndicator.className = 'online-status offline';
                statusIndicator.innerHTML = '<i class="fas fa-exclamation-triangle"></i> 오프라인';
            }
        }
        
        updateOnlineStatus();
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
    }
}

// 고급 필터 토글 추가
function addAdvancedFilterToggle() {
    const searchForm = document.querySelector('.search-form');
    if (!searchForm) return;
    
    // 고급 필터 영역 생성
    const advancedFilters = document.createElement('div');
    advancedFilters.className = 'advanced-filters';
    advancedFilters.style.display = 'none';
    
    // 고급 필터 내용
    advancedFilters.innerHTML = `
        <div class="search-row">
            <div class="search-group">
                <label for="yearsOfExperience">경력 연수</label>
                <select id="yearsOfExperience" name="yearsOfExperience">
                    <option value="">전체</option>
                    <option value="0-5">0-5년</option>
                    <option value="5-10">5-10년</option>
                    <option value="10+">10년 이상</option>
                </select>
            </div>
            <div class="search-group">
                <label for="teachingStyle">강의 스타일</label>
                <select id="teachingStyle" name="teachingStyle">
                    <option value="">전체</option>
                    <option value="이론중심">이론 중심</option>
                    <option value="실습중심">실습 중심</option>
                    <option value="혼합형">혼합형</option>
                </select>
            </div>
            <div class="search-group">
                <label for="contentFreshness">정보 최신성</label>
                <select id="contentFreshness" name="contentFreshness">
                    <option value="">전체</option>
                    <option value="30">최근 30일</option>
                    <option value="90">최근 3개월</option>
                    <option value="180">최근 6개월</option>
                    <option value="365">최근 1년</option>
                </select>
            </div>
        </div>
        <div class="search-row">
            <div class="search-group">
                <label for="rating">최소 평점</label>
                <select id="rating" name="rating">
                    <option value="">전체</option>
                    <option value="4.5">4.5 이상</option>
                    <option value="4.0">4.0 이상</option>
                    <option value="3.5">3.5 이상</option>
                    <option value="3.0">3.0 이상</option>
                </select>
            </div>
            <div class="search-group">
                <label for="availability">가용 요일</label>
                <select id="availability" name="availability">
                    <option value="">전체</option>
                    <option value="월">월요일</option>
                    <option value="화">화요일</option>
                    <option value="수">수요일</option>
                    <option value="목">목요일</option>
                    <option value="금">금요일</option>
                </select>
            </div>
            <div class="search-group">
                <label for="materials">자료 보유</label>
                <select id="materials" name="materials">
                    <option value="">전체</option>
                    <option value="워크북">워크북</option>
                    <option value="PPT">PPT</option>
                    <option value="동영상">동영상</option>
                    <option value="워크시트">워크시트</option>
                </select>
            </div>
        </div>
    `;
    
    // 검색 폼 아래에 추가
    searchForm.appendChild(advancedFilters);
    
    // 토글 버튼 추가
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'advanced-filter-toggle';
    toggleButton.innerHTML = '<i class="fas fa-sliders-h"></i> 고급 필터';
    
    // 첫 번째 search-row 다음에 토글 버튼 추가
    const firstSearchRow = searchForm.querySelector('.search-row');
    if (firstSearchRow) {
        firstSearchRow.after(toggleButton);
    }
    
    // 토글 버튼 이벤트 리스너
    toggleButton.addEventListener('click', function() {
        if (advancedFilters.style.display === 'none') {
            advancedFilters.style.display = 'block';
            toggleButton.innerHTML = '<i class="fas fa-times"></i> 고급 필터 닫기';
        } else {
            advancedFilters.style.display = 'none';
            toggleButton.innerHTML = '<i class="fas fa-sliders-h"></i> 고급 필터';
        }
    });
    
    // 고급 필터 변경 이벤트 리스너 추가
    const filterSelects = advancedFilters.querySelectorAll('select');
    filterSelects.forEach(select => {
        select.addEventListener('change', filterInstructors);
    });
}

// 강사 목록 필터링
function filterInstructors() {
    const regionFilter = document.getElementById('region').value;
    const specialityFilter = document.getElementById('speciality').value;
    const targetFilter = document.getElementById('target').value;
    const keywordFilter = document.getElementById('keyword').value.toLowerCase();
    const sortOption = document.getElementById('sort').value;
    
    // 고급 필터 값 가져오기
    const yearsOfExperienceFilter = document.getElementById('yearsOfExperience')?.value || '';
    const teachingStyleFilter = document.getElementById('teachingStyle')?.value || '';
    const freshessFilter = document.getElementById('contentFreshness')?.value || '';
    const ratingFilter = document.getElementById('rating')?.value || '';
    const availabilityFilter = document.getElementById('availability')?.value || '';
    const materialsFilter = document.getElementById('materials')?.value || '';
    
    // 필터링된 강사 목록
    let filteredInstructors = [...instructors];
    
    // 기본 필터 적용
    if (regionFilter) {
        filteredInstructors = filteredInstructors.filter(instructor => 
            instructor.region === regionFilter || 
            (instructor.regions && instructor.regions.includes(regionFilter))
        );
    }
    
    if (specialityFilter) {
        filteredInstructors = filteredInstructors.filter(instructor => 
            (instructor.mainFields && instructor.mainFields.includes(specialityFilter)) ||
            (instructor.specialTopics && instructor.specialTopics.includes(specialityFilter))
        );
    }
    
    if (targetFilter) {
        filteredInstructors = filteredInstructors.filter(instructor => 
            instructor.target && instructor.target.includes(targetFilter)
        );
    }
    
    if (keywordFilter) {
        filteredInstructors = filteredInstructors.filter(instructor => {
            // 이름, 소속기관, 전문분야, 세부전문주제 등에서 검색
            return (
                instructor.name.toLowerCase().includes(keywordFilter) ||
                (instructor.organization && instructor.organization.toLowerCase().includes(keywordFilter)) ||
                (instructor.specialTopics && instructor.specialTopics.toLowerCase().includes(keywordFilter)) ||
                (instructor.mainFields && instructor.mainFields.some(field => field.toLowerCase().includes(keywordFilter))) ||
                (instructor.detail && instructor.detail.toLowerCase().includes(keywordFilter))
            );
        });
    }
    
    // 고급 필터 적용
    if (yearsOfExperienceFilter) {
        filteredInstructors = filteredInstructors.filter(instructor => {
            if (!instructor.position) return false;
            
            const match = instructor.position.match(/(\d+)년 경력/);
            if (!match) return false;
            
            const years = parseInt(match[1]);
            
            switch (yearsOfExperienceFilter) {
                case '0-5': return years >= 0 && years <= 5;
                case '5-10': return years > 5 && years <= 10;
                case '10+': return years > 10;
                default: return true;
            }
        });
    }
    
    if (teachingStyleFilter) {
        filteredInstructors = filteredInstructors.filter(instructor => 
            instructor.teachingStyle === teachingStyleFilter
        );
    }
    
    if (freshessFilter) {
        const days = parseInt(freshessFilter);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        filteredInstructors = filteredInstructors.filter(instructor => {
            if (!instructor.updateDate) return false;
            const updateDate = new Date(instructor.updateDate);
            return updateDate >= cutoffDate;
        });
    }
    
    if (ratingFilter) {
        const minRating = parseFloat(ratingFilter);
        filteredInstructors = filteredInstructors.filter(instructor => {
            // 종합 만족도 또는 평균 평점 확인
            const rating = instructor.satisfactionRating || instructor.rating || 0;
            return rating >= minRating;
        });
    }
    
    if (availabilityFilter) {
        filteredInstructors = filteredInstructors.filter(instructor => {
            if (instructor.availableDays) {
                if (Array.isArray(instructor.availableDays)) {
                    return instructor.availableDays.includes(availabilityFilter);
                } else {
                    // 가용 요일이 객체 배열인 경우 (강의 등록 폼 구조)
                    return instructor.availableDays.some(day => 
                        day.day === availabilityFilter && day.available
                    );
                }
            }
            return false;
        });
    }
    
    if (materialsFilter) {
        filteredInstructors = filteredInstructors.filter(instructor => 
            instructor.materialsList && instructor.materialsList.includes(materialsFilter)
        );
    }
    
    // 정렬 적용
    switch (sortOption) {
        case 'rating':
            filteredInstructors.sort((a, b) => {
                const ratingA = a.satisfactionRating || a.rating || 0;
                const ratingB = b.satisfactionRating || b.rating || 0;
                return ratingB - ratingA;
            });
            break;
        case 'recent':
            filteredInstructors.sort((a, b) => {
                const dateA = a.updateDate ? new Date(a.updateDate) : new Date(0);
                const dateB = b.updateDate ? new Date(b.updateDate) : new Date(0);
                return dateB - dateA;
            });
            break;
        case 'name':
            filteredInstructors.sort((a, b) => a.name.localeCompare(b.name));
            break;
        // 추천순은 기본 데이터 순서 유지
    }
    
    // 결과 표시
    renderInstructorList(filteredInstructors);
    
    // 결과 카운트 업데이트
    const resultCount = document.querySelector('.result-count span');
    if (resultCount) {
        resultCount.textContent = filteredInstructors.length;
    }
}

// 강사 목록 렌더링
function renderInstructorList(filteredList = instructors) {
    const instructorListElement = document.getElementById('instructorList');
    if (!instructorListElement) return;
    
    if (filteredList.length === 0) {
        instructorListElement.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>검색 결과가 없습니다</h3>
                <p>다른 검색어나 필터를 시도해보세요.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    filteredList.forEach((instructor, index) => {
        const rating = instructor.satisfactionRating || instructor.rating || 0;
        const reviews = instructor.reviews || 0;
        const updateDate = instructor.updateDate || '';
        
        // 최신성 상태 확인
        let freshnessClass = '';
        let freshnessLabel = '';
        
        if (updateDate) {
            const today = new Date();
            const lastUpdate = new Date(updateDate);
            const diffTime = Math.abs(today - lastUpdate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 30) {
                freshnessClass = 'recent';
                freshnessLabel = '<span class="freshness-tag recent">최신</span>';
            } else if (diffDays > 180) {
                freshnessClass = 'outdated';
                freshnessLabel = '<span class="freshness-tag outdated">업데이트 필요</span>';
            }
        }
        
        html += `
            <div class="col">
                <div class="instructor-card ${freshnessClass}">
                    <div class="instructor-photo">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="instructor-info">
                        <h4>${instructor.name} ${freshnessLabel}</h4>
                        <p class="instructor-meta">${instructor.organization || ''} · ${instructor.position || ''}</p>
                        <p class="instructor-speciality">${instructor.specialTopics || instructor.mainFields?.join(', ') || ''}</p>
                        <div class="instructor-rating">
                            <div class="stars">
                                ${getStars(rating)}
                            </div>
                            <span class="rating-score">${rating.toFixed(1)}</span>
                            <span class="rating-count">(${reviews})</span>
                        </div>
                        <a href="instructor-detail.html?idx=${index}" class="instructor-detail-link">상세 정보</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    instructorListElement.innerHTML = html;
    
    // 최신성 태그 스타일 추가
    if (!document.getElementById('freshness-style')) {
        const style = document.createElement('style');
        style.id = 'freshness-style';
        style.textContent = `
            .freshness-tag {
                display: inline-block;
                font-size: 12px;
                padding: 2px 6px;
                border-radius: 4px;
                margin-left: 8px;
                font-weight: normal;
            }
            .freshness-tag.recent {
                background-color: var(--success);
                color: white;
            }
            .freshness-tag.outdated {
                background-color: var(--warning);
                color: white;
            }
            .instructor-card.outdated {
                border-left: 3px solid var(--warning);
            }
            .instructor-card.recent {
                border-left: 3px solid var(--success);
            }
            .no-results {
                text-align: center;
                padding: 40px 0;
                width: 100%;
                color: var(--medium-gray);
            }
            .no-results i {
                font-size: 48px;
                margin-bottom: 16px;
                opacity: 0.5;
            }
            .advanced-filter-toggle {
                margin: 10px 0;
                background: none;
                border: 1px solid var(--light-gray);
                border-radius: var(--radius-sm);
                padding: 8px 16px;
                color: var(--medium-gray);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .advanced-filter-toggle:hover {
                background-color: var(--off-white);
                color: var(--primary);
                border-color: var(--primary);
            }
            .advanced-filters {
                margin-top: 15px;
                padding: 15px;
                background-color: var(--off-white);
                border-radius: var(--radius-md);
                border: 1px solid var(--light-gray);
            }
        `;
        document.head.appendChild(style);
    }
}

// 별점 표시 함수
function getStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    
    // 채워진 별
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // 반 별
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // 빈 별
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// URL 쿼리 파라미터 가져오기
function getQueryParam(key) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
}

// 함수 내보내기 - 다른 페이지에서 재사용
window.getQueryParam = getQueryParam;
window.getStars = getStars;
window.instructors = instructors;
window.renderInstructorList = renderInstructorList;
window.filterInstructors = filterInstructors;
// instructor-detail.js: 상세페이지에서 URL의 idx 파라미터로 강사 정보 동적 표시

// URL에서 idx 파라미터 추출
function getQueryParam(key) {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(key);
    } catch (error) {
        console.error('Error parsing URL parameters:', error);
        return null;
    }
}

// 강사 프로필 섹션 렌더링
function renderProfileSection(instructor) {
    return `
    <div class="profile-header mb-5">
        <div class="row align-items-center">
            <div class="col-lg-3 col-md-4 text-center text-md-start mb-4 mb-md-0">
                <div class="profile-image-container">
                    <img src="${instructor.profileImage || 'img/profile-default.png'}" alt="${instructor.name} 프로필" 
                         class="profile-image shadow border border-3 border-white" width="180" height="180">
                </div>
            </div>
            <div class="col-lg-9 col-md-8">
                <div class="d-md-flex align-items-center justify-content-between mb-3">
                    <div>
                        <h1 class="display-5 fw-bold mb-1">${instructor.name}</h1>
                        <p class="text-muted fs-5 mb-2">${instructor.position} | ${instructor.organization}</p>
                    </div>
                    <div class="mt-3 mt-md-0">
                        <div class="rating-badge p-2 rounded-3 d-inline-flex align-items-center">
                            <div class="stars me-2">
                                ${getRatingStars(instructor.satisfactionRating || instructor.rating || 0)}
                            </div>
                            <div>
                                <span class="fw-bold">${instructor.satisfactionRating || instructor.rating || '-'}</span>
                                <span class="text-muted small">${instructor.reviews ? `(${instructor.reviews}건)` : ''}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="instructor-tags mb-3">
                    ${(instructor.mainFields || []).map(field => 
                        `<span class="badge bg-primary rounded-pill me-2 mb-2 py-2 px-3">${field}</span>`
                    ).join('')}
                </div>
                <div class="d-flex mt-4">
                    <button class="btn btn-primary me-2" onclick="contactInstructor('${instructor.email}', '${instructor.phone}')">
                        <i class="bi bi-envelope-fill me-2"></i>연락하기
                    </button>
                    <button class="btn btn-outline-primary" onclick="saveInstructor(${instructor.idx})">
                        <i class="bi bi-bookmark me-2"></i>저장하기
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}

// 정보 카드 렌더링 (확장)
function renderInfoCard(title, items, icon) {
    return `
    <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-primary text-white py-3">
            <h5 class="card-title mb-0">
                <i class="bi ${icon} me-2"></i>${title}
            </h5>
        </div>
        <div class="card-body">
            <ul class="list-group list-group-flush">
                ${items.map(item => `
                    <li class="list-group-item px-0 py-3 border-bottom">
                        <div class="row">
                            <div class="col-md-4 col-lg-3 fw-bold text-muted">${item.label}</div>
                            <div class="col-md-8 col-lg-9">${item.value || '-'}</div>
                        </div>
                    </li>
                `).join('')}
            </ul>
        </div>
    </div>`;
}

// 첨부파일 렌더링
function renderFileLink(label, filePath) {
    if (!filePath) return '-';
    return `<a href="${filePath}" download class="btn btn-sm btn-outline-secondary ms-2">${label} 다운로드</a>`;
}

// 개인정보 공개범위 렌더링
function renderPrivacySettings(settings) {
    if (!settings || settings.length === 0) return '모두 공개';
    return settings.map(s => {
        if (s === 'phone') return '연락처 비공개';
        if (s === 'email') return '이메일 비공개';
        if (s === 'name') return '이름 비공개';
        return s;
    }).join(', ');
}

// 강의 가능 요일/시간 렌더링
function renderAvailableDays(days) {
    if (!days || !Array.isArray(days)) return '-';
    return days.map(d => d.available ? `${d.day} (${d.start}~${d.end})` : '').filter(Boolean).join(', ');
}

// 강의 이력 테이블 렌더링
function renderLectureHistoryTable(history) {
    if (!history || history.length === 0) {
        return `<div class="alert alert-info">강의 이력이 없습니다.</div>`;
    }
    
    return `
    <div class="table-responsive">
        <table class="table table-hover">
            <thead class="table-light">
                <tr>
                    <th>일자</th>
                    <th>주제</th>
                    <th>대상</th>
                    <th>기관</th>
                    <th>참여인원</th>
                    <th>평점</th>
                </tr>
            </thead>
            <tbody>
                ${(history || []).map(lh => `
                    <tr>
                        <td>${lh.date}</td>
                        <td>${lh.topic}</td>
                        <td>${lh.target}</td>
                        <td>${lh.organization}</td>
                        <td>${lh.participants}명</td>
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="text-warning me-1">${'★'.repeat(Math.floor(lh.rating))}</div>
                                <div>${lh.rating}</div>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>`;
}

// 별점 표시 생성
function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="bi bi-star-fill text-warning"></i>';
    }
    if (halfStar) {
        stars += '<i class="bi bi-star-half text-warning"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="bi bi-star text-warning"></i>';
    }
    
    return stars;
}

// 강사 연락하기 함수
function contactInstructor(email, phone) {
    alert(`강사에게 연락하기\n\n이메일: ${email}\n전화번호: ${phone}`);
}

// 강사 저장하기 함수
function saveInstructor(idx) {
    // localStorage를 활용한 강사 저장 기능
    let savedInstructors = JSON.parse(localStorage.getItem('savedInstructors') || '[]');
    if (!savedInstructors.includes(idx)) {
        savedInstructors.push(idx);
        localStorage.setItem('savedInstructors', JSON.stringify(savedInstructors));
        alert('강사가 저장되었습니다.');
    } else {
        alert('이미 저장된 강사입니다.');
    }
}

// 페이지 로딩 시 실행
window.addEventListener('DOMContentLoaded', function() {
    console.log('Detail page loaded');
    
    // 로딩 상태 표시
    const detailContainer = document.getElementById('instructorDetail');
    detailContainer.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">강사 정보를 불러오는 중입니다...</p>
        </div>
    `;
    
    // URL에서 idx 파라미터 추출 시도
    let idx = parseInt(getQueryParam('idx'));
    
    // URL에서 idx를 가져오지 못한 경우, ?idx= 이후 값 직접 추출 시도
    if (isNaN(idx)) {
        try {
            const search = window.location.search;
            if (search && search.includes('idx=')) {
                const idxStr = search.split('idx=')[1].split('&')[0];
                idx = parseInt(idxStr);
            }
        } catch (e) {
            console.error('Error with alternative idx extraction:', e);
        }
    }
    
    // 위 방법으로도 실패한 경우, URL 경로에서 추출 시도
    if (isNaN(idx)) {
        try {
            const path = window.location.pathname;
            const matches = path.match(/\/instructor-detail\/(\d+)/);
            if (matches && matches[1]) {
                idx = parseInt(matches[1]);
            }
        } catch (e) {
            console.error('Error with path-based idx extraction:', e);
        }
    }
    
    // 테스트를 위해 인덱스 0을 강제로 할당
    if (isNaN(idx)) {
        console.warn('Could not extract index from URL, using 0 for testing');
        idx = 0;
    }
    
    const instructors = window.instructors || window.debugInstructors || [];
    
    // 강사 정보가 없는 경우 처리
    if (!instructors || !instructors[idx]) {
        detailContainer.innerHTML = `
            <div class="alert alert-danger shadow-sm p-4 mx-auto" style="max-width: 600px;">
                <div class="d-flex">
                    <div class="me-3">
                        <i class="bi bi-exclamation-triangle-fill fs-1 text-danger"></i>
                    </div>
                    <div>
                        <h4 class="alert-heading">강사 정보를 찾을 수 없습니다.</h4>
                        <p class="mb-0">요청하신 강사 정보(인덱스: ${idx})를 찾을 수 없습니다. 다시 시도하거나 관리자에게 문의해주세요.</p>
                        <hr>
                        <a href="index.html" class="btn btn-outline-danger mt-2">강사 목록으로 돌아가기</a>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    const ins = instructors[idx];
    
    // 기본 정보
    const basicInfoItems = [
        { label: '이름', value: ins.name },
        { label: '연락처', value: ins.phone },
        { label: '이메일', value: ins.email },
        { label: '소속', value: ins.organization },
        { label: '직위/경력', value: ins.position },
        { label: '개인정보 공개범위', value: renderPrivacySettings(ins.privacySettings) },
        { label: '등록일', value: ins.registerDate },
        { label: '최종수정일', value: ins.updateDate }
    ];

    // 전문 분야/강의 특성
    const specialtyItems = [
        { label: '주요 강의 분야', value: (ins.mainFields || []).join(', ') },
        { label: '세부 전문 주제', value: ins.specialTopics },
        { label: '교육 범위 및 특징', value: ins.teachingScope },
        { label: '강의 스타일', value: ins.teachingStyle + (ins.styleMixedRatio ? ` (${ins.styleMixedRatio})` : '') },
        { label: '최적 교육 인원', value: ins.optimalSize },
        { label: '선호 교수법', value: (ins.pedagogyMethods || []).join(', ') },
        { label: '강의 방식', value: (ins.teachingMethod || []).join(', ') }
    ];

    // 비용/일정/출장
    const scheduleItems = [
        { label: '강사비 기준', value: ins.feeBasis },
        { label: '강의 가능 요일/시간', value: renderAvailableDays(ins.availableDays) },
        { label: '출장 가능 지역', value: (ins.regions || []).join(', ') },
        { label: '지역 참고사항', value: ins.regionNote }
    ];

    // 강의 자료/첨부파일
    const materialItems = [
        { label: '보유 강의자료', value: ins.materialsList },
        { label: '샘플 강의안', value: renderFileLink('샘플 강의안', ins.sampleLecture) },
        { label: '워크시트/활동지', value: renderFileLink('워크시트', ins.worksheets) },
        { label: '자료 공유 동의', value: ins.sharingConsent },
        { label: '자료 공유 조건', value: ins.sharingConditionsText }
    ];

    // 종합 평가/피드백
    const evaluationItems = [
        { label: '강의 만족도', value: ins.satisfactionRating },
        { label: '전문성', value: ins.expertiseRating },
        { label: '교수법', value: ins.pedagogyRating },
        { label: '담당자 종합 평가', value: ins.overallEvaluation },
        { label: '강점 및 개선점', value: ins.strengthsWeaknesses },
        { label: '교육생 피드백 요약', value: ins.feedbackSummary },
        { label: '추천기관', value: ins.recommendingAgency },
        { label: '추천 담당자', value: ins.recommender },
        { label: '재초빙 추천도', value: ins.recommendationLevel === 'high' ? '적극 추천' : ins.recommendationLevel === 'medium' ? '추천' : ins.recommendationLevel === 'low' ? '보류' : '-' }
    ];
    
    // 전체 페이지 HTML 구성 및 렌더링
    detailContainer.innerHTML = `
        <div class="container py-4">
            ${renderProfileSection(ins)}
            <div class="row">
                <div class="col-lg-6">
                    ${renderInfoCard('기본 정보', basicInfoItems, 'bi-person-vcard')}
                    ${renderInfoCard('비용 및 일정', scheduleItems, 'bi-calendar-event')}
                </div>
                <div class="col-lg-6">
                    ${renderInfoCard('전문 분야 및 강의 특성', specialtyItems, 'bi-mortarboard')}
                    ${renderInfoCard('강의 자료 및 첨부파일', materialItems, 'bi-file-earmark-text')}
                </div>
            </div>
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-primary text-white py-3">
                    <h5 class="card-title mb-0">
                        <i class="bi bi-calendar-check me-2"></i>강의 이력
                    </h5>
                </div>
                <div class="card-body p-0">
                    ${renderLectureHistoryTable(ins.lectureHistory)}
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    ${renderInfoCard('종합 평가 및 피드백', evaluationItems, 'bi-star-half')}
                </div>
            </div>
            <div class="text-center my-5">
                <button type="button" class="btn btn-lg btn-outline-secondary me-2" onclick="history.back()">
                    <i class="bi bi-arrow-left me-2"></i>목록으로 돌아가기
                </button>
                <a href="javascript:window.print();" class="btn btn-lg btn-outline-primary">
                    <i class="bi bi-printer me-2"></i>인쇄하기
                </a>
            </div>
        </div>
    `;
    
    // 페이지 타이틀 업데이트
    document.title = `${ins.name} - 강사 상세 정보`;
    
    // 상단으로 스크롤 버튼 추가
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'btn btn-primary rounded-circle position-fixed scroll-to-top';
    scrollBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    scrollBtn.style.cssText = 'bottom: 30px; right: 30px; width: 50px; height: 50px; opacity: 0; transition: opacity 0.3s;';
    scrollBtn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
    document.body.appendChild(scrollBtn);
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.style.opacity = '1';
        } else {
            scrollBtn.style.opacity = '0';
        }
    });
}); 
// instructors.js - 동적 강사 목록 및 상세 모달 표시

// localStorage에 저장된 강사 데이터가 있으면 그걸 사용, 없으면 window.instructors 사용
let instructors = [];
const stored = localStorage.getItem('instructors');
if (stored) {
    try {
        instructors = JSON.parse(stored);
    } catch (e) {
        instructors = window.instructors || [];
    }
} else {
    instructors = window.instructors || [];
}

document.addEventListener('DOMContentLoaded', function() {
    // instructors 배열은 instructor-database.js에서 관리합니다.
    // instructors.html에서 반드시 instructor-database.js를 먼저 import해야 합니다.
    // 예시: <script src="js/instructor-database.js"></script> 다음 <script src="js/instructors.js"></script>
    // const instructors = window.instructors || []; // <-- 이 부분은 더이상 필요 없음

    // 페이지네이션 및 강사 목록 렌더링
    const listContainer = document.getElementById('instructorList');
    const paginationContainerId = 'instructorPagination';
    const pageSize = 9;
    let currentPage = 1;

    // 검색 기능 추가
    const regionSelect = document.getElementById('region');
    const specialitySelect = document.getElementById('speciality');
    const targetSelect = document.getElementById('target');
    const keywordInput = document.getElementById('keyword');
    const searchButton = document.querySelector('.search-button');

    function filterInstructors() {
        let filtered = instructors.filter(ins => {
            // 지역 필터
            if (regionSelect && regionSelect.value && ins.region !== regionSelect.value) return false;
            // 전문분야 필터 (mainFields, specialTopics 모두 검사)
            if (specialitySelect && specialitySelect.value) {
                const mainFields = (ins.mainFields || []).join(',');
                const specialTopics = ins.specialTopics || '';
                if (!mainFields.includes(specialitySelect.value) && !specialTopics.includes(specialitySelect.value)) return false;
            }
            // 교육대상 필터 (target에 포함되는지 검사)
            if (targetSelect && targetSelect.value && !(ins.target && ins.target.includes(targetSelect.value))) return false;
            // 키워드 필터 (이름, 전문분야, 주요경력, 상세설명 등)
            if (keywordInput && keywordInput.value.trim()) {
                const keyword = keywordInput.value.trim().toLowerCase();
                const fields = [
                    ins.name, ins.organization, ins.position, ins.specialTopics, (ins.mainFields||[]).join(','),
                    ins.region, ins.target, ins.detail, ins.overallEvaluation, ins.recommendingAgency, ins.recommender, ins.otherInfo
                ].join(' ').toLowerCase();
                if (!fields.includes(keyword)) return false;
            }
            return true;
        });
        renderInstructors(1, filtered);
    }

    // 강사 수 문구 업데이트 함수
    function updateResultCount(count) {
        const resultCount = document.querySelector('.result-count span');
        if (resultCount) {
            resultCount.textContent = count;
        }
    }

    // renderInstructors를 수정하여 필터링된 데이터도 지원
    function renderInstructors(page, data) {
        if (!listContainer) return;
        const arr = data || instructors;
        const startIdx = (page - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        const pageInstructors = arr.slice(startIdx, endIdx);
        updateResultCount(arr.length);
        if (pageInstructors.length === 0) {
            listContainer.innerHTML = '<div class="col-12 text-center py-5 text-muted">검색 결과가 없습니다.</div>';
            renderPagination(1, arr);
            return;
        }
        // Bootstrap row/col-md-3로 4열 배치
        let html = pageInstructors.map((ins, idx) => {
            const realIdx = instructors.indexOf(ins);
            return `
                <div class="mb-4">
                    <div class="card h-100 text-center instructor-card" data-index="${realIdx}" style="cursor:pointer;">
                        <div class="card-body">
                            <img src="img/profile-default.png" alt="프로필" class="rounded-circle mb-2" width="70" height="70">
                            <h5 class="card-title">${ins.name}</h5>
                            <div class="mb-1 text-muted">전문분야: ${(ins.mainFields||[]).join(', ')}</div>
                            <div class="mb-1">${ins.region} | ${ins.target}</div>
                            <div class="mb-2">
                                <span class="text-warning">★</span> ${ins.rating} <span class="text-secondary">(${ins.reviews}건)</span>
                            </div>
                            <a href="#" class="btn btn-outline-primary btn-sm detail-btn" data-index="${realIdx}">상세보기</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        listContainer.className = 'row row-cols-1 row-cols-md-4 g-4'; // Preserve 4-column layout
        listContainer.innerHTML = html;
        renderPagination(page, arr);
    }

    function renderPagination(page, data) {
        let pagination = document.getElementById(paginationContainerId);
        if (!pagination) {
            pagination = document.createElement('nav');
            pagination.id = paginationContainerId;
            pagination.className = 'd-flex justify-content-center mt-4';
            listContainer.parentNode.appendChild(pagination);
        }
        const arr = data || instructors;
        const totalPages = Math.ceil(arr.length / pageSize);
        let html = '<ul class="pagination">';
        html += `<li class="page-item${page === 1 ? ' disabled' : ''}"><a class="page-link" href="#" data-page="${page-1}">&lt;</a></li>`;
        for (let i = 1; i <= totalPages; i++) {
            html += `<li class="page-item${i === page ? ' active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
        html += `<li class="page-item${page === totalPages ? ' disabled' : ''}"><a class="page-link" href="#" data-page="${page+1}">&gt;</a></li>`;
        html += '</ul>';
        pagination.innerHTML = html;
    }

    // 초기 렌더링
    renderInstructors(currentPage);

    // 페이지네이션 클릭 이벤트
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('page-link')) {
            e.preventDefault();
            const page = parseInt(e.target.getAttribute('data-page'));
            // 필터링된 데이터로 페이지 이동
            let arr = instructors;
            if (regionSelect.value || specialitySelect.value || targetSelect.value || (keywordInput && keywordInput.value.trim())) {
                arr = instructors.filter(ins => {
                    if (regionSelect && regionSelect.value && ins.region !== regionSelect.value) return false;
                    if (specialitySelect && specialitySelect.value) {
                        const mainFields = (ins.mainFields || []).join(',');
                        const specialTopics = ins.specialTopics || '';
                        if (!mainFields.includes(specialitySelect.value) && !specialTopics.includes(specialitySelect.value)) return false;
                    }
                    if (targetSelect && targetSelect.value && !(ins.target && ins.target.includes(targetSelect.value))) return false;
                    if (keywordInput && keywordInput.value.trim()) {
                        const keyword = keywordInput.value.trim().toLowerCase();
                        const fields = [
                            ins.name, ins.organization, ins.position, ins.specialTopics, (ins.mainFields||[]).join(','),
                            ins.region, ins.target, ins.detail, ins.overallEvaluation, ins.recommendingAgency, ins.recommender, ins.otherInfo
                        ].join(' ').toLowerCase();
                        if (!fields.includes(keyword)) return false;
                    }
                    return true;
                });
            }
            const totalPages = Math.ceil(arr.length / pageSize);
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                currentPage = page;
                renderInstructors(currentPage, arr);
            }
        }
    });

    // 모달 생성
    const modalHtml = `
        <div class="modal fade" id="instructorModal" tabindex="-1" aria-labelledby="instructorModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="instructorModalLabel">강사 상세 정보</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div id="modalDetailContent"></div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
              </div>
            </div>
          </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // 카드 전체 혹은 상세보기 버튼 클릭 시 상세페이지로 이동
    document.addEventListener('click', function(e) {
        let card = e.target.closest('.instructor-card');
        if (card && (e.target.classList.contains('detail-btn') || card === e.target || card.contains(e.target))) {
            e.preventDefault(); // a, button 등 클릭 시 새로고침 방지
            const idx = card.getAttribute('data-index');
            window.location.href = `instructor-detail.html?idx=${idx}`;
        }
    });
//    // (모달 방식이 필요한 경우 아래 코드 사용)
//    if (e.target.classList.contains('detail-btn')) {
//        const idx = e.target.getAttribute('data-index');
//        showInstructorDetail(idx);
//    }

    function showInstructorDetail(idx) {
        const ins = instructors[idx];
        const content = `
            <div class="text-center mb-3">
                <img src="img/profile-default.png" alt="프로필" class="rounded-circle mb-2" width="90" height="90">
                <h5>${ins.name}</h5>
            </div>
            <ul class="list-group text-start">
                <li class="list-group-item"><strong>전문분야:</strong> ${ins.field}</li>
                <li class="list-group-item"><strong>지역:</strong> ${ins.region}</li>
                <li class="list-group-item"><strong>대상:</strong> ${ins.target}</li>
                <li class="list-group-item"><strong>평점:</strong> ${ins.rating} (${ins.reviews}건)</li>
                <li class="list-group-item"><strong>상세 설명:</strong> ${ins.detail}</li>
            </ul>
        `;
        document.getElementById('modalDetailContent').innerHTML = content;
        const modal = new bootstrap.Modal(document.getElementById('instructorModal'));
        modal.show();
    }

    // 검색 버튼 클릭 시
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            filterInstructors();
        });
    }
    // 엔터로도 검색 가능하게
    if (keywordInput) {
        keywordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                filterInstructors();
            }
        });
    }
    // 셀렉트 박스 변경 시 자동 검색
    [regionSelect, specialitySelect, targetSelect].forEach(sel => {
        if (sel) sel.addEventListener('change', filterInstructors);
    });
});

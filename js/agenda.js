// js/agenda.js - 월별 안건 목록 렌더링 및 관리

import { setDarkMode, initDarkModeToggle, getUserRole, setUserRole, initRoleSelect, showGlobalAlertIfNew } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#agendaTable tbody');
    const monthSelect = document.getElementById('monthSelect');
    let agendas = [];
    const stored = localStorage.getItem('agendas');
    if (stored) {
        try { agendas = JSON.parse(stored); } catch (e) { agendas = []; }
    }

    // 읽음표시용 userId(임시, 실제 협업시 로그인 연동 필요)
    const userId = 'me';
    function getReadAgendas() {
        try {
            return JSON.parse(localStorage.getItem('readAgendas_' + userId)) || [];
        } catch (e) { return []; }
    }
    function setReadAgendas(arr) {
        localStorage.setItem('readAgendas_' + userId, JSON.stringify(arr));
    }

    // 월 옵션 동적 생성 (최근 12개월)
    function getMonthOptions() {
        const options = [];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const ym = d.toISOString().slice(0, 7); // yyyy-MM
            options.push(`<option value="${ym}">${ym.replace('-', '년 ')}월</option>`);
        }
        return options.join('');
    }
    if (monthSelect) {
        monthSelect.innerHTML = '<option value="">전체</option>' + getMonthOptions();
    }

    const searchForm = document.getElementById('agendaSearchForm');
    const searchInput = document.getElementById('agendaSearchInput');
    let searchKeyword = '';

    function renderAgendaList() {
        if (!tableBody) return;
        let filtered = agendas;
        const selectedMonth = monthSelect ? monthSelect.value : '';
        if (selectedMonth) {
            filtered = agendas.filter(a => (a.month || '').startsWith(selectedMonth));
        }
        if (searchKeyword && searchKeyword.trim()) {
            const kw = searchKeyword.trim().toLowerCase();
            filtered = filtered.filter(a =>
                (a.title || '').toLowerCase().includes(kw) ||
                (a.description || '').toLowerCase().includes(kw) ||
                (a.createdBy || '').toLowerCase().includes(kw)
            );
        }
        const readArr = getReadAgendas();
        const userRole = getUserRole();
        if (!filtered.length) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">등록된 안건이 없습니다.</td></tr>';
            return;
        }
        tableBody.innerHTML = filtered.map((agenda, idx) => {
            const isRead = readArr.includes(agenda.id);
            return `
            <tr>
                <td>${filtered.length - idx}</td>
                <td><a href="agenda-detail.html?id=${agenda.id}">${agenda.title}</a></td>
                <td>${agenda.description || '-'}</td>
                <td>${agenda.createdBy || '-'}</td>
                <td>${formatDate(agenda.createdAt)}</td>
                <td><span class="badge ${isRead ? 'bg-success' : 'bg-secondary'}">${isRead ? '읽음' : '미확인'}</span></td>
                <td>
                    <a href="agenda-detail.html?id=${agenda.id}" class="btn btn-sm btn-outline-primary">상세</a>
                    ${userRole === 'admin' ? `<a href="agenda-register.html?id=${agenda.id}" class="btn btn-sm btn-outline-secondary">수정</a>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${agenda.id}">삭제</button>` : ''}
                </td>
            </tr>
        `;
        }).join('');
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toISOString().slice(0, 10);
    }

    // 월 변경 시 필터링
    if (monthSelect) {
        monthSelect.addEventListener('change', renderAgendaList);
    }

    // 삭제 버튼 이벤트 위임
    tableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            if (confirm('정말 삭제하시겠습니까?')) {
                agendas = agendas.filter(a => String(a.id) !== String(id));
                localStorage.setItem('agendas', JSON.stringify(agendas));
                renderAgendaList();
            }
        }
    });

    // 안건 등록/수정 폼 처리
    const agendaForm = document.getElementById('agendaForm');
    if (agendaForm) {
        // 수정 모드: URL에 id 파라미터가 있으면 해당 안건 불러오기
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('id');
        if (editId) {
            const agenda = agendas.find(a => String(a.id) === String(editId));
            if (agenda) {
                agendaForm.title.value = agenda.title;
                agendaForm.description.value = agenda.description;
                agendaForm.month.value = agenda.month;
                agendaForm.createdBy.value = agenda.createdBy;
                if (agenda.file) agendaForm.file.value = agenda.file;
            }
        }
        agendaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = agendaForm.title.value.trim();
            const description = agendaForm.description.value.trim();
            const month = agendaForm.month.value;
            const createdBy = agendaForm.createdBy.value.trim();
            const file = agendaForm.file.value.trim();
            if (!title || !month || !createdBy) {
                alert('필수 항목을 입력해 주세요.');
                return;
            }
            let now = new Date().toISOString();
            if (editId) {
                // 수정
                agendas = agendas.map(a => {
                    if (String(a.id) === String(editId)) {
                        return { ...a, title, description, month, createdBy, file, updatedAt: now };
                    }
                    return a;
                });
            } else {
                // 등록
                const newId = Date.now();
                agendas.push({
                    id: newId,
                    title,
                    description,
                    month,
                    createdBy,
                    file,
                    createdAt: now
                });
                localStorage.setItem('lastAgendaCreatedAt', now);
            }
            localStorage.setItem('agendas', JSON.stringify(agendas));
            alert('저장되었습니다.');
            window.location.href = 'agenda-list.html';
        });
    }

    // 안건 상세보기 처리
    const agendaDetailBox = document.getElementById('agendaDetailBox');
    if (agendaDetailBox) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        let agendas = [];
        const stored = localStorage.getItem('agendas');
        if (stored) {
            try { agendas = JSON.parse(stored); } catch (e) { agendas = []; }
        }
        const agenda = agendas.find(a => String(a.id) === String(id));
        if (!agenda) {
            agendaDetailBox.innerHTML = '<div class="alert alert-danger">안건을 찾을 수 없습니다.</div>';
            document.getElementById('editBtn').style.display = 'none';
            document.getElementById('deleteBtn').style.display = 'none';
            if (document.getElementById('agendaFileBox')) document.getElementById('agendaFileBox').innerHTML = '';
        } else {
            agendaDetailBox.innerHTML = `
                <h2>${agenda.title}</h2>
                <div class="mb-2 text-muted">월: ${agenda.month} | 등록자: ${agenda.createdBy || '-'} | 등록일: ${formatDate(agenda.createdAt)}</div>
                <div class="mb-4">${agenda.description ? agenda.description.replace(/\n/g, '<br>') : '-'}</div>
            `;
            if (document.getElementById('agendaFileBox')) {
                if (agenda.file) {
                    document.getElementById('agendaFileBox').innerHTML = `<strong>첨부파일:</strong> <a href="#" onclick="alert('샘플: 실제 파일 다운로드는 미구현입니다.');" download="${agenda.file}" class="btn btn-sm btn-outline-secondary ms-2">${agenda.file} 다운로드</a>`;
                } else {
                    document.getElementById('agendaFileBox').innerHTML = '';
                }
            }
            const userRole = getUserRole();
            document.getElementById('editBtn').style.display = userRole === 'admin' ? '' : 'none';
            document.getElementById('deleteBtn').style.display = userRole === 'admin' ? '' : 'none';
            document.getElementById('editBtn').onclick = function(e) {
                e.preventDefault();
                window.location.href = `agenda-register.html?id=${agenda.id}`;
            };
            document.getElementById('deleteBtn').onclick = function() {
                if (confirm('정말 삭제하시겠습니까?')) {
                    agendas = agendas.filter(a => String(a.id) !== String(id));
                    localStorage.setItem('agendas', JSON.stringify(agendas));
                    alert('삭제되었습니다.');
                    window.location.href = 'agenda-list.html';
                }
            };
            // 읽음 처리
            let readArr = getReadAgendas();
            if (!readArr.includes(agenda.id)) {
                readArr.push(agenda.id);
                setReadAgendas(readArr);
            }
        }
    }

    // 토의(댓글) 목록 및 등록/삭제 처리
    const discussionList = document.getElementById('discussionList');
    const discussionForm = document.getElementById('discussionForm');
    const discussionAuthor = document.getElementById('discussionAuthor');
    const discussionContent = document.getElementById('discussionContent');
    if (discussionList && discussionForm && discussionAuthor && discussionContent) {
        const urlParams = new URLSearchParams(window.location.search);
        const agendaId = urlParams.get('id');
        let discussions = [];
        const stored = localStorage.getItem('discussions');
        if (stored) {
            try { discussions = JSON.parse(stored); } catch (e) { discussions = []; }
        }
        function renderDiscussions() {
            const filtered = discussions.filter(d => String(d.agendaId) === String(agendaId));
            if (!filtered.length) {
                discussionList.innerHTML = '<li class="list-group-item text-muted">아직 등록된 의견이 없습니다.</li>';
                return;
            }
            discussionList.innerHTML = filtered.map(d => `
                <li class="list-group-item d-flex justify-content-between align-items-start">
                    <div>
                        <strong>${d.author}</strong> <span class="text-muted small">(${formatDate(d.createdAt)})</span><br>
                        <span>${d.content.replace(/\n/g, '<br>')}</span>
                    </div>
                    <button class="btn btn-sm btn-outline-danger ms-2 delete-discussion" data-id="${d.id}">삭제</button>
                </li>
            `).join('');
        }
        renderDiscussions();
        discussionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const author = discussionAuthor.value.trim();
            const content = discussionContent.value.trim();
            if (!author || !content) {
                alert('이름과 의견을 입력해 주세요.');
                return;
            }
            const newId = Date.now();
            discussions.push({
                id: newId,
                agendaId,
                author,
                content,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('discussions', JSON.stringify(discussions));
            discussionAuthor.value = '';
            discussionContent.value = '';
            renderDiscussions();
        });
        discussionList.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-discussion')) {
                const id = e.target.getAttribute('data-id');
                if (confirm('정말 삭제하시겠습니까?')) {
                    discussions = discussions.filter(d => String(d.id) !== String(id));
                    localStorage.setItem('discussions', JSON.stringify(discussions));
                    renderDiscussions();
                }
            }
        });
    }

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchKeyword = searchInput.value;
            renderAgendaList();
        });
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchKeyword = searchInput.value;
                renderAgendaList();
            }
        });
    }

    // 역할(권한) 관리
    initRoleSelect('roleSelect', renderAgendaList);
    // 다크모드 토글
    initDarkModeToggle('darkModeToggle');
    // 새글 알림 표시
    showGlobalAlertIfNew('lastAgendaCreatedAt', 'globalAlert');

    // localStorage 전체 초기화(관리자만)
    const resetBtn = document.getElementById('resetStorageBtn');
    if (resetBtn) {
        resetBtn.onclick = function() {
            if (getUserRole() !== 'admin') {
                alert('관리자만 초기화할 수 있습니다.');
                return;
            }
            if (!confirm('정말 모든 데이터를 초기화하시겠습니까?')) return;
            // 샘플 데이터
            const sampleAgendas = [
                { id: 1, title: '6월 회의 안건', description: '교육 커리큘럼 개편 논의', month: '2024-06', createdBy: '관리자', file: '', createdAt: new Date().toISOString() },
                { id: 2, title: '협업 도구 도입', description: '새로운 협업 플랫폼 검토', month: '2024-06', createdBy: '홍길동', file: '', createdAt: new Date().toISOString() }
            ];
            localStorage.clear();
            localStorage.setItem('agendas', JSON.stringify(sampleAgendas));
            localStorage.setItem('lastAgendaCreatedAt', sampleAgendas[0].createdAt);
            alert('데이터가 초기화되었습니다.');
            location.reload();
        };
    }

    renderAgendaList();
}); 
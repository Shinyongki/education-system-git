// js/minutes.js - 회의록 목록 렌더링 및 관리

import { setDarkMode, initDarkModeToggle, getUserRole, setUserRole, initRoleSelect, showGlobalAlertIfNew } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#minutesTable tbody');
    let minutes = [];
    let agendas = [];
    const stored = localStorage.getItem('minutes');
    if (stored) {
        try { minutes = JSON.parse(stored); } catch (e) { minutes = []; }
    }
    const agendaStored = localStorage.getItem('agendas');
    if (agendaStored) {
        try { agendas = JSON.parse(agendaStored); } catch (e) { agendas = []; }
    }
    function getAgendaTitle(id) {
        const a = agendas.find(a => String(a.id) === String(id));
        return a ? a.title : '-';
    }
    const searchForm = document.getElementById('minutesSearchForm');
    const searchInput = document.getElementById('minutesSearchInput');
    let searchKeyword = '';

    // 읽음표시용 userId(임시, 실제 협업시 로그인 연동 필요)
    const userId = 'me';
    function getReadMinutes() {
        try {
            return JSON.parse(localStorage.getItem('readMinutes_' + userId)) || [];
        } catch (e) { return []; }
    }
    function setReadMinutes(arr) {
        localStorage.setItem('readMinutes_' + userId, JSON.stringify(arr));
    }

    // 역할(권한) 관리
    initRoleSelect('roleSelect', renderMinutesList);

    function renderMinutesList() {
        if (!tableBody) return;
        let filtered = minutes;
        if (searchKeyword && searchKeyword.trim()) {
            const kw = searchKeyword.trim().toLowerCase();
            filtered = minutes.filter(m =>
                (m.summary || '').toLowerCase().includes(kw) ||
                (m.attendees || '').toLowerCase().includes(kw) ||
                (m.createdBy || '').toLowerCase().includes(kw) ||
                (getAgendaTitle(m.agendaId) || '').toLowerCase().includes(kw)
            );
        }
        const readArr = getReadMinutes();
        const userRole = getUserRole();
        if (!filtered.length) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">등록된 회의록이 없습니다.</td></tr>';
            return;
        }
        tableBody.innerHTML = filtered.map((m, idx) => {
            const isRead = readArr.includes(m.id);
            return `
            <tr>
                <td>${filtered.length - idx}</td>
                <td>${getAgendaTitle(m.agendaId)}</td>
                <td>${m.summary || '-'}</td>
                <td>${m.attendees || '-'}</td>
                <td>${m.createdBy || '-'}</td>
                <td>${formatDate(m.createdAt)}</td>
                <td><span class="badge ${isRead ? 'bg-success' : 'bg-secondary'}">${isRead ? '읽음' : '미확인'}</span></td>
                <td>
                    <a href="minutes-detail.html?id=${m.id}" class="btn btn-sm btn-outline-primary">상세</a>
                    ${userRole === 'admin' ? `<a href="minutes-register.html?id=${m.id}" class="btn btn-sm btn-outline-secondary">수정</a>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${m.id}">삭제</button>` : ''}
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
    tableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            if (confirm('정말 삭제하시겠습니까?')) {
                minutes = minutes.filter(m => String(m.id) !== String(id));
                localStorage.setItem('minutes', JSON.stringify(minutes));
                renderMinutesList();
            }
        }
    });
    renderMinutesList();

    // 회의록 등록/수정 폼 처리
    const minutesForm = document.getElementById('minutesForm');
    if (minutesForm) {
        // 안건 옵션 동적 생성
        let agendas = [];
        const agendaStored = localStorage.getItem('agendas');
        if (agendaStored) {
            try { agendas = JSON.parse(agendaStored); } catch (e) { agendas = []; }
        }
        const agendaIdSelect = document.getElementById('agendaId');
        if (agendaIdSelect) {
            agendaIdSelect.innerHTML = '<option value="">안건 선택</option>' + agendas.map(a => `<option value="${a.id}">${a.title}</option>`).join('');
        }
        // 수정 모드: URL에 id 파라미터가 있으면 해당 회의록 불러오기
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('id');
        let minutes = [];
        const stored = localStorage.getItem('minutes');
        if (stored) {
            try { minutes = JSON.parse(stored); } catch (e) { minutes = []; }
        }
        if (editId) {
            const m = minutes.find(m => String(m.id) === String(editId));
            if (m) {
                minutesForm.agendaId.value = m.agendaId;
                minutesForm.summary.value = m.summary;
                minutesForm.attendees.value = m.attendees;
                minutesForm.file.value = m.file || '';
                minutesForm.createdBy.value = m.createdBy;
            }
        }
        minutesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const agendaId = minutesForm.agendaId.value;
            const summary = minutesForm.summary.value.trim();
            const attendees = minutesForm.attendees.value.trim();
            const file = minutesForm.file.value.trim();
            const createdBy = minutesForm.createdBy.value.trim();
            if (!agendaId || !summary || !attendees || !createdBy) {
                alert('필수 항목을 입력해 주세요.');
                return;
            }
            let now = new Date().toISOString();
            if (editId) {
                // 수정
                minutes = minutes.map(m => {
                    if (String(m.id) === String(editId)) {
                        return { ...m, agendaId, summary, attendees, file, createdBy, updatedAt: now };
                    }
                    return m;
                });
            } else {
                // 등록
                const newId = Date.now();
                minutes.push({
                    id: newId,
                    agendaId,
                    summary,
                    attendees,
                    file,
                    createdBy,
                    createdAt: now
                });
                localStorage.setItem('lastMinutesCreatedAt', now);
            }
            localStorage.setItem('minutes', JSON.stringify(minutes));
            alert('저장되었습니다.');
            window.location.href = 'minutes-list.html';
        });
    }

    // 회의록 상세보기 처리
    const minutesDetailBox = document.getElementById('minutesDetailBox');
    if (minutesDetailBox) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        let minutes = [];
        let agendas = [];
        const stored = localStorage.getItem('minutes');
        if (stored) {
            try { minutes = JSON.parse(stored); } catch (e) { minutes = []; }
        }
        const agendaStored = localStorage.getItem('agendas');
        if (agendaStored) {
            try { agendas = JSON.parse(agendaStored); } catch (e) { agendas = []; }
        }
        function getAgendaTitle(id) {
            const a = agendas.find(a => String(a.id) === String(id));
            return a ? a.title : '-';
        }
        const m = minutes.find(m => String(m.id) === String(id));
        if (!m) {
            minutesDetailBox.innerHTML = '<div class="alert alert-danger">회의록을 찾을 수 없습니다.</div>';
            document.getElementById('editBtn').style.display = 'none';
            document.getElementById('deleteBtn').style.display = 'none';
            if (document.getElementById('minutesFileBox')) document.getElementById('minutesFileBox').innerHTML = '';
        } else {
            minutesDetailBox.innerHTML = `
                <h2>${getAgendaTitle(m.agendaId)}</h2>
                <div class="mb-2 text-muted">등록자: ${m.createdBy || '-'} | 등록일: ${formatDate(m.createdAt)}</div>
                <div class="mb-2"><strong>참석자:</strong> ${m.attendees || '-'}</div>
                <div class="mb-2"><strong>회의록 요약:</strong><br>${m.summary ? m.summary.replace(/\n/g, '<br>') : '-'}</div>
            `;
            if (document.getElementById('minutesFileBox')) {
                if (m.file) {
                    document.getElementById('minutesFileBox').innerHTML = `<strong>첨부파일:</strong> <a href="#" onclick="alert('샘플: 실제 파일 다운로드는 미구현입니다.');" download="${m.file}" class="btn btn-sm btn-outline-secondary ms-2">${m.file} 다운로드</a>`;
                } else {
                    document.getElementById('minutesFileBox').innerHTML = '';
                }
            }
            const userRole = getUserRole();
            document.getElementById('editBtn').style.display = userRole === 'admin' ? '' : 'none';
            document.getElementById('deleteBtn').style.display = userRole === 'admin' ? '' : 'none';
            document.getElementById('editBtn').onclick = function(e) {
                e.preventDefault();
                window.location.href = `minutes-register.html?id=${m.id}`;
            };
            document.getElementById('deleteBtn').onclick = function() {
                if (confirm('정말 삭제하시겠습니까?')) {
                    minutes = minutes.filter(mm => String(mm.id) !== String(id));
                    localStorage.setItem('minutes', JSON.stringify(minutes));
                    alert('삭제되었습니다.');
                    window.location.href = 'minutes-list.html';
                }
            };
            // 읽음 처리
            let readArr = getReadMinutes();
            if (!readArr.includes(m.id)) {
                readArr.push(m.id);
                setReadMinutes(readArr);
            }
        }
    }

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchKeyword = searchInput.value;
            renderMinutesList();
        });
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchKeyword = searchInput.value;
                renderMinutesList();
            }
        });
    }

    // 다크모드 토글
    initDarkModeToggle('darkModeToggle');

    // 새글 알림 표시
    showGlobalAlertIfNew('lastMinutesCreatedAt', 'globalAlert');

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
            const sampleMinutes = [
                { id: 1, agendaId: 1, summary: '6월 회의 요약', attendees: '홍길동, 김철수', file: '', createdBy: '관리자', createdAt: new Date().toISOString() },
                { id: 2, agendaId: 2, summary: '협업 도구 논의 결과', attendees: '홍길동, 이영희', file: '', createdBy: '홍길동', createdAt: new Date().toISOString() }
            ];
            localStorage.clear();
            localStorage.setItem('minutes', JSON.stringify(sampleMinutes));
            localStorage.setItem('lastMinutesCreatedAt', sampleMinutes[0].createdAt);
            alert('데이터가 초기화되었습니다.');
            location.reload();
        };
    }
}); 
// js/notice.js - 공지사항 목록 렌더링 및 관리

import { setDarkMode, initDarkModeToggle, getUserRole, setUserRole, initRoleSelect, showGlobalAlertIfNew } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
    const cardGrid = document.getElementById('noticeCardGrid');
    let notices = [];
    const stored = localStorage.getItem('notices');
    if (stored) {
        try {
            notices = JSON.parse(stored);
        } catch (e) {
            notices = [];
        }
    }
    renderNoticeList();

    const searchForm = document.getElementById('noticeSearchForm');
    const searchInput = document.getElementById('noticeSearchInput');
    let searchKeyword = '';

    // 읽음표시용 userId(임시, 실제 협업시 로그인 연동 필요)
    const userId = 'me';
    function getReadNotices() {
        try {
            return JSON.parse(localStorage.getItem('readNotices_' + userId)) || [];
        } catch (e) { return []; }
    }
    function setReadNotices(arr) {
        localStorage.setItem('readNotices_' + userId, JSON.stringify(arr));
    }

    // 역할(권한) 관리
    initRoleSelect('roleSelect', renderNoticeList);

    const tableBody = document.querySelector('#noticeTable tbody');
    const pagination = document.getElementById('noticePagination');
    const checkAllBox = document.getElementById('checkAll');
    let currentPage = 1;
    const pageSize = 10;

    function renderNoticeList() {
        if (!tableBody) return;
        let filtered = notices;
        if (searchKeyword && searchKeyword.trim()) {
            const kw = searchKeyword.trim().toLowerCase();
            filtered = notices.filter(n =>
                (n.title || '').toLowerCase().includes(kw) ||
                (n.content || '').toLowerCase().includes(kw) ||
                (n.createdBy || '').toLowerCase().includes(kw)
            );
        }
        // 최신순 정렬
        filtered = filtered.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const total = filtered.length;
        const totalPages = Math.ceil(total / pageSize);
        if (currentPage > totalPages) currentPage = totalPages || 1;
        const startIdx = (currentPage - 1) * pageSize;
        const pageData = filtered.slice(startIdx, startIdx + pageSize);
        const readArr = getReadNotices();
        const userRole = getUserRole();
        if (!pageData.length) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">등록된 공지사항이 없습니다.</td></tr>';
            pagination.innerHTML = '';
            return;
        }
        tableBody.innerHTML = pageData.map((notice, idx) => {
            const isRead = readArr.includes(notice.id);
            return `
            <tr>
                <td><input type="checkbox" class="row-check" data-id="${notice.id}"></td>
                <td>${total - (startIdx + idx)}</td>
                <td><a href="notice-detail.html?id=${notice.id}" class="${isRead ? '' : 'fw-bold'}">${notice.title}</a></td>
                <td>${formatDate(notice.createdAt)}</td>
                <td>${notice.createdBy || '-'}</td>
                <td>${notice.views || 0}</td>
                <td>
                    <a href="notice-detail.html?id=${notice.id}" class="btn btn-sm btn-outline-primary">상세</a>
                    ${userRole === 'admin' ? `<a href="notice-register.html?id=${notice.id}" class="btn btn-sm btn-outline-secondary">수정</a>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${notice.id}">삭제</button>` : ''}
                </td>
            </tr>
            `;
        }).join('');
        renderPagination(totalPages);
        if (checkAllBox) checkAllBox.checked = false;
    }

    function renderPagination(totalPages) {
        if (!pagination) return;
        let html = '';
        if (totalPages <= 1) { pagination.innerHTML = ''; return; }
        html += `<li class="page-item${currentPage === 1 ? ' disabled' : ''}"><a class="page-link" href="#" data-page="first">&laquo;</a></li>`;
        html += `<li class="page-item${currentPage === 1 ? ' disabled' : ''}"><a class="page-link" href="#" data-page="prev">&lt;</a></li>`;
        for (let i = 1; i <= totalPages; i++) {
            html += `<li class="page-item${currentPage === i ? ' active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
        html += `<li class="page-item${currentPage === totalPages ? ' disabled' : ''}"><a class="page-link" href="#" data-page="next">&gt;</a></li>`;
        html += `<li class="page-item${currentPage === totalPages ? ' disabled' : ''}"><a class="page-link" href="#" data-page="last">&raquo;</a></li>`;
        pagination.innerHTML = html;
    }

    if (pagination) {
        pagination.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                if (page === 'first') currentPage = 1;
                else if (page === 'prev') currentPage = Math.max(1, currentPage - 1);
                else if (page === 'next') currentPage = currentPage + 1;
                else if (page === 'last') currentPage = Math.ceil((notices.length || 1) / pageSize);
                else currentPage = parseInt(page);
                renderNoticeList();
            }
        });
    }

    // 체크박스 일괄 선택
    if (checkAllBox) {
        checkAllBox.addEventListener('change', function() {
            const checks = document.querySelectorAll('.row-check');
            checks.forEach(chk => { chk.checked = checkAllBox.checked; });
        });
    }
    // 일괄 삭제(관리자만, 선택된 행)
    if (tableBody) {
        tableBody.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-btn')) {
                const id = e.target.getAttribute('data-id');
                if (confirm('정말 삭제하시겠습니까?')) {
                    notices = notices.filter(n => String(n.id) !== String(id));
                    localStorage.setItem('notices', JSON.stringify(notices));
                    renderNoticeList();
                }
            }
        });
    }

    // 날짜 포맷 함수
    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toISOString().slice(0, 10);
    }

    // 공지사항 등록/수정 폼 처리
    const noticeForm = document.getElementById('noticeForm');
    if (noticeForm) {
        // 수정 모드: URL에 id 파라미터가 있으면 해당 공지 불러오기
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('id');
        let notices = [];
        const stored = localStorage.getItem('notices');
        if (stored) {
            try { notices = JSON.parse(stored); } catch (e) { notices = []; }
        }
        if (editId) {
            const notice = notices.find(n => String(n.id) === String(editId));
            if (notice) {
                noticeForm.title.value = notice.title;
                noticeForm.content.value = notice.content;
                noticeForm.createdBy.value = notice.createdBy;
                if (notice.file) noticeForm.file.value = notice.file;
            }
        }
        noticeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = noticeForm.title.value.trim();
            const content = noticeForm.content.value.trim();
            const createdBy = noticeForm.createdBy.value.trim();
            const file = noticeForm.file.value.trim();
            if (!title || !content || !createdBy) {
                alert('모든 항목을 입력해 주세요.');
                return;
            }
            let now = new Date().toISOString();
            if (editId) {
                // 수정
                notices = notices.map(n => {
                    if (String(n.id) === String(editId)) {
                        return { ...n, title, content, createdBy, file, updatedAt: now };
                    }
                    return n;
                });
            } else {
                // 등록
                const newId = Date.now();
                notices.push({
                    id: newId,
                    title,
                    content,
                    createdBy,
                    file,
                    createdAt: now
                });
                localStorage.setItem('lastNoticeCreatedAt', now);
            }
            localStorage.setItem('notices', JSON.stringify(notices));
            alert('저장되었습니다.');
            window.location.href = 'notice-list.html';
        });
    }

    // 공지사항 상세보기 처리
    const detailBox = document.getElementById('noticeDetailBox');
    if (detailBox) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        let notices = [];
        const stored = localStorage.getItem('notices');
        if (stored) {
            try { notices = JSON.parse(stored); } catch (e) { notices = []; }
        }
        const noticeIdx = notices.findIndex(n => String(n.id) === String(id));
        const notice = notices[noticeIdx];
        if (!notice) {
            detailBox.innerHTML = '<div class="alert alert-danger">공지사항을 찾을 수 없습니다.</div>';
            document.getElementById('editBtn').style.display = 'none';
            document.getElementById('deleteBtn').style.display = 'none';
            if (document.getElementById('noticeFileBox')) document.getElementById('noticeFileBox').innerHTML = '';
        } else {
            // 조회수 증가
            if (!notice.views) notice.views = 0;
            notice.views++;
            notices[noticeIdx] = notice;
            localStorage.setItem('notices', JSON.stringify(notices));
            detailBox.innerHTML = `
                <h2>${notice.title}</h2>
                <div class="mb-2 text-muted">작성자: ${notice.createdBy || '-'} | 작성일: ${formatDate(notice.createdAt)} | 조회: ${notice.views}</div>
                <div class="mb-4">${notice.content.replace(/\n/g, '<br>')}</div>
            `;
            if (document.getElementById('noticeFileBox')) {
                if (notice.file) {
                    document.getElementById('noticeFileBox').innerHTML = `<strong>첨부파일:</strong> <a href="#" onclick="alert('샘플: 실제 파일 다운로드는 미구현입니다.');" download="${notice.file}" class="btn btn-sm btn-outline-secondary ms-2">${notice.file} 다운로드</a>`;
                } else {
                    document.getElementById('noticeFileBox').innerHTML = '';
                }
            }
            const userRole = getUserRole();
            document.getElementById('editBtn').style.display = userRole === 'admin' ? '' : 'none';
            document.getElementById('deleteBtn').style.display = userRole === 'admin' ? '' : 'none';
            document.getElementById('editBtn').onclick = function(e) {
                e.preventDefault();
                window.location.href = `notice-register.html?id=${notice.id}`;
            };
            document.getElementById('deleteBtn').onclick = function() {
                if (confirm('정말 삭제하시겠습니까?')) {
                    notices = notices.filter(n => String(n.id) !== String(id));
                    localStorage.setItem('notices', JSON.stringify(notices));
                    alert('삭제되었습니다.');
                    window.location.href = 'notice-list.html';
                }
            };
            // 읽음 처리
            let readArr = getReadNotices();
            if (!readArr.includes(notice.id)) {
                readArr.push(notice.id);
                setReadNotices(readArr);
            }
        }
    }

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchKeyword = searchInput.value;
            renderNoticeList();
        });
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchKeyword = searchInput.value;
                renderNoticeList();
            }
        });
    }

    // 다크모드 토글
    initDarkModeToggle('darkModeToggle');

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
            const sampleNotices = [
                { id: 1, title: '시스템 오픈 안내', content: '협업 시스템이 오픈되었습니다.', createdBy: '관리자', file: '', createdAt: new Date().toISOString() },
                { id: 2, title: '회의 일정 공지', content: '6월 전체 회의는 6/20(목) 14시입니다.', createdBy: '홍길동', file: '', createdAt: new Date().toISOString() }
            ];
            localStorage.clear();
            localStorage.setItem('notices', JSON.stringify(sampleNotices));
            localStorage.setItem('lastNoticeCreatedAt', sampleNotices[0].createdAt);
            alert('데이터가 초기화되었습니다.');
            location.reload();
        };
    }
}); 
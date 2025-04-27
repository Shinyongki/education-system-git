// js/notice-preview.js - 메인페이지 공지사항 미리보기 동적 렌더링

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('noticePreviewContainer');
    if (!container) return;
    let notices = [];
    try {
        const stored = localStorage.getItem('notices');
        if (stored) notices = JSON.parse(stored);
    } catch (e) { notices = []; }
    if (!Array.isArray(notices)) notices = [];
    // 최신순 정렬
    notices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const preview = notices.slice(0, 3);
    if (!preview.length) {
        container.innerHTML = '<div class="card"><div class="card-body text-center text-muted">등록된 공지사항이 없습니다.</div></div>';
        return;
    }
    container.innerHTML = preview.map(n => `
        <div class="card">
            <div class="card-body">
                <div class="announcement-date" style="color:#888;font-size:0.95em;">${n.createdAt ? n.createdAt.slice(0,10) : ''}</div>
                <h3 class="announcement-title" style="font-size:1.15em;margin:0.5em 0 0.3em 0;">${n.title || '-'}</h3>
                <div class="announcement-meta" style="font-size:0.95em;color:#666;">작성자: ${n.author || '-'}</div>
                <div class="announcement-preview" style="margin:0.5em 0 1em 0; color:#333; min-height:2.5em;">${(n.content||'').replace(/\n/g,'<br>').slice(0,60)}${n.content && n.content.length>60 ? '...' : ''}</div>
                <a href="notice-detail.html?id=${n.id}" class="btn btn-sm btn-outline-primary">상세</a>
            </div>
        </div>
    `).join('');
}); 
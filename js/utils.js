// js/utils.js - 공통 유틸 함수 모음

// 다크모드
export function setDarkMode(on) {
    if (on) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'on');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'off');
    }
}
export function initDarkModeToggle(toggleId = 'darkModeToggle') {
    const darkModeToggle = document.getElementById(toggleId);
    if (darkModeToggle) {
        darkModeToggle.checked = localStorage.getItem('darkMode') === 'on';
        setDarkMode(darkModeToggle.checked);
        darkModeToggle.addEventListener('change', function() {
            setDarkMode(this.checked);
        });
    }
}

// 역할(권한)
export function getUserRole() {
    return localStorage.getItem('userRole') || 'admin';
}
export function setUserRole(role) {
    localStorage.setItem('userRole', role);
}
export function initRoleSelect(selectId = 'roleSelect', onChange) {
    const roleSelect = document.getElementById(selectId);
    if (roleSelect) {
        roleSelect.value = getUserRole();
        roleSelect.addEventListener('change', function() {
            setUserRole(this.value);
            if (onChange) onChange(this.value);
        });
    }
}

// 새글 알림
export function showGlobalAlertIfNew(storageKey, alertId = 'globalAlert') {
    const alertEl = document.getElementById(alertId);
    if (!alertEl) return;
    const lastCreated = localStorage.getItem(storageKey);
    if (!lastCreated) { alertEl.style.display = 'none'; return; }
    const diff = Date.now() - new Date(lastCreated).getTime();
    if (diff < 1000 * 60 * 60 * 24) {
        alertEl.style.display = '';
    } else {
        alertEl.style.display = 'none';
    }
} 

// 콘텐츠 최신성 체크 기능
export function checkContentFreshness(updateDate, maxAgeInDays = 180) {
    if (!updateDate) return { isFresh: false, daysAgo: null, needsUpdate: true };
    
    const today = new Date();
    const lastUpdate = new Date(updateDate);
    const diffTime = Math.abs(today - lastUpdate);
    const daysAgo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
        isFresh: daysAgo <= maxAgeInDays,
        daysAgo: daysAgo,
        needsUpdate: daysAgo > maxAgeInDays
    };
}

// 콘텐츠 최신성 표시 추가
export function addFreshnessIndicator(element, updateDate, maxAgeInDays = 180) {
    if (!element || !updateDate) return;
    
    const freshness = checkContentFreshness(updateDate, maxAgeInDays);
    const indicator = document.createElement('div');
    
    if (freshness.needsUpdate) {
        indicator.className = 'freshness-indicator stale';
        indicator.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${freshness.daysAgo}일 전 업데이트`;
        indicator.title = '업데이트가 필요합니다';
    } else {
        indicator.className = 'freshness-indicator fresh';
        indicator.innerHTML = `<i class="fas fa-check-circle"></i> ${freshness.daysAgo}일 전 업데이트`;
        indicator.title = '최신 상태입니다';
    }
    
    element.appendChild(indicator);
}

// 온라인/오프라인 상태 감지
export function initOnlineStatusMonitor() {
    function updateOnlineStatus() {
        const statusIndicator = document.getElementById('onlineStatusIndicator');
        if (!statusIndicator) return;
        
        if (navigator.onLine) {
            statusIndicator.className = 'online-status online';
            statusIndicator.innerHTML = '<i class="fas fa-wifi"></i> 온라인';
            statusIndicator.title = '온라인 상태입니다';
        } else {
            statusIndicator.className = 'online-status offline';
            statusIndicator.innerHTML = '<i class="fas fa-exclamation-triangle"></i> 오프라인';
            statusIndicator.title = '오프라인 상태입니다. 변경사항이 저장되지 않을 수 있습니다.';
        }
    }
    
    // 초기 상태 설정
    updateOnlineStatus();
    
    // 이벤트 리스너 등록
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

// 포매팅 유틸리티
export function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    });
} 
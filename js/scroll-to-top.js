/**
 * 스크롤 탑 버튼 기능 - 일정 스크롤 위치 이상에서 버튼 표시, 클릭 시 상단으로 스크롤
 */

document.addEventListener('DOMContentLoaded', function() {
    // 스크롤 탑 버튼 요소 가져오기
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    // 버튼이 없다면 함수 종료
    if (!scrollToTopBtn) return;

    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', function() {
        // 스크롤 위치 확인 (100px 이상 스크롤된 경우 버튼 표시)
        if (window.scrollY > 100) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // 버튼 클릭 이벤트 리스너 추가
    scrollToTopBtn.addEventListener('click', function() {
        // 부드럽게 상단으로 스크롤
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

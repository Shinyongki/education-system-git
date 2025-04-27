// 스크롤 탑 버튼 기능
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopButton = document.querySelector('.scroll-to-top');
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 100) {
            scrollToTopButton.classList.add('show');
        } else {
            scrollToTopButton.classList.remove('show');
        }
    });

    // 버튼 클릭 이벤트
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}); 
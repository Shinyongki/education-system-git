document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            // Toggle icon between bars and X
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mainNav.classList.contains('active') && 
            !mainNav.contains(event.target) && 
            !mobileMenuBtn.contains(event.target)) {
            mainNav.classList.remove('active');
            
            // Reset icon
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            // This would normally open a search overlay or expand a search field
            alert('검색 기능은 현재 개발 중입니다.');
        });
    }
    
    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // Add responsive styles for mobile navigation
    function updateMobileNav() {
        if (window.innerWidth <= 768) {
            if (mainNav) {
                mainNav.style.position = 'fixed';
                mainNav.style.top = '60px';
                mainNav.style.left = mainNav.classList.contains('active') ? '0' : '-100%';
                mainNav.style.width = '100%';
                mainNav.style.height = 'calc(100vh - 60px)';
                mainNav.style.backgroundColor = 'var(--primary)';
                mainNav.style.transition = 'left 0.3s ease';
                mainNav.style.zIndex = '90';
                mainNav.style.padding = '20px';
                mainNav.style.overflowY = 'auto';
                
                const navUl = mainNav.querySelector('ul');
                if (navUl) {
                    navUl.style.flexDirection = 'column';
                    navUl.style.gap = '20px';
                }
            }
        } else {
            if (mainNav) {
                mainNav.style = '';
                const navUl = mainNav.querySelector('ul');
                if (navUl) {
                    navUl.style = '';
                }
            }
        }
    }
    
    // Initial call and window resize handler
    updateMobileNav();
    window.addEventListener('resize', updateMobileNav);
}); 
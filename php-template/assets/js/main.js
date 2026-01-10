/**
 * Hoxta PHP Template - Main JavaScript
 * Handles navigation, dropdowns, and core interactivity
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // Header Scroll Effect
    // ============================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // ============================================
    // Desktop Dropdown Navigation
    // ============================================
    const navLinks = document.querySelectorAll('.nav-link.has-dropdown');
    const dropdownContainer = document.getElementById('dropdownContainer');
    let activeDropdown = null;
    let closeTimeout = null;

    function showDropdown(menuLabel) {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            closeTimeout = null;
        }

        // Hide all dropdowns
        document.querySelectorAll('.mega-dropdown').forEach(dd => {
            dd.classList.remove('active');
        });
        
        // Remove active state from all nav links
        navLinks.forEach(link => link.classList.remove('active'));

        // Show target dropdown
        const targetDropdown = document.querySelector(`[data-dropdown-content="${menuLabel}"]`);
        const targetLink = document.querySelector(`[data-dropdown="${menuLabel}"]`);
        
        if (targetDropdown) {
            targetDropdown.classList.add('active');
            activeDropdown = menuLabel;
        }
        
        if (targetLink) {
            targetLink.classList.add('active');
        }
    }

    function hideAllDropdowns() {
        closeTimeout = setTimeout(() => {
            document.querySelectorAll('.mega-dropdown').forEach(dd => {
                dd.classList.remove('active');
            });
            navLinks.forEach(link => link.classList.remove('active'));
            activeDropdown = null;
        }, 150);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const menuLabel = this.getAttribute('data-dropdown');
            
            if (activeDropdown === menuLabel) {
                hideAllDropdowns();
            } else {
                showDropdown(menuLabel);
            }
        });

        link.addEventListener('mouseenter', function() {
            const menuLabel = this.getAttribute('data-dropdown');
            showDropdown(menuLabel);
        });

        link.addEventListener('mouseleave', function() {
            hideAllDropdowns();
        });
    });

    // Keep dropdown open when hovering over it
    document.querySelectorAll('.mega-dropdown').forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
        });

        dropdown.addEventListener('mouseleave', function() {
            hideAllDropdowns();
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-desktop') && !e.target.closest('.dropdown-container')) {
            document.querySelectorAll('.mega-dropdown').forEach(dd => {
                dd.classList.remove('active');
            });
            navLinks.forEach(link => link.classList.remove('active'));
            activeDropdown = null;
        }
    });

    // Close on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.mega-dropdown').forEach(dd => {
                dd.classList.remove('active');
            });
            navLinks.forEach(link => link.classList.remove('active'));
            activeDropdown = null;
            
            // Close mobile menu too
            document.getElementById('mobileMenu')?.classList.remove('active');
        }
    });

    // ============================================
    // Mobile Menu
    // ============================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            
            // Update icon
            const isOpen = mobileMenu.classList.contains('active');
            this.innerHTML = isOpen 
                ? '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>'
                : '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
        });

        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';
            });
        });
    }

    // ============================================
    // Billing Toggle (for game cards)
    // ============================================
    const billingBtns = document.querySelectorAll('.billing-toggle button');
    
    billingBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            billingBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const period = this.getAttribute('data-period');
            // Trigger custom event for price updates
            document.dispatchEvent(new CustomEvent('billingChange', { detail: { period } }));
        });
    });

    // ============================================
    // Carousel Navigation
    // ============================================
    function initCarousel(carouselSelector, prevBtnSelector, nextBtnSelector) {
        const carousel = document.querySelector(carouselSelector);
        const prevBtn = document.querySelector(prevBtnSelector);
        const nextBtn = document.querySelector(nextBtnSelector);

        if (!carousel) return;

        const scrollAmount = 300;

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    }

    initCarousel('.games-carousel', '.carousel-prev', '.carousel-next');
    initCarousel('.testimonials-carousel', '.testimonials-prev', '.testimonials-next');

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ============================================
    // Form Validation Helper
    // ============================================
    window.validateForm = function(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        return isValid;
    };

    // ============================================
    // Copy to Clipboard Helper
    // ============================================
    window.copyToClipboard = async function(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    console.log('Hoxta Template initialized');
});

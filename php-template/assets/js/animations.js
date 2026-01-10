/**
 * Hoxta PHP Template - Animations
 * Handles console animation, radar, and other visual effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // Hero Console Animation
    // ============================================
    const consoleBody = document.querySelector('.console-body');
    const progressFill = document.querySelector('.console-progress-fill');
    const progressPercent = document.querySelector('.console-progress-percent');

    if (consoleBody) {
        const consoleLines = [
            { text: '> Configuring firewall...', delay: 0 },
            { text: '> Deploying Minecraft server files...', delay: 600 },
            { text: '> Initiating DDoS protection...', delay: 1200 },
            { text: '> Deploying Node.js modules...', delay: 1800 },
            { text: '> Allocating VPS cluster resources...', delay: 2400 },
            { text: '> Setting up SSL certificates...', delay: 3000 },
            { text: '> Optimizing kernel parameters...', delay: 3600 },
            { text: '> Launching control panel...', delay: 4200 },
            { text: '> Deployment completed successfully!', delay: 4800, success: true }
        ];

        let animationKey = 0;

        function runConsoleAnimation() {
            animationKey++;
            const currentKey = animationKey;
            
            // Clear console
            consoleBody.innerHTML = '';
            if (progressFill) progressFill.style.width = '0%';
            if (progressPercent) progressPercent.textContent = '0%';

            consoleLines.forEach((line, index) => {
                setTimeout(() => {
                    // Check if animation was reset
                    if (currentKey !== animationKey) return;

                    const lineEl = document.createElement('div');
                    lineEl.className = 'console-line' + (line.success ? ' success' : '');
                    lineEl.textContent = line.text;
                    
                    // Add cursor to non-success lines
                    if (!line.success && index === consoleLines.length - 2) {
                        lineEl.innerHTML += '<span class="console-cursor"></span>';
                    }
                    
                    consoleBody.appendChild(lineEl);
                    
                    // Update progress
                    const progress = Math.round(((index + 1) / consoleLines.length) * 100);
                    if (progressFill) progressFill.style.width = progress + '%';
                    if (progressPercent) progressPercent.textContent = progress + '%';
                    
                    // Auto-scroll
                    consoleBody.scrollTop = consoleBody.scrollHeight;
                }, line.delay);
            });

            // Loop animation
            setTimeout(() => {
                if (currentKey === animationKey) {
                    runConsoleAnimation();
                }
            }, 6500);
        }

        // Start animation
        runConsoleAnimation();
    }

    // ============================================
    // Radar Animation (for Anti-DDoS section)
    // ============================================
    const radarSvg = document.querySelector('.radar-svg');
    
    if (radarSvg) {
        // Radar is primarily CSS-animated, but we can add dynamic blips
        const blipPositions = [
            { cx: 120, cy: 80, delay: 0 },
            { cx: 280, cy: 120, delay: 1000 },
            { cx: 180, cy: 260, delay: 2000 },
            { cx: 320, cy: 200, delay: 3000 },
            { cx: 100, cy: 180, delay: 1500 }
        ];

        // Animation handled by CSS, positions are static
    }

    // ============================================
    // Testimonials Auto-scroll
    // ============================================
    const testimonialsCarousel = document.querySelector('.testimonials-carousel');
    
    if (testimonialsCarousel) {
        let isHovered = false;
        let scrollInterval;

        function startAutoScroll() {
            scrollInterval = setInterval(() => {
                if (!isHovered) {
                    const scrollWidth = testimonialsCarousel.scrollWidth;
                    const clientWidth = testimonialsCarousel.clientWidth;
                    const scrollLeft = testimonialsCarousel.scrollLeft;
                    
                    if (scrollLeft + clientWidth >= scrollWidth - 10) {
                        testimonialsCarousel.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        testimonialsCarousel.scrollBy({ left: 320, behavior: 'smooth' });
                    }
                }
            }, 5000);
        }

        testimonialsCarousel.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        testimonialsCarousel.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        testimonialsCarousel.addEventListener('touchstart', () => {
            isHovered = true;
        });

        testimonialsCarousel.addEventListener('touchend', () => {
            isHovered = false;
        });

        startAutoScroll();
    }

    // ============================================
    // Floating Icons Animation (Hero Section)
    // ============================================
    function initFloatingIcons() {
        const floatingContainer = document.querySelector('.floating-icons');
        if (!floatingContainer) return;

        const icons = floatingContainer.querySelectorAll('.floating-icon');
        
        icons.forEach((icon, index) => {
            // Add random animation delay
            const delay = Math.random() * 2;
            icon.style.animationDelay = delay + 's';
        });
    }

    initFloatingIcons();

    // ============================================
    // Parallax Effect (subtle, respects reduced motion)
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', () => {
                const scrollY = window.pageYOffset;
                
                parallaxElements.forEach(el => {
                    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
                    const yPos = scrollY * speed;
                    el.style.transform = `translateY(${yPos}px)`;
                });
            }, { passive: true });
        }
    }

    // ============================================
    // Number Counter Animation
    // ============================================
    function animateNumbers() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'), 10);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            // Use Intersection Observer to trigger
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(counter);
        });
    }

    animateNumbers();

    // ============================================
    // Staggered Fade-in for Card Grids
    // ============================================
    function initStaggeredAnimations() {
        const cardGrids = document.querySelectorAll('[data-stagger]');
        
        cardGrids.forEach(grid => {
            const cards = grid.children;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        Array.from(cards).forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('animated');
                            }, index * 100);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(grid);
        });
    }

    initStaggeredAnimations();

    // ============================================
    // Smooth Reveal on Scroll
    // ============================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');
        
        if (revealElements.length === 0) return;

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    initScrollReveal();

    console.log('Hoxta Animations initialized');
});

// ============================================
// CSS Animation Helper Classes
// ============================================
// Add these styles dynamically if not in CSS
const animationStyles = `
    .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .reveal.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    [data-stagger] > * {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.4s ease, transform 0.4s ease;
    }
    
    [data-stagger] > *.animated {
        opacity: 1;
        transform: translateY(0);
    }
    
    .floating-icon {
        animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(2deg); }
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

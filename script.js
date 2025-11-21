/* ============================================
   AKSHYA PANDEY - PORTFOLIO SCRIPTS
   Smooth interactions and animations
   ============================================ */

// Detect touch device
const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
};

// Detect mobile viewport
const isMobileViewport = () => window.innerWidth <= 768;

document.addEventListener('DOMContentLoaded', () => {
    // Add touch device class to body for CSS targeting
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
    }

    // Initialize all features
    initThemeSwitcher();
    initNavigation();
    initScrollAnimations();
    initCounterAnimation();
    initContactForm();
    setCurrentYear();

    // Initialize new interactive features (conditionally on non-touch devices)
    if (!isTouchDevice()) {
        initMouseGlow();
        initCardTilt();
    }

    initScrollProgress();
    initRippleEffect();

    // Only init tooltips on non-touch devices
    if (!isTouchDevice()) {
        initTooltips();
    }

    initParticleInteraction();
});

/* ============================================
   CURRENT YEAR
   ============================================ */
function setCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/* ============================================
   THEME SWITCHER
   ============================================ */
function initThemeSwitcher() {
    const themeSwitcher = document.querySelector('.theme-switcher');
    const themeToggle = document.querySelector('.theme-toggle');
    const themeStylesheet = document.getElementById('theme-style');
    const themeButtons = document.querySelectorAll('.theme-btn');

    // Load saved theme or default
    const savedTheme = localStorage.getItem('portfolio-theme') || 'default';
    setTheme(savedTheme);

    // Toggle theme menu on click
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            themeSwitcher.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!themeSwitcher.contains(e.target)) {
            themeSwitcher.classList.remove('active');
        }
    });

    // Theme button click handlers
    themeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const theme = btn.dataset.theme;
            setTheme(theme);
            localStorage.setItem('portfolio-theme', theme);

            // Update active state
            themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Close menu after selection
            themeSwitcher.classList.remove('active');
        });
    });

    function setTheme(theme) {
        themeStylesheet.href = `themes/${theme}.css`;

        // Update active button
        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    let lastScrollY = window.scrollY;
    let ticking = false;

    // Hide/show navbar on scroll
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    function handleScroll() {
        const currentScrollY = window.scrollY;

        // Add background when scrolled
        if (currentScrollY > 50) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        // Hide navbar on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;

        // Update active nav link based on scroll position
        updateActiveNavLink();
    }

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth scroll to sections (only for anchor links)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');

            // Only handle anchor links (starting with #), let external links work normally
            if (!targetId.startsWith('#')) {
                // Close mobile menu for external links
                navMenu.classList.remove('active');
                navToggle?.classList.remove('active');
                return; // Let the browser handle the navigation
            }

            e.preventDefault();
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Close mobile menu if open
                navMenu.classList.remove('active');
                navToggle?.classList.remove('active');

                // Scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');

                // Stagger children animations if present
                const children = entry.target.querySelectorAll('.stagger-child');
                children.forEach((child, index) => {
                    child.style.animationDelay = `${index * 0.1}s`;
                    child.classList.add('animate-visible');
                });
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll(
        '.section-header, .skill-category, .timeline-item, .project-card, .highlight-card, .about-visual'
    );

    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Add CSS for scroll animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .animate-on-scroll.animate-visible {
            opacity: 1;
            transform: translateY(0);
        }

        .stagger-child {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .stagger-child.animate-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                // Only animate if not already animated
                if (counter.dataset.animated === 'true') return;

                const target = parseInt(counter.dataset.count);
                animateCounter(counter, target);
                counter.dataset.animated = 'true';
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));

    function animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('status');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnContent = submitBtn.innerHTML;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>Sending...</span>
            <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="60">
                    <animate attributeName="stroke-dashoffset" values="60;0" dur="0.8s" fill="freeze"/>
                </circle>
            </svg>
        `;

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showStatus('success', 'Thank you! Your message has been sent successfully.');
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            showStatus('error', 'Oops! There was a problem sending your message. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        }
    });

    function showStatus(type, message) {
        status.textContent = message;
        status.className = `form-status ${type}`;
        status.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    }
}

/* ============================================
   UTILITY: Smooth scroll for all anchor links
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

/* ============================================
   UTILITY: Add loading animation
   ============================================ */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

/* ============================================
   UTILITY: Parallax effect for hero (disabled on mobile/touch)
   ============================================ */
const hero = document.querySelector('.hero');
if (hero && !isTouchDevice() && !isMobileViewport()) {
    window.addEventListener('scroll', () => {
        // Skip parallax on mobile viewport
        if (isMobileViewport()) return;

        const scrolled = window.scrollY;
        const heroImage = hero.querySelector('.hero-image');
        const heroContent = hero.querySelector('.hero-content');

        if (scrolled < window.innerHeight) {
            if (heroImage) {
                heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.05}px)`;
                heroContent.style.opacity = 1 - (scrolled * 0.001);
            }
        }
    });
}

/* ============================================
   MOUSE GLOW EFFECT
   ============================================ */
function initMouseGlow() {
    const mouseGlow = document.querySelector('.mouse-glow');
    if (!mouseGlow) return;

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth animation loop
    function animate() {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        mouseGlow.style.left = `${currentX}px`;
        mouseGlow.style.top = `${currentY}px`;

        requestAnimationFrame(animate);
    }
    animate();

    // Show/hide glow based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight) {
            mouseGlow.style.opacity = '0';
        } else {
            mouseGlow.style.opacity = '0.1';
        }
    });
}

/* ============================================
   SCROLL PROGRESS INDICATOR
   ============================================ */
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

/* ============================================
   RIPPLE EFFECT ON BUTTONS
   ============================================ */
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            // Calculate position
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            btn.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/* ============================================
   TOOLTIPS FOR SOCIAL LINKS
   ============================================ */
function initTooltips() {
    // Add tooltips and pulse rings to social links
    const socialLinks = document.querySelectorAll('.hero-social .social-link');
    const tooltipTexts = ['LinkedIn', 'Twitter / X', 'Instagram', 'GitHub'];

    socialLinks.forEach((link, index) => {
        // Add tooltip
        if (tooltipTexts[index]) {
            link.setAttribute('data-tooltip', tooltipTexts[index]);
        }

        // Add pulse ring element
        if (!link.querySelector('.pulse-ring')) {
            const pulseRing = document.createElement('span');
            pulseRing.classList.add('pulse-ring');
            link.appendChild(pulseRing);
        }
    });

    // Also add pulse rings and tooltips to footer social links
    const footerSocialLinks = document.querySelectorAll('.footer-social a');
    const footerTooltipTexts = ['LinkedIn', 'Twitter / X', 'Instagram', 'GitHub'];

    footerSocialLinks.forEach((link, index) => {
        // Add tooltip
        if (footerTooltipTexts[index]) {
            link.setAttribute('data-tooltip', footerTooltipTexts[index]);
        }

        // Add pulse ring element
        if (!link.querySelector('.pulse-ring')) {
            const pulseRing = document.createElement('span');
            pulseRing.classList.add('pulse-ring');
            link.appendChild(pulseRing);
        }
    });

}

/* ============================================
   PARTICLE INTERACTION ON MOUSE MOVE
   (Simplified - particles follow mouse slightly without breaking CSS animation)
   ============================================ */
function initParticleInteraction() {
    // Particles use CSS animation only - no JS interference
    // This keeps the floating effect smooth and consistent
}

/* ============================================
   3D CARD TILT EFFECT
   (Subtle effect for skill and highlight cards only - not project cards)
   ============================================ */
function initCardTilt() {
    // Only apply subtle tilt to smaller cards, not project cards
    const cards = document.querySelectorAll('.skill-category, .highlight-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Very subtle tilt - reduced from /20 to /50
            const rotateX = (y - centerY) / 50;
            const rotateY = (centerX - x) / 50;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });
}

/* ============================================
   MAGNETIC BUTTONS (disabled on touch devices)
   ============================================ */
if (!isTouchDevice()) {
    const magneticBtns = document.querySelectorAll('.btn-primary, .nav-cta');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/* Text scramble effect removed for better UX */

/* ============================================
   UTILITY: Typing effect for hero subtitle (skip on mobile for performance)
   ============================================ */
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle && !isMobileViewport()) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    heroSubtitle.style.borderRight = '2px solid var(--accent-primary)';

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroSubtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                heroSubtitle.style.borderRight = 'none';
            }, 1000);
        }
    };

    // Start typing after a short delay
    setTimeout(typeWriter, 500);
}

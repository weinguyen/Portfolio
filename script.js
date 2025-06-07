// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function safeElementAccess(selector, callback) {
    const element = document.querySelector(selector);
    if (element && typeof callback === 'function') {
        callback(element);
    }
}

function safeElementsAccess(selector, callback) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0 && typeof callback === 'function') {
        callback(elements);
    }
}

// Mobile Navigation
function initMobileNavigation() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            hamburger.classList.toggle("active");
        });
    }

    if (navLinks.length > 0) {
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                safeElementAccess(".nav-menu", (menu) => {
                    menu.classList.remove("active");
                });
                safeElementAccess(".hamburger", (burger) => {
                    burger.classList.remove("active");
                });
            });
        });
    }
}

// Active Navigation Link
function initActiveNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");

    const updateActiveNavLink = debounce(() => {
        let current = "";
        const sections = document.querySelectorAll("section");

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    }, 10);

    window.addEventListener("scroll", updateActiveNavLink);
}

// Header Background on Scroll
function initHeaderBackground() {
    const updateHeaderBackground = debounce(() => {
        safeElementAccess(".header", (header) => {
            if (window.scrollY > 100) {
                header.style.background = "rgba(255, 255, 255, 0.98)";
                header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
            } else {
                header.style.background = "rgba(255, 255, 255, 0.95)";
                header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.05)";
            }
        });
    }, 10);

    window.addEventListener("scroll", updateHeaderBackground);
}

// Tabs Functionality
function initTabsFunctionality() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");

    if (tabBtns.length > 0 && tabPanes.length > 0) {
        tabBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const targetTab = btn.getAttribute("data-tab");

                // Remove active class from all buttons and panes
                tabBtns.forEach((b) => b.classList.remove("active"));
                tabPanes.forEach((p) => p.classList.remove("active"));

                // Add active class to clicked button and corresponding pane
                btn.classList.add("active");
                const targetPane = document.getElementById(targetTab);
                if (targetPane) {
                    targetPane.classList.add("active");
                }
            });
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observeElements = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        },
        {
            threshold: 0.1,
        }
    );

    // Add animation to elements
    const animatedSelectors = [
        ".timeline-item",
        ".skill-category",
        ".stat-item",
        ".contact-item",
        ".project-card",
        ".other-item"
    ];

    animatedSelectors.forEach(selector => {
        safeElementsAccess(selector, (elements) => {
            elements.forEach((el) => {
                el.style.opacity = "0";
                el.style.transform = "translateY(30px)";
                el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
                observeElements.observe(el);
            });
        });
    });
}

// Contact Form Handling
function initContactForm() {
    safeElementAccess(".contact-form form", (contactForm) => {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Get form data
            const nameInput = this.querySelector('input[name="name"], input[type="text"]');
            const emailInput = this.querySelector('input[type="email"]');
            const subjectInput = this.querySelector('input[name="subject"]');
            const messageInput = this.querySelector("textarea");

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const subject = subjectInput ? subjectInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            // Simple validation
            if (!name || !email || !message) {
                alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Vui lòng nhập email hợp lệ!");
                return;
            }

            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = "Đang gửi...";
                submitBtn.disabled = true;

                setTimeout(() => {
                    alert("Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.");
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    });
}

// Typing Effect for Hero Title
function typeWriter(element, text, speed = 100) {
    if (!element || !text) return;

    let i = 0;
    element.innerHTML = "";

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing effect
function initTypingEffect() {
    safeElementAccess(".hero-subtitle", (heroSubtitle) => {
        const originalText = heroSubtitle.textContent;
        if (originalText) {
            setTimeout(() => {
                typeWriter(heroSubtitle, originalText, 80);
            }, 1000);
        }
    });
}

// Parallax Effect for Hero Section
function initParallaxEffect() {
    const handleParallax = debounce(() => {
        const scrolled = window.pageYOffset;
        safeElementAccess(".hero-image", (heroImage) => {
            const rate = scrolled * -0.3;
            heroImage.style.transform = `translateY(${rate}px)`;
        });
    }, 5);

    window.addEventListener("scroll", handleParallax);
}

// Hero Animation
function initHeroAnimation() {
    // Set initial states for animated elements
    safeElementAccess(".hero-text", (heroText) => {
        heroText.style.opacity = "0";
        heroText.style.transform = "translateY(30px)";
        heroText.style.transition = "opacity 1s ease, transform 1s ease";
    });

    safeElementAccess(".hero-image", (heroImage) => {
        heroImage.style.opacity = "0";
        heroImage.style.transform = "translateX(30px)";
        heroImage.style.transition = "opacity 1s ease, transform 1s ease";
    });
}

// Loading Animation
function initLoadingAnimation() {
    window.addEventListener("load", () => {
        document.body.classList.add("loaded");

        // Animate hero content
        safeElementAccess(".hero-text", (heroText) => {
            setTimeout(() => {
                heroText.style.opacity = "1";
                heroText.style.transform = "translateY(0)";
            }, 300);
        });

        safeElementAccess(".hero-image", (heroImage) => {
            setTimeout(() => {
                heroImage.style.opacity = "1";
                heroImage.style.transform = "translateX(0)";
            }, 600);
        });

        // Initialize typing effect after load
        initTypingEffect();
    });
}


// Scroll to Top Button
function createScrollToTop() {
    const scrollBtn = document.createElement("button");
    scrollBtn.className = "scroll-to-top";
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #ff69b4;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(255, 179, 201, 0.3);
        font-size: 1.2rem;
    `;

    scrollBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });

    const toggleScrollBtn = debounce(() => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = "1";
            scrollBtn.style.visibility = "visible";
        } else {
            scrollBtn.style.opacity = "0";
            scrollBtn.style.visibility = "hidden";
        }
    }, 10);

    window.addEventListener("scroll", toggleScrollBtn);
    document.body.appendChild(scrollBtn);
}

// Project Card Hover Effects
function initProjectCardHovers() {
    safeElementsAccess(".project-card", (cards) => {
        cards.forEach((item) => {
            item.addEventListener("mouseenter", function () {
                this.style.transform = "translateY(-10px) scale(1.02)";
                this.style.boxShadow = "0 15px 30px rgba(255, 179, 201, 0.2)";
            });

            item.addEventListener("mouseleave", function () {
                this.style.transform = "translateY(0) scale(1)";
                this.style.boxShadow = "0 10px 30px rgba(255, 179, 201, 0.15)";
            });
        });
    });
}

// Update Footer Year
function updateFooterYear() {
    const currentYear = new Date().getFullYear();
    safeElementAccess(".footer-content p", (footerText) => {
        footerText.textContent = `© ${currentYear} weinguyen. All rights reserved.`;
    });
}

// Image Viewer functionality (for regular images)
function initializeImageViewer() {
    document.querySelectorAll('.view-image-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Get the image source
            const img = this.closest('.image-preview').querySelector('.gallery-image');
            if (!img) return;

            // Create viewer
            const viewer = document.createElement('div');
            viewer.className = 'fullscreen-image';

            // Create image element
            const fullImg = document.createElement('img');
            fullImg.src = img.src;
            fullImg.alt = img.alt;

            // Create close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-fullscreen';
            closeBtn.innerHTML = '&times;';

            // Assemble viewer
            viewer.appendChild(fullImg);
            viewer.appendChild(closeBtn);
            document.body.appendChild(viewer);

            // Show viewer with animation
            requestAnimationFrame(() => {
                viewer.classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            // Close handling
            const closeViewer = () => {
                viewer.classList.remove('active');
                document.body.style.overflow = '';
                setTimeout(() => viewer.remove(), 300);
            };

            // Event listeners
            closeBtn.addEventListener('click', closeViewer);
            viewer.addEventListener('click', (e) => {
                if (e.target === viewer) closeViewer();
            });

            // Keyboard support
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    closeViewer();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        });
    });
}

// Project Modal and Gallery Functionality
function initProjectModals() {
    const projectCards = document.querySelectorAll('.project-card[data-project]');
    const modals = document.querySelectorAll('.project-modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    const otherItems = document.querySelectorAll('.other-item');

    // Unified modal open function
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Initialize gallery first
            initializeGallery(modal);

            // Then initialize image viewer after a short delay
            setTimeout(() => {
                initializeImageViewer();
            }, 100);
        }
    }

    // Unified modal close function
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Event listeners for other items
    otherItems.forEach(item => {
        item.addEventListener('click', function () {
            const modalId = this.getAttribute('data-project') + '-modal';
            openModal(modalId);
        });
    });

    // Event listeners for project cards
    projectCards.forEach(card => {
        card.addEventListener('click', function () {
            const modalId = this.getAttribute('data-project') + '-modal';
            openModal(modalId);
        });
    });

    // Event listeners for close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.project-modal');
            closeModal(modal);
        });
    });

    // Close on outside click
    modals.forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });

    // Gallery functionality
    function initializeGallery(modal) {
        const slides = modal.querySelectorAll('.gallery-slide');
        const dots = modal.querySelectorAll('.gallery-dot');
        const prevBtn = modal.querySelector('.prev-btn');
        const nextBtn = modal.querySelector('.next-btn');

        if (slides.length === 0) {
            console.log('No gallery slides found in modal');
            return;
        }

        console.log(`Found ${slides.length} slides in gallery`);

        let currentSlide = 0;

        function showSlide(index) {
            index = Math.max(0, Math.min(index, slides.length - 1));
            currentSlide = index;

            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            const newIndex = (currentSlide + 1) % slides.length;
            showSlide(newIndex);
        }

        function prevSlide() {
            const newIndex = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(newIndex);
        }

        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });

        // Keyboard navigation for gallery
        function handleGalleryKeyPress(e) {
            if (modal.classList.contains('active')) {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                }
            }
        }

        document.addEventListener('keydown', handleGalleryKeyPress);
        showSlide(0);
    }

    // Global keyboard navigation
    document.addEventListener('keydown', function (e) {
        const activeModal = document.querySelector('.project-modal.active');
        if (activeModal && e.key === 'Escape') {
            closeModal(activeModal);
        }
    });
}

// Certificate Navigation
function initCertificateNavigation() {
    const prevBtn = document.querySelector('.prev-btn:not(.gallery-btn)');
    const nextBtn = document.querySelector('.next-btn:not(.gallery-btn)');
    const certificateCards = document.querySelectorAll('.certificate-card');

    if (!prevBtn || !nextBtn || certificateCards.length === 0) return;

    let currentCertificate = 0;

    function showCertificate(index) {
        certificateCards.forEach((card, i) => {
            card.style.display = i === index ? 'block' : 'none';
        });

        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === certificateCards.length - 1;
    }

    prevBtn.addEventListener('click', () => {
        if (currentCertificate > 0) {
            currentCertificate--;
            showCertificate(currentCertificate);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentCertificate < certificateCards.length - 1) {
            currentCertificate++;
            showCertificate(currentCertificate);
        }
    });

    showCertificate(0);
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Performance monitoring
function initPerformanceMonitoring() {
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Scroll ended cleanup
        }, 150);
    });
}

// Resize handler with debounce
function initResizeHandler() {
    const handleResize = debounce(() => {
        const isMobile = window.innerWidth <= 768;
        safeElementAccess('.certificate-nav', (nav) => {
            nav.style.display = isMobile ? 'flex' : 'none';
        });
    }, 250);

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
}

function initActivityGallery() {
    const track = document.querySelector('.slider-track');
    const items = document.querySelectorAll('.slider-item');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');

    if (!track || !items.length) return;

    let currentIndex = 0;
    const itemsPerView = window.innerWidth <= 768 ? 1 : 3;
    const maxIndex = Math.max(0, items.length - itemsPerView);
    function updateSlider() {
        const container = track.parentElement;
        const containerWidth = container.offsetWidth;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        const itemWidth = (containerWidth - gap * (itemsPerView - 1)) / itemsPerView;

        items.forEach((item) => {
            item.style.width = `${itemWidth}px`;
        });

        const totalGap = currentIndex * gap;
        const translateX = currentIndex * itemWidth + totalGap;

        track.style.transform = `translateX(-${translateX}px)`;
        track.style.transition = 'transform 0.3s ease-out';

        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === maxIndex;
    }
    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(maxIndex, currentIndex + 1);
        updateSlider();
    });

    // Update on resize
    window.addEventListener('resize', () => {
        currentIndex = 0;
        updateSlider();
    });

    // Initial setup
    updateSlider();
}
function initializeWebsite() {
    console.log('Initializing website...');

    // Core functionality
    initMobileNavigation();
    initActiveNavigation();
    initHeaderBackground();
    initTabsFunctionality();
    initScrollAnimations();
    initContactForm();
    initParallaxEffect();
    initHeroAnimation();
    initProjectModals();
    initProjectCardHovers();
    initCertificateNavigation();
    initSmoothScroll();
    initPerformanceMonitoring();
    initResizeHandler();

    initActivityGallery();
    // UI enhancements

    createScrollToTop();
    updateFooterYear();

    // Initialize image viewer for existing images
    initializeImageViewer();

    console.log('Website initialized successfully');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeWebsite);
window.addEventListener('load', initLoadingAnimation);

// Handle page visibility changes
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        // Page is hidden - pause intensive operations
    } else {
        // Page is visible - resume operations
    }
});

// Global error handling
window.addEventListener('error', function (e) {
    console.error('JavaScript error occurred:', e.error);
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        safeElementAccess,
        safeElementsAccess,
        typeWriter,
        initializeWebsite
    };
}
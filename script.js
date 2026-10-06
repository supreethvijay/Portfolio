document.addEventListener('DOMContentLoaded', () => {

    // --- Check if loaded inside an iframe ---
    if (window.self !== window.top) {
        document.body.classList.add('in-iframe');
    }

    // --- Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.main-nav');

    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // --- ScrollSpy Navigation ---
    const spySections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.main-nav a');

    if (spySections.length > 0 && navLinks.length > 0) {
        const spyOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px', // triggers when the section is at the exact vertical center
            threshold: 0
        };

        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');

                    // We only want to remove active from links if the intersecting section actually has a corresponding link
                    const hasMatchingLink = Array.from(navLinks).some(link => link.getAttribute('href').endsWith(`#${id}`));

                    if (hasMatchingLink) {
                        navLinks.forEach(link => {
                            // Don't modify the Resume button which usually doesn't have a hash, or links without a hash
                            if (link.getAttribute('href').includes('#')) {
                                link.classList.remove('active');
                                if (link.getAttribute('href').endsWith(`#${id}`)) {
                                    link.classList.add('active');
                                }
                            }
                        });
                    }
                }
            });
        }, spyOptions);

        spySections.forEach(sec => spyObserver.observe(sec));
    }

    // --- Sticky Header Effect ---
    const header = document.querySelector('.site-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
            header.style.background = 'rgba(18, 18, 18, 0.95)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(18, 18, 18, 0.85)';
        }
    });

    // --- Smooth Scroll Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Intersection Observer for Fade-in Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply fade-in class to major sections cards
    const elementsToAnimate = document.querySelectorAll(
        '.hero-content, .hero-visual, .project-card, .expertise-card, .stat-card, .recognition-item, .testimonial-card, .contact-card, .about-text, .about-image'
    );

    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in-element');
        observer.observe(el);
    });

    // --- Floating Elements Mouse Parallax (Hero) ---
    const heroSection = document.querySelector('.hero-section');
    const float1 = document.querySelector('.float-1');
    const float2 = document.querySelector('.float-2');

    if (heroSection && float1 && float2) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            float1.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
            float2.style.transform = `translate(-${x * 30}px, -${y * 30}px)`;
        });
    }

    // --- Infinite Recognition Carousel Slider ---
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        const carousel = carouselWrapper.querySelector('.recognition-carousel');
        const prevBtn = carouselWrapper.querySelector('.prev-btn');
        const nextBtn = carouselWrapper.querySelector('.next-btn');

        if (carousel && prevBtn && nextBtn) {
            const originalItems = Array.from(carousel.children);

            // Calculate single set width including gap
            // We assume all items have the same width
            const itemWidth = originalItems[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(carousel).gap) || 0;
            const singleSetWidth = (itemWidth + gap) * originalItems.length;

            // Clone items for infinite loop
            originalItems.forEach(item => {
                const clone = item.cloneNode(true);
                carousel.appendChild(clone);
            });

            // Auto-scroll variables
            let scrollAmount = 0;
            const scrollSpeed = 0.8; // Adjust for speed
            let isPaused = false;
            let autoScrollId;

            const animateScroll = () => {
                if (!isPaused) {
                    scrollAmount += scrollSpeed;

                    // Infinite loop reset
                    if (scrollAmount >= singleSetWidth) {
                        scrollAmount -= singleSetWidth;
                    }
                    carousel.scrollLeft = scrollAmount;
                } else {
                    // Sync while paused (e.g. user manually scrolled)
                    scrollAmount = carousel.scrollLeft;

                    // Handle manual scroll wrapping (optional but good for consistency)
                    if (carousel.scrollLeft >= singleSetWidth) {
                        scrollAmount = carousel.scrollLeft - singleSetWidth;
                        carousel.scrollLeft = scrollAmount;
                    }
                }
                autoScrollId = requestAnimationFrame(animateScroll);
            };

            // Start loop
            autoScrollId = requestAnimationFrame(animateScroll);

            // Pause on hover
            carouselWrapper.addEventListener('mouseenter', () => isPaused = true);
            carouselWrapper.addEventListener('mouseleave', () => isPaused = false);

            // Simple Manual Controls
            prevBtn.addEventListener('click', () => {
                const cardWidth = itemWidth + gap;
                carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
                scrollAmount = carousel.scrollLeft - cardWidth; // Sync
            });

            nextBtn.addEventListener('click', () => {
                const cardWidth = itemWidth + gap;
                carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
                scrollAmount = carousel.scrollLeft + cardWidth; // Sync
            });
        }
    }

});


const logo = document.querySelector('.logo-img');
const originalSrc = logo.src;
const hoverSrc = logo.dataset.hover;

logo.addEventListener('mouseenter', () => {
    logo.src = hoverSrc;
});

logo.addEventListener('mouseleave', () => {
    logo.src = originalSrc;
});




/* Testimonials Read More Toggle */
function toggleTestimonial(btn) {
    const card = btn.closest('.testimonial-card');
    const moreText = card.querySelector('.more-text');
    const dots = card.querySelector('.dots');

    if (moreText.style.display === 'none') {
        moreText.style.display = 'inline';
        if (dots) dots.style.display = 'none';
        btn.textContent = 'Read Less';
    } else {
        moreText.style.display = 'none';
        if (dots) dots.style.display = 'inline';
        btn.textContent = 'Read More';
    }
}

/* Testimonial Slider Controls */
/* Testimonial Slider Controls */
document.addEventListener('DOMContentLoaded', () => {
    // --- Testimonial Slider Controls ---
    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (testimonialSlider) {
        const tPrevBtn = document.querySelector('.testimonial-prev-btn');
        const tNextBtn = document.querySelector('.testimonial-next-btn-main');

        if (tPrevBtn && tNextBtn) {
            tPrevBtn.addEventListener('click', () => {
                const firstCard = testimonialSlider.querySelector('.testimonial-card');
                if (firstCard) {
                    const cardWidth = firstCard.offsetWidth;
                    const gap = parseFloat(window.getComputedStyle(testimonialSlider).gap) || 0;
                    testimonialSlider.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
                }
            });

            tNextBtn.addEventListener('click', () => {
                const firstCard = testimonialSlider.querySelector('.testimonial-card');
                if (firstCard) {
                    const cardWidth = firstCard.offsetWidth;
                    const gap = parseFloat(window.getComputedStyle(testimonialSlider).gap) || 0;
                    testimonialSlider.scrollBy({ left: (cardWidth + gap), behavior: 'smooth' });
                }
            });
        }
    }

    // --- Project Overview Tabs (Event Delegation) ---
    const tabsContainer = document.querySelector('.overview-tabs-container');
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.overview-tab');
            if (!tab) return;

            // Prevent default button behavior
            e.preventDefault();

            // Remove active class from all tabs
            const allTabs = tabsContainer.querySelectorAll('.overview-tab');
            allTabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Get target content ID
            const tabValue = tab.getAttribute('data-tab');
            if (tabValue) {
                const targetId = 'content-' + tabValue;

                // Hide all content sections inside the overview panel
                const contentPanel = document.querySelector('.overview-content-panel');
                if (contentPanel) {
                    const allContents = contentPanel.querySelectorAll('.tab-content');
                    allContents.forEach(content => {
                        content.classList.add('u-hidden');
                        content.classList.remove('active');
                    });
                }

                // Show target content
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.remove('u-hidden');
                    // Small delay to allow display:block to apply before adding class for opacity transition
                    setTimeout(() => {
                        targetContent.classList.add('active');
                    }, 50);
                }
            }
        });
    }

    // --- Ambiguity to Clarity Tabs ---
    const ambiguityTabsContainer = document.querySelector('.ambiguity-tabs');
    const ambiguityPanels = document.querySelectorAll('.ambiguity-panel');

    if (ambiguityTabsContainer) {
        ambiguityTabsContainer.addEventListener('click', (e) => {
            const clickedTab = e.target.closest('.ambiguity-tab');
            if (!clickedTab) return;

            const themeId = clickedTab.dataset.theme;

            // Remove active class from all tabs
            ambiguityTabsContainer.querySelectorAll('.ambiguity-tab').forEach(tab => tab.classList.remove('active'));
            clickedTab.classList.add('active');

            // Hide all panels and show the selected one
            ambiguityPanels.forEach(panel => {
                panel.classList.remove('active');
                panel.classList.add('u-hidden');

                if (panel.id === themeId) {
                    panel.classList.remove('u-hidden');
                    // Small delay for fade-in effect
                    setTimeout(() => {
                        panel.classList.add('active');
                    }, 10);
                }
            });
        });
    }

    // --- Comparison Card Carousels ---
    const carousels = document.querySelectorAll('.comp-carousel-container');
    carousels.forEach(container => {
        const track = container.querySelector('.comp-carousel-track');
        const dots = container.querySelectorAll('.comp-dot');
        const prevBtn = container.querySelector('.comp-nav-btn.prev');
        const nextBtn = container.querySelector('.comp-nav-btn.next');
        const counter = container.querySelector('.comp-counter');
        const slides = container.querySelectorAll('.comp-slide');

        let currentIndex = 0;

        const updateCarousel = (index) => {
            currentIndex = index;

            // Update track position
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        // Navigation Button Events
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const index = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel(index);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const index = (currentIndex + 1) % slides.length;
                updateCarousel(index);
            });
        }
    });

    // --- Cinema Frame Toggle Logic (Shipping Experience) ---
    const cinemaToggles = document.querySelectorAll('.cinema-toggle');
    if (cinemaToggles.length > 0) {
        cinemaToggles.forEach(btn => {
            btn.addEventListener('click', () => {
                const container = btn.closest('.cinema-container');
                const targetId = btn.getAttribute('data-target');

                if (container && targetId) {
                    // Toggle buttons
                    container.querySelectorAll('.cinema-toggle').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Toggle panels
                    container.querySelectorAll('.cinema-panel').forEach(p => p.classList.remove('active'));
                    const targetPanel = container.querySelector('#' + targetId);
                    if (targetPanel) {
                        targetPanel.classList.add('active');
                    }
                }
            });
        });
    }

    // --- Project Discovery Carousel Scroll ---
    const discoveryWrapper = document.querySelector('.carousel-wrapper');
    if (discoveryWrapper) {
        const dCarousel = discoveryWrapper.querySelector('.teaser-carousel');
        const dPrevBtn = discoveryWrapper.querySelector('.carousel-nav-btn.prev');
        const dNextBtn = discoveryWrapper.querySelector('.carousel-nav-btn.next');

        if (dCarousel && dPrevBtn && dNextBtn) {
            dPrevBtn.addEventListener('click', () => {
                dCarousel.scrollBy({ left: -500, behavior: 'smooth' });
            });

            dNextBtn.addEventListener('click', () => {
                dCarousel.scrollBy({ left: 500, behavior: 'smooth' });
            });
        }
    }

    // --- Resume Download Handler ---
    document.querySelectorAll('.resume-download-btn, .nav-link[href*="drive.google.com"], .resume-download-link').forEach(el => {
        el.addEventListener('click', downloadResume);
    });

    // --- Project Card Navigation ---
    document.querySelectorAll('.project-card[data-href]').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.location.href = card.getAttribute('data-href');
        });
    });

    // --- Legacy onclick cleanup ---
    document.querySelectorAll('[onclick^="window.location.href"]').forEach(el => {
        const href = el.getAttribute('onclick').match(/'([^']+)'/)[1];
        el.removeAttribute('onclick');
        el.setAttribute('data-href', href);
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
            window.location.href = href;
        });
    });
    // --- Testimonial Read More ---
    document.querySelectorAll('.read-more-link').forEach(btn => {
        btn.addEventListener('click', () => toggleTestimonial(btn));
    });
});

// Utility: Toggle Testimonial Read More
function toggleTestimonial(button) {
    const parent = button.closest('.testimonial-card');
    const dots = parent.querySelector('.dots');
    const moreText = parent.querySelector('.more-text');

    if (moreText.classList.contains('u-hidden')) {
        dots.classList.add('u-hidden');
        button.innerHTML = "Read Less";
        moreText.classList.remove('u-hidden');
    } else {
        dots.classList.remove('u-hidden');
        button.innerHTML = "Read More";
        moreText.classList.add('u-hidden');
    }
}

function downloadResume(event) {
    event.preventDefault();
    const downloadUrl = "https://drive.google.com/uc?export=download&id=1-UMrkXepbxmX2F9KaqkmbTUOLRRCYi06";
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- Gallery Logic for CalmBridge ---
function setupGallery(trackId, dotsContainerId, prevId, nextId) {
    const track = document.getElementById(trackId);
    const dotsContainer = document.getElementById(dotsContainerId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if (!track || !dotsContainer) return;

    const dots = dotsContainer.querySelectorAll('.gallery-dot');
    let currentIndex = 0;

    // Card width including gap
    function getCardWidth() {
        const card = track.querySelector('.wireframe-gallery-card');
        if (!card) return 0;
        return card.offsetWidth + 20; // 20px is the gap
    }

    // Update dots on scroll
    track.addEventListener('scroll', () => {
        const cardWidth = getCardWidth();
        if (cardWidth === 0) return;
        currentIndex = Math.round(track.scrollLeft / cardWidth);
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    });

    // Click dot to scroll
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const cardWidth = getCardWidth();
            track.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
        });
    });

    // Click arrows to scroll
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const cardWidth = getCardWidth();
            track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const cardWidth = getCardWidth();
            track.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupGallery('wf-gallery-1', 'gallery-dots-1', 'gallery-prev-1', 'gallery-next-1');
    setupGallery('wf-gallery-2', 'gallery-dots-2', 'gallery-prev-2', 'gallery-next-2');
});

/* --- Split-View Storyteller Logic --- */
document.addEventListener('DOMContentLoaded', () => {
    const navSteps = document.querySelectorAll('.nav-step');
    const contentBlocks = document.querySelectorAll('.content-block');

    if (navSteps.length > 0 && contentBlocks.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        };

        const storytellerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');

                    // Update Nav
                    navSteps.forEach(step => {
                        step.classList.remove('active');
                        if (step.getAttribute('data-target') === id) {
                            step.classList.add('active');

                            // On mobile, scroll the nav into view if it overflows
                            if (window.innerWidth <= 1024) {
                                step.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                            }
                        }
                    });

                    // Update Block
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, observerOptions);

        contentBlocks.forEach(block => storytellerObserver.observe(block));

        // Click to Scroll
        navSteps.forEach(step => {
            step.addEventListener('click', () => {
                const targetId = step.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerHeight = 150; // Offset for sticky nav
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            });
        });
    }

    // --- Before & After Lightbox Modal Logic ---
    const comparisonCards = document.querySelectorAll('.comparison-card');
    const lightbox = document.getElementById('comparison-lightbox');

    if (comparisonCards.length > 0 && lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const lightboxBadge = lightbox.querySelector('.lightbox-badge-tag');
        const lightboxTitle = lightbox.querySelector('.lightbox-title-text');
        const lightboxDesc = lightbox.querySelector('.lightbox-desc-text');
        const lightboxClose = lightbox.querySelector('.lightbox-close-btn');

        comparisonCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                const img = card.querySelector('.comparison-image-wrap img');
                const badge = card.querySelector('.comparison-badge');
                const title = card.querySelector('.comparison-details h5');
                const desc = card.querySelector('.comparison-details p');

                if (img && badge && title && desc) {
                    // Populate lightbox elements
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;

                    // Set badge details
                    lightboxBadge.textContent = badge.textContent;
                    lightboxBadge.className = 'lightbox-badge-tag ' + (badge.classList.contains('before') ? 'before' : 'after');

                    // Set text content
                    lightboxTitle.textContent = title.textContent;
                    lightboxDesc.textContent = desc.textContent;

                    // Open Modal natively
                    lightbox.showModal();
                    document.body.classList.add('no-scroll');
                }
            });
        });

        // Close functions
        const closeLightbox = () => {
            lightbox.close();
            document.body.classList.remove('no-scroll');
        };

        lightboxClose.addEventListener('click', closeLightbox);

        // Close on clicking backdrop outside content
        lightbox.addEventListener('click', (e) => {
            const rect = lightbox.getBoundingClientRect();
            const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                closeLightbox();
            }
        });
    }

    // --- Resume Popup Modal Logic ---
    const resumeLinks = document.querySelectorAll('a[href*="Resume.html"]');

    if (resumeLinks.length > 0) {
        // Create the <dialog> modal element dynamically if it doesn't exist
        let resumeDialog = document.getElementById('resume-popup-dialog');
        if (!resumeDialog) {
            resumeDialog = document.createElement('dialog');
            resumeDialog.id = 'resume-popup-dialog';
            resumeDialog.className = 'resume-popup-lightbox';
            resumeDialog.innerHTML = `
                <button class="resume-popup-close-btn" aria-label="Close Resume">✕</button>
                <div class="resume-popup-content">
                    <div class="resume-loading-indicator" style="display: flex; justify-content: center; align-items: center; height: 100%; color: var(--text-muted); font-size: 1.2rem; gap: 0.8rem; padding: 5rem 0;">
                        <span class="spinner" style="width: 28px; height: 28px; border: 3px solid rgba(255,207,0,0.1); border-top-color: var(--accent-highlight); border-radius: 50%; animation: spin 0.8s linear infinite;"></span>
                        Loading Resume...
                    </div>
                </div>
            `;
            document.body.appendChild(resumeDialog);

            // Add CSS keyframe for spinner dynamically if not in css
            if (!document.getElementById('spin-keyframe-style')) {
                const style = document.createElement('style');
                style.id = 'spin-keyframe-style';
                style.innerHTML = `
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        const closeBtn = resumeDialog.querySelector('.resume-popup-close-btn');
        const contentContainer = resumeDialog.querySelector('.resume-popup-content');

        const closeResume = () => {
            resumeDialog.close();
            document.body.classList.remove('no-scroll');
        };

        closeBtn.addEventListener('click', closeResume);

        // Close on clicking backdrop outside dialog content
        resumeDialog.addEventListener('click', (e) => {
            const rect = resumeDialog.getBoundingClientRect();
            const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                closeResume();
            }
        });

        const openResumePopup = (e) => {
            e.preventDefault();

            if (typeof resumeDialog.showModal !== 'function') {
                window.location.href = 'Resume.html';
                return;
            }

            // Check if iframe is already loaded. If not, create and inject it.
            let iframe = contentContainer.querySelector('iframe');
            if (!iframe) {
                contentContainer.innerHTML = `
                    <iframe src="Resume.html" style="width: 100%; height: 100%; border: none; background: transparent; display: block;"></iframe>
                `;
            }

            resumeDialog.showModal();
            document.body.classList.add('no-scroll');
        };

        resumeLinks.forEach(link => {
            link.addEventListener('click', openResumePopup);
        });
    }

    // --- Splash Video Overlay Logic ---
    const splashOverlay = document.getElementById('splash-overlay');
    const splashVideo = document.getElementById('splash-video');
    const splashPlayOverlay = document.getElementById('splash-play-overlay');
    const splashPlayBtn = document.getElementById('splash-play-btn');
    const splashSkipBtn = document.getElementById('splash-skip-btn');
    const splashProgressBar = document.getElementById('splash-progress-bar');
    const splashProgressContainer = document.querySelector('.splash-progress-container');
    const heroWatchIntroBtn = document.getElementById('hero-watch-intro-btn');

    if (splashOverlay && splashVideo) {

        // Show overlay with transition
        const showSplash = () => {
            splashOverlay.style.display = 'flex';
            // Force reflow for opacity transition
            splashOverlay.offsetHeight;
            splashOverlay.classList.add('active');
            document.body.classList.add('no-scroll');

            // Set initial state - unmuted sound by default, never muted
            splashVideo.muted = false;
            splashVideo.currentTime = 0;

            // Set overlay active on start
            showPlayOverlay();

            // Try to autoplay unmuted
            const playPromise = splashVideo.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Autoplayed successfully with audio!
                    updatePlayButtonState(false);
                    hidePlayOverlay();
                }).catch(error => {
                    console.log("Unmuted autoplay blocked by browser policy. Sitting paused behind active play overlay: ", error);
                    // Sit paused on first frame with sound active and overlay displayed
                    updatePlayButtonState(true);
                    showPlayOverlay();
                });
            } else {
                updatePlayButtonState(false);
            }
        };

        // Dismiss overlay with smooth animation
        const dismissSplash = () => {
            splashOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            splashVideo.pause();

            // Wait for fadeout transition before display: none
            setTimeout(() => {
                splashOverlay.style.display = 'none';
            }, 500);

        // Store in local storage is now handled when the video is first shown
        };

        const updatePlayButtonState = (isPaused) => {
            if (!splashPlayBtn) return;
            const playIcon = splashPlayBtn.querySelector('.play-icon');
            const pauseIcon = splashPlayBtn.querySelector('.pause-icon');
            if (isPaused) {
                if (playIcon) playIcon.style.display = 'block';
                if (pauseIcon) pauseIcon.style.display = 'none';
            } else {
                if (playIcon) playIcon.style.display = 'none';
                if (pauseIcon) pauseIcon.style.display = 'block';
            }
        };

        const showPlayOverlay = () => {
            if (splashPlayOverlay) {
                splashPlayOverlay.style.display = 'flex';
                splashPlayOverlay.offsetHeight; // Force reflow
                splashPlayOverlay.classList.add('active');
            }
        };

        const hidePlayOverlay = () => {
            if (splashPlayOverlay) {
                splashPlayOverlay.classList.remove('active');
                setTimeout(() => {
                    splashPlayOverlay.style.display = 'none';
                }, 500);
            }
        };

        // Check if intro has already been shown
        const hasSeenIntro = sessionStorage.getItem('seen_intro_video');
        if (!hasSeenIntro) {
            sessionStorage.setItem('seen_intro_video', 'true');
            showSplash();
        } else {
            splashOverlay.style.display = 'none';
            // Explicitly remove autoplay, pause and reset so it doesn't trigger background playback
            splashVideo.removeAttribute('autoplay');
            splashVideo.pause();
            splashVideo.currentTime = 0;
        }

        // --- Event Listeners ---

        // Play/Pause Action
        if (splashPlayBtn) {
            splashPlayBtn.addEventListener('click', () => {
                // If play overlay is still active, trigger play and hide it
                if (splashPlayOverlay && splashPlayOverlay.classList.contains('active')) {
                    splashVideo.muted = false;
                    splashVideo.play();
                    updatePlayButtonState(false);
                    hidePlayOverlay();
                } else {
                    if (splashVideo.paused) {
                        splashVideo.play();
                        updatePlayButtonState(false);
                    } else {
                        splashVideo.pause();
                        updatePlayButtonState(true);
                    }
                }
            });
        }

        // Tap to Play Overlay Click Listener
        if (splashPlayOverlay) {
            splashPlayOverlay.addEventListener('click', (e) => {
                e.stopPropagation();
                splashVideo.muted = false;
                splashVideo.play();
                updatePlayButtonState(false);
                hidePlayOverlay();
            });
        }

        // Click on the video elements directly to toggle play/pause status
        splashVideo.addEventListener('click', () => {
            if (splashPlayOverlay && splashPlayOverlay.classList.contains('active')) {
                splashVideo.muted = false;
                splashVideo.play();
                updatePlayButtonState(false);
                hidePlayOverlay();
            } else {
                if (splashVideo.paused) {
                    splashVideo.play();
                    updatePlayButtonState(false);
                } else {
                    splashVideo.pause();
                    updatePlayButtonState(true);
                }
            }
        });

        // Progress bar updater
        splashVideo.addEventListener('timeupdate', () => {
            if (splashProgressBar) {
                const percentage = (splashVideo.currentTime / splashVideo.duration) * 100;
                splashProgressBar.style.width = `${percentage}%`;
            }
        });

        // Click on Progress track to scrub
        if (splashProgressContainer) {
            splashProgressContainer.addEventListener('click', (e) => {
                const rect = splashProgressContainer.getBoundingClientRect();
                const clickPosition = (e.clientX - rect.left) / rect.width;
                splashVideo.currentTime = clickPosition * splashVideo.duration;
            });
        }

        // Close on video ended
        splashVideo.addEventListener('ended', () => {
            dismissSplash();
        });

        // Close on "Skip Intro" click
        if (splashSkipBtn) {
            splashSkipBtn.addEventListener('click', () => {
                dismissSplash();
            });
        }

        // Replay Button in Hero
        if (heroWatchIntroBtn) {
            heroWatchIntroBtn.addEventListener('click', () => {
                showSplash();
            });
        }
    } else {
        // If we load a page without a splash video (like a case study), mark it as seen
        // so that clicking Home from the nav doesn't play the video.
        sessionStorage.setItem('seen_intro_video', 'true');
    }

    // --- Lightbox Interactive Zoom ---
    const zoomableWrappers = document.querySelectorAll('.zoomable-image-wrapper');
    const zoomLightbox = document.getElementById('image-lightbox');
    const zoomLightboxImg = document.getElementById('lightbox-img');
    const zoomLightboxClose = document.querySelector('.lightbox-close');

    if (zoomableWrappers.length > 0 && zoomLightbox && zoomLightboxImg) {
        zoomableWrappers.forEach(wrapper => {
            const mainImg = wrapper.querySelector('img');
            if (mainImg) {
                wrapper.addEventListener('click', () => {
                    zoomLightbox.classList.add('active');
                    zoomLightboxImg.src = mainImg.src;
                    zoomLightboxImg.alt = mainImg.alt;
                });
            }
        });

        if (zoomLightboxClose) {
            zoomLightboxClose.addEventListener('click', () => {
                zoomLightbox.classList.remove('active');
            });
        }

        zoomLightbox.addEventListener('click', (e) => {
            if (e.target !== zoomLightboxImg) {
                zoomLightbox.classList.remove('active');
            }
        });
    }

    // --- Criteria Chip Tooltip mobile click/tap trigger ---
    const chips = document.querySelectorAll('.criteria-chip');
    if (chips.length > 0) {
        const toggleChip = (chip, e) => {
            e.stopPropagation();
            e.preventDefault();
            const isActive = chip.classList.contains('active');
            
            // Clear all other active chips
            chips.forEach(c => c.classList.remove('active'));
            
            if (!isActive) {
                chip.classList.add('active');
            }
        };
        
        chips.forEach(chip => {
            // Touch start for mobile/tablet instant tap
            chip.addEventListener('touchstart', (e) => {
                toggleChip(chip, e);
            }, { passive: false });
            
            // Click fallback for desktop mouse or simulated clicks
            chip.addEventListener('click', (e) => {
                toggleChip(chip, e);
            });
        });
        
        // Tap outside to dismiss on mobile / desktop
        document.addEventListener('touchstart', () => {
            chips.forEach(c => c.classList.remove('active'));
        }, { passive: true });
        
        document.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
        });
    }

    // --- What I Mapped Tabs Switching Logic ---
    const mappedTabBtns = document.querySelectorAll('.mapped-tab-btn');
    const mappedTabPanels = document.querySelectorAll('.mapped-tab-panel');

    if (mappedTabBtns.length > 0 && mappedTabPanels.length > 0) {
        mappedTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTabId = btn.getAttribute('data-tab');

                // Toggle active class on buttons
                mappedTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Toggle active class on content panels
                mappedTabPanels.forEach(panel => {
                    if (panel.id === targetTabId) {
                        panel.classList.add('active');
                    } else {
                        panel.classList.remove('active');
                    }
                });
            });
        });
    }

});

// SCA Lo-Fi Interactive Hero Mockup Feature
document.addEventListener('DOMContentLoaded', () => {
    const lofiFeatures = document.querySelectorAll('.sca-lofi-feature');
    const mainImg = document.getElementById('sca-lofi-main-img');

    if (lofiFeatures.length > 0 && mainImg) {
        lofiFeatures.forEach(feature => {
            feature.addEventListener('click', function() {
                // Remove active class from all
                lofiFeatures.forEach(f => f.classList.remove('active'));
                
                // Add active class to clicked
                this.classList.add('active');
                
                // Update image source
                const newImgSrc = this.getAttribute('data-img');
                
                // Add quick fade out effect
                mainImg.style.opacity = '0';
                
                setTimeout(() => {
                    mainImg.src = newImgSrc;
                    // Fade back in
                    mainImg.style.opacity = '1';
                }, 300);
            });
        });
    }
});

// --- Number Roll Animation ---
document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        const animateValue = (obj, start, end, duration, suffix) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const easeProgress = progress * (2 - progress);
                const currentVal = Math.floor(easeProgress * (end - start) + start);
                obj.innerHTML = currentVal + suffix;
                if (progress < 1) {
                    obj.dataset.animId = window.requestAnimationFrame(step);
                }
            };
            if (obj.dataset.animId) {
                window.cancelAnimationFrame(parseInt(obj.dataset.animId));
            }
            obj.dataset.animId = window.requestAnimationFrame(step);
        };

        const observerOptions = {
            threshold: 0.5,
            rootMargin: "0px"
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el = entry.target;
                
                // Initialize dataset values on first run
                if (!el.dataset.targetNum) {
                    const text = el.innerText.trim();
                    const numMatch = text.match(/(\d+)/);
                    if (numMatch) {
                        el.dataset.targetNum = numMatch[0];
                        el.dataset.suffix = text.replace(numMatch[0], '');
                    }
                }

                if (entry.isIntersecting) {
                    if (el.dataset.targetNum) {
                        const targetNumber = parseInt(el.dataset.targetNum, 10);
                        const suffix = el.dataset.suffix || '';
                        el.innerHTML = "0" + suffix;
                        animateValue(el, 0, targetNumber, 2000, suffix);
                    }
                } else {
                    // Optional: Reset immediately to 0 when out of view, so it always starts from 0 when coming back
                    if (el.dataset.targetNum) {
                        const suffix = el.dataset.suffix || '';
                        el.innerHTML = "0" + suffix;
                    }
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => {
            statsObserver.observe(stat);
        });
    }
});



// --- Dynamic Medium Articles Sync & Filtering ---
document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.getElementById('articles-grid-container');
    const filterButtons = document.querySelectorAll('.filter-pill');
    
    // Modal elements
    const modalOverlay = document.getElementById('articleModal');
    const modalBody = document.getElementById('articleModalBody');
    const modalCloseBtn = document.getElementById('closeArticleModal');
    
    let mediumArticlesData = []; // Store fetched articles

    if (articlesContainer) {
        const mediumFeedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@supreeth.gani';

        fetch(mediumFeedUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'ok' && data.items.length > 0) {
                    articlesContainer.innerHTML = ''; 
                    mediumArticlesData = data.items;
                    
                    data.items.forEach((item, index) => {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = item.content || item.description;
                        let textContent = tempDiv.textContent || tempDiv.innerText || '';
                        
                        const wordCount = textContent.split(/\s+/).length;
                        const readTime = Math.max(1, Math.ceil(wordCount / 200));
                        
                        let excerpt = textContent.trim().substring(0, 150);
                        if (textContent.length > 150) excerpt += '...';

                        const pubDate = new Date(item.pubDate);
                        const formattedDate = pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                        
                        // Categorization
                        let tagClass = 'tag-ux';
                        let tagText = 'UX Design';
                        let filterCat = 'ux';
                        
                        const titleLower = item.title.toLowerCase();
                        const categoriesStr = (item.categories || []).join(' ').toLowerCase();
                        const searchStr = titleLower + ' ' + categoriesStr;
                        
                        // Categorize based on keywords in title and medium tags
                        if (searchStr.includes('ai') || searchStr.includes('prompt') || searchStr.includes('agentic')) {
                            tagClass = 'tag-ai';
                            tagText = 'AI & Technology';
                            filterCat = 'ai';
                        } else if (searchStr.includes('product') || searchStr.includes('think') || searchStr.includes('strategy') || searchStr.includes('process')) {
                            tagClass = 'tag-strategy';
                            tagText = 'Process & Strategy';
                            filterCat = 'strategy';
                        } else {
                            // Fallback is UX Design
                            tagClass = 'tag-ux';
                            tagText = 'UX Design & Psychology';
                            filterCat = 'ux';
                        }

                        const isLatest = index === 0;
                        const latestBadgeHTML = isLatest ? `<span class="article-badge latest">Latest</span>` : '';

                        const articleHTML = `
                            <article class="article-card" data-category="${filterCat}">
                                <div class="article-glow-border"></div>
                                <div class="article-card-header">
                                    <div>
                                        <span class="article-tag ${tagClass}">${tagText}</span>
                                        ${latestBadgeHTML}
                                    </div>
                                    <span class="article-read-time">${readTime} min read</span>
                                </div>
                                <h3><a href="javascript:void(0)" class="open-modal-trigger" data-index="${index}">${item.title}</a></h3>
                                <p class="article-excerpt">${excerpt}</p>
                                <div class="article-card-footer">
                                    <span class="article-date">${formattedDate}</span>
                                    <a href="javascript:void(0)" class="article-link open-modal-trigger" data-index="${index}">Read Article &rarr;</a>
                                </div>
                            </article>
                        `;
                        
                        articlesContainer.insertAdjacentHTML('beforeend', articleHTML);
                    });
                    
                    attachModalListeners();
                } else {
                    articlesContainer.innerHTML = '<div style="text-align:center; grid-column: 1 / -1;">No articles found right now.</div>';
                }
            })
            .catch(error => {
                console.error('Error fetching Medium articles:', error);
                articlesContainer.innerHTML = '<div style="text-align:center; grid-column: 1 / -1;">Failed to load articles. Please check back later.</div>';
            });
    }

    // --- Unified Search and Filter Logic ---
    const searchInput = document.getElementById('articles-search-input');
    let currentFilter = 'all';
    let searchQuery = '';

    const updateVisibleArticles = () => {
        const allCards = document.querySelectorAll('.article-card');
        allCards.forEach(card => {
            const category = card.getAttribute('data-category') || '';
            const title = (card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '');
            const excerpt = (card.querySelector('.article-excerpt') ? card.querySelector('.article-excerpt').textContent.toLowerCase() : '');

            const matchesFilter = (currentFilter === 'all' || category === currentFilter);
            const matchesSearch = (title.includes(searchQuery) || excerpt.includes(searchQuery));

            if (matchesFilter && matchesSearch) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentFilter = btn.getAttribute('data-filter');
            updateVisibleArticles();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            updateVisibleArticles();
        });
    }

    // Modal Logic
    function attachModalListeners() {
        const triggers = document.querySelectorAll('.open-modal-trigger');
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const index = trigger.getAttribute('data-index');
                const article = mediumArticlesData[index];
                
                if (article) {
                    // Populate modal with article content
                    modalBody.innerHTML = `
                        <h1 style="margin-top:0;">${article.title}</h1>
                        ${article.content || article.description}
                    `;
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                }
            });
        });
    }

    if (modalCloseBtn && modalOverlay) {
        const closeModal = () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            // Clear content after animation
            setTimeout(() => { modalBody.innerHTML = ''; }, 300);
        };
        
        modalCloseBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
});


// --- Constellation Background Animation ---
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    
    let width, height;
    let particles = [];
    let shootingStars = [];
    
    // Configuration
    const particleCount = 150; // Increased for more stars
    const connectionDistance = 120;
    const particleSpeed = 0.15; 
    
    function resizeCanvas() {
        width = parent.offsetWidth;
        height = parent.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * particleSpeed;
            this.vy = (Math.random() - 0.5) * particleSpeed;
            this.radius = Math.random() * 1.5 + 0.2;
            
            // Sparkling effect
            this.baseAlpha = Math.random() * 0.5 + 0.1;
            this.alphaPhase = Math.random() * Math.PI * 2;
            // Some stars sparkle faster
            this.alphaSpeed = Math.random() < 0.2 ? Math.random() * 0.1 + 0.05 : Math.random() * 0.03 + 0.01;
            
            this.connectable = this.radius > 1.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alphaPhase += this.alphaSpeed;
            
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
        
        draw() {
            // Enhanced sparkle
            const twinkle = this.baseAlpha + Math.sin(this.alphaPhase) * 0.4;
            const finalAlpha = Math.max(0.1, Math.min(1, twinkle));
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
            ctx.fill();
            
            if (this.radius > 1.2 || finalAlpha > 0.8) {
                ctx.shadowBlur = this.radius > 1.2 ? 6 : 3;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
            } else {
                ctx.shadowBlur = 0;
            }
        }
    }
    
    class ShootingStar {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * width * 1.5;
            this.y = 0;
            this.length = Math.random() * 80 + 30;
            this.speed = Math.random() * 10 + 6;
            this.angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1); // Roughly 45 degrees
            this.vx = -Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.opacity = 0;
            this.active = false;
            
            // Random delay before spawning
            this.delay = Math.random() * 300 + 100;
            this.tick = 0;
        }
        
        update() {
            if (!this.active) {
                this.tick++;
                if (this.tick > this.delay) {
                    this.active = true;
                    this.opacity = 1;
                }
                return;
            }
            
            this.x += this.vx;
            this.y += this.vy;
            
            // Fade out near the end
            this.opacity -= 0.015;
            
            if (this.x < -this.length || this.y > height + this.length || this.opacity <= 0) {
                this.reset();
            }
        }
        
        draw() {
            if (!this.active || this.opacity <= 0) return;
            
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.vx * this.length * 0.1, this.y - this.vy * this.length * 0.1);
            
            const gradient = ctx.createLinearGradient(
                this.x, this.y, 
                this.x - this.vx * this.length * 0.1, this.y - this.vy * this.length * 0.1
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.stroke();
            ctx.shadowBlur = 0; // reset
        }
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        shootingStars = [];
        // Add 3 shooting stars that loop
        for (let i = 0; i < 3; i++) {
            shootingStars.push(new ShootingStar());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Update & Draw Background Stars
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].connectable) {
                for (let j = i + 1; j < particles.length; j++) {
                    if (!particles[j].connectable) continue;
                    
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        
                        const opacity = (1 - (distance / connectionDistance)) * 0.25;
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Update & Draw Shooting Stars
        for (let i = 0; i < shootingStars.length; i++) {
            shootingStars[i].update();
            shootingStars[i].draw();
        }
        
        requestAnimationFrame(animate);
    }
    
    initParticles();
    animate();
});
